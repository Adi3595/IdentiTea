# 🚀 IdentiTea: Reviewer & Submission Notes

Welcome to **IdentiTea**! Thank you for reviewing our submission. This document contains essential notes to help you evaluate the platform, understand its core architecture, and test its features.

## 🎯 What is IdentiTea?
IdentiTea is an interactive, brutalist AI platform that ingests your scattered professional data (resumes, certificates, code repositories) and transforms them into a mathematically verifiable **Professional Knowledge Graph**. 

We built this to solve the problem of "unverifiable claims" on resumes. Instead of trusting a piece of paper, IdentiTea cryptographically extracts skills and draws edges directly to the source documents that prove them.

## 🌟 Highlights for Reviewers

### 1. End-to-End AI Ingestion Pipeline (No Mock Data!)
We do not use fake data. If you create a new account, your graph is completely empty. 
Try uploading a PDF Resume or Certificate on the **Documents** page!
- The backend parses the PDF using PyMuPDF.
- It passes the raw text to **Gemini 1.5 Flash** for highly structured JSON entity extraction.
- It securely saves the physical file to a **Supabase Storage Bucket**.
- It creates relational rows in **Supabase Postgres** (for fast tabular querying).
- It injects the skills and technologies as nodes into a **Neo4j Knowledge Graph**, linking them to the source document with confidence scores.

### 2. The Living Graph
Navigate to the **Knowledge Graph** tab to explore a fully interactive, force-directed graph of your professional identity. Watch nodes pulse and drag them around. This is powered by real Neo4j cypher queries hitting the backend.

### 3. Strict Brutalist Design Architecture
The UI/UX is built on a strict, 2-color rule:
- **Canvas (Background):** `#f8f9fa`
- **Ink (Foreground):** `#0f0b0a`
- We rely on harsh geometric borders, solid 4px lines, and aggressive drop-shadows.
- **Dark Mode:** Notice how the entire UI perfectly inverts. Even our SVG logo and the D3.js Knowledge Graph nodes dynamically invert their colors without introducing any tertiary shades. 

## 🛠️ Technology Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS (Vanilla CSS for strict brutalism), Framer Motion, Firebase Auth.
- **Backend:** Python FastAPI, Uvicorn, Google Generative AI (Gemini), PyMuPDF.
- **Databases:** 
  - **Supabase (PostgreSQL):** For relational entities, user settings, timelines, and blob storage.
  - **Neo4j (AuraDB):** For the highly connected, multi-hop Knowledge Graph relationships.

## 🚀 How to Test (Live Demo)
We have deployed the application so you don't have to build it locally!
- **Frontend (Vercel):** [https://identitea.vercel.app](https://identitea.vercel.app)
- **Backend (Render):** `https://identitea-backend.onrender.com`

**Testing Steps:**
1. Sign in via Google or GitHub (Firebase Auth).
2. Go to Settings and set up your profile and GitHub URL.
3. Go to the **Documents** tab and upload a PDF resume or a PDF certificate.
4. Watch the AI extract the skills in real-time.
5. Go to the **Knowledge Graph** to see your newly verified skills visually mapped out.
6. Check the **Certificates / Projects** tabs to see the tabular breakdown of your extracted data.

> *Note: If Render has spun down due to inactivity, the first document upload might take an extra 30-40 seconds while the backend wakes up!*

## 🧑‍💻 Running Locally
If you prefer to run the judges' evaluation locally:
1. Clone the repository.
2. In the `frontend` folder, add a `.env.local` with your Firebase config and `NEXT_PUBLIC_API_URL=http://localhost:8000/api`.
3. In the `backend` folder, add a `.env.development` with your `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEO4J_URI/USERNAME/PASSWORD`.
4. Start the frontend: `npm run dev`
5. Start the backend: `pip install -r requirements.txt` followed by `uvicorn main:app --reload`
6. Important: Execute `supabase_schema.sql` in your Supabase SQL editor to create the required tables.

---
*Thank you for exploring IdentiTea! Escape the folders, enter the graph.*
