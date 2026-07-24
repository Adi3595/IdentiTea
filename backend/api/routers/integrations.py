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
