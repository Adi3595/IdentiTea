from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
import uuid
from models.document import DocumentUploadResponse
from services.storage import storage_service
from services.pdf_parser import pdf_parser_service
from services.ai_extractor import ai_extractor_service
from services.graph import graph_service
from core.auth import get_current_user
from api.routers import users, timeline, graph, integrations

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(timeline.router, prefix="/timeline", tags=["Timeline"])
api_router.include_router(graph.router, prefix="/graph-data", tags=["GraphData"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["Integrations"])

MAX_FILE_SIZE = 5 * 1024 * 1024 # 5 MB
ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"]

async def scan_for_viruses(content: bytes) -> bool:
    # Placeholder for a real virus scan (e.g. ClamAV integration)
    return True

@api_router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["uid"]
        
        # 1. MIME type validation
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=415,
                detail="Unsupported file type. Only PDF, PNG, and JPEG are allowed."
            )

        # 2. Read file bytes and size validation
        file_bytes = await file.read()
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds the 5MB limit."
            )
            
        # 3. Virus Scan Hook
        is_safe = await scan_for_viruses(file_bytes)
        if not is_safe:
            raise HTTPException(
                status_code=400,
                detail="File rejected: Virus scan failed."
            )
        
        # 4. Upload to Supabase Storage securely
        storage_result = await storage_service.upload_file(file_bytes, file.filename)
        signed_url = storage_result["signed_url"]
        
        # 5. Extract text from PDF using PyMuPDF
        text_content = await pdf_parser_service.extract_text(file_bytes)
        
        # 6. AI Entity & Metadata Extraction via Gemini
        metadata = await ai_extractor_service.extract_metadata(text_content, file.filename)
        
        document_id = str(uuid.uuid4())
        
        # 7. Ingest extracted metadata into Neo4j Knowledge Graph
        await graph_service.insert_document_graph(
            document_id=document_id,
            metadata=metadata,
            user_id=user_id
        )
        
        # 8. Return structured response
        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename,
            storage_url=signed_url,
            metadata=metadata,
            status="processed"
        )
    except HTTPException:
        raise
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

from services.engines import identity_engine

@api_router.get("/identity/score")
async def get_identity_score(current_user: dict = Depends(get_current_user)):
    """
    Calculates the Identity Score based on verified skills, documents, and connections.
    """
    user_id = current_user["uid"]
    score_data = await identity_engine.calculate_identity_score(user_id)
    return score_data

@api_router.get("/career/recommendations")
async def get_career_recommendations(current_user: dict = Depends(get_current_user)):
    """
    Generates career readiness recommendations.
    """
    user_id = current_user["uid"]
    recommendations = await identity_engine.generate_career_recommendations(user_id)
    return {"recommendations": recommendations}

@api_router.get("/portfolio/auto")
async def get_auto_portfolio(current_user: dict = Depends(get_current_user)):
    """
    Synthesizes a public-facing portfolio structure.
    """
    user_id = current_user["uid"]
    portfolio = await identity_engine.generate_auto_portfolio(user_id)
    return portfolio

@api_router.get("/portfolio/public/{user_id}")
async def get_public_portfolio(user_id: str):
    """
    Unauthenticated endpoint for public viewing.
    """
    portfolio = await identity_engine.generate_auto_portfolio(user_id)
    return portfolio

@api_router.get("/career/gap-analysis")
async def run_gap_analysis(target_role: str = "Software Engineer", current_user: dict = Depends(get_current_user)):
    """
    Analyzes gaps between current skills and a target role.
    """
    user_id = current_user["uid"]
    analysis = await identity_engine.run_resume_gap_analysis(user_id, target_role)
    return analysis

@api_router.post("/identity/infer-relationships")
async def trigger_relationship_inference(current_user: dict = Depends(get_current_user)):
    """
    Triggers the relationship engine to infer skills from projects/experience.
    """
    user_id = current_user["uid"]
    result = await identity_engine.run_relationship_inference(user_id)
    return result
