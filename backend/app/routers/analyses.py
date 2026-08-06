from fastapi import APIRouter
from app.supabase_client import get_recent_analyses, get_stats

router = APIRouter(prefix="/analyses", tags=["analyses"])


@router.get("/recent")
def recent_analyses(limit: int = 10):
    return {"items": get_recent_analyses(limit)}


@router.get("/stats")
def stats():
    return get_stats()