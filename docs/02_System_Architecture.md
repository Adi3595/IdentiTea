# 02. System Architecture

IdentiTea is built on a highly decoupled, modern SaaS architecture emphasizing scale, separation of concerns, and hybrid data management.

## 1. The Frontend (Client Layer)
- **Framework**: Next.js 14 App Router.
- **Hosting**: Designed for Edge deployments (e.g., Vercel or Cloudflare Pages) to minimize latency.
- **State**: `React Query` manages all asynchronous data fetching, caching, and state synchronization with the backend APIs.

## 2. The Backend (Intelligence Layer)
- **Framework**: Python FastAPI.
- **Why Python?**: Python is the undisputed king of AI and Data Science. Writing the backend in FastAPI allows us to native import LangChain, Gemini SDKs, and Neo4j graph data science plugins without relying on brittle JavaScript wrappers.

## 3. The Dual-Database Strategy
We do not force all data into a single paradigm.
- **PostgreSQL (Supabase)**: The immutable System of Record. Handles highly structured, tabular data like Users, Audit Logs, Application Settings, and Document Metadata.
- **Neo4j (Knowledge Graph)**: The Intelligence Engine. Handles flexible, highly interconnected semantic data. It allows us to execute rapid graph traversals (e.g., "Find all skills connected to projects connected to this user") in milliseconds, which would require massive, slow `JOIN` operations in Postgres.

## 4. Authentication Flow
We use **Firebase Auth** as the edge identity provider.
1. Frontend authenticates with Firebase via Google/GitHub OAuth or Email.
2. Frontend receives a secure JWT.
3. Frontend attaches the JWT as a Bearer token to FastAPI requests.
4. FastAPI uses the Firebase Admin SDK to decode and verify the JWT cryptographically without a network round-trip, yielding a secure `user_id`.
