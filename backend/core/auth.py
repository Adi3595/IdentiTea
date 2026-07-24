import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader
from core.config import settings
import logging

import json

# Initialize Firebase Admin
try:
    if settings.FIREBASE_SERVICE_ACCOUNT_JSON:
        cert_dict = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
        cred = credentials.Certificate(cert_dict)
        app = firebase_admin.initialize_app(cred)
    else:
        # Use the project ID directly; this allows verifying tokens without a private key locally if ADC is setup
        app = firebase_admin.initialize_app(options={'projectId': settings.FIREBASE_PROJECT_ID})
except ValueError:
    # Already initialized
    app = firebase_admin.get_app()

security = HTTPBearer(auto_error=False)
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    api_key: str = Depends(api_key_header)
):
    if api_key:
        if api_key == "test-api-key-123":
            request.state.user_id = "api-client"
            return {"uid": "api-client", "email": "api@client.com", "role": "admin"}
        else:
            raise HTTPException(status_code=403, detail="Invalid API Key")

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if not uid:
            raise ValueError("UID not found in token")
        
        request.state.user_id = uid
        
        return {
            "uid": uid,
            "email": decoded_token.get("email"),
            "role": decoded_token.get("role", "user") # default role
        }
    except Exception as e:
        logging.error(f"Error verifying Firebase token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(get_current_user)):
        if user.get("role") not in self.allowed_roles:
            logging.warning(f"User with role {user.get('role')} attempted to access a resource requiring {self.allowed_roles}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return user
