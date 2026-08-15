# Verify — AI-Powered Media Literacy Platform

> **UNESCO Youth Hackathon 2026 Submission**

**Verify** is an AI-powered media literacy platform that helps people evaluate the credibility of information they encounter online — while teaching them how to recognise misinformation themselves.

Instead of simply labelling content as **"true" or "false"**, Verify provides a **credibility assessment, score, explanation, evidence indicators, red flags, and suggested sources for further verification**.

Users can paste text, upload screenshots or documents, or use their voice to submit content for analysis. Beyond checking individual claims, Verify includes a gamified learning experience that helps users build stronger media-literacy habits over time.

> **Don't just tell people what to believe. Teach them how to evaluate information.**

---

## 🚀 Live Demo

**Try Verify:**
[https://media-literacy-coach.vercel.app/](https://media-literacy-coach.vercel.app/)

**GitHub Repository:**
[https://github.com/codingwithlebo/media-literacy-coach](https://github.com/codingwithlebo/media-literacy-coach)

---

# 🌍 The Problem

Misinformation spreads through the platforms people use every day:

- WhatsApp messages
- Social media posts
- Screenshots
- News articles
- Job advertisements
- Voice notes
- AI-generated content

The problem is not only that misinformation exists. It is also that many people are not given the tools or knowledge to understand **why** something may be misleading.

People may encounter a suspicious message but not know:

- Who created it?
- Is the source trustworthy?
- What evidence supports the claim?
- Is emotional language being used to manipulate them?
- Is there pressure to act immediately?
- Can the information be independently verified?

Traditional fact-checking approaches can also require users to already have strong digital-literacy skills.

**Verify addresses this gap by combining AI-assisted credibility analysis with media-literacy education.**

---

# 💡 Our Solution

Verify brings two experiences together in one platform.

## 1. 🔎 Verify — Check Information

Users can submit information they are unsure about and receive an understandable credibility assessment.

The platform can analyse:

- Written claims
- Articles
- Social media posts
- Messages
- Job advertisements
- Screenshots
- Documents
- Voice input

The result does not simply say **"true" or "false."**

Instead, Verify explains **why the content may be credible, suspicious, or uncertain**, helping users make better-informed decisions.

---

## 2. 🧠 Learn — Build Media-Literacy Skills

Verify also helps users develop the skills needed to evaluate information independently.

Users can complete short challenges covering topics such as:

- Identifying suspicious sources
- Recognising emotional language
- Detecting urgency and manipulation
- Evaluating evidence
- Lateral reading
- Recognising misleading claims
- Understanding AI-generated content

Gamification elements such as **streaks, coins, challenges, and progress tracking** encourage users to keep learning.

The goal is not to make users dependent on AI.

The goal is to help users become **better at evaluating information themselves**.

---

# ✨ Key Features

## 🔎 AI Credibility Checking

Submit information and receive:

- Credibility score
- Verdict
- Plain-language explanation
- Evidence indicators
- Potential red flags
- Suggested sources for independent verification

The goal is to help users understand the reasoning behind an assessment rather than blindly trust an AI-generated answer.

---

## 📸 Screenshot & Image Analysis

Users can upload screenshots or images containing information they want to investigate.

Verify extracts relevant text using OCR and sends the extracted content through the credibility-analysis workflow.

**OCR technology:** `Tesseract.js`

This allows users to investigate information from sources such as:

- WhatsApp screenshots
- Social media posts
- Online advertisements
- News screenshots
- Images containing claims

---

## 📄 Document Analysis

Users can provide supported documents such as:

- PDF
- DOCX
- TXT

Text is extracted from the document before being passed into the analysis workflow.

This allows users to investigate information without manually copying and pasting large amounts of text.

---

## 🎙️ Voice Input & Transcription

Users can record or provide voice input.

Verify converts speech into text and sends the resulting content through the credibility-analysis pipeline.

The application can also provide a spoken response, making the experience more accessible for users who prefer voice interaction.

---

## 🧠 AI-Powered Reasoning

Verify uses an **OpenAI-compatible AI client with OpenRouter support**.

The analysis considers signals including:

- Source clarity
- Source credibility
- Emotional or manipulative language
- Missing or vague sourcing
- Urgency and pressure tactics
- Suspicious requests
- Whether claims are independently verifiable
- Other potential misinformation indicators

The AI acts as an **assistive reasoning layer**, rather than an unquestionable source of truth.

---

## 🛡️ Rule-Based Fallback

AI services can become unavailable because of:

- Missing API credentials
- Rate limits
- Network problems
- Service interruptions

Verify therefore includes a **rule-based heuristic fallback**.

The fallback can identify common warning signs such as:

- False urgency
- Requests for sensitive information
- Chain-message patterns
- Suspicious domains
- Lookalike domains
- Excessive emotional language
- Excessive capitalisation

This means the application can still provide a basic credibility assessment even when the external AI service is unavailable.

---

# 📊 Insights Dashboard

The Insights dashboard gives users an overview of their analysed content.

It includes information such as:

- Total items checked
- Average credibility score
- Likely misleading content
- Likely credible content
- Uncertain content
- Credibility breakdown by reliability band

Example:

```
{
  "total": 30,
  "likely_fake": 10,
  "likely_real": 19,
  "uncertain": 1,
  "avg_score": 62
}

```

---

# 🎮 Gamified Learning

Verify goes beyond one-time fact checking.

The **Learn** experience encourages users to practise media-literacy skills through interactive challenges.

Users can build progress through:

- 🪙 Coins
- 🔥 Streaks
- 🏆 Challenges
- 📈 Progress tracking

The purpose of gamification is to turn media literacy into a **continuous learning habit**, rather than something people only think about after encountering misinformation.

---

# 🏗️ System Architecture

```
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                   Text / Image / Voice / Document
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Verify Frontend   │
                         │ React + TypeScript  │
                         │       + Vite        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FastAPI Backend   │
                         │       Python        │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │   AI Analysis    │          │ Rule-Based       │
          │    OpenRouter    │          │ Fallback         │
          └─────────┬────────┘          └─────────┬────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │ Credibility Result  │
                         │ Score + Explanation │
                         │ Red Flags + Sources │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │        User         │
                         └─────────────────────┘

```

---

# 🛠️ Technology Stack

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **Tesseract.js**
- Browser Speech APIs

### Backend

- **Python**
- **FastAPI**
- **Uvicorn**

### AI

- **OpenRouter**
- OpenAI-compatible AI client
- AI-powered credibility reasoning

### Processing

- **Tesseract.js** for OCR
- Document text extraction
- Voice transcription

### Deployment

- **Vercel** — Frontend
- FastAPI backend — deployed API

### Version Control

- **GitHub**

---

# 📁 Project Structure

```
media-literacy-coach/
│
├── .vscode/
│
├── backend/
│   ├── ...
│   └── requirements.txt
│
├── src/
│   ├── ...
│   └── App.tsx
│
├── .gitignore
├── globals.css
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md

```

The frontend is located directly in the repository root, with the main application source code inside `src/`.

---

# 🔌 Backend API

Verify uses a **FastAPI backend** to process analysis requests.

### Core endpoints

| EndpointMethodPurpose |        |                                   |
| --------------------- | ------ | --------------------------------- |
| `/check`              | `POST` | Analyse submitted content         |
| `/transcribe`         | `POST` | Process voice/audio transcription |
| `/ocr`                | `POST` | Process image text extraction     |

### Example credibility request

```
POST /check
Content-Type: application/json

```

Example:

```
{
  "text": "Example claim to analyse"
}

```

The backend processes the submitted content and returns a structured credibility assessment.

---

# ⚙️ Running Verify Locally

## Prerequisites

Make sure you have:

- Node.js
- npm
- Python 3.10+
- pip
- Git

---

## 1. Clone the repository

```
git clone https://github.com/codingwithlebo/media-literacy-coach.git

cd media-literacy-coach

```

---

## 2. Install frontend dependencies

The frontend is located in the repository root.

Run:

```
npm install

```

---

## 3. Configure the backend

Navigate to the backend directory:

```
cd backend

```

Install the Python dependencies:

```
pip install -r requirements.txt

```

Create your environment file if the project provides an `.env.example`:

```
cp .env.example .env

```

Add the required AI provider credentials.

For example:

```
OPENROUTER_API_KEY=your_api_key_here

```

**Never commit real API keys to GitHub.**

---

## 4. Start the FastAPI backend

From the `backend` directory:

```
uvicorn main:app --reload

```

The API will start on the local FastAPI development server.

---

## 5. Start the frontend

Open a second terminal.

From the project root:

```
npm run dev

```

Vite will provide a local development URL.

Open that URL in your browser to use Verify.

---

# 🔐 Environment Variables

API keys and other secrets should never be committed to the repository.

Depending on the configured AI provider, the backend requires the appropriate environment variable for authentication.

Example:

```
OPENROUTER_API_KEY=your_api_key_here

```

If the AI service is unavailable, Verify can fall back to its rule-based credibility analysis.

---

# 🧪 Example Use Cases

## WhatsApp Message

A user receives:

> "URGENT! Send your banking details now to claim your prize!"

They can submit the message to Verify.

The system can identify signals such as:

- Urgency
- Prize-based manipulation
- Sensitive information requests
- Suspicious language

The user receives an explanation rather than simply being told that the message is "fake."

---

## Job Advertisement

A user finds an online job advertisement asking applicants to pay a registration fee.

They can submit the advertisement to Verify and receive an assessment highlighting suspicious indicators such as:

- Requests for upfront payment
- Missing organisation information
- Pressure to act quickly
- Unclear source information

---

## Social Media Screenshot

A user sees a claim in a social media screenshot.

Instead of manually typing the entire post, they can upload the screenshot and allow Verify to extract the text for analysis.

---

# 🎯 Who Is Verify For?

Verify is designed for people who regularly encounter online information but may not have advanced media-literacy or fact-checking skills.

Potential users include:

- Students
- Young people
- Social media users
- Job seekers
- Digital newcomers
- Communities vulnerable to misinformation
- Anyone unsure whether online information can be trusted

---

# 🌍 Social Impact

Misinformation can influence decisions about:

- Health
- Education
- Employment
- Finance
- Public safety
- Everyday life

Verify aims to contribute to a more **digitally literate and critically thinking society** by making credibility analysis easier to access while teaching users the skills to evaluate information independently.

The long-term vision is not simply to create a tool that says:

> **"This information is suspicious."**

It is to help users eventually recognise the warning signs **without needing the tool at all**.

---

# 🔒 Responsible AI & Limitations

Verify is an **AI-assisted media-literacy tool**, not an authoritative fact-checking service.

AI-generated assessments can sometimes be:

- Incorrect
- Incomplete
- Uncertain
- Missing important context

A credibility score does **not** guarantee that a claim is objectively true or false.

For important decisions, users should independently verify claims using reliable sources and authoritative information.

Verify is intentionally designed to encourage users to ask:

> **"Why might this information be credible or suspicious?"**

rather than simply:

> **"Did the AI say it was true?"**

This distinction is central to the project's media-literacy goal.

---

# 🏆 Why Verify?

Many fact-checking tools focus primarily on providing an answer.

Verify focuses on helping people **understand the reasoning behind an assessment** and develop the skills required to investigate information themselves.

Our approach combines:

**AI assistance**
\+
**Explainable credibility analysis**
\+
**Media-literacy education**
\+
**Gamification**
\+
**Multiple input formats**

The result is a platform designed not only to help users identify potentially misleading information, but also to help them become **better digital citizens**.

---

# 🚀 Future Improvements

Potential future development includes:

- Real-time source verification
- Browser extension
- WhatsApp integration
- Multilingual support
- More advanced fact-checking workflows
- Trusted-source databases
- Improved AI-generated-content detection
- Community reporting
- Personalised learning paths
- More accessibility features
- Expanded analytics
- Additional document and media formats

---

# 👥 Project

**Verify — UNESCO Youth Hackathon 2026**

A youth-led technology project focused on improving digital and media literacy and helping people make more informed decisions about the information they encounter online.

---

# 👥 Team

This project was developed by:

- **Malebo Nkuna**
- **Lerato Thungo**
- **Owethu Jezile**
- **Mpho Mangena**

---

# ⭐ Support the Project

If you find Verify useful or interesting:

⭐ Star the repository
🐛 Report issues
💡 Suggest improvements
🤝 Contribute to the project

**Live Demo:**
[https://media-literacy-coach.vercel.app/](https://media-literacy-coach.vercel.app/)

**GitHub:**
[https://github.com/codingwithlebo/media-literacy-coach](https://github.com/codingwithlebo/media-literacy-coach)

---

# 💭 Our Vision

> **Don't just trust information. Verify it.**
>
> **And more importantly — learn how to verify it yourself.**
