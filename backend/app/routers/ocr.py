from fastapi import APIRouter, UploadFile, HTTPException
from PIL import Image
import pytesseract
import io
from app.models import OcrResponse

router = APIRouter(prefix="/ocr", tags=["ocr"])


@router.post("", response_model=OcrResponse)
async def extract_text_from_image(file: UploadFile) -> OcrResponse:
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        extracted = pytesseract.image_to_string(image)
        return OcrResponse(extracted_text=extracted.strip())
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"OCR failed: {exc}")
