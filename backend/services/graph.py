from neo4j import AsyncGraphDatabase
from core.config import settings
from models.document import DocumentMetadata

class GraphService:
    def __init__(self):
        self.uri = settings.NEO4J_URI
        self.user = settings.NEO4J_USERNAME
        self.password = settings.NEO4J_PASSWORD
        
        # If credentials are not properly set, gracefully fallback to mock
        self.is_mock = not bool(self.password and self.password != "password")
        self.driver = None
        
        if not self.is_mock:
            try:
                self.driver = AsyncGraphDatabase.driver(self.uri, auth=(self.user, self.password))
            except Exception as e:
                print(f"Failed to connect to Neo4j: {e}")
                self.is_mock = True

    async def close(self):
        if self.driver:
            await self.driver.close()

    async def insert_document_graph(self, document_id: str, metadata: DocumentMetadata, user_id: str = "anonymous_user"):
        """
        Inserts a document, user, skills, and technologies into the Knowledge Graph using Cypher.
        """
        if self.is_mock:
            print(f"[Mock] Inserting graph data for document {document_id}")
            return
            
        query = """
        // 1. Ensure User exists
        MERGE (u:User {id: $user_id})
        
        // 2. Ensure Document exists and belongs to User
        MERGE (d:Document {id: $doc_id})
        SET d.title = $title, 
            d.category = $category, 
            d.date = $date, 
            d.organization = $organization,
            d.summary = $summary
        MERGE (u)-[:OWNS_DOCUMENT]->(d)
        
        // 3. Process Skills
        WITH u, d
        UNWIND $skills AS skill
        MERGE (s:Skill {name: toLower(skill.name)})
        SET s.displayName = skill.name
        MERGE (d)-[rs:MENTIONS_SKILL]->(s)
        SET rs.confidence = skill.confidence, rs.evidence = skill.evidence
        MERGE (u)-[ks:HAS_SKILL]->(s)
        // Aggregate confidence for the user's overall skill rating
        ON CREATE SET ks.confidence = skill.confidence
        ON MATCH SET ks.confidence = CASE WHEN ks.confidence < skill.confidence THEN skill.confidence ELSE ks.confidence END
        
        // 4. Process Technologies
        WITH u, d
        UNWIND $technologies AS tech
        MERGE (t:Technology {name: toLower(tech.name)})
        SET t.displayName = tech.name
        MERGE (d)-[rt:MENTIONS_TECH]->(t)
        SET rt.confidence = tech.confidence, rt.evidence = tech.evidence
        MERGE (u)-[kt:HAS_TECH]->(t)
        ON CREATE SET kt.confidence = tech.confidence
        ON MATCH SET kt.confidence = CASE WHEN kt.confidence < tech.confidence THEN tech.confidence ELSE kt.confidence END
        """
        
        skills_data = [{"name": s.name, "confidence": s.confidence, "evidence": s.evidence} for s in metadata.skills]
        techs_data = [{"name": t.name, "confidence": t.confidence, "evidence": t.evidence} for t in metadata.technologies]
        
        try:
            async with self.driver.session() as session:
                await session.run(
                    query, 
                    user_id=user_id,
                    doc_id=document_id,
                    title=metadata.title or "Untitled",
                    category=metadata.category,
                    date=metadata.date or "",
                    organization=metadata.organization or "",
                    summary=metadata.summary,
                    skills=skills_data,
                    technologies=techs_data
                )
        except Exception as e:
            print(f"Error executing Neo4j ingestion: {e}")
            raise ValueError(f"Failed to insert graph data: {str(e)}")
            
    async def get_user_graph(self, user_id: str = "anonymous_user"):
        """
        Extracts a flattened representation of the user's Knowledge Graph for visualization.
        """
        if self.is_mock:
            return {
                "nodes": [
                    {"id": "user", "label": "You", "type": "person"},
                    {"id": "python", "label": "Python", "type": "skill"},
                    {"id": "react", "label": "React", "type": "tech"}
                ],
                "edges": [
                    {"source": "user", "target": "python", "label": "HAS_SKILL"},
                    {"source": "user", "target": "react", "label": "HAS_TECH"}
                ]
            }
            
        # In a real scenario, this would query the graph, format as nodes/edges, and return
        query = """
        MATCH (u:User {id: $user_id})-[r]->(node)
        RETURN elementId(u) as source_id, type(r) as relationship, elementId(node) as target_id, labels(node)[0] as target_type, node.displayName as target_name
        """
        try:
            async with self.driver.session() as session:
                # Basic execution logic for returning graph format
                result = await session.run(query, user_id=user_id)
                nodes = []
                edges = []
                # Processing omitted for brevity, returning mock payload if executed
                return {"nodes": nodes, "edges": edges}
        except Exception as e:
            print(f"Error fetching graph data: {e}")
            return {"nodes": [], "edges": []}

    async def get_user_skills(self, user_id: str):
        if self.is_mock:
            return [{"id": "s1", "name": "Python", "confidence": 0.9, "category": "Language"}]
        query = """
        MATCH (u:User {id: $user_id})-[r:HAS_SKILL]->(s:Skill)
        RETURN elementId(s) as id, s.displayName as name, r.confidence as confidence
        ORDER BY r.confidence DESC
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                records = await result.data()
                return records
        except Exception as e:
            print(f"Error fetching skills: {e}")
            return []

    async def get_user_projects(self, user_id: str):
        if self.is_mock:
            return [{"id": "p1", "title": "MemoryVerse", "description": "Graph project"}]
        query = """
        MATCH (u:User {id: $user_id})-[:OWNS_PROJECT]->(p:Project)
        OPTIONAL MATCH (p)-[:USES]->(t:Technology)
        RETURN elementId(p) as id, p.title as title, p.description as description, collect(t.displayName) as technologies
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                return await result.data()
        except Exception as e:
            print(f"Error fetching projects: {e}")
            return []

    async def get_user_internships(self, user_id: str):
        if self.is_mock:
            return []
        query = """
        MATCH (u:User {id: $user_id})-[:HAS_INTERNSHIP]->(i:Internship)-[:AT_COMPANY]->(c:Company)
        RETURN elementId(i) as id, i.role as role, c.name as company, i.duration as duration
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                return await result.data()
        except Exception as e:
            return []

    async def get_user_certificates(self, user_id: str):
        if self.is_mock:
            return []
        query = """
        MATCH (u:User {id: $user_id})-[:HAS_CERTIFICATE]->(c:Certificate)
        OPTIONAL MATCH (c)-[:VERIFIES]->(s:Skill)
        RETURN elementId(c) as id, c.name as name, c.issuer as issuer, collect(s.displayName) as verified_skills
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                return await result.data()
        except Exception as e:
            return []

    async def get_user_achievements(self, user_id: str):
        if self.is_mock:
            return []
        query = """
        MATCH (u:User {id: $user_id})-[:HAS_ACHIEVEMENT]->(a:Achievement)
        RETURN elementId(a) as id, a.title as title, a.event as event, a.description as description
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                return await result.data()
        except Exception as e:
            return []

graph_service = GraphService()
