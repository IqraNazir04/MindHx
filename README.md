# MindHx

MindHx is an early-detection mental-health **triage aid**, not a diagnostic tool. It combines three independent signals — acoustic (how someone sounds), linguistic (what they say), and validated clinical questionnaires (PHQ-9, GAD-7, K10) — into one explainable, weighted risk score, and routes elevated risk to a professional rather than attempting to diagnose or treat.

## Objective

Depression, anxiety, and related conditions are frequently under-screened, especially where access to mental-health professionals is limited and stigma discourages self-report. MindHx's objective is to lower the barrier to a *first* screening step — a private, low-friction check-in that surfaces a risk signal a person can act on — while being explicit about what it is not: not a diagnosis, not a replacement for a clinician, and not a clinically calibrated instrument (yet — see Roadmap).

Three design commitments follow directly from that objective:

- **Multimodal, not single-signal.** A single questionnaire misses tone and word choice; a single acoustic score misses clinical history. MindHx fuses all three, and shows *why* the combined score landed where it did (a per-signal contribution breakdown on the results page) rather than returning an opaque number.
- **Route, don't diagnose.** Every page — the AI chat, the therapist referral, the support plan — is worded in risk-tier language ("your responses suggest elevated risk") and never in diagnostic language ("you have depression"). Crisis signals (PHQ-9 item 9, self-harm language) short-circuit everything else and go straight to immediate-support routing.
- **Minimal data, no accounts.** No login, no email collection, no persisted identity profile. Session context (age range, optional gender/relationship status/life context) lives in the browser only for the active session; audio is processed and discarded, never stored.

## Roadmap

**Built:**
- Voice, text, and PHQ-9/GAD-7/K10 check-in flow with a live combined-signal preview
- `/risk-assess` fusing all five signals (PHQ-9, GAD-7, K10, text, voice) into one score, with crisis short-circuiting on PHQ-9 item 9 or detected self-harm language
- A genuine per-signal attribution breakdown (mathematically exact for this additive scoring model, not an approximation) shown on the results page
- A local heuristic acoustic signal (pause ratio, loudness variability, speaking rate) extracted directly from recorded audio — a proxy signal, explicitly not a validated biomarker
- Theme detection (anxiety, frustration, loss, grief, trauma, hardship, medical concerns) driving tailored coping content
- A dedicated Emergency Support page, reachable from both the check-in flow and the therapist page
- A bounded, source-grounded AI chat (`/ai/chat`) that only serves pre-approved reference content after a safety gate — no free-form generation, no diagnosis
- A resource library (medication, meditation techniques, therapies, AI info) with individual detail pages for each meditation technique and therapy approach
- A "Find a professional in Pakistan" directory: verified real institutions per city plus live links to established doctor-directory platforms (oladoc, Marham), rather than a static list that would go stale
- Full English/Urdu bilingual support across every page, with a header-level language toggle
- Qwen (via Alibaba Cloud DashScope) as the preferred text-analysis provider, falling back to OpenRouter, then a local heuristic classifier
- A `/brand` page documenting the color system

**Not yet built, deliberately:**
- **Score calibration.** The combined risk score is an uncalibrated weighted heuristic — it has not been fit against labeled outcome data, so it should be read as a relative risk-tier indicator, not a calibrated probability. Building this requires real labeled data, which the project does not yet have; faking a calibration step would make the "explainable, calibrated" claim false rather than true.
- **A clinically validated Urdu translation of PHQ-9/GAD-7/K10.** The current Urdu text is a draft, unlicensed translation appropriate for demo purposes only. Item 9 (self-harm ideation) is a safety-critical item in a validated instrument; shipping an unlicensed translation as clinical-grade would be irresponsible.
- **A real acoustic voice-biomarker vendor integration.** The current `/analyze-voice` local heuristic is intentionally provider-pluggable (`VOICE_BIOMARKER_PROVIDER`) so a vendor with a public API contract (e.g. a clinical speech-biomarker provider) can be dropped in later.

## Future implications

- **Calibration work directly changes what MindHx can responsibly claim.** Once labeled outcome data is available, Platt scaling or isotonic regression against a held-out set would let the risk score be reported as an actual probability rather than a relative indicator — a prerequisite for any clinical deployment claim.
- **A validated Urdu instrument would let MindHx be used as a real screening tool in Urdu-speaking clinical settings**, not just as a bilingual demo — this is the single highest-leverage localization gap remaining.
- **A real acoustic biomarker vendor would strengthen the acoustic signal from a heuristic proxy to a validated one**, likely the biggest lever on overall score reliability, since text and PHQ-family signals are already backed by validated instruments or real classifier models.
- **Alibaba Cloud stack depth.** Qwen/DashScope is already integrated for text analysis; further Alibaba-native deployment (Function Compute for the FastAPI service, OSS-backed model caching) is a natural next step for anyone deploying this on that stack. Persistent object storage for user audio was deliberately *not* added, since it would contradict the app's core "nothing is saved" privacy commitment — any future storage decision should stay opt-in and time-boxed, not a default.

## Productivity / impact

MindHx is designed to compress a screening step that otherwise requires scheduling a professional appointment into a few private minutes on a phone or laptop:

- A full check-in (voice note, free-text, three questionnaires) takes under 5 minutes and requires no account.
- The combined-signal results page gives a person something concrete to bring into a first conversation with a clinician — three questionnaire scores, a sentiment read, an explainable score breakdown — rather than starting that conversation from zero.
- The bounded AI chat and resource library (medication reference, meditation techniques, therapy approaches) answer common orienting questions ("what is CBT," "what does an SSRI do") without needing a search engine or a first appointment just to get oriented.
- The Pakistan provider directory turns "I should probably see someone" into an actual next click, city by city, without a stale or fabricated contact list.

## Support for users

- **In-app crisis routing:** PHQ-9 item 9 or detected self-harm language in text immediately routes to the Emergency Support page — before any score is computed or shown.
- **Emergency Support page** (`/emergency`): immediate-action guidance, explicitly framed as a risk signal and not a diagnosis, reachable from the check-in flow and from the Therapist page at any time.
- **Therapist referral page** (`/therapist`): what to say at a first appointment, what to bring, and a city-by-city directory of real psychiatric/psychological care in Pakistan.
- **Resource library:** medication reference, meditation techniques (each with step-by-step instructions), and therapy approaches (each with what sessions may involve) — all framed as general education, never as personalized treatment.
- **Bounded AI chat** (`/ai`): answers general mental-health questions from a fixed, reviewed reference library; explicitly escalates rather than engages if it detects a safety concern.
- **Bilingual throughout:** every page above is available in English and Urdu via a header-level toggle.
- **Privacy by default:** no login, no persisted identity, audio discarded after processing.

## Technical details

**Architecture:** two stateless services — a Next.js 16 (App Router) frontend, and a FastAPI backend. No database; every request is self-contained.

**Frontend** (`src/app/`): 9 page routes — home (`/`), results, medication, AI chat, meditation (+ 4 technique detail sub-pages), therapies (+ 5 approach detail sub-pages), therapist, emergency, and brand. Shared components: `SiteHeader` (sticky nav + language toggle, used on every page) and `Doodles` (original hand-drawn-style SVG illustrations). Styling is a single `globals.css` light theme (no CSS framework component library beyond Tailwind's base).

**Backend** (`backend/main.py`, FastAPI): 12 endpoints —

| Endpoint | Purpose |
|---|---|
| `GET /health` | Liveness check |
| `POST /session/start` | Issues an ephemeral session token; nothing is persisted |
| `POST /transcribe` | Local `faster-whisper` transcription (`compute_type="int8"`) |
| `POST /analyze-voice` | Heuristic prosodic signal (pause ratio, loudness variability, speaking rate) via PyAV + numpy — pluggable via `VOICE_BIOMARKER_PROVIDER`, only `local` implemented today |
| `POST /analyze-text` | Sentiment, keyword flags, crisis-language detection — Qwen (DashScope) → OpenRouter → local heuristic, in that fallback order |
| `POST /support-resources` | Theme-matched coping strategies and meditation content |
| `POST /ai/chat` | Bounded, source-grounded chat; safety-gated before any content is returned |
| `POST /synthesize` | Urdu text-to-speech via Uplift AI |
| `POST /score-phq9`, `/score-gad7`, `/score-k10` | Individual questionnaire scoring |
| `POST /risk-assess` | Fuses all signals into the combined score, band, explanation, and routing decision |

**Risk fusion:** a weighted sum over PHQ-9 (0.30), GAD-7 (0.22), K10 (0.22), text sentiment (0.16), and voice (0.10, when available) signals, each normalized to 0–1. The per-signal attribution shown on the results page is the exact weighted contribution of each term — for this additive model, that is mathematically identical to each signal's Shapley value, not an approximation.

**Testing:** 12 backend tests (`backend/test_main.py`) covering crisis short-circuiting, theme detection (including a regression test for a fixed keyword-matching bug), the prosodic-signal math independent of PyAV availability, bilingual AI chat responses, and the risk-assessment fusion shape. Run with `cd backend && source .venv/bin/activate && pytest test_main.py -v`.

**Stack:** Next.js 16 / React 19 / TypeScript / Tailwind on the frontend; FastAPI / Pydantic / faster-whisper / PyAV / numpy / httpx on the backend; Qwen via Alibaba Cloud DashScope (preferred) or OpenRouter (fallback) for text classification; Uplift AI for Urdu speech synthesis.

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

## Run both services with Docker

```bash
docker compose up --build
```

The web app runs at `http://localhost:3000`; the API runs at `http://localhost:8000`. The first transcription downloads the configured Whisper model into the named Docker volume. Set `WHISPER_MODEL` and `WHISPER_DEVICE` in the environment when needed.

## Important caveats

The current text and risk logic are transparent development implementations; validate/calibrate the models and routing with qualified clinical oversight before production or Alibaba Cloud deployment. The combined risk score is an uncalibrated weighted heuristic — it has not been fit or checked against labeled outcome data, so its output should be read as a relative risk-tier indicator, not a calibrated probability, until that validation work is done. The in-app Urdu PHQ-9/GAD-7/K10 text is a draft translation for demo purposes and is not a clinically validated instrument; a validated translation should replace it before clinical use. `POST /analyze-voice`'s acoustic signal is a heuristic proxy (pause ratio, loudness variability, speaking rate), not a validated clinical voice biomarker.

The session-start profile is deliberately minimal: age range is required; gender, relationship status, life context, and preferred language are optional. There is no login, email collection, identity profile, or long-term demographic storage. The frontend holds the opaque session token and profile only while the browser session is active. No database is used anywhere in the system.
