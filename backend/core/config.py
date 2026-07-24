from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    
    # Firebase
    FIREBASE_PROJECT_ID: str = "identitea"
    
    # Supabase / DB
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = None
    
    # Neo4j
    NEO4J_URI: str
    NEO4J_USERNAME: str
    NEO4J_PASSWORD: str
    
    # Qdrant
    QDRANT_URL: Optional[str] = None
    QDRANT_API_KEY: Optional[str] = None
    
    # Gemini
    GEMINI_API_KEY: Optional[str] = None
    
    BACKEND_SECRET_KEY: str
    CORS_ORIGINS: str

    class Config:
        env_file = ".env.development"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
