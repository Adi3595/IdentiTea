from supabase import create_client, Client
from core.config import settings
import logging

class PostgresService:
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.is_mock = not (self.supabase_url and self.supabase_key)
        
        if not self.is_mock:
            try:
                self.client: Client = create_client(self.supabase_url, self.supabase_key)
            except Exception as e:
                logging.error(f"Failed to initialize Supabase Postgres client: {e}")
                self.is_mock = True

    def get_user_settings(self, user_id: str):
        if self.is_mock:
            return {"user_id": user_id, "theme": "system", "email_notifications": True}
        
        try:
            response = self.client.table("user_settings").select("*").eq("user_id", user_id).execute()
            if len(response.data) > 0:
                return response.data[0]
            else:
                return None
        except Exception as e:
            logging.error(f"Error fetching user settings: {e}")
            return None

    def update_user_settings(self, user_id: str, settings_data: dict):
        if self.is_mock:
            return settings_data
        
        try:
            settings_data["user_id"] = user_id
            response = self.client.table("user_settings").upsert(settings_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logging.error(f"Error updating user settings: {e}")
            return None

    def get_timeline_events(self, user_id: str):
        if self.is_mock:
            return []
        
        try:
            response = self.client.table("timeline_events").select("*").eq("user_id", user_id).order("date", desc=True).execute()
            return response.data
        except Exception as e:
            logging.error(f"Error fetching timeline: {e}")
            return []

    def log_timeline_event(self, user_id: str, event_type: str, title: str, description: str, date: str):
        if self.is_mock:
            return {"id": "mock-event", "user_id": user_id, "title": title}
            
        try:
            data = {
                "user_id": user_id,
                "event_type": event_type,
                "title": title,
                "description": description,
                "date": date
            }
            response = self.client.table("timeline_events").insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logging.error(f"Error logging timeline event: {e}")
            return None

db = PostgresService()
