from __future__ import annotations

from models.entities import JobDescription
from models.schemas import CandidateResult, RankedCandidate, ResultsResponse


def format_candidate_result(candidate: RankedCandidate) -> CandidateResult:
    explanation = " ".join(candidate.explanation[:2]).strip()
    if not explanation:
        explanation = "Candidate was ranked using skill, experience, and semantic similarity."

    return CandidateResult(
        name=candidate.candidate_name or candidate.filename,
        score=round(candidate.match_score, 2),
        matched_skills=candidate.matched_skills,
        missing_skills=candidate.missing_skills,
        explanation=explanation,
    )


def build_results_response(
    *,
    job: JobDescription,
    rankings: list[RankedCandidate],
) -> ResultsResponse:
    return ResultsResponse(
        job_id=job.id,
        job_title=job.title,
        results=[format_candidate_result(candidate) for candidate in rankings],
    )
