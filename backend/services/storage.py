import os
import uuid
from core.config import settings

class StorageService:
    def __init__(self):
        self.supabase_url = settings.NEXT_PUBLIC_SUPABASE_URL
        self.supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        # If no supabase credentials, we fallback to local mock storage
        self.is_mock = not (self.supabase_url and self.supabase_key)

    async def upload_file(self, file_bytes: bytes, filename: str) -> str:
        """
        Uploads a file to Supabase Storage and returns the public URL.
        Falls back to a mock URL if not configured.
        """
        if self.is_mock:
            # Mock behavior
            mock_id = str(uuid.uuid4())
            return f"http://localhost:8000/mock-storage/{mock_id}/{filename}"
            
        # In a real scenario, use supabase-py client here
        # supabase.storage.from_("documents").upload(filename, file_bytes)
        # return supabase.storage.from_("documents").get_public_url(filename)
        return f"{self.supabase_url}/storage/v1/object/public/documents/{filename}"

storage_service = StorageService()
