# 10. Roadmap

IdentiTea is currently in V1, successfully proving the concept of a Living Knowledge Graph. The following features represent the trajectory for V2 and beyond.

## Phase 1: Real-time Platform Integrations
- **LinkedIn OAuth Sync**: Instead of relying solely on PDF uploads, users can authenticate via LinkedIn to ingest their graph data natively.
- **GitHub API Integration**: The system will automatically scan a user's public repositories, inferring skills (e.g., Python, Docker) based on actual code commits, and wiring them into the Knowledge Graph as `(Project)-[:PROVES]->(Skill)`.

## Phase 2: Autonomous Career Agents
- **Auto-Apply Engine**: Leveraging the structured graph, a background agent can read job descriptions from external boards, match them against the user's graph, and auto-generate hyper-tailored cover letters.
- **Skill Rot**: Implementing a time-decay algorithm on the edges of the Knowledge Graph. If a skill (e.g., React) hasn't been connected to a new Project node in 3 years, its Identity Score weight decays.

## Phase 3: Enterprise & Recruiter Access
- **Talent Discovery Portal**: Allowing enterprise partners to write natural language queries ("Find a backend engineer who knows Rust and has verified open-source contributions"). The backend will translate this into Cypher queries and return candidates based on their graph density.
- **Cryptographic Verification**: Issuing credentials on-chain (e.g., via Polygon) to ensure that `(Certificate)` nodes cannot be spoofed.
