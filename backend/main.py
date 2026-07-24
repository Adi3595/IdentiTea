import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from api.routes import api_router
from core.config import settings

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup
    if settings.DATABASE_URL:
        try:
            import psycopg2
            logging.info("Running automatic DB migrations via psycopg2...")
            conn = psycopg2.connect(settings.DATABASE_URL)
            cur = conn.cursor()
            
            # user_settings
            cur.execute("""
            CREATE TABLE IF NOT EXISTS user_settings (
                user_id TEXT PRIMARY KEY,
                theme TEXT DEFAULT 'system',
                email_notifications BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
            );
            """)
            
            # timeline_events
            cur.execute("""
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            CREATE TABLE IF NOT EXISTS timeline_events (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
            );
            """)
            
            # audit_logs
            cur.execute("""
            CREATE TABLE IF NOT EXISTS audit_logs (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id TEXT,
                action TEXT NOT NULL,
                resource TEXT,
                ip_address TEXT,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
            );
            """)
            
            conn.commit()
            cur.close()
            conn.close()
            logging.info("DB migrations completed successfully.")
        except Exception as e:
            logging.error(f"Failed to run automatic DB migrations: {e}")
    
    yield

app = FastAPI(
    title="IdentiTea API",
    version="1.0.0",
    description="IdentiTea API",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response

from core.audit import AuditLogMiddleware

app.add_middleware(AuditLogMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

@app.get("/system-status")
@limiter.limit("120/minute")
async def system_status_check(request: Request):
    return {"status": "ok", "environment": settings.ENVIRONMENT}

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
