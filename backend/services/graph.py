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
        Fetches up to 2 hops away from the user.
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
            
        query = """
        MATCH (u:User {id: $user_id})-[r1]->(n1)
        OPTIONAL MATCH (n1)-[r2]->(n2)
        RETURN 
            elementId(u) as u_id,
            elementId(n1) as n1_id, type(r1) as r1_type, labels(n1)[0] as n1_label, coalesce(n1.displayName, n1.title, n1.name, 'Node') as n1_name,
            elementId(n2) as n2_id, type(r2) as r2_type, labels(n2)[0] as n2_label, coalesce(n2.displayName, n2.title, n2.name, 'Node') as n2_name
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                records = await result.data()
                
                nodes_dict = {
                    user_id: {"id": user_id, "label": "You", "type": "User"}
                }
                edges_set = set()
                edges = []
                
                for r in records:
                    # Process 1st hop
                    n1_id = r.get("n1_id")
                    if n1_id:
                        nodes_dict[n1_id] = {"id": n1_id, "label": r.get("n1_name"), "type": r.get("n1_label")}
                        edge1 = (user_id, n1_id, r.get("r1_type"))
                        if edge1 not in edges_set:
                            edges_set.add(edge1)
                            edges.append({"source": user_id, "target": n1_id, "label": edge1[2]})
                            
                    # Process 2nd hop
                    n2_id = r.get("n2_id")
                    if n2_id:
                        nodes_dict[n2_id] = {"id": n2_id, "label": r.get("n2_name"), "type": r.get("n2_label")}
                        edge2 = (n1_id, n2_id, r.get("r2_type"))
                        if edge2 not in edges_set:
                            edges_set.add(edge2)
                            edges.append({"source": n1_id, "target": n2_id, "label": edge2[2]})
                            
                return {"nodes": list(nodes_dict.values()), "edges": edges}
        except Exception as e:
            print(f"Error fetching graph data: {e}")
            return {"nodes": [], "edges": []}

    async def get_user_skills(self, user_id: str):
        if self.is_mock:
            return [{"id": "s1", "name": "Python", "confidence": 0.9, "category": "Language"}]
        query = """
        MATCH (u:User {id: $user_id})-[r:HAS_SKILL|HAS_TECH]->(s)
        RETURN elementId(s) as id, coalesce(s.displayName, s.name) as name, coalesce(r.confidence, 1.0) as confidence
        ORDER BY r.confidence DESC
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                return await result.data()
        except Exception as e:
            print(f"Error fetching skills: {e}")
            return []

    async def get_user_projects(self, user_id: str):
        if self.is_mock:
            return [{"id": "p1", "title": "MemoryVerse", "description": "Graph project"}]
        query = """
        MATCH (u:User {id: $user_id})-[:OWNS_DOCUMENT]->(p:Document)
        WHERE p.category = 'Project'
        OPTIONAL MATCH (p)-[:MENTIONS_TECH]->(t:Technology)
        RETURN elementId(p) as id, coalesce(p.title, 'Unnamed Project') as title, coalesce(p.summary, '') as description, collect(t.displayName) as technologies
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
        MATCH (u:User {id: $user_id})-[:OWNS_DOCUMENT]->(i:Document)
        WHERE i.category = 'Internship' OR i.category = 'Experience'
        RETURN elementId(i) as id, coalesce(i.title, 'Unnamed Role') as role, coalesce(i.organization, 'Unknown Company') as company, coalesce(i.date, 'Unknown Duration') as duration
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
        MATCH (u:User {id: $user_id})-[:OWNS_DOCUMENT]->(c:Document)
        WHERE c.category = 'Certificate' OR c.category = 'Certification'
        OPTIONAL MATCH (c)-[:MENTIONS_SKILL]->(s:Skill)
        RETURN elementId(c) as id, coalesce(c.title, 'Unnamed Certificate') as name, coalesce(c.organization, 'Unknown Issuer') as issuer, collect(s.displayName) as verified_skills
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
            
    async def infer_relationships(self, user_id: str):
        if self.is_mock:
            return {"inferred_skills_added": 3, "examples": ["React", "PostgreSQL"]}
            
        # Example inference: If user owns a Document that mentions a skill/tech, 
        # ensure the user HAS_SKILL or HAS_TECH.
        query = """
        MATCH (u:User {id: $user_id})-[:OWNS_DOCUMENT]->(d:Document)-[r:MENTIONS_SKILL|MENTIONS_TECH]->(t)
        MERGE (u)-[new_r:HAS_SKILL]->(t)
        ON CREATE SET new_r.confidence = r.confidence, new_r.inferred = true
        RETURN t.displayName as inferred_skill
        """
        try:
            async with self.driver.session() as session:
                result = await session.run(query, user_id=user_id)
                records = await result.data()
                inferred = [r.get("inferred_skill") for r in records]
                return {
                    "inferred_skills_added": len(inferred),
                    "examples": inferred[:5],
                    "status": "Inference Complete"
                }
        except Exception as e:
            print(f"Error inferring relationships: {e}")
            return {"error": str(e)}

graph_service = GraphService()
