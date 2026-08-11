# Media Literacy Coach

An AI-powered web application designed to help users identify and understand misinformation. Instead of simply telling users whether information is "true" or "false," the application provides a credibility assessment, explains potential warning signs, and encourages users to think critically about the information they encounter.

## Features

* **Text Credibility Checking** — Analyze written content and receive a credibility score, assessment, explanation, evidence, and potential red flags.
* **Voice & Transcription** — Record or provide voice input and convert speech into text for analysis.
* **OCR** — Extract text from images so that visual content can also be analyzed.
* **AI-Powered Analysis** — Uses OpenRouter to provide AI-assisted credibility analysis.
* **Verification Journey** — Shows users the factors that contributed to an assessment.
* **Insights Dashboard** — Provides statistics and an overview of analyzed content.
* **Learning Resources** — Helps users develop stronger media-literacy and fact-checking skills.
* **Multiple Content Types** — Supports articles, social media posts, job posts, and messages.
* **Fallback Analysis** — Uses heuristic-based checks when AI analysis is unavailable.

## How It Works

The application follows a simple analysis flow:

1. The user provides content through text, voice, or an image.
2. Voice input can be transcribed and images can be processed using OCR.
3. The content is sent to the FastAPI backend.
4. The backend analyzes the content using OpenRouter AI.
5. The AI evaluates credibility indicators, supporting evidence, and potential red flags.
6. The backend returns a structured credibility assessment.
7. The frontend displays the results in an easy-to-understand analysis report.

The application is designed to support **critical thinking rather than provide absolute certainty**. A credibility score should therefore be treated as guidance for further verification rather than proof that a claim is true or false.

## Technology Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### AI

* OpenRouter API

### Additional Technologies

* OCR processing
* Speech transcription
* Git & GitHub

> **Database:** The current version does not rely on a dedicated database as a core requirement.

## Project Structure

```text
media-literacy-coach/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models.py
│   │   ├── heuristics.py
│   │   ├── ai_client.py
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── data/
│   ├── types/
│   └── App.tsx
│
├── package.json
└── README.md
```

## Running the Project Locally

### Prerequisites

Make sure the following are installed:

* Node.js
* Python 3.12 or compatible Python version
* Git

### 1. Clone the repository

```bash
git clone https://github.com/codingwithlebo/media-literacy-coach.git
cd media-literacy-coach
```

### 2. Set up the backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create your local environment file:

```bash
copy .env.example .env
```

Add the required API key to `.env`.

**Never commit your real API key to GitHub.**

Start the backend:

```bash
uvicorn app.main:app --reload
```

The API should then be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Start the frontend

Open a new terminal from the project root:

```bash
cd media-literacy-coach
npm install
npm run dev
```

Vite will provide the local frontend address in the terminal.

## Environment Variables

The backend uses environment variables for API credentials.

Example:

```env
OPENAI_API_KEY=your-openrouter-key-here
```

The variable name is kept according to the current backend configuration, even though the actual AI provider is OpenRouter.

**Do not place real API keys in source code, GitHub, README files, or other publicly accessible files.**

## API

The main credibility endpoint is:

```text
POST /check
```

It accepts content and a content type.

Example request:

```json
{
  "content": "Example content to analyze.",
  "content_type": "article"
}
```

Supported content types include:

```text
article
social_post
job_post
message
```

The API returns a structured credibility assessment containing information such as:

* credibility score
* verdict
* explanation
* evidence
* red flags
* learning topic
* suggested sources

## Fallback Analysis

If the AI service is unavailable, the backend can fall back to a heuristic-based analysis.

The heuristic checker looks for common signals such as:

* false urgency
* requests for sensitive information
* chain-message patterns
* vague or emotional sourcing
* suspicious domains
* excessive capitalization

This ensures the application can still provide a basic assessment when the external AI service cannot be reached.

## Security

API credentials should always be stored as environment variables.

For local development:

```text
.env
```

should remain private and should not be committed to Git.

For production deployment, API credentials should be configured through the hosting platform's environment-variable/secret management system.

## Team

This project was developed by:

* **Malebo Nkuna**
* **Lerato Thungo**
* **Owethu Jezile**
* **Mpho Mangena**

## Project Goal

The goal of Media Literacy Coach is to make media literacy more accessible by helping people pause, question, and evaluate information before accepting or sharing it.

The application is intended to encourage users to ask:

> **Who created this information? What evidence supports it? What might be missing?**

Rather than replacing human judgment, Media Literacy Coach acts as a tool to support better-informed decisions and stronger critical-thinking habits.
