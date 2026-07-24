from fastapi import APIRouter, Depends, HTTPException
from core.auth import get_current_user
from services.graph import graph_service

router = APIRouter()

@router.get("/skills")
async def get_skills(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    return await graph_service.get_user_skills(user_id)

@router.get("/projects")
async def get_projects(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    return await graph_service.get_user_projects(user_id)

@router.get("/internships")
async def get_internships(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    return await graph_service.get_user_internships(user_id)

@router.get("/certificates")
async def get_certificates(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    return await graph_service.get_user_certificates(user_id)

@router.get("/achievements")
async def get_achievements(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    return await graph_service.get_user_achievements(user_id)

