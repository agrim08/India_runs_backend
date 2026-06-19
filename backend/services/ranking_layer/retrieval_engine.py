import logging
from backend.models.jd import JobDescription
from backend.services.semantic_layer.semantic_match import SemanticMatchEngine
from backend.services.ranking_layer.domain_score import DomainScoreEngine
from backend.services.candidate_parser import CandidateParser
from backend.services.skill_score import SkillScorer
from backend.services.experience_score import ExperienceScorer
from backend.services.career_trajectory import CareerTrajectoryScorer

logger = logging.getLogger(__name__)

class RetrievalEngine:
    """
    Implements the Top-50 Retrieval Pipeline (5000 -> 500 -> 50 -> 10).
    Coordinates hard filters, semantic search, and hybrid ranking.
    """
    
    @staticmethod
    async def retrieve_and_rank(jd: JobDescription) -> list:
        """
        Executes the full retrieval and ranking pipeline.
        
        Args:
            jd: The parsed JobDescription model.
            
        Returns:
            List of all 25 ranked candidates.
        """
        # STEP 1: Construct a rich semantic string from the JD for embedding
        jd_semantic_string = f"Role: {jd.role}. Domain: {jd.domain}. Required Skills: {', '.join(jd.required_skills)}. Nice to have: {', '.join(jd.nice_to_have_skills)}."
        
        # STEP 2: Semantic Retrieval (Top 25)
        # In a real scenario, Supabase RPC would also apply the hard filters (min experience) before vector search.
        try:
            semantic_candidates = await SemanticMatchEngine.match_candidates(
                jd_summary_text=jd_semantic_string, 
                top_k=25
            )
        except Exception as e:
            logger.error(f"Semantic retrieval failed: {e}")
            return []
            
        if not semantic_candidates:
            return []

        # STEP 3: Hybrid Ranking (50 -> 10)
        ranked_candidates = []
        for candidate in semantic_candidates:
            # Supabase RPC returns the similarity as 'similarity'
            semantic_score = candidate.get("similarity", 0.0) * 100 
            
            # Extract full candidate profile (assuming RPC returns it in 'profile_data')
            profile_data = candidate.get("profile_data", {})
            career_history = profile_data.get("career_history", [])
            
            # Calculate Domain Fit
            domain_score = DomainScoreEngine.calculate_domain_fit(jd.domain, career_history)
            
            # Calculate Skill, Experience, and Trajectory scores using candidate parser
            try:
                candidate_model = CandidateParser.parse_dict(profile_data)
                skill_report = SkillScorer.calculate_match(candidate_model)
                skill_score = skill_report["score"]
                experience_score = ExperienceScorer.calculate_score(candidate_model)
                trajectory_report = CareerTrajectoryScorer.calculate_score(candidate_model)
                trajectory_score = float(trajectory_report.get("career_trajectory_score", 0.0))
            except Exception as e:
                logger.error(f"Failed to parse candidate model for scoring: {e}")
                skill_score = 0.0
                experience_score = 0.0
                trajectory_score = 0.0

            # Replace the placeholder with the combined Skill, Experience, and Trajectory scores (50% weight total)
            other_score = (skill_score + experience_score + trajectory_score) / 3.0
            
            final_score = (
                (0.40 * semantic_score) + 
                (0.10 * domain_score) + 
                (0.50 * other_score)
            )
            
            ranked_candidates.append({
                "candidate_id": candidate.get("candidate_id"),
                "semantic_score": round(semantic_score, 2),
                "domain_score": domain_score,
                "final_score": round(final_score, 2),
                "profile": profile_data.get("profile", {})
            })
            
        # Sort by final score descending
        ranked_candidates.sort(key=lambda x: x["final_score"], reverse=True)
        
        # Return all 25 sorted candidates
        return ranked_candidates
