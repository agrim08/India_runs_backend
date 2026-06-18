# Job Description Schema (JD Schema)

This document defines the structured data extracted from raw Job Descriptions by the JD Intelligence Engine.

## Purpose
Raw job descriptions are unstructured text containing marketing fluff, company descriptions, and buried requirements. To match candidates semantically, we must extract the core signals.

## Schema Structure

```json
{
  "role": "string",            // e.g. "Backend Engineer"
  "domain": "string",          // e.g. "IT Services", "Healthcare"
  "min_experience_years": 0.0, // e.g. 3.0
  "max_experience_years": 0.0, // e.g. 6.0
  "required_skills": [         // List of explicitly required skills
    "Python",
    "FastAPI",
    "PostgreSQL"
  ],
  "nice_to_have_skills": [     // List of optional/preferred skills
    "Docker",
    "AWS"
  ],
  "must_have_requirements": [  // High-level absolute constraints
    "Must be willing to work onsite",
    "Must have 3+ years of Python"
  ],
  "role_type": "string"        // e.g. "Full-time", "Contract"
}
```

## Why Important
Without a structured understanding of the job, ranking is useless. Converting a JD to this schema makes it directly comparable to the `candidate_schema.json`.
