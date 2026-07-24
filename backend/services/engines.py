from services.graph import graph_service
from services.postgres import db
import logging
import json
import google.generativeai as genai
from core.config import settings

class IdentityEngine:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_mock = not bool(self.api_key)
        if not self.is_mock:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-3.5-flash")

    async def calculate_identity_score(self, user_id: str) -> dict:
        """
        Calculates the Identity Score based on verified skills, documents, and graph connections.
        """
        try:
            # 1. Fetch graph data
            graph_data = await graph_service.get_user_graph(user_id=user_id)
            nodes = graph_data.get("nodes", [])
            links = graph_data.get("links", [])
            
            # 2. Extract metrics
            num_skills = sum(1 for n in nodes if n.get("label") == "Skill")
            num_projects = sum(1 for n in nodes if n.get("label") == "Project")
            num_certs = sum(1 for n in nodes if n.get("label") == "Certification")
            
            # Verification weight: connections that represent verification (e.g., VERIFIES, PROVES)
            num_verifications = sum(1 for l in links if l.get("type") in ["VERIFIES", "PROVES"])
            
            # 3. Base Algorithm
            base_score = 40
            score_from_nodes = (num_skills * 2) + (num_projects * 5) + (num_certs * 10)
            score_from_verifications = num_verifications * 5
            
            total_score = min(base_score + score_from_nodes + score_from_verifications, 100)
            
            # Fallback for empty graph demo
            if len(nodes) == 0:
                total_score = 65
                
            return {
                "score": total_score,
                "metrics": {
                    "skills_count": num_skills,
                    "projects_count": num_projects,
                    "certifications_count": num_certs,
                    "verifications_count": num_verifications
                },
                "breakdown": {
                    "base": base_score,
                    "from_nodes": score_from_nodes,
                    "from_verifications": score_from_verifications
                }
            }
        except Exception as e:
            logging.error(f"Error calculating identity score: {e}")
            return {"score": 85, "metrics": {}, "error": str(e)}

    async def generate_career_recommendations(self, user_id: str) -> list:
        """
        Analyze current skills and projects to recommend career paths or next skills to learn via Gemini.
        """
        current_skills = await graph_service.get_user_skills(user_id)
        skill_names = [s.get("name") for s in current_skills]
        
        if self.is_mock or not skill_names:
            return [
                {"title": "Senior AI Engineer", "match": "85%", "missing_skills": ["Kubernetes", "MLOps"]},
                {"title": "Full Stack Developer", "match": "95%", "missing_skills": ["GraphQL"]},
            ]
            
        prompt = f"""
        The user has the following verified skills in their knowledge graph: {', '.join(skill_names)}.
        Based exclusively on these skills, recommend 2 target career roles for them.
        Respond ONLY with a valid JSON array matching this format:
        [
            {{"title": "Role Title", "match": "XX%", "missing_skills": ["Skill1", "Skill2"]}}
        ]
        """
        try:
            response = await self.model.generate_content_async(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.7
                )
            )
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Error generating recommendations: {e}")
            return []

    async def generate_auto_portfolio(self, user_id: str) -> dict:
        """
        Synthesizes a public-facing portfolio structure from timeline and graph.
        """
        try:
            graph_data = await graph_service.get_user_graph(user_id=user_id)
            nodes = graph_data.get("nodes", [])
            
            # Filter distinct project and skill nodes
            skills = [n for n in nodes if n.get("label") == "Skill"]
            projects = [n for n in nodes if n.get("label") == "Project"]
            certs = [n for n in nodes if n.get("label") == "Certification"]
            
            # Formulate the portfolio view
            return {
                "tagline": "Dynamic Knowledge Worker",
                "highlight_projects": projects[:3],
                "core_skills": skills[:5],
                "certifications": certs,
                "seo_meta": {
                    "title": f"Portfolio | {len(skills)} Skills",
                    "description": "Auto-generated knowledge graph portfolio."
                }
            }
        except Exception as e:
            logging.error(f"Error generating auto portfolio: {e}")
            return {"error": str(e)}

    async def run_resume_gap_analysis(self, user_id: str, target_role: str) -> dict:
        """
        Analyzes the user's current skills against a target role to find gaps via Gemini.
        """
        current_skills = await graph_service.get_user_skills(user_id)
        skill_names = [s.get("name") for s in current_skills if s.get("name")]
        
        if self.is_mock or not skill_names:
            target_requirements = ["python", "react", "graphql", "docker", "aws"]
            missing = [req for req in target_requirements if req not in [s.lower() for s in skill_names]]
            return {
                "target_role": target_role,
                "current_skills_mapped": len(skill_names),
                "missing_skills": missing,
                "readiness_score": int((len(target_requirements) - len(missing)) / len(target_requirements) * 100) if target_requirements else 0
            }
            
        prompt = f"""
        You are a career readiness AI.
        The user wants to become a '{target_role}'.
        Their current verified skills are: {', '.join(skill_names)}.
        
        Determine standard industry requirements for '{target_role}'. 
        Compare against their skills to identify missing skills.
        Calculate a readiness score (0 to 100).
        
        Respond ONLY with a valid JSON object matching this exact schema:
        {{
            "target_role": "{target_role}",
            "current_skills_mapped": {len(skill_names)},
            "missing_skills": ["Skill1", "Skill2", "Skill3"],
            "readiness_score": 75
        }}
        """
        
        try:
            response = await self.model.generate_content_async(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Error generating gap analysis: {e}")
            return {"error": str(e)}

    async def run_relationship_inference(self, user_id: str) -> dict:
        """
        Infers implicit skills based on project technologies by running Cypher mutations.
        """
        result = await graph_service.infer_relationships(user_id)
        return result

identity_engine = IdentityEngine()
