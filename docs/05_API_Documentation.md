# 05. API Documentation

The IdentiTea Backend is built on FastAPI and fully documented via standard OpenAPI (Swagger) specifications. 

*When running locally, full interactive docs are available at `http://localhost:8000/docs`.*

## Core Endpoints

### 1. File Ingestion
`POST /api/documents/upload`
- **Auth**: Required (Firebase JWT Bearer)
- **Body**: `multipart/form-data` containing the file binary.
- **Logic**: Validates file -> Uploads to Supabase -> Parses Text -> Extracts via Gemini -> Ingests to Neo4j.
- **Returns**: JSON object with `document_id`, signed `storage_url`, and the extracted `metadata`.

### 2. Graph Retrieval
`GET /api/graph`
- **Auth**: Required
- **Logic**: Executes a Cypher query to retrieve the user's entire node and edge web.
- **Returns**: Formatted list of nodes and links for frontend visualization libraries (e.g., Force Directed Graphs).

### 3. Identity Engines
`GET /api/identity/score`
- **Auth**: Required
- **Logic**: Calculates a proprietary score based on the density and cryptographic verification of the user's graph nodes.

`GET /api/career/gap-analysis?target_role={role}`
- **Auth**: Required
- **Logic**: Compares the user's verified `(Skill)` nodes against industry standard requirements for the target role, identifying missing edges.

`GET /api/portfolio/auto`
- **Auth**: Required
- **Logic**: Synthesizes the complex graph into a clean, hierarchical JSON object suitable for rendering a public-facing static portfolio page.

`POST /api/identity/infer-relationships`
- **Auth**: Required
- **Logic**: Triggers the background inference engine to deduce missing skills based on existing project and technology nodes.
