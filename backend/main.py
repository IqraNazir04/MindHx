"""Stateless MindHx assessment API."""

import json
import os
import secrets
import tempfile
from pathlib import Path
from typing import Literal, Optional

import httpx
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

app = FastAPI(title="MindHx API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEB_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CRISIS_TERMS = {
    "kill myself", "killing myself", "suicide", "suicidal", "end my life",
    "hurt myself", "self harm", "self-harm", "better off dead",
    "خودکشی", "اپنی جان", "مر جانا", "خود کو نقصان",
}


class TextAnalysisRequest(BaseModel):
    text: str = Field(default="", max_length=10000)
    language: str = "en"


class SupportResourcesRequest(BaseModel):
    themes: list[str] = Field(default_factory=list, max_length=5)
    language: str = "en"


class AiSupportRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    language: str = "en"
    risk_clear: bool = True


RAG_DOCUMENTS = [
    {"id": "grounding", "intent": "anxiety", "title": "Grounding and anxious thoughts", "content": "Try naming five things you see, four you feel, three you hear, two you smell, and one you taste. If anxiety continues to interfere with daily life, consider speaking with a qualified professional.", "link": "/meditation"},
    {"id": "small-action", "intent": "depression", "title": "One small achievable action", "content": "Choose one manageable action for the next hour, such as drinking water, opening a window, taking a short walk, or messaging someone you trust. Small actions do not replace treatment, but they can create a starting point.", "link": "/meditation"},
    {"id": "therapy", "intent": "therapy", "title": "Therapy approaches", "content": "CBT, DBT, exposure therapy, trauma-informed care, and medical review are different approaches. A licensed clinician determines what is appropriate for your circumstances.", "link": "/therapies"},
    {"id": "medication", "intent": "medication", "title": "Medication information", "content": "Medication decisions require a licensed prescriber who can review symptoms, medical history, current medicines, and side effects. Do not start, stop, or change medication based on this chat.", "link": "/medication"},
]


class Profile(BaseModel):
    age_range: str = Field(min_length=1, max_length=20)
    gender: Optional[str] = Field(default=None, max_length=40)
    marital_status: Optional[str] = Field(default=None, max_length=40)
    life_context: Optional[str] = Field(default=None, max_length=40)
    preferred_language: str = Field(default="en", max_length=10)


class SessionStartRequest(BaseModel):
    profile: Profile


class SpeechRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    language: str = "ur"


class Phq9Request(BaseModel):
    answers: list[int] = Field(min_length=9, max_length=9)
    session_token: Optional[str] = Field(default=None, max_length=128)


class QuestionnaireRequest(BaseModel):
    answers: list[int] = Field(min_length=1, max_length=10)


class RiskAssessmentRequest(BaseModel):
    transcript: str = Field(default="", max_length=10000)
    typed_text: str = Field(default="", max_length=10000)
    language: str = "en"
    phq9_answers: list[int] = Field(min_length=9, max_length=9)
    gad7_answers: list[int] = Field(default_factory=lambda: [0] * 7, min_length=7, max_length=7)
    k10_answers: list[int] = Field(default_factory=lambda: [1] * 10, min_length=10, max_length=10)
    text_analysis: dict = Field(default_factory=dict)
    phq9_result: dict = Field(default_factory=dict)
    profile: Optional[Profile] = None
    voice_features: dict[str, float] = Field(default_factory=dict)


def has_crisis_language(text: str) -> bool:
    normalized = " ".join(text.lower().split())
    return any(term in normalized for term in CRISIS_TERMS)


def retrieve_rag_documents(message: str) -> list[dict]:
    lowered = message.lower()
    terms = {
        "anxiety": ("anx", "worry", "panic", "نروس", "فکر", "گھبرا"),
        "depression": ("sad", "empty", "motivation", "depress", "اداس", "مایوس"),
        "therapy": ("therap", "counsel", "relationship", "تھراپی", "مشیر"),
        "medication": ("medicine", "medication", "drug", "دوا", "دوائی"),
    }
    matched = [intent for intent, keywords in terms.items() if any(keyword in lowered for keyword in keywords)]
    return [document for document in RAG_DOCUMENTS if document["intent"] in matched] or [RAG_DOCUMENTS[0]]


def severity_for(score: int) -> str:
    if score <= 4:
        return "minimal"
    if score <= 9:
        return "mild"
    if score <= 14:
        return "moderate"
    if score <= 19:
        return "moderately_severe"
    return "severe"


def gad7_band(score: int) -> str:
    if score <= 4:
        return "minimal"
    if score <= 9:
        return "mild"
    if score <= 14:
        return "moderate"
    return "severe"


def k10_band(score: int) -> str:
    if score <= 19:
        return "low"
    if score <= 24:
        return "mild"
    if score <= 29:
        return "moderate"
    return "severe"


def score_gad7(answers: list[int]) -> dict:
    normalized = [max(0, min(3, answer)) for answer in answers]
    total_score = sum(normalized)
    return {"total_score": total_score, "severity_band": gad7_band(total_score)}


def score_k10(answers: list[int]) -> dict:
    normalized = [max(1, min(5, answer)) for answer in answers]
    total_score = sum(normalized)
    return {"total_score": total_score, "severity_band": k10_band(total_score)}


def support_resources(themes: list[str], language: str = "en") -> dict:
    """Return fixed, non-diagnostic support content; no model or profile data is required."""
    theme_set = set(themes)
    strategies = [
        {"name": "One small action", "themes": ["hardship", "patience"], "steps": "Choose one achievable action for the next hour, such as water, food, a shower, or messaging someone you trust."},
        {"name": "Gentle routine", "themes": ["depression", "hardship"], "steps": "Pick one anchor for today: wake time, a meal, daylight, or a 5-minute walk. Keep the goal deliberately small."},
        {"name": "Worry notes", "themes": ["anxiety"], "steps": "Write the worry down, separate what you can control from what you cannot, and choose one next action."},
        {"name": "Grief pacing", "themes": ["grief", "patience"], "steps": "Allow the feeling without forcing a timeline. Alternate emotional space with basic care, rest, and contact with someone safe."},
    ]
    meditation = [
        {"name": "Paced breathing", "themes": ["anxiety", "hardship"], "steps": "Inhale gently for 4 counts and exhale for 6 counts for 2 minutes. Stop if dizzy or more distressed."},
        {"name": "Five-senses grounding", "themes": ["anxiety", "hardship"], "steps": "Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste."},
        {"name": "Compassionate body scan", "themes": ["patience", "grief", "hardship"], "steps": "For 3 minutes, notice tension from head to feet without judging it. Relax only where comfortable."},
        {"name": "Name and allow", "themes": ["grief", "patience"], "steps": "Name the feeling in a few words, acknowledge it, and give it 90 seconds without forcing it away."},
    ]
    groups = [
        {"name": "Peer support groups", "description": "Look for a moderated, confidential group through a licensed clinic, hospital, university, or established mental-health organization."},
        {"name": "Trusted-person check-in", "description": "Choose one person and tell them what kind of support would help: listening, company, or help finding care."},
    ]
    resources = [
        {"name": "Licensed mental-health professional", "description": "Use a regulated local provider directory, hospital service, or telehealth service for an assessment."},
        {"name": "Local crisis service", "description": "For immediate safety concerns, contact local emergency services or a crisis line in your country."},
    ]
    return {
        "language": language,
        "themes": themes,
        "strategies": [item for item in strategies if not theme_set or theme_set.intersection(item["themes"])],
        "meditation": [item for item in meditation if not theme_set or theme_set.intersection(item["themes"])],
        "support_groups": groups,
        "resources": resources,
    }


def professional_contact(urgency: str) -> dict:
    if urgency == "immediate":
        return {"recommended": True, "urgency": "immediate", "action": "Contact local emergency services or a crisis line now, and stay with a trusted person if possible.", "what_to_say": "Tell them you are experiencing a mental-health safety concern and need immediate support."}
    if urgency == "soon":
        return {"recommended": True, "urgency": "soon", "action": "Arrange a call or appointment with a licensed psychiatrist or qualified mental-health clinician before continuing self-management alone.", "what_to_say": "Share that your screening results show moderate or severe symptoms and ask for a safety and treatment review."}
    return {"recommended": False, "urgency": "monitor", "action": "Consider speaking with a qualified professional if symptoms persist, worsen, or interfere with daily life.", "what_to_say": "You can bring these screening results to the conversation."}


def classify_themes(phq_result: dict, gad_result: dict, k10_result: dict, text_result: dict) -> list[str]:
    themes: list[str] = []
    phq_score = int(phq_result.get("total_score", 0))
    gad_score = int(gad_result.get("total_score", 0))
    k10_score = int(k10_result.get("total_score", 0))
    text = " ".join(text_result.get("keyword_flags", [])).lower()
    if gad_score >= 10 and phq_score < 10:
        themes.append("anxiety")
    if phq_score >= 10:
        themes.append("grief" if any(term in text for term in ("loss", "bereav", "غم", "وفات")) else "hardship")
    if k10_score >= 25 and "hardship" not in themes:
        themes.append("hardship")
    if any(term in text for term in ("pain", "medical", "illness", "درد", "بیماری", "علاج")):
        themes.append("medical_state")
    return themes or ["patience"]


def evaluate_components(phq_result: dict, gad_result: dict, k10_result: dict, text_result: dict, voice_features: dict[str, float]) -> dict:
    phq_signal = round(int(phq_result.get("total_score", 0)) / 27, 2)
    gad_signal = round(int(gad_result.get("total_score", 0)) / 21, 2)
    k10_signal = round(max(0, int(k10_result.get("total_score", 10)) - 10) / 40, 2)
    text_signal = 1.0 if text_result.get("crisis_language") else 0.65 if text_result.get("sentiment") == "negative" else 0.25 if text_result.get("sentiment") == "neutral" else 0.0
    voice_signal = round(max(0.0, min(1.0, float(voice_features.get("risk_signal", 0.0)))), 2) if voice_features else None
    available = [phq_signal, gad_signal, k10_signal, text_signal] + ([voice_signal] if voice_signal is not None else [])
    weights = [0.30, 0.22, 0.22, 0.16] + ([0.10] if voice_signal is not None else [])
    combined = round(sum(signal * weight for signal, weight in zip(available, weights)) * 100) / 100
    return {
        "phq9": {"signal": phq_signal, "score": phq_result.get("total_score", 0), "band": phq_result.get("severity_band")},
        "gad7": {"signal": gad_signal, "score": gad_result.get("total_score", 0), "band": gad_result.get("severity_band")},
        "k10": {"signal": k10_signal, "score": k10_result.get("total_score", 0), "band": k10_result.get("severity_band")},
        "text": {"signal": text_signal, "sentiment": text_result.get("sentiment", "neutral"), "crisis_language": bool(text_result.get("crisis_language"))},
        "voice": {"signal": voice_signal, "available": voice_signal is not None, "note": "Acoustic voice risk features are not available yet." if voice_signal is None else "Calibrated voice features included."},
        "combined_signal": combined,
    }


def support_plan(phq_result: dict, gad_result: dict, k10_result: dict, crisis: bool, profile: dict, themes: list[str]) -> dict:
    if crisis:
        return {
            "route": "crisis",
            "title": "Immediate support comes first",
            "next_action": "Contact local emergency services or a crisis line now, and stay with a trusted person if possible.",
            "psychiatric_referral": professional_contact("immediate"),
            "support_content": support_resources(themes, profile.get("preferred_language", "en")),
            "meditation": [],
            "strategies": [],
            "support_groups": [],
            "resources": support_resources(themes, profile.get("preferred_language", "en"))["resources"],
        }

    urgent_bands = {"moderate", "moderately_severe", "severe"}
    urgent = (
        phq_result.get("severity_band") in urgent_bands
        or gad_result.get("severity_band") in urgent_bands
        or k10_result.get("severity_band") in {"moderate", "severe"}
    )
    if urgent:
        return {
            "route": "psychiatric_referral",
            "title": "A professional evaluation is the next step",
            "next_action": "Book an appointment with a licensed psychiatrist or qualified mental-health clinician. If symptoms worsen or safety changes, seek urgent help.",
            "psychiatric_referral": {
                "what_to_expect": [
                    "A private conversation about symptoms, sleep, mood, anxiety, medicines, substance use, and safety.",
                    "A review of your questionnaire results and daily functioning.",
                    "Shared decisions about therapy, medical checks, medication, or follow-up. You can ask questions and decline options.",
                ],
                "provider_search": "Use a licensed local service, a hospital psychiatry department, or a regulated telehealth directory in your country.",
                "not_a_diagnosis": True,
            },
            "professional_contact": professional_contact("soon"),
            "support_content": support_resources(themes, profile.get("preferred_language", "en")),
            "meditation": [],
            "strategies": [],
            "support_groups": support_resources(themes, profile.get("preferred_language", "en"))["support_groups"],
            "resources": support_resources(themes, profile.get("preferred_language", "en"))["resources"],
        }

    content = support_resources(themes, profile.get("preferred_language", "en"))
    return {
        "route": "self_support_options",
        "title": "Gentle support options",
        "next_action": "Choose one small practice and consider sharing how you are doing with someone you trust.",
        "psychiatric_referral": None,
        "professional_contact": professional_contact("monitor"),
        "support_content": content,
        "meditation": content["meditation"],
        "strategies": content["strategies"],
        "support_groups": content["support_groups"],
        "resources": content["resources"],
    }


async def analyze_with_openrouter(text: str, language: str) -> Optional[dict]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return None

    payload = {
        "model": os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": "Classify mental-health check-in text for triage support, not diagnosis. Return only JSON with sentiment (negative, neutral, or positive), keyword_flags (array of strings), and crisis_language (boolean). Treat explicit self-harm or suicide intent as crisis_language true.",
            },
            {"role": "user", "content": f"Language: {language}\nText: {text}"},
        ],
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:3000"),
        "X-OpenRouter-Title": "MindHx",
    }
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            result = json.loads(content)
            if result.get("sentiment") not in {"negative", "neutral", "positive"}:
                return None
            return result
    except (httpx.HTTPError, KeyError, TypeError, ValueError):
        return None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "mindhx"}


@app.post("/session/start")
def start_session(payload: SessionStartRequest) -> dict:
    """Start a stateless session; the API never stores the supplied profile."""
    return {
        "session_token": secrets.token_urlsafe(24),
        "privacy": "Profile context is used for this request flow only. MindHx does not persist it or create an account.",
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...), language: str = Form("auto")) -> dict:
    """Transcribe audio with local faster-whisper using int8 quantization."""
    try:
        from faster_whisper import WhisperModel
    except ImportError as error:
        raise HTTPException(status_code=503, detail="faster-whisper is not installed") from error

    audio = await file.read()
    if not audio or len(audio) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio must be between 1 byte and 25 MB")

    suffix = Path(file.filename or "recording.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
        temp_file.write(audio)
        temp_path = temp_file.name

    try:
        model = WhisperModel(
            os.getenv("WHISPER_MODEL", "small"),
            device=os.getenv("WHISPER_DEVICE", "cpu"),
            compute_type="int8",
        )
        segments, info = model.transcribe(temp_path, language=None if language == "auto" else language)
        text = " ".join(segment.text.strip() for segment in segments).strip()
        return {"text": text, "language": info.language, "language_probability": round(info.language_probability, 3)}
    finally:
        Path(temp_path).unlink(missing_ok=True)


@app.post("/analyze-text")
async def analyze_text(payload: TextAnalysisRequest) -> dict:
    text = payload.text.strip()
    lowered = text.lower()
    crisis = has_crisis_language(text)
    negative_terms = ["hopeless", "empty", "worthless", "alone", "tired", "sad", "depressed", "اندر سے خالی", "مایوس", "اداس", "تنہا"]
    positive_terms = ["better", "hopeful", "calm", "خوش", "بہتر", "پُرسکون"]
    keywords = sorted({term for term in negative_terms + positive_terms if term in lowered})
    negative_hits = sum(term in lowered for term in negative_terms)
    positive_hits = sum(term in lowered for term in positive_terms)
    sentiment: Literal["negative", "neutral", "positive"] = "negative" if negative_hits > positive_hits else "positive" if positive_hits > negative_hits else "neutral"
    heuristic_result = {
        "sentiment": sentiment,
        "keyword_flags": keywords,
        "crisis_language": crisis,
        "language": payload.language,
    }
    llm_result = await analyze_with_openrouter(text, payload.language)
    return {**heuristic_result, **(llm_result or {}), "language": payload.language, "provider": "openrouter" if llm_result else "heuristic"}


@app.post("/support-resources")
def get_support_resources(payload: SupportResourcesRequest) -> dict:
    return support_resources(payload.themes, payload.language)


@app.post("/ai/chat")
def ai_chat(payload: AiSupportRequest) -> dict:
    """Return grounded support content only after the caller's risk gate is clear."""
    if not payload.risk_clear or has_crisis_language(payload.message):
        return {
            "status": "escalate",
            "message": "A safety concern requires immediate professional or emergency support. This chat cannot provide crisis counseling.",
            "resources": [{"title": "Immediate professional support", "link": "/therapist"}],
        }
    documents = retrieve_rag_documents(payload.message)
    return {
        "status": "grounded_support",
        "intent": documents[0]["intent"],
        "message": "Here is grounded information related to what you shared. It is general education, not a diagnosis or treatment plan.",
        "sources": [{"id": document["id"], "title": document["title"], "content": document["content"], "link": document["link"]} for document in documents],
        "generation": {"provider": "approved-rag-library", "model": "bounded-template", "diagnosis": False, "medication_prescribing": False},
    }


@app.post("/synthesize")
async def synthesize(payload: SpeechRequest) -> Response:
    """Generate audio with Uplift AI for Urdu text."""
    if payload.language != "ur":
        raise HTTPException(status_code=400, detail="Uplift speech generation currently supports Urdu only")
    api_key = os.getenv("UPLIFT_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="UPLIFT_API_KEY is not configured")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.upliftai.org/v1/synthesis/text-to-speech",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "voiceId": os.getenv("UPLIFT_VOICE_ID", "v_8eelc901"),
                    "text": payload.text,
                    "outputFormat": os.getenv("UPLIFT_OUTPUT_FORMAT", "MP3_22050_128"),
                },
            )
            response.raise_for_status()
    except httpx.HTTPError as error:
        raise HTTPException(status_code=502, detail="Uplift speech generation failed") from error

    return Response(content=response.content, media_type=response.headers.get("content-type", "audio/mpeg"))


@app.post("/score-phq9")
def score_phq9(payload: Phq9Request) -> dict:
    answers = [max(0, min(3, answer)) for answer in payload.answers]
    item_9_crisis = answers[8] > 0
    if item_9_crisis:
        return {
            "total_score": sum(answers),
            "severity_band": "crisis_flag",
            "item_9_crisis": True,
            "routing_decision": "refer_immediately",
        }
    total_score = sum(answers)
    return {
        "total_score": total_score,
        "severity_band": severity_for(total_score),
        "item_9_crisis": False,
        "routing_decision": "refer" if total_score >= 10 else "no_referral_needed",
    }


@app.post("/score-gad7")
def score_gad7_endpoint(payload: QuestionnaireRequest) -> dict:
    if len(payload.answers) != 7:
        raise HTTPException(status_code=422, detail="GAD-7 requires exactly 7 answers")
    return score_gad7(payload.answers)


@app.post("/score-k10")
def score_k10_endpoint(payload: QuestionnaireRequest) -> dict:
    if len(payload.answers) != 10:
        raise HTTPException(status_code=422, detail="K10 requires exactly 10 answers")
    return score_k10(payload.answers)


@app.post("/risk-assess")
async def risk_assess(payload: RiskAssessmentRequest) -> dict:
    phq_result = payload.phq9_result or score_phq9(Phq9Request(answers=payload.phq9_answers))
    gad_result = score_gad7(payload.gad7_answers)
    k10_result = score_k10(payload.k10_answers)
    text_result = payload.text_analysis or await analyze_text(TextAnalysisRequest(text=f"{payload.transcript}\n{payload.typed_text}", language=payload.language))
    crisis = bool(phq_result.get("item_9_crisis") or text_result.get("crisis_language"))
    profile_data = payload.profile.model_dump() if payload.profile else {}
    themes = classify_themes(phq_result, gad_result, k10_result, text_result)
    components = evaluate_components(phq_result, gad_result, k10_result, text_result, payload.voice_features)
    plan = support_plan(phq_result, gad_result, k10_result, crisis, profile_data, themes)
    if crisis:
        return {
            "risk_score": 1.0,
            "band": "crisis",
            "explanation": ["A crisis signal was detected and takes priority over the combined score."],
            "routing_decision": "refer_immediately",
            "crisis_flag": True,
            "themes": themes,
            "components": components,
            "phq9": phq_result,
            "gad7": gad_result,
            "k10": k10_result,
            "support_plan": plan,
        }

    risk_score = components["combined_signal"]
    band = "elevated" if risk_score >= 0.40 else "watch" if risk_score >= 0.2 else "low"
    return {
        "risk_score": risk_score,
        "band": band,
        "explanation": [f"PHQ-9 contributed {components['phq9']['score']} of 27 points.", f"GAD-7 contributed {components['gad7']['score']} of 21 points and K10 contributed {components['k10']['score']} of 50 points.", f"Text sentiment was {text_result.get('sentiment', 'neutral')}.", components["voice"]["note"]],
        "routing_decision": "refer" if plan["route"] == "psychiatric_referral" else "no_referral_needed",
        "crisis_flag": False,
        "themes": themes,
        "components": components,
        "phq9": phq_result,
        "gad7": gad_result,
        "k10": k10_result,
        "support_plan": plan,
    }
