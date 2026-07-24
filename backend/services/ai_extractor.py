import json
import google.generativeai as genai
from core.config import settings
from models.document import DocumentMetadata, ExtractedEntity

class AIExtractorService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_mock = not bool(self.api_key)
        
        if not self.is_mock:
            genai.configure(api_key=self.api_key)
            # Using the fast and powerful 1.5 Flash for highly accurate JSON extraction
            self.model = genai.GenerativeModel("gemini-1.5-flash")

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

        # Real Gemini API implementation
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
        
        try:
            # We enforce JSON output directly via the generation config
            response = await self.model.generate_content_async(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.1 # Low temperature for factual extraction
                )
            )
            
            # Parse the JSON string into our Pydantic model
            raw_json = response.text
            parsed_data = json.loads(raw_json)
            
            return DocumentMetadata(**parsed_data)
            
        except Exception as e:
            print(f"Error during AI Extraction: {e}")
            raise ValueError(f"Failed to extract metadata via AI: {str(e)}")

ai_extractor_service = AIExtractorService()
