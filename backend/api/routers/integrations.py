from fastapi import APIRouter, Depends, HTTPException, Body
from core.auth import get_current_user
from services.github import github_service
import logging

router = APIRouter()

@router.post("/github")
async def sync_github(
    payload: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    username = payload.get("username")
    if not username:
        raise HTTPException(status_code=400, detail="GitHub username is required")
        
    try:
        user_id = current_user["uid"]
        result = await github_service.sync_repositories(username, user_id)
        return result
    except Exception as e:
        logging.error(f"GitHub Sync Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from services.postgres import db
from services.linkedin import linkedin_service
from datetime import datetime
import asyncio

@router.post("/linkedin")
async def connect_linkedin(
    payload: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="LinkedIn URL is required")
        
    try:
        user_id = current_user["uid"]
        
        # Save to user settings immediately
        settings = db.get_user_settings(user_id) or {}
        settings["linkedin_url"] = url
        db.update_user_settings(user_id, settings)
        
        # Log event
        db.log_timeline_event(
            user_id=user_id,
            event_type="integration",
            title="Connected LinkedIn",
            description=f"User connected LinkedIn profile: {url}",
            date=datetime.utcnow().isoformat() + "Z"
        )
        
        # Trigger async scraping in background
        asyncio.create_task(linkedin_service.scrape_and_sync(url, user_id))
        
        return {"status": "success", "message": "LinkedIn profile connected. Syncing data..."}
    except Exception as e:
        logging.error(f"LinkedIn Connect Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
