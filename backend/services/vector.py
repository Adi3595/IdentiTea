from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
from core.config import settings

class VectorService:
    def __init__(self):
        self.url = settings.QDRANT_URL
        self.api_key = settings.QDRANT_API_KEY
        self.is_mock = not bool(self.api_key)
        self.collection_name = "documents"
        
        if not self.is_mock:
            self.client = AsyncQdrantClient(url=self.url, api_key=self.api_key)
            
    async def initialize_collection(self):
        if self.is_mock:
            return
            
        exists = await self.client.collection_exists(collection_name=self.collection_name)
        if not exists:
            await self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=768, distance=Distance.COSINE)
            )

    async def upsert_vector(self, document_id: str, vector: list[float], payload: dict):
        if self.is_mock:
            print(f"[Mock] Upserting vector for doc {document_id}")
            return
            
        await self.client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(id=document_id, vector=vector, payload=payload)
            ]
        )

    async def search(self, query_vector: list[float], limit: int = 5):
        if self.is_mock:
            return [{"id": "mock-doc-1", "score": 0.95, "payload": {"title": "Mock Resume"}}]
            
        results = await self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )
        return [{"id": r.id, "score": r.score, "payload": r.payload} for r in results]

vector_service = VectorService()
