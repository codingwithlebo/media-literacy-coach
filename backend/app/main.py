from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import check, transcribe, ocr, analyses

app = FastAPI(
    title="Media Literacy Coach API",
    version="0.1.0",
)

# Allow frontend applications to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",

        # Production frontend
        "https://media-literacy-coach.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
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