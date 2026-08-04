from fastapi import APIRouter, UploadFile, HTTPException
from google.genai import types
from app.models import OcrResponse
from app.ai_client import require_client, MODEL

router = APIRouter(prefix="/ocr", tags=["ocr"])


@router.post("", response_model=OcrResponse)
async def extract_text_from_image(file: UploadFile) -> OcrResponse:
    try:
        client = require_client()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    try:
        image_bytes = await file.read()
        mime_type = file.content_type or "image/png"
        image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

        response = client.models.generate_content(
            model=MODEL,
            contents=[
                image_part,
                "Extract all readable text from this image exactly as it appears. "
                "Return only the extracted text, nothing else. If there's no "
                "readable text, return an empty string.",
            ],
        )
        return OcrResponse(extracted_text=response.text.strip())
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"OCR failed: {exc}")