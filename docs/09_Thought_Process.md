# 09. Thought Process

This document outlines the core architectural and product decisions made during the development of IdentiTea.

## 1. Why a Knowledge Graph? (Neo4j vs Postgres)
Early in the design phase, we recognized that a career is not a set of tables; it is a web of context. If a user works at Google, uses Kubernetes, and earns an AWS certification, storing those in isolated relational tables makes answering questions like "How verified is this user's Kubernetes skill?" extremely difficult.
**Decision**: We chose Neo4j to store career data natively as a graph. This allows our Identity Engine to traverse the graph instantly to calculate verification scores based on edge density.

## 2. Why a Hybrid DB approach?
While Neo4j is incredible for relationships, it is not optimized for standard web-app mechanical tasks like storing user sessions, audit logs, or binary file metadata.
**Decision**: We use PostgreSQL (via Supabase) for the system of record and Neo4j strictly as an intelligence layer.

## 3. Why Gemini 1.5 Pro?
Extracting structured data from an unstructured PDF resume is notoriously difficult. Standard OCR + Regex fails due to infinite resume layouts.
**Decision**: We chose Gemini 1.5 Pro because of its massive context window and native support for `response_mime_type="application/json"`. This guarantees that the LLM returns parsable JSON conforming to our Pydantic schema, eliminating parsing errors downstream.

## 4. Why Firebase over NextAuth/Clerk?
We required authentication that could be verified statelessly by a distinct Python backend *without* needing to query the frontend's database or session store.
**Decision**: Firebase issues cryptographically signed JWTs. The frontend passes this JWT to the backend, which verifies it locally using the Firebase Admin SDK, ensuring complete decoupling and zero latency.
