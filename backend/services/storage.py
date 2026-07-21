import os
import uuid
from supabase import create_client, Client
from core.config import settings

class StorageService:
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.bucket_name = "documents"
        
        self.is_mock = not (self.supabase_url and self.supabase_key)
        
        if not self.is_mock:
            try:
                self.client: Client = create_client(self.supabase_url, self.supabase_key)
            except Exception as e:
                print(f"Failed to initialize Supabase client: {e}")
                self.is_mock = True

    async def initialize_bucket(self):
        """Ensures the secure storage bucket exists."""
        if self.is_mock:
            return
            
        try:
            buckets = self.client.storage.list_buckets()
            bucket_names = [b.name for b in buckets]
            if self.bucket_name not in bucket_names:
                # Private bucket by default for secure career data
                self.client.storage.create_bucket(self.bucket_name, {"public": False})
        except Exception as e:
            print(f"Could not verify bucket: {e}")

    async def upload_file(self, file_bytes: bytes, original_filename: str) -> dict:
        """
        Uploads a file to Supabase Storage securely.
        Returns a dict with 'path' and a temporary 'signed_url' for processing.
        Gracefully falls back to mock behavior if credentials are not configured.
        """
        if self.is_mock:
            mock_id = str(uuid.uuid4())
            return {
                "path": f"mock/{mock_id}/{original_filename}",
                "signed_url": f"http://localhost:8000/mock-storage/{mock_id}/{original_filename}"
            }
            
        # Secure bucket organization: folder/uuid-filename
        folder_id = str(uuid.uuid4())
        file_path = f"{folder_id}/{original_filename}"
        
        try:
            # Upload file bytes
            self.client.storage.from_(self.bucket_name).upload(
                file_path, 
                file_bytes,
                {"content-type": "application/pdf"}
            )
            
            # Generate a signed URL for secure access (expires in 1 hour)
            # This allows the AI or frontend to temporarily access the raw file without making the bucket public
            signed_url_res = self.client.storage.from_(self.bucket_name).create_signed_url(file_path, 3600)
            
            return {
                "path": file_path,
                "signed_url": signed_url_res.get("signedURL", "")
            }
        except Exception as e:
            raise ValueError(f"Failed to upload to Supabase: {str(e)}")

storage_service = StorageService()
