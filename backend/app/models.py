from pydantic import BaseModel
from typing import Literal

class Evidence(BaseModel):
    title: str
    status: Literal["good", "warning", "bad"]
    description: str


class RedFlag(BaseModel):
    label: str
    description: str


class CredibilityCheckResponse(BaseModel):
    credibility_score: int
    verdict: Literal["likely_real", "likely_fake", "uncertain"]

    summary: str
    explanation: str

    evidence: list[Evidence]
    red_flags: list[RedFlag]

    ai_generated_probability: int

    learning_topic: str

    suggested_sources: list[str]