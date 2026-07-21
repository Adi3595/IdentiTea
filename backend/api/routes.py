from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import uuid
from models.document import DocumentUploadResponse
from services.storage import storage_service
from services.ai_extractor import ai_extractor_service

api_router = APIRouter()

class MockResponse(BaseModel):
    message: str

@api_router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    try:
        # 1. Read file bytes
        file_bytes = await file.read()
        
        # 2. Upload to storage
        storage_url = await storage_service.upload_file(file_bytes, file.filename)
        
        # 3. Extract text (mocking OCR for now)
        text_content = f"Extracted text from {file.filename}"
        
        # 4. AI Entity & Metadata Extraction
        metadata = await ai_extractor_service.extract_metadata(text_content, file.filename)
        
        # 5. Return structured response
        return DocumentUploadResponse(
            document_id=str(uuid.uuid4()),
            filename=file.filename,
            storage_url=storage_url,
            metadata=metadata,
            status="processed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/graph", response_model=MockResponse)
async def get_knowledge_graph():
    return {"message": "Development fallback: Mock knowledge graph data"}

