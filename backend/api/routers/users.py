from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core.auth import get_current_user
from services.postgres import db

router = APIRouter()

class UserProfile(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None

class UserSettings(BaseModel):
    theme: Optional[str] = None
    email_notifications: Optional[bool] = None
    profile: Optional[UserProfile] = None
    linkedin_url: Optional[str] = None

@router.get("/settings")
async def get_settings(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    settings = db.get_user_settings(user_id)
    if not settings:
        return {"user_id": user_id, "theme": "system", "email_notifications": True}
    return settings

@router.post("/settings")
async def update_settings(settings: UserSettings, current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    
    existing = db.get_user_settings(user_id) or {}
    update_data = settings.dict(exclude_unset=True)
    
    if "profile" in update_data and "profile" in existing and isinstance(existing["profile"], dict):
        existing["profile"].update(update_data["profile"])
        update_data["profile"] = existing["profile"]
        
    existing.update(update_data)
    existing["user_id"] = user_id
    
    updated = db.update_user_settings(user_id, existing)
    if not updated:
        raise HTTPException(status_code=500, detail="Could not update settings. Ensure 'profile' JSONB column exists.")
    return updated

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user["uid"],
        "email": current_user.get("email"),
    }
