import json
from google import genai
from google.genai import types
from core.config import settings
from models.document import DocumentMetadata, ExtractedEntity

class AIExtractorService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_mock = not bool(self.api_key)
        
        if not self.is_mock:
            self.client = genai.Client(api_key=self.api_key)

    async def extract_metadata(self, text_content: str, filename: str) -> DocumentMetadata:
        """
        Uses Gemini API to extract structured knowledge from document text.
        Falls back to mock data if no API key is provided, ensuring development is not blocked.
        """
        if self.is_mock:
            print(f"[Mock] AI Extractor running for {filename}")
            return DocumentMetadata(
                title=f"Mock Title for {filename}",
                organization="Mock Organization",
                date="2026-07-20",
                category="Resume",
                skills=[
                    ExtractedEntity(name="Python", confidence=0.95, evidence="Built backend with Python"),
                    ExtractedEntity(name="React", confidence=0.88, evidence="Built frontend with React")
                ],
                technologies=[
                    ExtractedEntity(name="FastAPI", confidence=0.92, evidence="REST API using FastAPI")
                ],
                summary="This is a mock summary generated because the Gemini API key is missing.",
                confidence_score=0.90
            )

        # List of models to try in case of rate limits or missing models
        # Strictly avoiding 1.x models per user request
        fallback_models = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-exp",
            "gemini-2.0-pro-exp",
            "gemini-2.5-flash"
        ]
        
        prompt = f"""
        You are an advanced NLP Parsing Engine for an AI Knowledge Graph.
        Your job is to read the following text extracted from a document ({filename}) and extract concrete skills, technologies, and metadata.
        
        Respond ONLY with a valid JSON object matching this exact schema:
        {{
            "title": "String (Job title or document title)",
            "organization": "String (Company or university)",
            "date": "String (YYYY-MM-DD or general time period)",
            "category": "String (e.g. Resume, Certificate, Project, Internship)",
            "skills": [
                {{"name": "String", "confidence": Float (0.0 to 1.0), "evidence": "String (Exact quote from text proving this skill)"}}
            ],
            "technologies": [
                {{"name": "String", "confidence": Float (0.0 to 1.0), "evidence": "String (Exact quote from text proving this tech)"}}
            ],
            "summary": "String (A 2-sentence summary of the document's professional value)",
            "confidence_score": Float (0.0 to 1.0, your overall confidence in parsing this document)
        }}
        
        Text to parse:
        \"\"\"
        {text_content}
        \"\"\"
        """
        
        last_error = None
        for model_name in fallback_models:
            try:
                print(f"Attempting extraction with model: {model_name}...")
                response = await self.client.aio.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.1
                    )
                )
                
                parsed_data = json.loads(response.text)
                print(f"Successfully extracted data using {model_name}")
                return DocumentMetadata(**parsed_data)
                
            except Exception as e:
                print(f"Model {model_name} failed: {str(e)}. Switching to next model...")
                last_error = str(e)
                continue
                
        # If all models fail
        raise ValueError(f"All fallback models failed. Last error: {last_error}")

ai_extractor_service = AIExtractorService()
