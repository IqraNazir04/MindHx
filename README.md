# MindHx

MindHx is an early-detection triage aid that combines voice patterns, language, and the validated PHQ-9 questionnaire into one explainable risk signal for professional review. It is not a diagnostic tool.

## Run the web app

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Run the FastAPI service

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

MindHx is split into two stateless services. The frontend owns the UI and conversation flow; the FastAPI service owns transcription, text analysis, PHQ-9 scoring, and risk assessment.

## MindHx API

- `POST /transcribe`: local `faster-whisper` transcription with `compute_type="int8"`; returns text and detected language.
- `POST /analyze-text`: returns sentiment, keyword flags, and crisis-language detection.
- `POST /score-phq9`: returns total score, severity band, and the item 9 crisis flag. Item 9 routes immediately and must be checked before risk assessment.
- `POST /risk-assess`: combines the independent results and returns score, band, explanation, and routing decision.

No database is used. Requests are self-contained. A future session token may be passed for in-memory frontend continuity, but MindHx does not persist it.

The session-start profile is deliberately minimal: age range is required; gender, relationship status, life context, and preferred language are optional. There is no login, email collection, identity profile, or long-term demographic storage. The frontend holds the opaque session token and profile only while the browser session is active.

## Run both services with Docker

```bash
docker compose up --build
```

The web app runs at `http://localhost:3000`; the API runs at `http://localhost:8000`. The first transcription downloads the configured Whisper model into the named Docker volume. Set `WHISPER_MODEL` and `WHISPER_DEVICE` in the environment when needed. The current text and risk logic are transparent development implementations; validate/calibrate the models and routing with qualified clinical oversight before production or Alibaba Cloud deployment.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
