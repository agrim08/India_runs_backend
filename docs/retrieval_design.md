# Top-50 Retrieval Pipeline Design

## Overview
This document outlines the architecture for the "Top-50 Retrieval Pipeline", designed to filter a large candidate pool (e.g., 5000) down to a highly relevant shortlist (10 Recommended) in stages.

## Pipeline Stages

### 1. Broad Filtering (The "5000 -> 500" Stage)
**Mechanism**: Hard Filters / Metadata matching using Supabase PostgreSQL.
- Filter candidates by absolute constraints:
  - Required minimum experience.
  - Required basic domain overlap (if strict).
  - Open to work flag.
- **Why**: Vector search is computationally heavier. Hard filters instantly reduce the search space to relevant candidates.

### 2. Semantic Retrieval (The "500 -> 50" Stage)
**Mechanism**: Vector Search using Supabase `pgvector`.
- Embed the Job Description's structured summary using `gemini-embedding-2`.
- Perform a Cosine Similarity search against the Candidate's profile embeddings.
- Retrieve the top 50 matches.
- **Why**: Matches on *meaning* rather than exact keywords (e.g., matching "Machine Learning Engineer" with "AI Engineer").

### 3. Hybrid Ranking (The "50 -> 10" Stage)
**Mechanism**: The Hybrid Ranking Engine (Day 4/5).
- Re-rank the Top 50 using a weighted formula:
  - 40% Semantic Match Score
  - 25% Skill Match Score (from Missing Skills Analysis)
  - 15% Experience Score
  - 10% Domain Fit
  - 10% Career Growth (Trajectory Score)
- **Why**: Semantic similarity alone isn't enough; recruiters care about experience depth and exact skill alignment.

## Database Flow
1. **Frontend** submits JD -> **FastAPI Backend** parses JD.
2. **Backend** constructs a SQL query with `pgvector` operators to query Supabase.
3. Supabase returns Top 50 -> Backend applies Hybrid Ranking -> Returns Top 10 to Frontend.
