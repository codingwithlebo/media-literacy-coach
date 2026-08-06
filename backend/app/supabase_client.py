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


def get_recent_analyses(limit: int = 10) -> list[dict]:
    if client is None:
        return []
    try:
        response = (
            client.table("analyses")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []
    except Exception as exc:
        print(f"Supabase fetch failed (non-fatal): {exc}")
        return []


def get_stats() -> dict:
    if client is None:
        return {"total": 0, "likely_fake": 0, "likely_real": 0, "uncertain": 0, "avg_score": 0}
    try:
        response = client.table("analyses").select("verdict, credibility_score").execute()
        rows = response.data or []
        stats = {"total": len(rows), "likely_fake": 0, "likely_real": 0, "uncertain": 0, "avg_score": 0}
        score_sum = 0
        for row in rows:
            v = row.get("verdict")
            if v in stats:
                stats[v] += 1
            score_sum += row.get("credibility_score") or 0
        if rows:
            stats["avg_score"] = round(score_sum / len(rows))
        return stats
    except Exception as exc:
        print(f"Supabase stats fetch failed (non-fatal): {exc}")
        return {"total": 0, "likely_fake": 0, "likely_real": 0, "uncertain": 0, "avg_score": 0}