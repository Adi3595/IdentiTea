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
    events = db.get_timeline_events(user_id)
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
