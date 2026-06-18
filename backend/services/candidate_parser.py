import json
import logging
from typing import Any, Generator, List, Union
from pydantic import ValidationError

from backend.models.candidate import Candidate

logger = logging.getLogger(__name__)


class CandidateParser:
    """
    Parser service to load, validate, normalize, and instantiate Candidate objects
    from various JSON representations, handling anomalies and missing fields.
    """

    @staticmethod
    def normalize_profile(data: dict) -> dict:
        """
        Normalizes profile fields (strips whitespace, handles formatting).

        Args:
            data: Candidate dictionary.

        Returns:
            Dictionary with normalized profile fields.
        """
        profile = data.get("profile", {})
        if not isinstance(profile, dict):
            return data

        # Normalize strings: strip whitespace
        for field in [
            "anonymized_name",
            "headline",
            "summary",
            "location",
            "country",
            "current_title",
            "current_company",
            "current_industry",
        ]:
            if field in profile and isinstance(profile[field], str):
                profile[field] = profile[field].strip()

        # Enforce normalized profile dict back into data
        data["profile"] = profile
        return data

    @staticmethod
    def normalize_collections(data: dict) -> dict:
        """
        Ensures lists like certifications and languages default to empty arrays
        if they are missing or null, and trims all string fields in items.

        Args:
            data: Candidate dictionary.

        Returns:
            Dictionary with normalized collections.
        """
        for field in ["career_history", "education", "skills", "certifications", "languages"]:
            if field not in data or data[field] is None:
                data[field] = []
            elif isinstance(data[field], list):
                # Trim string values inside items
                for item in data[field]:
                    if isinstance(item, dict):
                        for k, v in item.items():
                            if isinstance(v, str):
                                item[k] = v.strip()
        return data

    @classmethod
    def parse_dict(cls, data: dict) -> Candidate:
        """
        Parses a candidate dictionary, normalizes fields, and instantiates
        a validated Candidate Pydantic model.

        Args:
            data: Raw dictionary of candidate data.

        Returns:
            Validated Candidate Pydantic model instance.

        Raises:
            ValidationError: If model validation rules are violated.
        """
        # Deep copy to avoid mutating the original data structure
        normalized_data = json.loads(json.dumps(data))
        
        # Run normalizations
        normalized_data = cls.normalize_profile(normalized_data)
        normalized_data = cls.normalize_collections(normalized_data)

        # Let the Pydantic model validate and initialize
        return Candidate.model_validate(normalized_data)

    @classmethod
    def parse_json_str(cls, json_str: str) -> Candidate:
        """
        Parses a candidate JSON string, normalizes fields, and returns a Candidate object.

        Args:
            json_str: Raw JSON string.

        Returns:
            Validated Candidate Pydantic model instance.

        Raises:
            ValueError: If JSON decode fails.
            ValidationError: If validation fails.
        """
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON string format: {e}") from e
        return cls.parse_dict(data)

    @classmethod
    def load_from_json_file(
        cls, file_path: str, ignore_validation_errors: bool = False
    ) -> List[Candidate]:
        """
        Loads a list of Candidates from a standard JSON array file.

        Args:
            file_path: Absolute path to the JSON file.
            ignore_validation_errors: If True, invalid candidates are skipped.

        Returns:
            List of validated Candidate objects.
        """
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            raise ValueError("JSON file root must be a list of candidate objects.")
            
        candidates = []
        for i, item in enumerate(data):
            try:
                candidates.append(cls.parse_dict(item))
            except ValidationError as e:
                if ignore_validation_errors:
                    logger.warning(f"Skipping candidate at index {i} due to validation error: {e}")
                    continue
                logger.error(f"Validation failed for candidate at index {i}: {e}")
                raise
        return candidates

    @classmethod
    def iterate_jsonl_file(
        cls, file_path: str, ignore_validation_errors: bool = False
    ) -> Generator[Candidate, None, None]:
        """
        Generator to stream candidates from a large JSON Lines (.jsonl) file.
        Memory-efficient for production scale.

        Args:
            file_path: Absolute path to the JSONL file.
            ignore_validation_errors: If True, invalid candidates (honeypots) are skipped.

        Yields:
            Validated Candidate objects sequentially.
        """
        with open(file_path, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                clean_line = line.strip()
                if not clean_line:
                    continue
                try:
                    yield cls.parse_json_str(clean_line)
                except ValidationError as e:
                    if ignore_validation_errors:
                        logger.warning(f"Skipping line {line_num} due to validation error: {e}")
                        continue
                    raise
