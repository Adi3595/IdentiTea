import logging
from google import genai
from google.genai import types
from core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

FALLBACK_MODELS = [
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.0-flash',
    'gemini-2.5-flash'
]

async def generate_content_with_fallback(contents: str, config: types.GenerateContentConfig = None):
    if not client:
        raise Exception("Gemini API key is not configured.")
        
    last_error = None
    for model_name in FALLBACK_MODELS:
        try:
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=contents,
                config=config
            )
            return response
        except Exception as e:
            error_str = str(e).lower()
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str or "404" in error_str or "not found" in error_str:
                logging.warning(f"Model {model_name} failed: {e}. Falling back to next model.")
                last_error = e
                continue
            else:
                # If it's a different kind of error (like bad request), raise it immediately
                raise e
                
    logging.error(f"All fallback models failed. Last error: {last_error}")
    raise Exception(f"All fallback models failed. Last error: {last_error}")
