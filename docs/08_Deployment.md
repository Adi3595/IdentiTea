# 08. Deployment

IdentiTea is designed to be deployed across specialized, decoupled infrastructure.

## Frontend Deployment (Vercel)
The Next.js 14 frontend is optimized for Vercel.
- **Edge Network**: Static assets and Server Components are cached at the edge.
- **Environment Variables**: Managed securely via Vercel dashboard (`NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_API_URL`).
- **Middleware**: Runs on Vercel Edge Functions to intercept unauthenticated requests before they hit serverless instances.

## Backend Deployment (Render / AWS / GCP)
The FastAPI backend requires persistent compute for background tasks (inference engines) and memory overhead for data processing.
- **Docker**: The backend should be containerized using a standard `python:3.12-slim` image.
- **Web Server**: Uses `uvicorn` to run the ASGI application.
- **Environment**: Secrets (like `FIREBASE_SERVICE_ACCOUNT_JSON`, `GEMINI_API_KEY`) must be injected at runtime via secure secret managers.

## Database Infrastructure
- **PostgreSQL**: Hosted on Supabase Cloud. Backups and point-in-time recovery handled natively.
- **Neo4j**: Hosted on Neo4j AuraDB. A highly available, managed cloud graph database. Ensure AuraDB firewall rules permit traffic strictly from the Backend deployment IP addresses.
