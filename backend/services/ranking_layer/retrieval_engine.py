import logging
from backend.models.jd import JobDescription
from backend.services.semantic_layer.semantic_match import SemanticMatchEngine
from backend.services.ranking_layer.domain_score import DomainScoreEngine

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
            
            # TODO: Integrate other scores (Skill Score, Experience Score, Trajectory Score) 
            # For now, we simulate the hybrid formula:
            final_score = (
                (0.40 * semantic_score) + 
                (0.10 * domain_score) + 
                (0.50 * 75.0) # Placeholder for other scores until they are built
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
