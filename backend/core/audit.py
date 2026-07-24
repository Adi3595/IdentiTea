import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from services.postgres import db

class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Proceed with request
        response = await call_next(request)
        
        # Determine if we should log it (e.g. mutations)
        if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
            # Try to get user_id from request state if set by auth dependency,
            # or we log as anonymous
            user_id = getattr(request.state, "user_id", "anonymous")
            
            action = f"{request.method} {request.url.path}"
            
            # Log async to not block response (in a real app, use BackgroundTasks)
            # For now, we'll just log it synchronously
            if response.status_code < 400:
                db.log_audit_event(user_id=user_id, action=action, details={"status": response.status_code})
            else:
                db.log_audit_event(user_id=user_id, action=f"FAILED {action}", details={"status": response.status_code})

        return response
