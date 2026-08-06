# Media Literacy Coach — Backend

A FastAPI backend providing a credibility-checking API for the Media Literacy
Coach project (UNESCO Youth Hackathon 2026).

## What it does

- **`POST /check`** — analyzes text content (articles, social posts, job
  listings, messages) and returns a credibility score, verdict, plain-language
  explanation, red flags, and suggested sources to verify with.
  - Uses Google Gemini if a free API key is configured.
  - Falls back automatically to a rule-based pattern checker if no key is set,
    or if the AI call fails for any reason (quota, network, etc.). This means
    the endpoint always works — no API key required to demo it.
- **`POST /transcribe`** — transcribes an uploaded audio file to text using
  Gemini's multimodal audio support. Requires a Gemini API key.
- **`POST /ocr`** — extracts text from an uploaded screenshot/image using
  local Tesseract OCR. No API key needed, but requires the Tesseract program
  installed separately (see below).
- **`GET /`** — health check.

Interactive docs (test every endpoint from the browser, no code needed):
once running, open **http://localhost:8000/docs**

## Setup

**Requirements:** Python 3.12 (recommended — newer versions like 3.13/3.14
currently lack prebuilt wheels for some dependencies on Windows and will fail
to install). Get it at https://www.python.org/downloads/release/python-31210/
if you don't already have it — check with `py -0` first.

```powershell
cd backend
py -3.12 -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

Copy the environment template and (optionally) add a real key:

```powershell
copy .env.example .env
```

The app works with **no key at all** — `/check` uses the rule-based fallback
automatically. If you want smarter AI-powered analysis or voice transcription,
get a **free** Gemini key (no credit card needed) at
https://aistudio.google.com/apikey and paste it into `.env` as
`GEMINI_API_KEY=...`.

## Running

```powershell
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`. The `--reload` flag auto-restarts on
code changes.

## OCR setup (optional, only needed for the `/ocr` endpoint)

`pytesseract` (the Python package, already in `requirements.txt`) is just a
wrapper — it needs the actual Tesseract program installed separately:

- Windows: download from https://github.com/UB-Mannheim/tesseract/wiki
- After installing, you may need to point `pytesseract` to it if it's not on
  your PATH — see the pytesseract docs if `/ocr` errors out.

## Project structure
## CORS

The frontend origin is pre-configured for `http://localhost:3000` (Next.js
default dev port). Add your deployed frontend URL to `app/main.py` under
`allow_origins` once it's live.

## Notes for the team

- `.env` is gitignored — never commit real API keys.
- The heuristic fallback in `/check` is intentionally simple pattern-matching
  (urgency language, requests for sensitive info, suspicious domains, chain-
  message patterns, etc.) — it's a safety net for demos, not a replacement
  for the AI-powered check.
- If billing/quota becomes an issue with any AI provider, the app keeps
  working via the fallback — nothing breaks.