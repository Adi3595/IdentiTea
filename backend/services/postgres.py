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
            raise Exception("Supabase is not configured. Real database connection required.")
        
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
            raise Exception("Supabase is not configured. Real database connection required.")
        
        try:
            settings_data["user_id"] = user_id
            response = self.client.table("user_settings").upsert(settings_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logging.error(f"Error updating user settings: {e}")
            return None

    def get_timeline_events(self, user_id: str):
        if self.is_mock:
            raise Exception("Supabase is not configured. Real database connection required.")
        
        try:
            response = self.client.table("timeline_events").select("*").eq("user_id", user_id).order("date", desc=True).execute()
            return response.data
        except Exception as e:
            logging.error(f"Error fetching timeline events: {e}")
            return []

    def log_timeline_event(self, user_id: str, event_type: str, title: str, description: str, date: str):
        if self.is_mock:
            raise Exception("Supabase is not configured. Real database connection required.")
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

    def log_audit(self, user_id: str, action: str, resource: str, ip_address: str):
        if self.is_mock:
            raise Exception("Supabase is not configured. Real database connection required.")
        
        try:
            data = {
                "user_id": user_id,
                "action": action,
                "resource": resource,
                "ip_address": ip_address
            }
            self.client.table("audit_logs").insert(data).execute()
        except Exception as e:
            logging.error(f"Error inserting audit log: {e}")

    # ==========================================
    # DOCUMENT INGESTION METHODS
    # ==========================================

    def insert_document(self, user_id: str, filename: str, storage_path: str, category: str):
        if self.is_mock: raise Exception("Supabase not configured.")
        try:
            data = {
                "user_id": user_id,
                "filename": filename,
                "storage_path": storage_path,
                "category": category
            }
            res = self.client.table("documents").insert(data).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            logging.error(f"Error inserting document: {e}")
            return None

    def insert_certificate(self, user_id: str, title: str, issuer: str, date: str, document_id: str):
        if self.is_mock: raise Exception("Supabase not configured.")
        try:
            data = {
                "user_id": user_id,
                "title": title,
                "issuer": issuer,
                "date": date,
                "document_id": document_id
            }
            res = self.client.table("certificates").insert(data).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            logging.error(f"Error inserting certificate: {e}")
            return None

    def insert_internship(self, user_id: str, role: str, company: str, duration: str, document_id: str):
        if self.is_mock: raise Exception("Supabase not configured.")
        try:
            data = {
                "user_id": user_id,
                "role": role,
                "company": company,
                "duration": duration,
                "document_id": document_id
            }
            res = self.client.table("internships").insert(data).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            logging.error(f"Error inserting internship: {e}")
            return None

    def insert_project(self, user_id: str, name: str, description: str, technologies: list, document_id: str):
        if self.is_mock: raise Exception("Supabase not configured.")
        try:
            data = {
                "user_id": user_id,
                "name": name,
                "description": description,
                "technologies": technologies,
                "document_id": document_id
            }
            res = self.client.table("projects").insert(data).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            logging.error(f"Error inserting project: {e}")
            return None

    def get_certificates(self, user_id: str):
        if self.is_mock: raise Exception("Supabase not configured.")
        try:
            res = self.client.table("certificates").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return res.data
        except Exception as e:
            logging.error(f"Error fetching certificates: {e}")
            return []

    def get_internships(self, user_id: str):
        if self.is_mock: raise Exception("Supabase not configured.")
        try:
            res = self.client.table("internships").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return res.data
        except Exception as e:
            logging.error(f"Error fetching internships: {e}")
            return []

    def get_projects(self, user_id: str):
        if self.is_mock: raise Exception("Supabase not configured.")
        try:
            res = self.client.table("projects").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return res.data
        except Exception as e:
            logging.error(f"Error fetching projects: {e}")
            return []

db = PostgresService()
