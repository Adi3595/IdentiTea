import json
from core.config import settings
from models.document import DocumentMetadata, ExtractedEntity

class AIExtractorService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_mock = not bool(self.api_key)

    async def extract_metadata(self, text_content: str, filename: str) -> DocumentMetadata:
        """
        Uses Gemini API to extract structured knowledge from document text.
        Falls back to mock data if no API key is provided.
        """
        if self.is_mock:
            # Mock behavior
            return DocumentMetadata(
                title=f"Mock Title for {filename}",
                organization="Mock Organization",
                date="2026-07-20",
                category="Resume",
                skills=[
                    ExtractedEntity(name="Python", confidence=0.95, evidence=filename),
                    ExtractedEntity(name="React", confidence=0.88, evidence=filename)
                ],
                technologies=[
                    ExtractedEntity(name="FastAPI", confidence=0.92, evidence=filename)
                ],
                summary="This is a mock summary generated because Gemini API key is missing.",
                confidence_score=0.90
            )

        # Real Gemini API implementation would go here using google-generativeai
        # Example:
        # model = genai.GenerativeModel('gemini-1.5-pro')
        # prompt = f"Extract skills, technologies, and metadata from this text: {text_content}"
        # response = model.generate_content(prompt)
        # Parse response into DocumentMetadata...
        
        pass

ai_extractor_service = AIExtractorService()
