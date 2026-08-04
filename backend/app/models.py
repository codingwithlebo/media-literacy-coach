from pydantic import BaseModel
from typing import Literal


class CredibilityCheckRequest(BaseModel):
    content: str
    content_type: Literal[
        "article",
        "social_post",
        "job_post",
        "message"
    ] = "article"


class EvidenceFinding(BaseModel):
    title: str
    status: Literal["good", "warning", "bad"]
    description: str


class RedFlag(BaseModel):
    label: str
    description: str


class CredibilityCheckResponse(BaseModel):
    credibility_score: int
    verdict: Literal["likely_real", "likely_fake", "uncertain"]

    explanation: str

    red_flags: list[RedFlag]

    suggested_sources: list[str]

    # New fields
    summary: str
    evidence: list[EvidenceFinding]
    learning_topic: str


class TranscriptionResponse(BaseModel):
    text: str


class OcrResponse(BaseModel):
    extracted_text: str