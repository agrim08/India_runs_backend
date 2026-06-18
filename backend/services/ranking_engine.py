import logging
from typing import List, Optional
import numpy as np
from pydantic import BaseModel, Field

from backend.models.candidate import Candidate
from backend.services.candidate_embedding import CandidateEmbedder
from backend.services.skill_score import SkillScorer
from backend.services.experience_score import ExperienceScorer

logger = logging.getLogger(__name__)


class RankedCandidate(BaseModel):
    """
    Model representing a candidate's computed rank, scores, and matching details.
    """
    candidate_id: str = Field(..., description="Unique identifier format CAND_XXXXXXX.")
    final_score: float = Field(..., description="Combined weighted ranking score (0.0 to 100.0).")
    semantic_score: float = Field(..., description="Semantic profile similarity score (0.0 to 100.0).")
    skill_score: float = Field(..., description="Skill match score against JD (0.0 to 100.0).")
    experience_score: float = Field(..., description="Experience match score against JD (0.0 to 100.0).")
    matched_skills: List[str] = Field(default_factory=list, description="Skill groups matched.")
    missing_skills: List[str] = Field(default_factory=list, description="Skill groups missing.")


class RankingEngine:
    """
    Core engine to rank candidates by combining semantic similarity,
    skill coverage, and experience relevance against a target job description.
    """

    def __init__(self, embedder: Optional[CandidateEmbedder] = None) -> None:
        """
        Initializes the ranking engine.

        Args:
            embedder: Optional pre-configured CandidateEmbedder service.
        """
        self.embedder = embedder or CandidateEmbedder()

    @staticmethod
    def _cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
        """
        Calculates cosine similarity between two 1D numpy arrays.

        Args:
            v1: Vector 1.
            v2: Vector 2.

        Returns:
            Float cosine similarity between -1.0 and 1.0.
        """
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        if norm_v1 == 0 or norm_v2 == 0:
            return 0.0
        return float(np.dot(v1, v2) / (norm_v1 * norm_v2))

    def rank_candidates(
        self,
        candidates: List[Candidate],
        jd_text: str,
        batch_size: int = 32,
    ) -> List[RankedCandidate]:
        """
        Ranks a list of candidates against the job description using the 40-30-30 formula.

        Args:
            candidates: List of Candidate objects.
            jd_text: The Job Description text to rank against.
            batch_size: Batch size used in sentence-transformers.

        Returns:
            List of RankedCandidate objects sorted in descending order of final_score.
        """
        if not candidates:
            return []

        # 1. Generate query embedding for the JD
        logger.info("Generating embedding for the Job Description...")
        jd_embedding = self.embedder.model.encode(jd_text, convert_to_numpy=True)

        # 2. Generate embeddings for all candidates
        logger.info(f"Generating embeddings for {len(candidates)} candidates...")
        candidate_embeddings = self.embedder.embed_candidates(
            candidates, batch_size=batch_size
        )

        ranked_list: List[RankedCandidate] = []

        # 3. Calculate scores and weights for each candidate
        for i, candidate in enumerate(candidates):
            try:
                # A. Semantic similarity (40% weight)
                cand_emb = candidate_embeddings[i]
                sim = self._cosine_similarity(jd_embedding, cand_emb)
                # Scale cosine similarity [-1.0, 1.0] to [0.0, 100.0]
                semantic_score = max(0.0, sim * 100.0)

                # B. Skill score (30% weight)
                skill_report = SkillScorer.calculate_match(candidate)
                skill_score = skill_report["score"]
                matched_skills = skill_report["matched_skills"]
                missing_skills = skill_report["missing_skills"]

                # C. Experience score (30% weight)
                experience_score = ExperienceScorer.calculate_score(candidate)

                # D. Combine into final weighted score
                # 40% semantic similarity, 30% skill, 30% experience
                final_score = (
                    (0.40 * semantic_score)
                    + (0.30 * skill_score)
                    + (0.30 * experience_score)
                )
                final_score = round(final_score, 2)

                ranked_list.append(
                    RankedCandidate(
                        candidate_id=candidate.candidate_id,
                        final_score=final_score,
                        semantic_score=round(semantic_score, 2),
                        skill_score=skill_score,
                        experience_score=experience_score,
                        matched_skills=matched_skills,
                        missing_skills=missing_skills,
                    )
                )
            except Exception as e:
                logger.error(f"Error ranking candidate {candidate.candidate_id}: {e}")
                # Fallback ranking item to prevent complete system crash
                ranked_list.append(
                    RankedCandidate(
                        candidate_id=candidate.candidate_id,
                        final_score=0.0,
                        semantic_score=0.0,
                        skill_score=0.0,
                        experience_score=0.0,
                    )
                )

        # 4. Sort ranked candidates (highest final_score first)
        ranked_list.sort(key=lambda x: x.final_score, reverse=True)
        return ranked_list
