"""Stateless MindHx assessment API."""

import os
import tempfile
from pathlib import Path
from typing import Literal, Optional

import numpy as np
import requests
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

VOICE_SAMPLE_RATE = 16000
VOICE_FMIN_HZ = 80.0
VOICE_FMAX_HZ = 350.0


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
    voice_analysis: dict = Field(default_factory=dict)


def has_crisis_language(text: str) -> bool:
    normalized = " ".join(text.lower().split())
    return any(term in normalized for term in CRISIS_TERMS)


def decode_audio_mono(path: str) -> np.ndarray:
    """Decode any container ffmpeg/av understands to mono float32 PCM at VOICE_SAMPLE_RATE."""
    import av

    container = av.open(path)
    resampler = av.AudioResampler(format="s16", layout="mono", rate=VOICE_SAMPLE_RATE)
    chunks: list[np.ndarray] = []
    for frame in container.decode(audio=0):
        for resampled in resampler.resample(frame):
            array = resampled.to_ndarray()
            if array.size:
                chunks.append(array.reshape(-1))
    container.close()
    if not chunks:
        return np.array([], dtype=np.float32)
    return np.concatenate(chunks).astype(np.float32) / 32768.0


def estimate_pitch_track(samples: np.ndarray, sr: int, frame_ms: float = 40, hop_ms: float = 20) -> list[float]:
    """Per-frame autocorrelation pitch (F0) estimate, skipping silent/unvoiced frames."""
    frame_len = int(sr * frame_ms / 1000)
    hop_len = int(sr * hop_ms / 1000)
    min_lag = int(sr / VOICE_FMAX_HZ)
    max_lag = int(sr / VOICE_FMIN_HZ)
    pitches: list[float] = []
    for start in range(0, max(0, len(samples) - frame_len), hop_len):
        frame = samples[start:start + frame_len]
        if np.sqrt(np.mean(frame ** 2)) < 0.01:
            continue
        windowed = (frame - frame.mean()) * np.hanning(len(frame))
        autocorr = np.correlate(windowed, windowed, mode="full")[len(windowed) - 1:]
        if autocorr[0] <= 0 or max_lag >= len(autocorr):
            continue
        segment = autocorr[min_lag:max_lag]
        if segment.size == 0:
            continue
        peak_lag = int(np.argmax(segment)) + min_lag
        if autocorr[peak_lag] / autocorr[0] < 0.35:
            continue
        pitches.append(sr / peak_lag)
    return pitches


def analyze_voice_signal(samples: np.ndarray, word_count: Optional[int]) -> dict:
    sr = VOICE_SAMPLE_RATE
    duration_seconds = round(len(samples) / sr, 2) if sr else 0.0
    if len(samples) == 0 or duration_seconds < 0.3:
        return {
            "duration_seconds": duration_seconds, "pitch_mean_hz": 0.0, "pitch_variability_hz": 0.0,
            "energy_mean": 0.0, "silence_ratio": 1.0, "speaking_rate_wpm": None,
            "vocal_flags": [], "vocal_pattern": "insufficient_audio",
        }

    frame_len = int(sr * 0.03)
    frame_energies = [
        float(np.sqrt(np.mean(samples[i:i + frame_len] ** 2)))
        for i in range(0, max(1, len(samples) - frame_len), frame_len)
    ] or [0.0]
    peak_energy = max(frame_energies) or 1.0
    silence_ratio = round(sum(energy < 0.05 * peak_energy for energy in frame_energies) / len(frame_energies), 2)
    energy_mean = round(float(np.mean(frame_energies)), 4)

    pitches = estimate_pitch_track(samples, sr)
    pitch_mean = round(float(np.mean(pitches)), 1) if pitches else 0.0
    pitch_variability = round(float(np.std(pitches)), 1) if len(pitches) > 1 else 0.0
    speaking_rate_wpm = round(word_count / (duration_seconds / 60), 1) if word_count and duration_seconds >= 1 else None

    flags = []
    if pitches and pitch_mean > 0 and (pitch_variability / pitch_mean) < 0.12:
        flags.append("reduced_pitch_variability")
    if silence_ratio > 0.55:
        flags.append("high_pause_ratio")
    if speaking_rate_wpm is not None and speaking_rate_wpm < 90:
        flags.append("slow_speaking_rate")
    if not pitches:
        flags.append("low_vocal_energy")

    vocal_pattern = "flat_or_subdued" if len(flags) >= 2 else "some_variation_reduced" if flags else "typical_variation"
    return {
        "duration_seconds": duration_seconds, "pitch_mean_hz": pitch_mean, "pitch_variability_hz": pitch_variability,
        "energy_mean": energy_mean, "silence_ratio": silence_ratio, "speaking_rate_wpm": speaking_rate_wpm,
        "vocal_flags": flags, "vocal_pattern": vocal_pattern,
    }


def normalize_clinical_response(vendor_payload: dict) -> dict:
    """Map a vendor's response into MindHx's voice-analysis schema (see analyze_voice_signal).

    Stub: no clinical voice-biomarker vendor (Kintsugi, Ellipsis Health, Canary Speech, ...)
    has a public self-serve API contract to build against. Replace this body with a real
    field mapping once you have a vendor account and their API docs.
    """
    raise NotImplementedError(
        "normalize_clinical_response() has no vendor mapping yet — implement it once you have "
        "API docs for the chosen clinical voice-biomarker vendor."
    )


def analyze_voice_clinical_api(temp_path: str, transcript: str) -> dict:
    """Send the recording to a configured clinical voice-biomarker vendor instead of the local heuristic."""
    api_url = os.getenv("VOICE_BIOMARKER_API_URL")
    api_key = os.getenv("VOICE_BIOMARKER_API_KEY")
    if not api_url or not api_key:
        raise HTTPException(
            status_code=503,
            detail="VOICE_BIOMARKER_PROVIDER=clinical_api requires VOICE_BIOMARKER_API_URL and VOICE_BIOMARKER_API_KEY",
        )

    with open(temp_path, "rb") as audio_file:
        response = requests.post(
            api_url,
            headers={"Authorization": f"Bearer {api_key}"},
            files={"audio": audio_file},
            data={"transcript": transcript} if transcript else {},
            timeout=30,
        )
    response.raise_for_status()
    return normalize_clinical_response(response.json())


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


@app.post("/analyze-voice")
async def analyze_voice(file: UploadFile = File(...), transcript: str = Form("")) -> dict:
    """Extract prosodic features (pitch, pace, pauses) from a voice note, independent of its words.

    Provider is selected by VOICE_BIOMARKER_PROVIDER: "local" (default) runs the built-in
    heuristic below; "clinical_api" delegates to analyze_voice_clinical_api once a vendor
    is configured via VOICE_BIOMARKER_API_URL/VOICE_BIOMARKER_API_KEY.
    """
    audio = await file.read()
    if not audio or len(audio) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio must be between 1 byte and 25 MB")

    suffix = Path(file.filename or "recording.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
        temp_file.write(audio)
        temp_path = temp_file.name

    provider = os.getenv("VOICE_BIOMARKER_PROVIDER", "local")
    try:
        if provider == "clinical_api":
            result = analyze_voice_clinical_api(temp_path, transcript)
        else:
            samples = decode_audio_mono(temp_path)
            word_count = len(transcript.split()) if transcript.strip() else None
            result = analyze_voice_signal(samples, word_count)
    except HTTPException:
        raise
    except requests.RequestException as error:
        raise HTTPException(status_code=502, detail="Voice biomarker provider request failed") from error
    except Exception as error:
        raise HTTPException(status_code=422, detail="Could not analyze audio") from error
    finally:
        Path(temp_path).unlink(missing_ok=True)

    result["provider"] = provider
    return result


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

    voice_flags = payload.voice_analysis.get("vocal_flags", [])
    voice_signal = 0.15 if len(voice_flags) >= 2 else 0.08 if len(voice_flags) == 1 else 0.0

    phq_score = int(phq_result.get("total_score", 0)) / 27
    text_signal = 0.2 if text_result.get("sentiment") == "negative" else 0.0
    risk_score = round(min(1.0, phq_score * 0.75 + text_signal + voice_signal), 2)
    band = "elevated" if risk_score >= 0.40 else "watch" if risk_score >= 0.2 else "low"
    voice_explanation = (
        f"Voice pattern showed {', '.join(flag.replace('_', ' ') for flag in voice_flags)}."
        if voice_flags
        else "Voice pattern showed typical variation." if payload.voice_analysis else
        "Voice features are added here when a voice note is analyzed."
    )
    return {
        "risk_score": risk_score,
        "band": band,
        "explanation": [f"PHQ-9 contributed {phq_result.get('total_score', 0)} of 27 points.", f"Text sentiment was {text_result.get('sentiment', 'neutral')}.", voice_explanation],
        "routing_decision": "refer" if risk_score >= 0.40 else "no_referral_needed",
        "crisis_flag": False,
    }
