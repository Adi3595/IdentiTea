import httpx
from services.graph import graph_service
from models.document import DocumentMetadata, ExtractedEntity
import logging
import uuid

class GithubService:
    async def sync_repositories(self, username: str, user_id: str) -> dict:
        """
        Fetches public repositories for a given GitHub username and 
        ingests them into the Knowledge Graph as 'Project' documents.
        """
        url = f"https://api.github.com/users/{username}/repos"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params={"sort": "updated", "per_page": 20})
            
            if response.status_code != 200:
                logging.error(f"Failed to fetch GitHub repos for {username}: {response.text}")
                raise ValueError("Failed to fetch GitHub repositories. Make sure the username is correct.")
                
            repos = response.json()
            
            processed_count = 0
            for repo in repos:
                # We only want to add actual projects, skip forks if necessary (or keep them)
                if repo.get("fork"):
                    continue
                    
                # Create DocumentMetadata from Repo data
                technologies = []
                skills = []
                
                language = repo.get("language")
                if language:
                    technologies.append(ExtractedEntity(name=language, confidence=1.0, evidence="Primary repository language"))
                    
                topics = repo.get("topics", [])
                for topic in topics:
                    technologies.append(ExtractedEntity(name=topic, confidence=0.8, evidence="Repository topic"))
                    
                metadata = DocumentMetadata(
                    title=repo.get("name"),
                    organization=username,
                    date=repo.get("updated_at", "")[:10],
                    category="Project",
                    summary=repo.get("description") or f"GitHub repository {repo.get('name')}",
                    skills=skills,
                    technologies=technologies,
                    confidence_score=1.0
                )
                
                # Ingest into Neo4j
                # Generate a deterministic or random UUID for the repo document
                # Using the repo ID to avoid duplicates if synced multiple times could work, 
                # but we'll just use a uuid for now to match the document ingestion pattern
                doc_id = f"github_{repo.get('id')}"
                
                try:
                    await graph_service.insert_document_graph(
                        document_id=doc_id,
                        metadata=metadata,
                        user_id=user_id
                    )
                    processed_count += 1
                except Exception as e:
                    logging.error(f"Failed to ingest repo {repo.get('name')}: {e}")
                    
            return {
                "status": "success", 
                "message": f"Successfully synced {processed_count} repositories.",
                "count": processed_count
            }

github_service = GithubService()
