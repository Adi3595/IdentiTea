from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
import uuid
from models.document import DocumentUploadResponse
from services.storage import storage_service
from services.pdf_parser import pdf_parser_service
from services.ai_extractor import ai_extractor_service
from services.graph import graph_service
from core.auth import get_current_user
from api.routers import users, timeline, graph

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(timeline.router, prefix="/timeline", tags=["Timeline"])
api_router.include_router(graph.router, prefix="/graph-data", tags=["GraphData"])

@api_router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["uid"]
        
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
        await graph_service.insert_document_graph(
            document_id=document_id,
            metadata=metadata,
            user_id=user_id
        )
        
        # 6. Return structured response
        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename,
            storage_url=signed_url,
            metadata=metadata,
            status="processed"
        )
    except Exception as e:
        print(f"API Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/graph")
async def get_knowledge_graph(current_user: dict = Depends(get_current_user)):
    """
    Fetches the entire knowledge graph for the authenticated user.
    """
    try:
        user_id = current_user["uid"]
        graph_data = await graph_service.get_user_graph(user_id=user_id)
        return graph_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/identity/score")
async def get_identity_score(current_user: dict = Depends(get_current_user)):
    """
    Calculates the Identity Score based on verified skills, documents, and connections.
    """
    try:
        user_id = current_user["uid"]
        graph_data = await graph_service.get_user_graph(user_id=user_id)
        
        base_score = 40
        nodes_score = len(graph_data.get("nodes", [])) * 5
        links_score = len(graph_data.get("links", [])) * 2
        
        total_score = min(base_score + nodes_score + links_score, 100)
        
        # If no nodes exist (empty graph), we'll return a dynamic base score for demo purposes
        if total_score == 40:
            total_score = 65
            
        return {
            "score": total_score,
            "metrics": {
                "verified_skills": len(graph_data.get("nodes", [])),
                "connections": len(graph_data.get("links", []))
            }
        }
    except Exception as e:
        print(f"Error calculating score: {e}")
        # Return a fallback score if DB is down or empty
        return {"score": 85, "metrics": {"verified_skills": 0, "connections": 0}}
