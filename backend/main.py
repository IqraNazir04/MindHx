"""Stateless MindHx assessment API."""

import os
import tempfile
from pathlib import Path
from typing import Literal, Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
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


class Phq9Request(BaseModel):
    answers: list[int] = Field(min_length=9, max_length=9)
    session_token: Optional[str] = Field(default=None, max_length=128)


class RiskAssessmentRequest(BaseModel):
    transcript: str = Field(default="", max_length=10000)
    typed_text: str = Field(default="", max_length=10000)
    language: str = "en"
    phq9_answers: list[int] = Field(min_length=9, max_length=9)
    text_analysis: dict = Field(default_factory=dict)
    phq9_result: dict = Field(default_factory=dict)


def has_crisis_language(text: str) -> bool:
    normalized = " ".join(text.lower().split())
    return any(term in normalized for term in CRISIS_TERMS)


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


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "mindhx"}


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
def analyze_text(payload: TextAnalysisRequest) -> dict:
    text = payload.text.strip()
    lowered = text.lower()
    crisis = has_crisis_language(text)
    negative_terms = ["hopeless", "empty", "worthless", "alone", "tired", "sad", "depressed", "اندر سے خالی", "مایوس", "اداس", "تنہا"]
    positive_terms = ["better", "hopeful", "calm", "خوش", "بہتر", "پُرسکون"]
    keywords = sorted({term for term in negative_terms + positive_terms if term in lowered})
    negative_hits = sum(term in lowered for term in negative_terms)
    positive_hits = sum(term in lowered for term in positive_terms)
    sentiment: Literal["negative", "neutral", "positive"] = "negative" if negative_hits > positive_hits else "positive" if positive_hits > negative_hits else "neutral"
    return {
        "sentiment": sentiment,
        "keyword_flags": keywords,
        "crisis_language": crisis,
        "language": payload.language,
    }


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


@app.post("/risk-assess")
def risk_assess(payload: RiskAssessmentRequest) -> dict:
    phq_result = payload.phq9_result or score_phq9(Phq9Request(answers=payload.phq9_answers))
    text_result = payload.text_analysis or analyze_text(TextAnalysisRequest(text=f"{payload.transcript}\n{payload.typed_text}", language=payload.language))
    crisis = bool(phq_result.get("item_9_crisis") or text_result.get("crisis_language"))
    if crisis:
        return {
            "risk_score": 1.0,
            "band": "crisis",
            "explanation": ["A crisis signal was detected and takes priority over the combined score."],
            "routing_decision": "refer_immediately",
            "crisis_flag": True,
        }

    phq_score = int(phq_result.get("total_score", 0)) / 27
    text_signal = 0.2 if text_result.get("sentiment") == "negative" else 0.0
    risk_score = round(min(1.0, phq_score * 0.75 + text_signal), 2)
    band = "elevated" if risk_score >= 0.40 else "watch" if risk_score >= 0.2 else "low"
    return {
        "risk_score": risk_score,
        "band": band,
        "explanation": [f"PHQ-9 contributed {phq_result.get('total_score', 0)} of 27 points.", f"Text sentiment was {text_result.get('sentiment', 'neutral')}.", "Voice features are added here when the calibrated voice model is connected."],
        "routing_decision": "refer" if risk_score >= 0.40 else "no_referral_needed",
        "crisis_flag": False,
    }
