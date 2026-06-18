import asyncio
import json
from dotenv import load_dotenv

# Load environment variables before importing our services
load_dotenv()

from backend.services.jd_intelligence.jd_parser import JDParser
from backend.services.jd_intelligence.requirement_extractor import RequirementExtractor

sample_jd = """
Looking for a Senior Backend Engineer to join our core infrastructure team.
Must have at least 4 years of experience building scalable APIs.
Required skills include Python, FastAPI, and PostgreSQL.
Nice to have: Docker, Kubernetes, AWS.
This is a full-time, remote position.
Must reside in the US and have a valid work permit.
"""

async def run_test():
    print("=== Testing JD Parser ===")
    try:
        jd_structure = await JDParser.parse_jd_text(sample_jd)
        # Convert the Pydantic model back to JSON for pretty printing
        print(jd_structure.model_dump_json(indent=2))
        
        print("\n=== Testing Requirement Extractor ===")
        hard_requirements = await RequirementExtractor.extract_hard_requirements(sample_jd)
        print(json.dumps(hard_requirements, indent=2))
        
    except Exception as e:
        print(f"Error during testing: {e}")

if __name__ == "__main__":
    asyncio.run(run_test())
