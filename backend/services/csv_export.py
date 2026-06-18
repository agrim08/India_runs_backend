import csv
import io
import os
import logging
from typing import Dict, List, Optional, Union

from backend.models.candidate import Candidate
from backend.services.ranking_engine import RankedCandidate
from backend.services.career_trajectory import CareerTrajectoryScorer
from backend.services.potential_score import PotentialScorer
from backend.services.hidden_gem_detector import HiddenGemDetector

logger = logging.getLogger(__name__)

CSV_HEADERS = [
    "candidate_id",
    "final_score",
    "semantic_score",
    "skill_score",
    "experience_score",
    "potential_score",
    "career_trajectory_score",
    "hidden_gem_status"
]


class CSVExporter:
    """
    Exporter service to dump ranked candidates with deep scoring signals
    (semantic, skill, experience, potential, trajectory, hidden gem status) into CSV format.
    """

    @classmethod
    def export_to_stream(
        cls,
        ranked_candidates: List[RankedCandidate],
        candidates_map: Dict[str, Candidate],
        jd_text: str,
        top_n: Optional[int] = None
    ) -> io.StringIO:
        """
        Generates CSV content in-memory as a StringIO stream.

        Args:
            ranked_candidates: Sorted list of RankedCandidate objects.
            candidates_map: Dictionary mapping candidate ID to Candidate model.
            jd_text: The Job Description text.
            top_n: Optional limit for top N candidates.

        Returns:
            io.StringIO containing the generated CSV data.
        """
        output = io.StringIO()
        writer = csv.writer(output, lineterminator='\n')
        
        # Write header
        writer.writerow(CSV_HEADERS)

        # Slice to top_n if requested
        export_list = ranked_candidates
        if top_n is not None and top_n > 0:
            export_list = ranked_candidates[:top_n]

        # Process and write rows
        for rc in export_list:
            candidate = candidates_map.get(rc.candidate_id)
            if not candidate:
                logger.warning(f"Candidate {rc.candidate_id} not found in map. Skipping CSV row.")
                continue

            try:
                # Calculate downstream potential and trajectory scores
                potential_report = PotentialScorer.calculate_potential(candidate)
                potential_score = potential_report.get("potential_score", 0)

                trajectory_report = CareerTrajectoryScorer.calculate_score(candidate)
                trajectory_score = trajectory_report.get("career_trajectory_score", 0)

                # Detect hidden gem status
                gem_report = HiddenGemDetector.detect(candidate, jd_text, rc.final_score)
                hidden_gem = gem_report.get("is_hidden_gem", False)

                row = [
                    rc.candidate_id,
                    rc.final_score,
                    rc.semantic_score,
                    rc.skill_score,
                    rc.experience_score,
                    potential_score,
                    trajectory_score,
                    str(hidden_gem).upper()
                ]
                writer.writerow(row)
            except Exception as e:
                logger.error(f"Failed exporting row for candidate {rc.candidate_id}: {e}")

        # Reset stream position to beginning
        output.seek(0)
        return output

    @classmethod
    def export_to_file(
        cls,
        ranked_candidates: List[RankedCandidate],
        candidates_map: Dict[str, Candidate],
        jd_text: str,
        output_filepath: str,
        top_n: Optional[int] = None
    ) -> str:
        """
        Generates CSV content and writes it directly to the filesystem.

        Args:
            ranked_candidates: Sorted list of RankedCandidate.
            candidates_map: Map of ID to Candidate.
            jd_text: Job Description text.
            output_filepath: Target file path to write to.
            top_n: Optional limit.

        Returns:
            The absolute filepath where the CSV was written.
        """
        stream = cls.export_to_stream(ranked_candidates, candidates_map, jd_text, top_n)
        
        # Ensure directories exist
        os.makedirs(os.path.dirname(os.path.abspath(output_filepath)), exist_ok=True)

        with open(output_filepath, "w", encoding="utf-8") as f:
            f.write(stream.getvalue())

        logger.info(f"Successfully exported ranking CSV to: {output_filepath}")
        return os.path.abspath(output_filepath)
