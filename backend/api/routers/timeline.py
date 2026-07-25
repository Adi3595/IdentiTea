from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core.auth import get_current_user
from services.postgres import db

router = APIRouter()

class TimelineEvent(BaseModel):
    id: Optional[str] = None
    event_type: str
    title: str
    description: str
    date: str

@router.get("/")
async def get_timeline(current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    
    events = []
    
    # Fetch internships
    try:
        internships = db.get_internships(user_id)
        for i in internships:
            events.append({
                "id": str(i.get("id")),
                "event_type": "work",
                "title": f"{i.get('role')} at {i.get('company')}",
                "description": f"Worked as {i.get('role')} at {i.get('company')}",
                "date": i.get("duration") or "Unknown Date"
            })
    except: pass
    
    # Fetch certificates
    try:
        certs = db.get_certificates(user_id)
        for c in certs:
            events.append({
                "id": str(c.get("id")),
                "event_type": "education",
                "title": c.get("title"),
                "description": f"Earned certificate from {c.get('issuer')}",
                "date": c.get("date") or "Unknown Date"
            })
    except: pass
    
    # Fetch projects
    try:
        projects = db.get_projects(user_id)
        for p in projects:
            events.append({
                "id": str(p.get("id")),
                "event_type": "work",
                "title": p.get("name"),
                "description": p.get("description") or "Built project",
                "date": "Recent" # Projects might not have dates, fallback
            })
    except: pass
    
    return events

@router.post("/")
async def add_timeline_event(event: TimelineEvent, current_user: dict = Depends(get_current_user)):
    user_id = current_user["uid"]
    logged_event = db.log_timeline_event(
        user_id=user_id,
        event_type=event.event_type,
        title=event.title,
        description=event.description,
        date=event.date
    )
    if not logged_event:
        raise HTTPException(status_code=500, detail="Could not log event")
    return logged_event
