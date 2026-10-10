"""Detection-quality checks for the text triage path.

Labelled sentences in English and Roman Urdu/Urdu, grouped by what the
deterministic analysis must do with them. These run without an OpenAI key, so
they measure the same lexicon/heuristic path a deployment falls back to.
"""

import asyncio

import pytest

import main
from main import TextAnalysisRequest


CRISIS = [
    "I want to kill myself",
    "I don't want to be here anymore, I've been thinking about ending it",
    "I've been thinking about ending my life",
    "I'd rather not wake up tomorrow",
    "I don't want to exist anymore",
    "I want to disappear forever",
    "everyone would be better off without me",
    "I keep thinking about hurting myself",
    "I'm thinking of taking my own life",
    "there's no point in going on, I'm done",
    "I think about dying every night",
    "I wish I had never been born",
    "mujhe marna hai, ab jeena nahi chahta",
    "میں اپنی جان لینا چاہتا ہوں",
    "I've been cutting again",
    "I'm going to take all my pills tonight",
    "I bought a rope",
    "I wish I could sleep and never wake up",
    "honestly kms",
    "I want to unalive myself",
    "I want to k1ll myself",
    "what's the point of living",
    "I won't be around much longer",
    "I overdosed last year and I'm thinking about it again",
]

NEGATIVE_CONCERN = [
    "I feel hopeless and I don't see the point anymore",
    "I can't sleep and I feel like a failure at everything",
    "Nothing feels enjoyable and I've stopped seeing my friends",
    "I've been crying for no reason and I feel empty inside",
    "I'm so exhausted all the time and nothing motivates me",
    "I feel worthless and like I'm a burden to everyone",
    "I keep worrying about everything and my chest feels tight",
    "I'm constantly on edge and can't stop my racing thoughts",
    "I feel so alone even when people are around me",
    "I've lost interest in everything I used to love",
    "mujhe bohat udaas aur tanha mehsoos ho raha hai",
    "میں بہت مایوس اور اداس ہوں",
]

BENIGN_LOOKALIKES = [
    "I don't want to go on the trip this weekend",
    "I'm ending it with my partner after a long talk",
    "I don't want to be around people at the party",
    "I'm ending my shift at five and then going home",
    "The pain should disappear once the swelling goes down",
    "I'm taking my medication every morning now",
    "I walked by the sea today and felt alive",
    "I'd die laughing at that joke, it was so funny",
    "this exam is killing me",
    "I killed it at work today",
    "I'm cutting back on sugar",
    "I took all my exams this week",
    "I need to cut my hair",
]

NEUTRAL_OR_POSITIVE = [
    "Today was a good day, I felt calm and grateful",
    "I'm doing better and feel hopeful about the future",
    "I went for a walk and had lunch with my sister",
    "Work was busy but manageable, I'm looking forward to the weekend",
    "I finished my assignment and went to bed early",
    "Feeling much more relaxed after the breathing exercise",
    "aaj mera din acha guzra, bohat sukoon tha",
    "آج کا دن اچھا گزرا، میں پرسکون ہوں",
]


def analyse(text: str) -> dict:
    language = "ur" if main.is_urdu_script(text) else "en"
    return asyncio.run(main.analyze_text(TextAnalysisRequest(text=text, language=language)))


@pytest.mark.parametrize("text", CRISIS)
def test_crisis_language_is_always_flagged(text: str) -> None:
    assert analyse(text)["crisis_language"] is True, text


@pytest.mark.parametrize("text", NEUTRAL_OR_POSITIVE + BENIGN_LOOKALIKES)
def test_non_concerning_text_is_not_flagged_as_crisis(text: str) -> None:
    assert analyse(text)["crisis_language"] is False, text


def test_negative_concern_is_recognised_as_negative_most_of_the_time() -> None:
    negative = [text for text in NEGATIVE_CONCERN if analyse(text)["sentiment"] == "negative"]
    recall = len(negative) / len(NEGATIVE_CONCERN)
    assert recall >= 0.8, f"negative recall {recall:.0%}; missed: {[t for t in NEGATIVE_CONCERN if t not in negative]}"


def test_positive_text_is_not_read_as_negative() -> None:
    misread = [text for text in NEUTRAL_OR_POSITIVE if analyse(text)["sentiment"] == "negative"]
    assert not misread, misread


import io
import wave

import numpy as np
from fastapi.testclient import TestClient

SAMPLE_RATE = 16000


def _signals() -> dict:
    t = np.arange(int(SAMPLE_RATE * 6)) / SAMPLE_RATE
    monotone = 0.3 * np.sin(2 * np.pi * 130 * t) * ((t % 2.0) < 1.1)
    f0 = 150 + 90 * np.sin(2 * np.pi * 0.7 * t)
    expressive = (0.2 + 0.2 * np.abs(np.sin(2 * np.pi * 1.3 * t))) * np.sin(2 * np.pi * np.cumsum(f0) / SAMPLE_RATE) * ((t % 3.0) < 2.8)
    return {"monotone": monotone, "expressive": expressive}


def _wav_bytes(samples: np.ndarray) -> bytes:
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as writer:
        writer.setnchannels(1)
        writer.setsampwidth(2)
        writer.setframerate(SAMPLE_RATE)
        writer.writeframes((np.clip(samples, -1, 1) * 32767).astype("<i2").tobytes())
    return buffer.getvalue()


def test_flat_monotone_speech_scores_higher_risk_than_expressive_speech() -> None:
    signals = _signals()
    flat = main._prosodic_risk_signal(main._prosodic_features(signals["monotone"].astype(np.float32), SAMPLE_RATE))
    expressive = main._prosodic_risk_signal(main._prosodic_features(signals["expressive"].astype(np.float32), SAMPLE_RATE))
    assert flat - expressive >= 0.3, (flat, expressive)


def test_pitch_spread_separates_flat_from_expressive_voice() -> None:
    signals = _signals()
    flat = main._prosodic_features(signals["monotone"].astype(np.float32), SAMPLE_RATE)["pitch_variability_semitones"]
    expressive = main._prosodic_features(signals["expressive"].astype(np.float32), SAMPLE_RATE)["pitch_variability_semitones"]
    assert flat is not None and expressive is not None
    assert expressive > flat + 3


def test_silence_and_noise_do_not_break_voice_analysis() -> None:
    rng = np.random.default_rng(1)
    for samples in (np.zeros(SAMPLE_RATE * 3, dtype=np.float32), rng.normal(0, 0.1, SAMPLE_RATE * 3).astype(np.float32)):
        features = main._prosodic_features(samples, SAMPLE_RATE)
        risk = main._prosodic_risk_signal(features)
        assert 0.0 <= risk <= 1.0


def test_voice_endpoint_returns_features_for_a_wav_recording() -> None:
    client = TestClient(main.app)
    response = client.post("/analyze-voice", files={"file": ("voice.wav", _wav_bytes(_signals()["monotone"]), "audio/wav")})
    assert response.status_code == 200, response.text
    body = response.json()
    assert 0.0 <= body["risk_signal"] <= 1.0
    assert "pitch_variability_semitones" in body
