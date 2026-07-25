from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from core.auth import get_current_user
from services.postgres import db
from services.storage import storage_service
from services.pdf_parser import pdf_parser_service
from services.ai_extractor import ai_extractor_service
from services.graph import graph_service
import uuid
import logging
from datetime import datetime

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024 # 5 MB
ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg", "text/markdown", "text/plain"]

@router.get("/test_insert")
async def test_insert():
    try:
        from services.postgres import db
        data = {
            "user_id": "test_user_id",
            "filename": "test.pdf",
            "storage_path": "mock/test.pdf",
            "category": "Project"
        }
        res = db.client.table("documents").insert(data).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        import traceback
        return {"status": "error", "message": str(e), "traceback": traceback.format_exc()}

async def scan_for_viruses(content: bytes) -> bool:
    # Placeholder for a real virus scan
    return True

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user)
):
    # 1. MIME type validation
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type."
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 5MB limit."
        )

    is_safe = await scan_for_viruses(content)
    if not is_safe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File rejected: Virus scan failed."
        )
        
    user_id = current_user["uid"]

    try:
        # 2. Upload to Supabase Storage
        storage_res = await storage_service.upload_file(content, file.filename)
        storage_path = storage_res["path"]
        
        # 3. Parse PDF/Text
        extracted_text = ""
        if "pdf" in file.content_type:
            extracted_text = await pdf_parser_service.extract_text(content)
        else:
            extracted_text = content.decode('utf-8', errors='ignore')

        # 4. Extract Structured Data with Gemini
        metadata = await ai_extractor_service.extract_metadata(extracted_text, file.filename)
        
        # 5. We bypass Postgres insertion for these entities
        # Just generate a random UUID for the neo4j document node
        doc_id = str(uuid.uuid4())
            
        # 7. Insert to Neo4j Knowledge Graph
        await graph_service.insert_document_graph(doc_id, metadata, user_id)
        
        # 8. Log timeline event
        db.log_timeline_event(
            user_id=user_id,
            event_type="upload",
            title=f"Uploaded {metadata.category}",
            description=f"Extracted {len(metadata.skills)} skills and {len(metadata.technologies)} technologies.",
            date=datetime.utcnow().isoformat() + "Z"
        )
        
        logging.info(f"User {user_id} successfully uploaded and parsed {file.filename}")

        return {
            "id": doc_id,
            "filename": file.filename,
            "category": metadata.category,
            "skills_extracted": len(metadata.skills),
            "status": "success"
        }
    except Exception as e:
        logging.error(f"Error processing document upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
