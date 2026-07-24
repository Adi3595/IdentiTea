from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core.auth import get_current_user
from services.postgres import db

router = APIRouter()

class UserSettings(BaseModel):
    theme: Optional[str] = None
    email_notifications: Optional[bool] = None

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
    updated = db.update_user_settings(user_id, settings.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=500, detail="Could not update settings")
    return updated

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user["uid"],
        "email": current_user.get("email"),
    }
