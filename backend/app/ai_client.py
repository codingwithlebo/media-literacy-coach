from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

_api_key = os.getenv("OPENAI_API_KEY")

client: OpenAI | None = (
    OpenAI(
        api_key=_api_key,
        base_url="https://openrouter.ai/api/v1",
    )
    if _api_key and _api_key != "your-openai-api-key-here"
    else None
)

MODEL = "openai/gpt-4o-mini"


def require_client() -> OpenAI:
    if client is None:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Add your OpenRouter API key."
        )
    return client