from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Optional[str] = None
    CLERK_SECRET_KEY: Optional[str] = None
    
    # Supabase / DB
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = "postgresql://identitea:identitea@localhost:5432/identitea"
    
    # Neo4j
    NEO4J_URI: str = "neo4j+s://aura.databases.neo4j.io"
    NEO4J_USERNAME: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    
    # Qdrant
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: Optional[str] = None
    
    # Gemini
    GEMINI_API_KEY: Optional[str] = None
    
    BACKEND_SECRET_KEY: str = "supersecretkey"

    model_config = SettingsConfigDict(
        env_file=".env.development" if ENVIRONMENT == "development" else ".env.production",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
