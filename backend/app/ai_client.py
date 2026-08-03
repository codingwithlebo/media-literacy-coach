import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY")

client: genai.Client | None = (
    genai.Client(api_key=_api_key)
    if _api_key and _api_key != "your-gemini-api-key-here"
    else None
)

MODEL = "gemini-2.0-flash"


def require_client() -> genai.Client:
    if client is None:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Copy .env.example to .env and add a real key "
            "(free at https://aistudio.google.com/apikey)."
        )
    return client