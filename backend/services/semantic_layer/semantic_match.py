from backend.app.utils.gemini_client import generate_embeddings
from backend.app.core.db import supabase
import logging

logger = logging.getLogger(__name__)

class SemanticMatchEngine:
    """
    Handles semantic matching between a Job Description and Candidates using Vector Search.
    """

    @staticmethod
    async def match_candidates(jd_summary_text: str, top_k: int = 50, threshold: float = 0.5, is_custom: bool = False) -> list:
        """
        Embeds the JD text and queries the Supabase `match_candidates` RPC function.
        
        Args:
            jd_summary_text: A string synthesizing the JD's core requirements.
            top_k: Number of candidates to retrieve.
            threshold: Minimum cosine similarity threshold.
            
        Returns:
            A list of matching candidate dictionaries with their similarity scores.
        """
        try:
            # 1. Generate embedding for the JD
            jd_embedding = await generate_embeddings(jd_summary_text)
            
            # 2. Query Supabase pgvector using the RPC function
            # Note: We assume a 'match_candidates' function exists in Supabase.
            print("Threshold:", threshold)
            response = supabase.rpc("match_candidates", {
                "query_embedding": jd_embedding,
                "match_threshold": threshold,
                "match_count": top_k,
                "p_is_custom": is_custom
            }).execute()

            print("RPC returned:")
            print(response.data)
            
            return response.data
            
        except Exception as e:
            logger.error(f"Error in Semantic Match Engine: {e}")
            raise
