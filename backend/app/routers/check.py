import json
from fastapi import APIRouter
from app.models import CredibilityCheckRequest, CredibilityCheckResponse
from app.ai_client import client, MODEL
from app.heuristics import heuristic_check

router = APIRouter(prefix="/check", tags=["credibility"])

SYSTEM_PROMPT = """
You are an AI Media Literacy Coach.

Your goal is not to decide absolute truth.
Your goal is to help users think critically about information.

Analyze the content according to its type (news article, social media post, job listing, or message).

When analyzing, consider:
- Source credibility
- Quality of evidence
- Emotional or manipulative language
- Missing context
- Unverifiable claims
- Logical inconsistencies

Explain your reasoning in simple language that anyone can understand.

If you are uncertain, clearly explain why instead of making confident claims.

Recommend one media literacy topic the user should learn next based on the issues you identified.

Return ONLY valid JSON with exactly this structure:

{
  "credibility_score": 0,
  "verdict": "likely_real",
  "summary": "",
  "explanation": "",
  "evidence": [
    {
      "title": "",
      "status": "good",
      "description": ""
    }
  ],
  "red_flags": [
    {
      "label": "",
      "description": ""
    }
  ],
  "learning_topic": "",
  "suggested_sources": []
}

Do not return markdown.
Do not wrap the JSON in code fences.
Return JSON only.
"""

@router.post("", response_model=CredibilityCheckResponse)
def check_credibility(payload: CredibilityCheckRequest) -> CredibilityCheckResponse:
    if client is None:
        return heuristic_check(payload.content)

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
        return CredibilityCheckResponse(**data)
    except Exception:
        return heuristic_check(payload.content)