import re
from app.models import (
    CredibilityCheckResponse,
    RedFlag,
    EvidenceFinding,
)

URGENCY_PHRASES = [
    r"\bact now\b", r"\burgent\b", r"\bimmediately\b", r"\b24 hours\b",
    r"\bexpires? (today|soon)\b", r"\blimited time\b", r"\bact fast\b",
    r"\bmidnight tonight\b",
]

SENSITIVE_REQUEST_PHRASES = [
    r"\bbanking details\b", r"\bpassword\b", r"\bOTP\b", r"\bpin (code|number)\b",
    r"\bcredit card\b", r"\bsocial security\b", r"\bID number\b", r"\bverify your account\b",
]

CHAIN_MESSAGE_PHRASES = [
    r"\bforward this\b", r"\bshare with \d+\b", r"\bwill be (deactivated|suspended|deleted)\b",
    r"\bsend to \d+ (people|friends|contacts)\b",
]

VAGUE_SOURCE_PHRASES = [
    r"\bscientists (confirm|say|discover)\b", r"\bexperts (say|agree|confirm)\b",
    r"\bthey (don'?t|do not) want you to know\b", r"\bgovernment hiding\b",
    r"\bwake up\b", r"\bthe truth about\b",
]

SUSPICIOUS_DOMAIN_PATTERN = r"\b[\w.-]+(0nline|secur[e3]-|verify-|-alert)[\w.-]*\.\w+\b"


def _matches(patterns: list[str], text: str) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in patterns)


def heuristic_check(content: str) -> CredibilityCheckResponse:
    red_flags: list[RedFlag] = []

    if _matches(URGENCY_PHRASES, content):
        red_flags.append(RedFlag(label="False urgency", description="Uses pressure language like deadlines or 'act now' to rush decisions."))
    if _matches(SENSITIVE_REQUEST_PHRASES, content):
        red_flags.append(RedFlag(label="Requests sensitive info", description="Asks for banking details, passwords, or personal identifiers."))
    if _matches(CHAIN_MESSAGE_PHRASES, content):
        red_flags.append(RedFlag(label="Chain message pattern", description="Asks you to forward or share, a common hoax-spreading tactic."))
    if _matches(VAGUE_SOURCE_PHRASES, content):
        red_flags.append(RedFlag(label="Vague or emotional sourcing", description="Cites unnamed 'experts' or uses emotionally charged framing instead of a checkable source."))
    if re.search(SUSPICIOUS_DOMAIN_PATTERN, content, re.IGNORECASE):
        red_flags.append(RedFlag(label="Suspicious domain", description="Contains a web address that mimics a legitimate brand with lookalike characters."))
    if content.isupper() and len(content) > 20:
        red_flags.append(RedFlag(label="Excessive capitalization", description="Written entirely in capital letters, often used to provoke urgency or alarm."))

    flag_count = len(red_flags)
    score = max(10, 90 - flag_count * 18)
    verdict = "likely_fake" if flag_count >= 2 else "uncertain" if flag_count == 1 else "likely_real"

    explanation = (
        f"This automated pattern check found {flag_count} common misinformation "
        f"or scam signal{'s' if flag_count != 1 else ''} in the text. "
        + ("Treat this with caution and verify independently." if flag_count >= 2
           else "No major red flags were detected by this quick check, but that doesn't guarantee accuracy — verify with a trusted source if unsure.")
    )

    return CredibilityCheckResponse(
    credibility_score=score,
    verdict=verdict,

    summary=(
        "This assessment was generated using heuristic pattern matching because "
        "AI analysis is currently unavailable."
    ),

    explanation=explanation,

    evidence=[
        {
            "title": "Pattern-Based Analysis",
            "status": "warning",
            "description": (
                "This result is based on common scam and misinformation patterns, "
                "not AI reasoning. Verify important claims using trusted sources."
            ),
        }
    ],

    red_flags=red_flags,

    learning_topic="Checking Reliable Sources",

    suggested_sources=[
        "Google Fact Check",
        "Snopes",
    ],
)