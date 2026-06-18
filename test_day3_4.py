import asyncio
import json
from dotenv import load_dotenv

load_dotenv()

from backend.models.jd import JobDescription
from backend.services.ranking_layer.domain_score import DomainScoreEngine
from backend.services.ranking_layer.retrieval_engine import RetrievalEngine

# A parsed dummy JD
sample_jd = JobDescription(
    role="Backend Engineer",
    domain="IT Services",
    min_experience_years=4.0,
    required_skills=["Python", "FastAPI", "SQL"],
    nice_to_have_skills=["Docker", "AWS"],
    must_have_requirements=["Willing to work remotely"],
    role_type="Full-time"
)

async def test_domain_score():
    print("\n=== Testing Domain Score Engine ===")
    mock_career = [
        {"industry": "IT Services", "duration_months": 24},
        {"industry": "Finance", "duration_months": 12},
    ]
    score = DomainScoreEngine.calculate_domain_fit("IT Services", mock_career)
    print(f"Mock Career Domain Score for 'IT Services': {score}% (Expected ~66.67%)")

async def test_retrieval_engine():
    print("\n=== Testing Retrieval Engine (End-to-End Semantic Search) ===")
    print(f"Searching for Role: {sample_jd.role}, Domain: {sample_jd.domain}")
    try:
        results = await RetrievalEngine.retrieve_and_rank(sample_jd)
        if not results:
            print("No results returned. Ensure your Supabase database is seeded using backend/db/seed.py!")
            return
            
        for i, res in enumerate(results):
            print(f"\nRank {i+1}: {res['profile'].get('anonymized_name', 'Unknown')}")
            print(f"  Candidate ID: {res['candidate_id']}")
            print(f"  Semantic Vector Score: {res['semantic_score']}")
            print(f"  Domain Fit Score: {res['domain_score']}")
            print(f"  Final Hybrid Score: {res['final_score']}")
            
    except Exception as e:
        print(f"\nError running Retrieval Engine: {e}")
        print("Note: If the error mentions 'function match_candidates does not exist', you need to run the backend/db/setup.sql script in your Supabase SQL editor.")

if __name__ == "__main__":
    asyncio.run(test_domain_score())
    asyncio.run(test_retrieval_engine())
