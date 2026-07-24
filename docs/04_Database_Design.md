# 04. Database Design

Our application relies on two distinctly different database paradigms operating in tandem.

## 1. Relational Layer: PostgreSQL (Supabase)
This layer acts as the absolute source of truth for the application's mechanical operations.

### Key Entities
- **Users**: (Managed by Firebase natively, but a shadow copy or extended profile can exist here).
- **Documents**: Tracks `document_id`, `filename`, `mime_type`, `size`, `upload_timestamp`, and `user_id`.
- **Audit Logs**: A strict, append-only table recording every state mutation (POST/PUT/DELETE) with `user_id`, `action`, `endpoint`, `ip_address`, and `timestamp`.

## 2. Intelligence Layer: Neo4j (Knowledge Graph)
This layer stores the unstructured identity data.

### Nodes (Labels)
- `(User)`: The root node for a person. Indexed heavily on `user_id`.
- `(Skill)`: Represents a capability (e.g., Python, UI Design, Leadership).
- `(Project)`: Represents a body of work.
- `(Certificate)`: Represents verifiable evidence.
- `(Company)` & `(University)`: Represent organizations.

### Edges (Relationships)
Edges represent the context between nodes and often carry properties (like timestamps, evidence strings, or validation scores).
- `(User)-[:HAS_SKILL]->(Skill)`
- `(User)-[:WORKED_AT]->(Company)`
- `(User)-[:COMPLETED]->(Project)`
- `(Project)-[:USES]->(Skill)`
- `(Certificate)-[:VERIFIES]->(Skill)`

### Why Graph?
To calculate an "Identity Score", the system needs to evaluate the density of a user's connections. A skill that is connected to 3 projects and 1 certificate is "heavier" and more verified than a skill with no connections. In Neo4j, traversing this web to calculate a score takes milliseconds. In Postgres, it would require complex recursive CTEs or massive JOINs.
