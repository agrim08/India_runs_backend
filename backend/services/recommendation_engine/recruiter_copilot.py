import json
import logging
from google.genai import types
from backend.app.utils.gemini_client import client, MODEL_NAME

logger = logging.getLogger(__name__)

class RecruiterCopilot:
    """
    Generates personalized interview guides and outreach emails based on JD/Candidate alignment.
    """

    @staticmethod
    async def generate_interview_guide(jd_text: str, candidate_profile: dict) -> dict:
        prompt = f"""
You are an expert recruiter preparing an interview guide for a hiring manager.
Based on the JD and the candidate's profile, generate personalized interview questions that probe their specific weaknesses and verify their claimed strengths.
Also, generate a personalized, highly engaging outreach email to recruit this candidate for the role.

Return ONLY a valid JSON object matching this schema:
{{
  "technical_questions": ["string"],
  "behavioral_questions": ["string"],
  "areas_to_probe": ["string"],
  "personalized_outreach_email": "string"
}}

Job Description:
{jd_text}

Candidate Profile:
{json.dumps(candidate_profile, indent=2)}
"""
        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        try:
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Failed to parse Copilot output: {e}")
            raise ValueError("Failed to generate recruiter copilot guide")
