from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ExtractedEntity(BaseModel):
    name: str
    confidence: float
    evidence: str

class DocumentMetadata(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    date: Optional[str] = None
    category: str = Field(..., description="Resume, Certificate, Project, Internship, etc.")
    skills: List[ExtractedEntity] = []
    technologies: List[ExtractedEntity] = []
    summary: str
    confidence_score: float

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    storage_url: str
    metadata: DocumentMetadata
    status: str
