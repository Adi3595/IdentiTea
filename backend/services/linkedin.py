import httpx
import re
import json
import logging
import google.generativeai as genai
from core.config import settings
from services.graph import graph_service

class LinkedinService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-3.5-flash')
        else:
            self.model = None

    async def scrape_and_sync(self, url: str, user_id: str) -> dict:
        """
        Attempts to scrape the LinkedIn URL and uses Gemini to extract skills and experiences.
        Falls back to just saving the URL if LinkedIn blocks the request.
        """
        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
                response = await client.get(url, headers=headers)
                
            # LinkedIn often returns 999 or login walls for unauthenticated scrapers
            if response.status_code != 200 or "authwall" in response.url.path.lower():
                logging.warning(f"LinkedIn blocked the request or returned {response.status_code}. Using fallback.")
                return {"status": "partial", "message": "LinkedIn blocked scraping, but profile linked."}

            html = response.text
            
            # Simple tag stripper to get raw text for LLM
            text = re.sub(r'<[^>]+>', ' ', html)
            text = re.sub(r'\s+', ' ', text).strip()
            
            # Truncate text to avoid blowing up token limits, usually profile info is in the first half
            text = text[:15000]

            if self.model:
                prompt = f"""
                You are a data extraction AI. Read the following text extracted from a LinkedIn profile URL: {url}
                
                Text: {text}
                
                Extract the professional skills and experiences found in this text. 
                Respond ONLY with a valid JSON object matching this schema:
                {{
                    "skills": ["Skill 1", "Skill 2"],
                    "experiences": [
                        {{"title": "Job Title", "description": "Brief description of role"}}
                    ]
                }}
                """
                
                ai_response = self.model.generate_content(
                    prompt,
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json"
                    )
                )
                
                result = json.loads(ai_response.text.strip())
                
                # Add extracted data to Knowledge Graph
                skills = result.get("skills", [])
                experiences = result.get("experiences", [])
                
                added_skills = []
                for skill in skills:
                    await graph_service.add_skill(user_id=user_id, skill_name=skill)
                    added_skills.append(skill)
                    
                added_projects = []
                for exp in experiences:
                    await graph_service.add_project(
                        user_id=user_id,
                        title=exp.get("title", "Experience"),
                        description=exp.get("description", ""),
                        url=url
                    )
                    added_projects.append(exp.get("title"))
                    
                return {
                    "status": "success",
                    "extracted_skills": added_skills,
                    "extracted_experiences": added_projects
                }
            
            return {"status": "partial", "message": "No AI model configured to extract data."}

        except Exception as e:
            logging.error(f"LinkedIn Scraper Error: {e}")
            return {"status": "error", "message": str(e)}

linkedin_service = LinkedinService()
