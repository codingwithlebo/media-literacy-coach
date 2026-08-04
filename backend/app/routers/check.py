import json
from fastapi import APIRouter
from app.models import CredibilityCheckRequest, CredibilityCheckResponse
from app.ai_client import client, MODEL
from app.heuristics import heuristic_check
from app.supabase_client import save_analysis

router = APIRouter(prefix="/check", tags=["credibility"])

SYSTEM_PROMPT = """You are a media literacy assistant helping everyday users \
evaluate whether content (articles, social posts, job listings, or messages) \
is likely credible or likely misleading/fake.

Analyze the given content and respond ONLY with a JSON object matching this \
exact shape, no extra text:

{
  "credibility_score": <integer 0-100, higher = more credible>,
  "verdict": "likely_real" | "likely_fake" | "uncertain",
  "explanation": "<2-4 plain-language sentences explaining your reasoning, \
written for someone with no media literacy background>",
  "red_flags": [{"label": "<short flag name>", "description": "<one sentence>"}],
  "suggested_sources": ["<name of a reputable source or fact-checking site \
relevant to verifying this specific topic>"]
}

Be specific to the actual content given, not generic. If uncertain, say so \
honestly rather than guessing confidently."""


@router.post("", response_model=CredibilityCheckResponse)
def check_credibility(payload: CredibilityCheckRequest) -> CredibilityCheckResponse:
    if client is None:
        result = heuristic_check(payload.content)
    else:
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=f"Content type: {payload.content_type}\n\nContent:\n{payload.content}",
                config={
                    "system_instruction": SYSTEM_PROMPT,
                    "response_mime_type": "application/json",
                    "temperature": 0.3,
                },
            )
            data = json.loads(response.text)
            result = CredibilityCheckResponse(**data)
        except Exception:
            result = heuristic_check(payload.content)

    save_analysis(
        content=payload.content,
        content_type=payload.content_type,
        credibility_score=result.credibility_score,
        verdict=result.verdict,
        explanation=result.explanation,
    )

    return result