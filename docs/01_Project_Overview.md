# 01. Project Overview

## What is IdentiTea?
IdentiTea is a next-generation AI-powered career identity platform. It goes beyond traditional linear resumes and static portfolios by leveraging advanced Large Language Models (LLMs) and Graph Neural Network principles to map out a user's entire professional history as a **Living Knowledge Graph**.

## The Problem
Modern professionals possess diverse skills, experiences, and projects that are often deeply interconnected. A traditional PDF resume flattens this multi-dimensional identity into a static document. Furthermore, validating these skills or understanding the implicit relationships between a candidate's experiences and a target role is highly manual and prone to bias.

## The Solution
IdentiTea acts as the central nervous system for a professional's career:
1. **Automated Ingestion**: Users simply upload their existing resumes, certificates, and project files.
2. **AI Extraction**: The system uses Google's Gemini to parse documents, extracting concrete skills, roles, technologies, and achievements.
3. **Graph Construction**: The extracted entities are woven into a Neo4j Knowledge Graph. If a user uploads a project built with "React", the system infers "JavaScript" proficiency and links them.
4. **Intelligent Output**: The platform generates real-time Identity Scores, runs Gap Analyses against target job roles, and synthesizes dynamic portfolios instantly.

## Target Audience
- **Job Seekers**: Looking to stand out with a cryptographically verifiable, dynamic career graph rather than a static PDF.
- **Professionals**: Wanting to run a "Gap Analysis" on their current skillset to understand what they need to learn for their next promotion.
- **Recruiters/Enterprises**: Capable of querying complex relationships (e.g., "Find someone who has 3 projects using Python and a verified certificate in AWS").
