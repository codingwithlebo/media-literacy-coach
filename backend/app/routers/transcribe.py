from fastapi import APIRouter, UploadFile, HTTPException

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

        if not audio_bytes:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty.",
            )

        # OpenAI-compatible audio transcription
        response = client.audio.transcriptions.create(
            model="openai/whisper-1",
            file=(
                file.filename or "audio.webm",
                audio_bytes,
                file.content_type or "audio/webm",
            ),
        )

        text = (response.text or "").strip()

        return TranscriptionResponse(text=text)

    except HTTPException:
        raise

    except Exception as exc:
        print(f"Transcription failed: {exc}")

        raise HTTPException(
            status_code=502,
            detail=f"Transcription failed: {exc}",
        )
