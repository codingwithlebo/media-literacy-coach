from pydantic import BaseModel
from typing import Literal


class CredibilityCheckRequest(BaseModel):
    content: str
    content_type: Literal["article", "social_post", "job_post", "message"] = "article"


class RedFlag(BaseModel):
    label: str
    description: str


class CredibilityCheckResponse(BaseModel):
    credibility_score: int  # 0-100, higher = more credible
    verdict: Literal["likely_real", "likely_fake", "uncertain"]
    explanation: str
    red_flags: list[RedFlag]
    suggested_sources: list[str]


class TranscriptionResponse(BaseModel):
    text: str


class OcrResponse(BaseModel):
    extracted_text: str
