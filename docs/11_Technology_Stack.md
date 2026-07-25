# 11. Technology Stack

This document details every major technology used in IdentiTea, explaining where it lives, why it was chosen, and its specific function within the system architecture.

---

## 1. Frontend Architecture

### Next.js 14 (App Router)
*   **Where it is used:** `frontend/` directory.
*   **What it is used for:** The core framework powering the entire web application.
*   **Why it was used:** Provides hybrid Server-Side Rendering (SSR) and Client-Side Rendering, leading to excellent SEO and fast initial page loads. The App Router paradigm handles nested layouts perfectly for our dashboard.
*   **Function:** Handles routing, server-side data fetching, and serves as the bridge between the React components and the backend API.

### React
*   **Where it is used:** `frontend/src/` directory.
*   **What it is used for:** Building the interactive user interface.
*   **Why it was used:** The industry standard for building component-driven, stateful web applications.
*   **Function:** Manages local state (e.g., theme toggles, form inputs) and orchestrates the rendering of the UI.

### Tailwind CSS
*   **Where it is used:** `frontend/src/app/globals.css` and throughout all React components.
*   **What it is used for:** Styling the application.
*   **Why it was used:** Allows for rapid, utility-first styling without context-switching to CSS files. It was crucial for strictly enforcing our rigid 2-color brutalist design system via CSS variables.
*   **Function:** Controls layout, typography, responsive design, and color themes.

### Framer Motion
*   **Where it is used:** `frontend/src/components/` (specifically in animated components).
*   **What it is used for:** Complex, physics-based UI animations.
*   **Why it was used:** Standard CSS transitions are too linear. Framer Motion allows us to use spring physics (`stiffness`, `damping`) to give the brutalist UI a fluid, mechanical, and heavy feel when interacting with elements.
*   **Function:** Animates page transitions, hover states, and the custom cursor.

### ForceGraph2D (react-force-graph)
*   **Where it is used:** `frontend/src/app/(dashboard)/dashboard/graph/page.tsx`
*   **What it is used for:** Visualizing the Knowledge Graph.
*   **Why it was used:** Rendering thousands of interconnected nodes requires a highly optimized canvas and a physics engine (d3-force) to calculate node repulsion and edge attraction in real-time.
*   **Function:** Renders the "Living Graph", allowing the user to zoom, pan, and click on nodes (Skills, Projects) to explore their professional identity visually.

---

## 2. Backend Architecture

### FastAPI
*   **Where it is used:** `backend/` directory (specifically `main.py` and `api/routers/`).
*   **What it is used for:** The core backend web framework.
*   **Why it was used:** Built on Starlette, it is incredibly fast, asynchronous by default, and auto-generates Swagger documentation. It is perfectly suited for Python-heavy AI tasks.
*   **Function:** Exposes RESTful API endpoints, handles JWT authentication middleware, and routes requests to the appropriate AI engines.

### Python 3.12
*   **Where it is used:** Entire `backend/` directory.
*   **What it is used for:** The programming language for the backend.
*   **Why it was used:** Python is the undisputed king of the AI, NLP, and data engineering ecosystem. Using it allows seamless integration with LLM SDKs and data-processing libraries.
*   **Function:** Executes the business logic, parsing engines, and database communications.

---

## 3. Database & Storage Layer

### Neo4j (Knowledge Graph)
*   **Where it is used:** `backend/services/neo4j_service.py` (Hosted on Neo4j AuraDB).
*   **What it is used for:** Storing unstructured, interconnected professional data.
*   **Why it was used:** Relational databases are terrible at deep, recursive relationship queries. Neo4j can traverse a massive web of Skills, Projects, and Certifications in milliseconds to calculate graph density and weight.
*   **Function:** Stores the nodes `(User, Skill, Project)` and relationships `[:HAS_SKILL]`, acting as the core "Intelligence Layer" of the platform.

### Supabase (PostgreSQL)
*   **Where it is used:** `backend/services/postgres.py` (Hosted on Supabase Cloud).
*   **What it is used for:** Storing structured, relational configuration data.
*   **Why it was used:** Provides rock-solid ACID compliance, easy JSONB column support, and a fast managed cloud instance.
*   **Function:** Acts as the "Mechanical Layer", storing `user_settings` (themes, profiles), `timeline_events` (chronological updates), and immutable `audit_logs`.

### Qdrant (Vector Database)
*   **Where it is used:** `backend/services/vector.py` (Hosted locally via Docker or Qdrant Cloud).
*   **What it is used for:** Storing high-dimensional vector embeddings.
*   **Why it was used:** It is incredibly fast at performing cosine-similarity mathematical searches on vectors, which is required for semantic matching.
*   **Function:** Takes the text of a user's Graph and the text of a Job Description, converts them to mathematical vectors, and queries the distance between them to generate the **Readiness Score**.

---

## 4. Artificial Intelligence & Auth

### Google Gemini (LLM)
*   **Where it is used:** `backend/services/engines.py` (via `google-generativeai` SDK).
*   **What it is used for:** Natural Language Processing and Entity Extraction.
*   **Why it was used:** Gemini excels at parsing large, messy contexts (like a randomly formatted PDF resume) and reliably returning strictly formatted JSON objects.
*   **Function:** Ingests the user's uploaded PDFs, identifies what is a "Skill", "Project", or "Timeline Event", and structures that data so the backend can inject it into Neo4j and Supabase.

### Firebase Authentication
*   **Where it is used:** `frontend/src/lib/firebase.ts` and `backend/core/auth.py`.
*   **What it is used for:** User identity management.
*   **Why it was used:** Offloads the heavy security burden of managing passwords, salts, and session hijacking to Google's battle-tested infrastructure.
*   **Function:** Handles user sign-up/login on the frontend, issues a JWT (JSON Web Token), which the frontend sends to the backend. The backend verifies this token to ensure the user is who they claim to be.
