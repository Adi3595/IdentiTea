import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings
import logging

# Initialize Firebase Admin
try:
    # Use the project ID directly; this allows verifying tokens without a private key
    app = firebase_admin.initialize_app(options={'projectId': settings.FIREBASE_PROJECT_ID})
except ValueError:
    # Already initialized
    app = firebase_admin.get_app()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if not uid:
            raise ValueError("UID not found in token")
        return {"uid": uid, "email": decoded_token.get("email")}
    except Exception as e:
        logging.error(f"Error verifying Firebase token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
