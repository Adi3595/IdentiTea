# 03. AI Workflow

IdentiTea's core value proposition is its ability to ingest unstructured data (like a PDF resume) and synthesize it into a rigid, highly connected Knowledge Graph.

## The Extraction Pipeline

### 1. Document Ingestion
When a user uploads a file via the `/api/documents/upload` endpoint:
- The file is validated for MIME type constraints (PDF, PNG, JPEG) and size limits (5MB).
- A background Virus Scan hook verifies the binary.
- The file is securely uploaded to a private Supabase Storage bucket, and a short-lived signed URL is generated.

### 2. Text Parsing
We utilize `PyMuPDF` (via `fitz`) to rapidly extract raw textual data from the binary PDF byte stream. This is significantly faster and more accurate than standard OCR for native digital documents.

### 3. LLM Orchestration (Gemini 1.5 Pro)
The raw text is passed to the `AIExtractorService`, which communicates with the Google Gemini API.
- **Strict JSON Enforcement**: We pass a strict `response_mime_type="application/json"` directive to Gemini, effectively forcing the LLM to output its results conforming to a specific, predefined JSON Schema representing nodes and edges.
- **Prompt Engineering**: The prompt instructs the model to identify "Skills", "Projects", "Certificates", and "Internships", and importantly, to extract the explicit *evidence string* that proves the relationship.

### 4. Graph Construction (Cypher)
Once the structured JSON is returned from Gemini:
- The `GraphService` maps the JSON array into Cypher `MERGE` commands.
- **Idempotency**: We use `MERGE` instead of `CREATE` to ensure that if a user uploads a new resume mentioning "Python", it doesn't create a duplicate "Python" node, but rather updates the edge weight or adds a new evidence relationship to the existing node.

### 5. Relationship Inference Engine
An asynchronous background task analyzes the newly ingested nodes. If it detects a `(Project)` node that uses `(Skill: React)`, the inference engine automatically executes logic to deduce and append a hidden edge `(User)-[:INFERRED_SKILL]->(Skill: JavaScript)`.
