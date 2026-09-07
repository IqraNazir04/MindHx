"""MindHx assessment API. The screening/risk-assessment endpoints are fully
stateless and require no account. Accounts (backend/auth.py, database.py,
models.py) are an optional, separate feature purely for people who choose
to save their check-in history across visits."""

import json
import os
import secrets
import tempfile
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal, Optional

import httpx
import numpy as np
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from auth import create_access_token, get_current_user, hash_password, verify_password
from database import get_db, init_db
from models import CheckIn, User


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(title="MindHx API", version="1.0.0", lifespan=lifespan)
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
    {
        "id": "grounding", "intent": "anxiety", "link": "/meditation",
        "en": {
            "title": "Grounding and anxious thoughts",
            "content": "The 5-4-3-2-1 technique works by shifting attention away from anxious or racing thoughts and onto your immediate senses, which can help interrupt a spiral of worry. Slowly name five things you can see, four things you can feel (like your feet on the floor or the texture of your clothing), three things you can hear, two things you can smell, and one thing you can taste. There's no need to rush - if a particular sense is hard to notice right now, just move to the next one. This is a general grounding technique, not a treatment for an anxiety disorder. If anxiety continues to interfere with daily life, sleep, or relationships, consider speaking with a qualified professional who can properly assess what's happening and discuss options such as therapy.",
        },
        "ur": {
            "title": "گراؤنڈنگ اور بےچین خیالات",
            "content": "5-4-3-2-1 تکنیک توجہ کو بےچین یا تیزی سے دوڑتے خیالات سے ہٹا کر آپ کے فوری حواس کی طرف لے جاتی ہے، جو فکر کے چکر کو روکنے میں مدد دے سکتی ہے۔ آہستہ آہستہ پانچ چیزیں جو آپ دیکھ سکتے ہیں، چار چیزیں جو محسوس کر سکتے ہیں (جیسے پاؤں کا فرش پر ہونا یا کپڑے کی ساخت)، تین چیزیں جو سن سکتے ہیں، دو چیزیں جن کی خوشبو محسوس ہو، اور ایک چیز جس کا ذائقہ محسوس ہو، نام لیں۔ جلدی کرنے کی ضرورت نہیں - اگر کوئی خاص حس ابھی محسوس کرنا مشکل ہو تو اگلی طرف بڑھ جائیں۔ یہ ایک عمومی گراؤنڈنگ تکنیک ہے، اضطرابی مرض کا علاج نہیں۔ اگر بےچینی روزمرہ زندگی، نیند، یا تعلقات میں مسلسل مداخلت کرے تو ایک مستند ماہر سے بات کرنے پر غور کریں جو صورتحال کا صحیح جائزہ لے کر تھراپی جیسے اختیارات پر گفتگو کر سکے۔",
        },
    },
    {
        "id": "small-action", "intent": "depression", "link": "/meditation",
        "en": {
            "title": "One small achievable action",
            "content": "When motivation and energy are low, waiting to \"feel ready\" can keep things stuck. Behavioral activation works the other way around: doing one small, concrete thing first, and letting the feeling follow. Choose one manageable action for the next hour, such as drinking a glass of water, opening a window for fresh air, stepping outside for a short walk, or sending one message to someone you trust. Keep the goal deliberately small so it's achievable even on a hard day. Small actions do not replace treatment, but they can create a starting point and interrupt withdrawal. If low mood, low energy, or loss of interest continue for most of the day, most days, over two weeks or more, that's worth discussing with a professional.",
        },
        "ur": {
            "title": "ایک چھوٹا سا قابلِ حصول قدم",
            "content": "جب حوصلہ اور توانائی کم ہو تو 'تیار محسوس کرنے' کا انتظار چیزوں کو رکا ہوا رکھ سکتا ہے۔ رویے پر مبنی محرک اس کے برعکس کام کرتا ہے: پہلے ایک چھوٹا، ٹھوس کام کرنا، اور احساس کو بعد میں آنے دینا۔ اگلے ایک گھنٹے کے لیے ایک قابلِ انتظام کام منتخب کریں، جیسے ایک گلاس پانی پینا، تازہ ہوا کے لیے کھڑکی کھولنا، مختصر سیر کے لیے باہر جانا، یا کسی قابلِ اعتماد شخص کو ایک پیغام بھیجنا۔ ہدف کو جان بوجھ کر اتنا چھوٹا رکھیں کہ مشکل دن میں بھی قابلِ حصول ہو۔ چھوٹے اقدامات علاج کا متبادل نہیں، لیکن یہ ایک نقطہ آغاز بنا سکتے ہیں اور پیچھے ہٹنے کے عمل کو روک سکتے ہیں۔ اگر کم موڈ، کم توانائی، یا دلچسپی کی کمی دو ہفتوں یا اس سے زیادہ عرصے تک، زیادہ تر دن، زیادہ تر وقت جاری رہے، تو یہ ایک ماہر سے گفتگو کے قابل ہے۔",
        },
    },
    {
        "id": "therapy", "intent": "therapy", "link": "/therapies",
        "en": {
            "title": "Therapy approaches",
            "content": "There isn't a single \"right\" therapy - different approaches suit different needs. Cognitive behavioral therapy (CBT) examines the links between thoughts, feelings, and behavior through structured sessions and between-session exercises. Dialectical behavior therapy (DBT) builds skills in emotion regulation, distress tolerance, and interpersonal effectiveness. Exposure therapy gradually and safely addresses specific fears or anxiety triggers under a clinician's guidance. Trauma-informed care prioritizes safety, pacing, and choice when trauma may be a factor. A medical review can also rule out physical contributors like sleep, thyroid, or medication effects. A licensed clinician can help match the approach to your specific circumstances - you don't need to figure this out alone.",
        },
        "ur": {
            "title": "تھراپی کے طریقے",
            "content": "کوئی ایک 'درست' تھراپی نہیں ہوتی - مختلف طریقے مختلف ضروریات کے لیے موزوں ہوتے ہیں۔ کوگنیٹو بیہیویورل تھراپی (CBT) منظم سیشنز اور سیشنز کے درمیان مشقوں کے ذریعے خیالات، جذبات، اور رویے کے تعلق کو دیکھتی ہے۔ ڈائلیکٹیکل بیہیویورل تھراپی (DBT) جذباتی توازن، تکلیف برداشت کرنے، اور باہمی تعلقات کی مہارتیں پیدا کرتی ہے۔ ایکسپوژر تھراپی ایک معالج کی رہنمائی میں مخصوص خوف یا اضطراب کے محرکات کو آہستہ آہستہ اور محفوظ طریقے سے حل کرتی ہے۔ صدمے سے آگاہ نگہداشت حفاظت، رفتار، اور انتخاب کو ترجیح دیتی ہے جب صدمہ ایک عنصر ہو سکتا ہے۔ ایک طبی جائزہ نیند، تھائیرائیڈ، یا ادویات کے اثرات جیسے جسمانی اسباب کو بھی خارج کر سکتا ہے۔ ایک مستند معالج آپ کے مخصوص حالات کے مطابق طریقہ منتخب کرنے میں مدد کر سکتا ہے - آپ کو یہ اکیلے سمجھنے کی ضرورت نہیں۔",
        },
    },
    {
        "id": "medication", "intent": "medication", "link": "/medication",
        "en": {
            "title": "Medication information",
            "content": "Medication can be part of treatment for some mental-health conditions, but the right choice - if any - depends on individual factors like diagnosis, medical history, other medications, and personal response, which only a licensed prescriber can properly evaluate. Common examples referenced in general education include SSRIs for depression and some anxiety disorders, and short-term options for acute anxiety symptoms under close supervision; each carries different considerations around side effects, dependence, and interactions. Do not start, stop, or change any medication based on this chat. If you're currently prescribed something and have concerns, or are considering medication for the first time, that conversation belongs with your prescriber, who can review your full picture safely.",
        },
        "ur": {
            "title": "ادویات کی معلومات",
            "content": "کچھ ذہنی صحت کی کیفیات کے علاج میں ادویات شامل ہو سکتی ہیں، لیکن صحیح انتخاب - اگر کوئی ہو - تشخیص، طبی تاریخ، دیگر ادویات، اور ذاتی ردعمل جیسے انفرادی عوامل پر منحصر ہوتا ہے، جن کا صحیح جائزہ صرف ایک مستند تجویز کنندہ لے سکتا ہے۔ عمومی تعلیم میں حوالہ دی جانے والی عام مثالوں میں ڈپریشن اور کچھ اضطرابی امراض کے لیے ایس ایس آر آئیز، اور قریبی نگرانی میں شدید اضطراب کی علامات کے لیے قلیل مدتی اختیارات شامل ہیں؛ ہر ایک کے ساتھ ضمنی اثرات، انحصار، اور تعامل کے مختلف پہلو جڑے ہیں۔ اس گفتگو کی بنیاد پر کوئی دوا شروع، بند، یا تبدیل نہ کریں۔ اگر آپ فی الوقت کوئی دوا لے رہے ہیں اور خدشات رکھتے ہیں، یا پہلی بار ادویات پر غور کر رہے ہیں، تو یہ گفتگو آپ کے تجویز کنندہ کے ساتھ ہونی چاہیے، جو آپ کی مکمل صورتحال کا محفوظ طریقے سے جائزہ لے سکے۔",
        },
    },
]


class Profile(BaseModel):
    age_range: str = Field(min_length=1, max_length=20)
    gender: Optional[str] = Field(default=None, max_length=40)
    marital_status: Optional[str] = Field(default=None, max_length=40)
    life_context: Optional[str] = Field(default=None, max_length=40)
    preferred_language: str = Field(default="en", max_length=10)


class SessionStartRequest(BaseModel):
    profile: Profile


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    age_range: Optional[str] = Field(default=None, max_length=20)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class CheckInCreateRequest(BaseModel):
    risk_score: float = Field(ge=0, le=1)
    band: str = Field(max_length=20)
    routing_decision: str = Field(max_length=30)
    themes: list[str] = Field(default_factory=list, max_length=10)


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


def localize_rag_document(document: dict, language: str) -> dict:
    locale = document["ur"] if language == "ur" else document["en"]
    return {"id": document["id"], "title": locale["title"], "content": locale["content"], "link": document["link"]}


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
        {"name": "Cool-down pause", "themes": ["frustration"], "steps": "Step away for 2 minutes, unclench your jaw and shoulders, and name what specifically triggered the frustration before responding."},
        {"name": "Loss processing", "themes": ["loss"], "steps": "Acknowledge what changed, allow yourself an adjustment period, and identify one practical next step for the coming week."},
        {"name": "Grounding after distress", "themes": ["trauma"], "steps": "Orient to the present: name the room, the date, and one safe fact. Trauma-focused work is best done with a qualified trauma-informed clinician."},
    ]
    meditation = [
        {"name": "Paced breathing", "themes": ["anxiety", "hardship"], "steps": "Inhale gently for 4 counts and exhale for 6 counts for 2 minutes. Stop if dizzy or more distressed."},
        {"name": "Five-senses grounding", "themes": ["anxiety", "hardship"], "steps": "Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste."},
        {"name": "Compassionate body scan", "themes": ["patience", "grief", "hardship"], "steps": "For 3 minutes, notice tension from head to feet without judging it. Relax only where comfortable."},
        {"name": "Name and allow", "themes": ["grief", "patience"], "steps": "Name the feeling in a few words, acknowledge it, and give it 90 seconds without forcing it away."},
        {"name": "Cooling breath", "themes": ["frustration"], "steps": "Inhale through the nose for 4 counts, exhale slowly through pursed lips for 6 counts, and repeat for 2 minutes."},
        {"name": "Anchoring statement", "themes": ["loss"], "steps": "Repeat a brief steadying phrase (e.g. \"this is hard, and I am getting through it\") while breathing slowly for 1-2 minutes."},
        {"name": "Safe-place visualization", "themes": ["trauma"], "steps": "Picture a place where you have felt calm and safe and notice its details for 2-3 minutes. Stop if this increases distress and seek trauma-informed professional support."},
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


THEME_KEYWORDS = {
    "trauma": ("trauma", "ptsd", "flashback", "abuse", "assault", "molest", "صدمہ", "زیادتی", "تشدد"),
    "grief": ("bereav", "passed away", "died", "death of", "funeral", "غم", "وفات", "انتقال"),
    "loss": ("lost my job", "lost my", "breakup", "broke up", "divorce", "miscarriage", "طلاق", "نوکری چلی گئی", "کھو دیا"),
    "frustration": ("frustrat", "irritat", "fed up", "annoyed", "so angry", "غصہ", "چڑچڑا", "تنگ آ"),
    "anxiety": ("anx", "worry", "worried", "panic", "نروس", "فکر", "گھبرا"),
    "medical_state": ("in pain", "medical condition", "illness", "chronic pain", "درد", "بیماری", "علاج"),
}


def classify_themes(phq_result: dict, gad_result: dict, k10_result: dict, text_result: dict, raw_text: str = "") -> list[str]:
    """Themes are derived from the raw check-in text (not text_result['keyword_flags'], which
    only ever holds a small fixed sentiment vocabulary and would never match these terms)."""
    themes: list[str] = []
    phq_score = int(phq_result.get("total_score", 0))
    gad_score = int(gad_result.get("total_score", 0))
    k10_score = int(k10_result.get("total_score", 0))
    lowered = raw_text.lower()

    def mentions(theme: str) -> bool:
        return any(term in lowered for term in THEME_KEYWORDS[theme])

    if mentions("trauma"):
        themes.append("trauma")
    if mentions("grief"):
        themes.append("grief")
    if mentions("loss") and "grief" not in themes:
        themes.append("loss")
    if mentions("frustration"):
        themes.append("frustration")
    if (gad_score >= 10 and phq_score < 10) or mentions("anxiety"):
        if "anxiety" not in themes:
            themes.append("anxiety")
    if phq_score >= 10 and not {"grief", "loss", "trauma"} & set(themes):
        themes.append("hardship")
    if k10_score >= 25 and "hardship" not in themes:
        themes.append("hardship")
    if mentions("medical_state"):
        themes.append("medical_state")
    return themes or ["patience"]


MODALITY_LABELS = {
    "phq9": ("PHQ-9", "clinical"),
    "gad7": ("GAD-7", "clinical"),
    "k10": ("K10", "clinical"),
    "text": ("Linguistic (what they say)", "linguistic"),
    "voice": ("Acoustic (how they sound)", "acoustic"),
}


def evaluate_components(phq_result: dict, gad_result: dict, k10_result: dict, text_result: dict, voice_features: dict[str, float]) -> dict:
    phq_signal = round(int(phq_result.get("total_score", 0)) / 27, 2)
    gad_signal = round(int(gad_result.get("total_score", 0)) / 21, 2)
    k10_signal = round(max(0, int(k10_result.get("total_score", 10)) - 10) / 40, 2)
    text_signal = 1.0 if text_result.get("crisis_language") else 0.65 if text_result.get("sentiment") == "negative" else 0.25 if text_result.get("sentiment") == "neutral" else 0.0
    voice_signal = round(max(0.0, min(1.0, float(voice_features.get("risk_signal", 0.0)))), 2) if voice_features else None

    names = ["phq9", "gad7", "k10", "text"] + (["voice"] if voice_signal is not None else [])
    signals = [phq_signal, gad_signal, k10_signal, text_signal] + ([voice_signal] if voice_signal is not None else [])
    weights = [0.30, 0.22, 0.22, 0.16] + ([0.10] if voice_signal is not None else [])
    combined = round(sum(signal * weight for signal, weight in zip(signals, weights)) * 100) / 100

    # combined is a weighted sum with these exact weights (unnormalized, matching the
    # calculation above), so each term's raw weighted value is its exact contribution to
    # combined - the Shapley value for an additive payoff with no interaction effects to
    # split. Contributions below sum to `combined` by construction, not approximately.
    contributions = []
    for name, signal, weight in zip(names, signals, weights):
        label, modality = MODALITY_LABELS[name]
        value = round(signal * weight, 4)
        contributions.append({
            "name": name,
            "label": label,
            "modality": modality,
            "signal": signal,
            "weight": weight,
            "contribution": value,
            "share_pct": round((value / combined) * 100, 1) if combined else 0.0,
        })

    return {
        "phq9": {"signal": phq_signal, "score": phq_result.get("total_score", 0), "band": phq_result.get("severity_band")},
        "gad7": {"signal": gad_signal, "score": gad_result.get("total_score", 0), "band": gad_result.get("severity_band")},
        "k10": {"signal": k10_signal, "score": k10_result.get("total_score", 0), "band": k10_result.get("severity_band")},
        "text": {"signal": text_signal, "sentiment": text_result.get("sentiment", "neutral"), "crisis_language": bool(text_result.get("crisis_language"))},
        "voice": {"signal": voice_signal, "available": voice_signal is not None, "note": "Acoustic voice risk features are not available for this check-in." if voice_signal is None else "Heuristic acoustic features included (pause ratio, loudness variability, speaking rate) - not a validated clinical biomarker."},
        "combined_signal": combined,
        "attribution": {
            "method": "additive_signal_attribution",
            "note": "MindHx's combined signal is a weighted sum of clinical, linguistic, and acoustic inputs, so these contributions are the exact per-signal attribution (equivalent to Shapley values for an additive model), not an approximation.",
            "total": combined,
            "contributions": sorted(contributions, key=lambda item: item["contribution"], reverse=True),
        },
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


TRIAGE_CLASSIFIER_SYSTEM_PROMPT = "Classify mental-health check-in text for triage support, not diagnosis. Return only JSON with sentiment (negative, neutral, or positive), keyword_flags (array of strings), and crisis_language (boolean). Treat explicit self-harm or suicide intent as crisis_language true."


def _parse_triage_classification(content: str) -> Optional[dict]:
    try:
        result = json.loads(content)
    except (TypeError, ValueError):
        return None
    if result.get("sentiment") not in {"negative", "neutral", "positive"}:
        return None
    return result


async def analyze_with_qwen(text: str, language: str) -> Optional[dict]:
    """Classify check-in text with Qwen via Alibaba Cloud DashScope's OpenAI-compatible API."""
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        return None

    base_url = os.getenv("DASHSCOPE_BASE_URL", "https://dashscope-intl.aliyuncs.com/compatible-mode/v1")
    payload = {
        "model": os.getenv("DASHSCOPE_MODEL", "qwen-plus"),
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": TRIAGE_CLASSIFIER_SYSTEM_PROMPT},
            {"role": "user", "content": f"Language: {language}\nText: {text}"},
        ],
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(f"{base_url}/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
    except (httpx.HTTPError, KeyError, TypeError, IndexError):
        return None
    return _parse_triage_classification(content)


async def analyze_with_openrouter(text: str, language: str) -> Optional[dict]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return None

    payload = {
        "model": os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": TRIAGE_CLASSIFIER_SYSTEM_PROMPT},
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
    except (httpx.HTTPError, KeyError, TypeError, IndexError):
        return None
    return _parse_triage_classification(content)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "mindhx"}


def _serialize_user(user: User) -> dict:
    return {"id": user.id, "email": user.email, "age_range": user.age_range, "created_at": user.created_at.isoformat()}


def _serialize_checkin(check_in: CheckIn) -> dict:
    return {
        "id": check_in.id,
        "risk_score": check_in.risk_score,
        "band": check_in.band,
        "routing_decision": check_in.routing_decision,
        "themes": check_in.themes.split(",") if check_in.themes else [],
        "created_at": check_in.created_at.isoformat(),
    }


@app.post("/auth/register", status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> dict:
    """Create an optional account. The core check-in flow never requires one."""
    email = payload.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(email=email, hashed_password=hash_password(payload.password), age_range=payload.age_range)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}


@app.get("/auth/me")
def read_current_user(current_user: User = Depends(get_current_user)) -> dict:
    return _serialize_user(current_user)


@app.post("/checkins", status_code=201)
def create_checkin(payload: CheckInCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """Save an aggregate check-in result (never the raw transcript/typed text) for a signed-in user."""
    check_in = CheckIn(
        user_id=current_user.id,
        risk_score=payload.risk_score,
        band=payload.band,
        routing_decision=payload.routing_decision,
        themes=",".join(payload.themes),
    )
    db.add(check_in)
    db.commit()
    db.refresh(check_in)
    return _serialize_checkin(check_in)


@app.get("/checkins")
def list_checkins(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[dict]:
    check_ins = db.query(CheckIn).filter(CheckIn.user_id == current_user.id).order_by(CheckIn.created_at.desc()).all()
    return [_serialize_checkin(check_in) for check_in in check_ins]


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


def _decode_audio_mono(av_module, path: str, target_rate: int = 16000) -> tuple[np.ndarray, int]:
    """Decode any container PyAV can read into mono float32 PCM at target_rate."""
    container = av_module.open(path)
    try:
        stream = container.streams.audio[0]
        resampler = av_module.audio.resampler.AudioResampler(format="flt", layout="mono", rate=target_rate)
        chunks = []
        for frame in container.decode(stream):
            for resampled in resampler.resample(frame):
                chunks.append(resampled.to_ndarray())
        for resampled in resampler.resample(None):
            chunks.append(resampled.to_ndarray())
    finally:
        container.close()
    if not chunks:
        return np.array([], dtype=np.float32), target_rate
    return np.concatenate(chunks, axis=1).flatten().astype(np.float32), target_rate


def _prosodic_features(audio: np.ndarray, sample_rate: int) -> dict:
    """Frame-level loudness/pause/rate features computed directly from PCM samples."""
    frame_length = max(1, int(0.025 * sample_rate))
    hop_length = max(1, int(0.010 * sample_rate))
    frames = [audio[start:start + frame_length] for start in range(0, max(1, len(audio) - frame_length), hop_length)]
    if not frames:
        frames = [audio]
    rms = np.array([float(np.sqrt(np.mean(frame.astype(np.float64) ** 2) + 1e-12)) for frame in frames])
    threshold = max(float(rms.mean()) * 0.35, 1e-4)
    voiced_mask = rms > threshold
    pause_ratio = float(1.0 - voiced_mask.mean())
    voiced_rms = rms[voiced_mask]
    energy_variability = float(voiced_rms.std() / (voiced_rms.mean() + 1e-9)) if voiced_rms.size >= 2 else 0.0
    transitions = np.diff(voiced_mask.astype(int))
    segment_count = int(np.sum(transitions == 1)) + (1 if voiced_mask.size and voiced_mask[0] else 0)
    duration_sec = len(audio) / sample_rate
    speaking_rate = segment_count / duration_sec if duration_sec > 0 else 0.0
    return {
        "duration_sec": round(duration_sec, 2),
        "pause_ratio": round(pause_ratio, 3),
        "energy_variability": round(energy_variability, 3),
        "speaking_rate": round(speaking_rate, 3),
    }


def _prosodic_risk_signal(features: dict) -> float:
    """Maps prosodic features to 0..1: more pausing, flatter loudness, and slower speech
    (all associated with psychomotor slowing / low affect in the literature) push it up.
    The thresholds below are reasonable heuristic assumptions, not fitted to labeled data -
    treat this as a proxy signal, not a validated biomarker score."""
    pause_component = min(1.0, max(0.0, (features["pause_ratio"] - 0.3) / 0.4))
    variability_component = min(1.0, max(0.0, (0.5 - features["energy_variability"]) / 0.5))
    rate_component = min(1.0, max(0.0, (2.0 - features["speaking_rate"]) / 2.0))
    signal = 0.4 * pause_component + 0.35 * variability_component + 0.25 * rate_component
    return round(min(1.0, max(0.0, signal)), 2)


@app.post("/analyze-voice")
async def analyze_voice(file: UploadFile = File(...)) -> dict:
    """Extract a heuristic prosodic risk signal directly from audio (pause ratio, loudness
    variability, speaking rate). VOICE_BIOMARKER_PROVIDER selects the provider; only 'local'
    is implemented - no clinical voice-biomarker vendor is integrated."""
    provider = os.getenv("VOICE_BIOMARKER_PROVIDER", "local")
    if provider != "local":
        raise HTTPException(status_code=503, detail=f"Voice biomarker provider '{provider}' is not implemented")

    try:
        import av
    except ImportError as error:
        raise HTTPException(status_code=503, detail="Audio decoding (PyAV) is not installed") from error

    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio must be between 1 byte and 25 MB")

    suffix = Path(file.filename or "recording.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
        temp_file.write(audio_bytes)
        temp_path = temp_file.name

    try:
        audio, sample_rate = _decode_audio_mono(av, temp_path)
        if audio.size < sample_rate * 0.5:
            raise HTTPException(status_code=422, detail="Audio is too short to analyze (minimum ~0.5s)")
        features = _prosodic_features(audio, sample_rate)
        risk_signal = _prosodic_risk_signal(features)
        return {
            "provider": "local-heuristic",
            "risk_signal": risk_signal,
            **features,
            "note": "Heuristic prosodic signal derived directly from audio (pause ratio, energy variability, speaking rate). Not a validated clinical voice biomarker.",
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=422, detail="Could not analyze this audio file") from error
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
    llm_result = await analyze_with_qwen(text, payload.language)
    provider = "dashscope-qwen" if llm_result else None
    if not llm_result:
        llm_result = await analyze_with_openrouter(text, payload.language)
        provider = "openrouter" if llm_result else None
    return {**heuristic_result, **(llm_result or {}), "language": payload.language, "provider": provider or "heuristic"}


@app.post("/support-resources")
def get_support_resources(payload: SupportResourcesRequest) -> dict:
    return support_resources(payload.themes, payload.language)


AI_CHAT_COPY = {
    "en": {
        "escalate": "A safety concern requires immediate professional or emergency support. This chat cannot provide crisis counseling.",
        "escalate_resource": "Immediate professional support",
        "grounded": "Here is grounded information related to what you shared. It is general education, not a diagnosis or treatment plan.",
    },
    "ur": {
        "escalate": "ایک حفاظتی خدشے کے لیے فوری پیشہ ورانہ یا ہنگامی مدد درکار ہے۔ یہ چیٹ بحرانی مشاورت فراہم نہیں کر سکتی۔",
        "escalate_resource": "فوری پیشہ ورانہ مدد",
        "grounded": "آپ نے جو بتایا اس سے متعلق مصدقہ معلومات یہ ہیں۔ یہ عمومی تعلیم ہے، تشخیص یا علاج کا منصوبہ نہیں۔",
    },
}


@app.post("/ai/chat")
def ai_chat(payload: AiSupportRequest) -> dict:
    """Return grounded support content only after the caller's risk gate is clear."""
    lang = "ur" if payload.language == "ur" else "en"
    text = AI_CHAT_COPY[lang]
    if not payload.risk_clear or has_crisis_language(payload.message):
        return {
            "status": "escalate",
            "message": text["escalate"],
            "resources": [{"title": text["escalate_resource"], "link": "/therapist"}],
        }
    documents = retrieve_rag_documents(payload.message)
    return {
        "status": "grounded_support",
        "intent": documents[0]["intent"],
        "message": text["grounded"],
        "sources": [localize_rag_document(document, lang) for document in documents],
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
    themes = classify_themes(phq_result, gad_result, k10_result, text_result, f"{payload.transcript}\n{payload.typed_text}")
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
