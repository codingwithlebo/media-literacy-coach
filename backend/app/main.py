from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import check, transcribe, ocr

app = FastAPI(title="Media Literacy Coach API", version="0.1.0")

# Allow the Next.js frontend (running on localhost during dev) to call this API.
# Add your deployed frontend URL here too once it's live.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(check.router)
app.include_router(transcribe.router)
app.include_router(ocr.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "media-literacy-coach-api"}