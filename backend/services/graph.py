from neo4j import GraphDatabase, AsyncGraphDatabase
from core.config import settings
from models.document import DocumentMetadata

class GraphService:
    def __init__(self):
        self.uri = settings.NEO4J_URI
        self.user = settings.NEO4J_USER
        self.password = settings.NEO4J_PASSWORD
        
        self.is_mock = False
        try:
            self.driver = AsyncGraphDatabase.driver(self.uri, auth=(self.user, self.password))
        except Exception:
            self.is_mock = True

    async def close(self):
        if not self.is_mock:
            await self.driver.close()

    async def insert_document_graph(self, document_id: str, metadata: DocumentMetadata):
        """
        Inserts document and its extracted entities into the Neo4j Knowledge Graph.
        """
        if self.is_mock:
            print(f"[Mock] Inserting graph data for document {document_id}")
            return
            
        query = """
        MERGE (d:Document {id: $doc_id})
        SET d.title = $title, d.category = $category
        
        WITH d
        UNWIND $skills AS skill
        MERGE (s:Skill {name: skill.name})
        MERGE (d)-[r:MENTIONS_SKILL {confidence: skill.confidence}]->(s)
        """
        
        skills_data = [{"name": s.name, "confidence": s.confidence} for s in metadata.skills]
        
        async with self.driver.session() as session:
            await session.run(
                query, 
                doc_id=document_id,
                title=metadata.title,
                category=metadata.category,
                skills=skills_data
            )
            
    async def get_graph_data(self):
        """
        Returns graph data for React Flow visualization.
        """
        if self.is_mock:
            return {
                "nodes": [
                    {"id": "user", "label": "Student", "type": "person"},
                    {"id": "python", "label": "Python", "type": "skill"},
                    {"id": "react", "label": "React", "type": "skill"}
                ],
                "edges": [
                    {"source": "user", "target": "python", "label": "KNOWS"},
                    {"source": "user", "target": "react", "label": "KNOWS"}
                ]
            }
            
        # In a real scenario, run a Cypher query to extract nodes and edges for visualization
        return {"nodes": [], "edges": []}

graph_service = GraphService()
