from fastapi import APIRouter, Depends, HTTPException, Body
from core.auth import get_current_user
from services.graph import graph_service
import google.generativeai as genai
from core.config import settings
import json
import logging

router = APIRouter()

# Initialize Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-3.5-flash')

@router.post("/suggest")
async def get_career_suggestions(
    payload: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    goal = payload.get("goal")
    if not goal:
        raise HTTPException(status_code=400, detail="Career goal is required")
        
    user_id = current_user["uid"]
    
    try:
        # 1. Fetch user's current knowledge graph context
        skills = await graph_service.get_user_skills(user_id)
        projects = await graph_service.get_user_projects(user_id)
        certs = await graph_service.get_user_certificates(user_id)
        
        # 2. Prepare context for Gemini
        context = f"""
        User's Current Skills: {[s.get('name') for s in skills]}
        User's Projects: {[p.get('title') for p in projects]}
        User's Certifications: {[c.get('name') for c in certs]}
        
        The user's target career goal is: "{goal}"
        """
        
        # 3. Prompt Gemini
        prompt = f"""
        You are an expert technical career advisor. Based on the user's current profile and their target career goal, provide specific, actionable recommendations to bridge the gap.
        
        {context}
        
        Respond ONLY with a valid JSON object matching this schema:
        {{
            "analysis": "A 2-3 sentence professional analysis of their current standing vs their goal.",
            "courses": [
                {{"title": "Course Name", "platform": "Platform (e.g. Coursera)", "reason": "Why they need it"}}
            ],
            "projects": [
                {{"title": "Project Idea", "description": "Brief description of the project to build", "skills_to_learn": ["Skill1", "Skill2"]}}
            ],
            "hackathons": [
                {{"title": "Type of Hackathon to look for", "focus": "What they should focus on building"}}
            ]
        }}
        Ensure exactly 3 courses, 2 projects, and 1 hackathon recommendation.
        DO NOT include markdown formatting like ```json in the output, just the raw JSON object.
        """
        
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        return json.loads(text)
        
    except Exception as e:
        logging.error(f"Error generating career suggestions: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate career suggestions")
