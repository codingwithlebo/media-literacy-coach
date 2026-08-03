from fastapi import APIRouter, UploadFile, HTTPException
from google.genai import types
from app.models import TranscriptionResponse
from app.ai_client import require_client, MODEL

router = APIRouter(prefix="/transcribe", tags=["voice"])


@router.post("", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile) -> TranscriptionResponse:
    try:
        client = require_client()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    try:
        audio_bytes = await file.read()
        mime_type = file.content_type or "audio/mpeg"
        audio_part = types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)

        response = client.models.generate_content(
            model=MODEL,
            contents=[
                audio_part,
                "Transcribe this audio exactly as spoken. Return only the transcript text, nothing else.",
            ],
        )
        return TranscriptionResponse(text=response.text.strip())
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Transcription failed: {exc}")