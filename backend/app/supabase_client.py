import os
from dotenv import load_dotenv

load_dotenv()

_url = os.getenv("SUPABASE_URL")
_key = os.getenv("SUPABASE_KEY")

client = None
if _url and _key:
    try:
        from supabase import create_client
        client = create_client(_url, _key)
    except Exception as exc:
        print(f"Supabase client failed to initialize: {exc}")
        client = None


def save_analysis(content: str, content_type: str, credibility_score: int, verdict: str, explanation: str) -> None:
    if client is None:
        return
    try:
        client.table("analyses").insert({
            "content": content,
            "content_type": content_type,
            "credibility_score": credibility_score,
            "verdict": verdict,
            "explanation": explanation,
        }).execute()
    except Exception as exc:
        print(f"Supabase save failed (non-fatal): {exc}")