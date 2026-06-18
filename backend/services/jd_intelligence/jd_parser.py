import json
import logging
from google.genai import types
from backend.app.utils.gemini_client import client, MODEL_NAME
from backend.models.jd import JobDescription

logger = logging.getLogger(__name__)

class JDParser:
    """
    Service to parse unstructured Job Description text into structured JSON.
    """
    
    @staticmethod
    async def parse_jd_text(jd_text: str) -> JobDescription:
        """
        Parses raw JD text and returns a structured JobDescription model.
        """
        prompt = f"""
You are an expert AI Recruiter. Your task is to analyze the following Job Description and extract structured information.
Respond ONLY with a valid JSON object matching the following schema. Ensure all fields are present, even if empty arrays or null.

{{
  "role": "string (e.g. Backend Engineer)",
  "domain": "string (e.g. IT Services, Finance, Healthcare, E-commerce) or null",
  "min_experience_years": number (e.g. 3.0),
  "max_experience_years": number or null (e.g. 6.0),
  "required_skills": ["skill1", "skill2"],
  "nice_to_have_skills": ["skill3", "skill4"],
  "must_have_requirements": ["string constraint 1", "string constraint 2"],
  "role_type": "string (e.g. Full-time, Contract, Remote)"
}}

Job Description to analyze:
{jd_text}
"""
        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        try:
            data = json.loads(response.text)
            return JobDescription.model_validate(data)
        except Exception as e:
            logger.error(f"Failed to parse JD from Gemini: {e}")
            logger.error(f"Raw Gemini Output: {response.text}")
            raise ValueError("Failed to parse JD into valid structure.")
