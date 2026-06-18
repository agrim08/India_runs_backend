from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.app.core.db import supabase
from backend.services.comparison_system.comparison_engine import ComparisonEngine
from backend.services.risk_engine.risk_analysis import RiskEngine
from backend.services.recommendation_engine.recruiter_copilot import RecruiterCopilot

router = APIRouter()

class CandidateRequest(BaseModel):
    jd_text: str
    candidate_id: str

class ComparisonRequest(BaseModel):
    jd_text: str
    candidate_ids: List[str]

@router.post("/risk")
async def analyze_candidate_risk(req: CandidateRequest):
    """
    Analyzes a candidate for job-hopping, gaps, and missing skills.
    """
    try:
        # Fetch candidate profile from DB
        resp = supabase.table("candidates").select("profile_data").eq("candidate_id", req.candidate_id).execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail=f"Candidate {req.candidate_id} not found in database.")
        
        candidate_data = resp.data[0]['profile_data']
        risk_report = await RiskEngine.analyze_risks(req.jd_text, candidate_data)
        return risk_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/copilot")
async def generate_recruiter_guide(req: CandidateRequest):
    """
    Generates tailored interview questions and a personalized outreach email.
    """
    try:
        resp = supabase.table("candidates").select("profile_data").eq("candidate_id", req.candidate_id).execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Candidate not found")
            
        candidate_data = resp.data[0]['profile_data']
        guide = await RecruiterCopilot.generate_interview_guide(req.jd_text, candidate_data)
        return guide
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare")
async def compare_candidates(req: ComparisonRequest):
    """
    Compares multiple candidates side-by-side against the JD.
    """
    try:
        resp = supabase.table("candidates").select("profile_data").in_("candidate_id", req.candidate_ids).execute()
        if not resp.data or len(resp.data) != len(req.candidate_ids):
            raise HTTPException(status_code=404, detail="One or more candidates not found")
            
        profiles = [item['profile_data'] for item in resp.data]
        comparison = await ComparisonEngine.compare_candidates(req.jd_text, profiles)
        return comparison
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
