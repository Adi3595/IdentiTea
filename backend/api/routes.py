from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import uuid
from models.document import DocumentUploadResponse
from services.storage import storage_service
from services.pdf_parser import pdf_parser_service
from services.ai_extractor import ai_extractor_service
from services.graph import graph_service

api_router = APIRouter()

@api_router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    try:
        # 1. Read file bytes
        file_bytes = await file.read()
        
        # 2. Upload to Supabase Storage securely
        storage_result = await storage_service.upload_file(file_bytes, file.filename)
        signed_url = storage_result["signed_url"]
        
        # 3. Extract text from PDF using PyMuPDF
        text_content = await pdf_parser_service.extract_text(file_bytes)
        
        # 4. AI Entity & Metadata Extraction via Gemini
        metadata = await ai_extractor_service.extract_metadata(text_content, file.filename)
        
        document_id = str(uuid.uuid4())
        
        # 5. Ingest extracted metadata into Neo4j Knowledge Graph
        # Hardcoding a generic user_id until Clerk auth is fully wired into backend requests
        await graph_service.insert_document_graph(
            document_id=document_id,
            metadata=metadata,
            user_id="anonymous_user"
        )
        
        # 6. Return structured response
        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename,
            storage_url=signed_url, # Returning temporary signed URL for frontend preview
            metadata=metadata,
            status="processed"
        )
    except Exception as e:
        print(f"API Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/graph")
async def get_knowledge_graph():
    """
    Fetches the entire knowledge graph for the authenticated user.
    """
    try:
        graph_data = await graph_service.get_user_graph(user_id="anonymous_user")
        return graph_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
