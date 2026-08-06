from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

_api_key = os.getenv("OPENAI_API_KEY")

client: OpenAI | None = (
    OpenAI(api_key=_api_key)
    if _api_key and _api_key != "your-openai-api-key-here"
    else None
)

MODEL = "gpt-3.5-turbo"


def require_client() -> OpenAI:
    if client is None:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Copy .env.example to .env and add a real key "
            "(free at https://platform.openai.com/api-keys)."
        )
    return client