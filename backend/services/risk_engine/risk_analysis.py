import json
import logging
from google.genai import types
from backend.app.utils.gemini_client import client, MODEL_NAME

logger = logging.getLogger(__name__)

class RiskEngine:
    """
    Analyzes a candidate's profile for potential risks (gaps, job hopping, skill mismatches).
    """

    @staticmethod
    async def analyze_risks(jd_text: str, candidate_profile: dict) -> dict:
        prompt = f"""
You are a meticulous technical recruiter conducting risk analysis.
Review the candidate's career history and skills against the Job Description.
Identify red flags such as:
1. Job hopping (short tenures without progression).
2. Large employment gaps.
3. Missing critical skills.
4. Mismatched seniority levels.

Return ONLY a valid JSON object matching this schema:
{{
  "risk_level": "Low" | "Medium" | "High",
  "risk_score_0_to_100": number,
  "risk_factors": ["string"],
  "mitigating_factors": ["string"]
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
            logger.error(f"Failed to parse Risk Analysis output: {e}")
            raise ValueError("Failed to analyze risks")
