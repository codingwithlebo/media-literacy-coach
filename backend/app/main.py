from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import check, transcribe, ocr, analyses

app = FastAPI(
    title="Media Literacy Coach API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(check.router)
app.include_router(transcribe.router)
app.include_router(ocr.router)
app.include_router(analyses.router)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "media-literacy-coach-api",
    }