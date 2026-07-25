from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core.auth import get_current_user
from services.postgres import db
from services.engines import identity_engine

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
    github_url: Optional[str] = None

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

@router.get("/identity-score")
async def get_identity_score(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    try:
        portfolio = await identity_engine.generate_auto_portfolio(user_id)
        skills_count = len(portfolio.get("core_skills", []))
        projects_count = len(portfolio.get("highlight_projects", []))
        verifications_count = len(portfolio.get("certifications", []))
        
        score = min(100, (skills_count * 2) + (projects_count * 10) + (verifications_count * 5) + 30)
        return {
            "score": score,
            "metrics": {
                "skills_count": skills_count,
                "projects_count": projects_count,
                "verifications_count": verifications_count
            },
            "history": [
                {"date": "2023-01", "score": 30},
                {"date": "2023-06", "score": max(30, score - 20)},
                {"date": "2024-01", "score": score}
            ]
        }
    except Exception as e:
        return {
            "score": 0,
            "metrics": {"skills_count": 0, "projects_count": 0, "verifications_count": 0},
            "history": []
        }

