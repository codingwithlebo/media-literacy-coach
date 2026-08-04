import json
from fastapi import APIRouter
from app.models import CredibilityCheckRequest, CredibilityCheckResponse
from app.ai_client import client, MODEL
from app.heuristics import heuristic_check

router = APIRouter(prefix="/check", tags=["credibility"])

SYSTEM_PROMPT = """
You are an AI Media Literacy Coach.

Your purpose is to help users critically evaluate information, not simply label it as true or false.

When analyzing content:
- Assess the credibility of the information.
- Explain your reasoning in clear, simple language.
- Highlight both positive credibility indicators and warning signs.
- Avoid making absolute claims when evidence is limited.
- If you are uncertain, explain why.

Always encourage critical thinking rather than certainty.

Return ONLY valid JSON matching this exact structure:

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

Do not include markdown.
Do not include code fences.
Return JSON only.
"""
CONTENT_GUIDANCE = {
    "article": """
Focus on:
- publication credibility
- author information
- supporting evidence
- citations
- publication date
- balanced reporting
""",

    "social_post": """
Focus on:
- emotionally charged language
- engagement bait
- unsupported claims
- manipulated context
- missing sources
""",

    "job_post": """
Focus on:
- unrealistic salaries
- payment requests
- missing company information
- urgency tactics
- suspicious contact details
""",

    "message": """
Focus on:
- phishing attempts
- impersonation
- suspicious links
- requests for sensitive information
- urgency tactics
"""
}

@router.post("", response_model=CredibilityCheckResponse)
def check_credibility(payload: CredibilityCheckRequest) -> CredibilityCheckResponse:
    if client is None:
        return heuristic_check(payload.content)

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=f"""
{CONTENT_GUIDANCE.get(payload.content_type, "")}

Content Type:
{payload.content_type}

Content:
{payload.content}
""",
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