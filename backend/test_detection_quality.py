"""Detection-quality checks for the text triage path.

Labelled sentences in English and Roman Urdu/Urdu, grouped by what the
deterministic analysis must do with them. These run without an OpenAI key, so
they measure the same lexicon/heuristic path a deployment falls back to.
"""

import asyncio

import httpx
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
    # Regression cases: "happy"/"great"/"glad"/"fine" were missing from the
    # positive lexicon, so an ordinary sentence mentioning fatigue (a real
    # word, legitimately tracked elsewhere for depression screening) read as
    # negative even when paired with a clearly positive word right next to it.
    "I am a bit tired from a late night but otherwise great",
    "I am tired but happy with how things went",
    "Work was busy but I handled it fine",
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


class _StubEmotionModel:
    """Stands in for the ONNX session with a fixed reading (mostly sad), so these
    tests check how /analyze-voice combines tone with words and silence gating,
    independent of the real model file."""

    def __init__(self) -> None:
        self.calls = 0

    def run(self, _outputs, _feeds: dict) -> list:
        self.calls += 1
        logits = np.full((1, len(main.VOICE_EMOTION_LABELS)), -4.0, dtype=np.float32)
        logits[0, main.VOICE_EMOTION_LABELS.index("sad")] = 4.0
        return [logits]


@pytest.fixture
def stub_model(monkeypatch) -> _StubEmotionModel:
    model = _StubEmotionModel()
    monkeypatch.setattr(main, "_load_voice_emotion_model", lambda: model)
    return model


def _tone(seconds: float = 3.0) -> np.ndarray:
    t = np.arange(int(SAMPLE_RATE * seconds)) / SAMPLE_RATE
    return (0.3 * np.sin(2 * np.pi * 180 * t) * ((t % 1.0) < 0.7)).astype(np.float32)


def _wav_bytes(samples: np.ndarray) -> bytes:
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as writer:
        writer.setnchannels(1)
        writer.setsampwidth(2)
        writer.setframerate(SAMPLE_RATE)
        writer.writeframes((np.clip(samples, -1, 1) * 32767).astype("<i2").tobytes())
    return buffer.getvalue()


def test_voiced_seconds_separates_speech_from_silence() -> None:
    assert main._voiced_seconds(np.zeros(SAMPLE_RATE * 3, dtype=np.float32), SAMPLE_RATE) == 0.0
    assert main._voiced_seconds(_tone(3.0), SAMPLE_RATE) > 1.5


def test_voice_endpoint_returns_model_emotions_for_a_wav_recording(stub_model) -> None:
    client = TestClient(main.app)
    response = client.post("/analyze-voice", files={"file": ("voice.wav", _wav_bytes(_tone()), "audio/wav")})
    assert response.status_code == 200, response.text
    body = response.json()
    assert tuple(body["emotion"]) == main.VOICE_EMOTION_LABELS
    assert body["emotion"]["sad"] > 0.9
    assert body["acoustic_signal"] == body["risk_signal"] and body["risk_signal"] > 0.9
    assert body["provider"] == main.VOICE_EMOTION_MODEL_ID
    assert body["has_speech"] is True


def test_voice_endpoint_reports_no_speech_for_a_silent_recording(stub_model) -> None:
    """Silence never reaches the model: it still returns confident-looking
    probabilities for an empty room, which would be a false reading."""
    client = TestClient(main.app)
    response = client.post("/analyze-voice", files={"file": ("silence.wav", _wav_bytes(np.zeros(SAMPLE_RATE * 2, dtype=np.float32)), "audio/wav")})
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["risk_signal"] is None
    assert body["emotion"] is None
    assert body["has_speech"] is False
    assert stub_model.calls == 0


def test_voice_endpoint_reads_words_only_when_the_model_is_unavailable() -> None:
    # conftest blanks VOICE_EMOTION_MODEL_PATH, so the model never loads.
    client = TestClient(main.app)
    response = client.post(
        "/analyze-voice",
        files={"file": ("voice.wav", _wav_bytes(_tone()), "audio/wav")},
        data={"transcript": "I feel hopeless and empty, nothing matters anymore"},
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["acoustic_signal"] is None and body["emotion"] is None
    assert body["risk_signal"] == body["content_signal"] and body["content_signal"] > 0.5


def test_voice_endpoint_trusts_a_supplied_transcript_over_a_false_acoustic_silence_reading(stub_model) -> None:
    """A caller that already knows real words were spoken (here, passed
    directly instead of making a second Whisper call) overrides a false
    acoustic "no speech" reading: has_speech becomes true, and - since tone
    can't be read from too-quiet audio - the content signal from the words
    carries the risk_signal on its own rather than leaving it null."""
    client = TestClient(main.app)
    response = client.post(
        "/analyze-voice",
        files={"file": ("quiet.wav", _wav_bytes(np.zeros(SAMPLE_RATE * 2, dtype=np.float32)), "audio/wav")},
        data={"transcript": "I feel hopeless and empty, nothing matters anymore"},
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["acoustic_signal"] is None  # still no reliable tone reading
    assert body["content_signal"] is not None and body["content_signal"] > 0.5
    assert body["risk_signal"] == body["content_signal"]  # words alone carry it
    assert body["has_speech"] is True
    assert body["voice_activity_checked_with_whisper"] is True


def test_voice_endpoint_blends_acoustic_tone_with_transcribed_words(stub_model) -> None:
    """A voice the model reads as sad, but whose transcribed words are clearly
    positive, scores lower than the tone alone - the words are allowed to pull
    a misleading tone reading back down, not just add on top of it. The bars
    themselves stay the model's own probabilities."""
    client = TestClient(main.app)
    acoustic_only = client.post("/analyze-voice", files={"file": ("voice.wav", _wav_bytes(_tone()), "audio/wav")}).json()
    blended = client.post(
        "/analyze-voice",
        files={"file": ("voice.wav", _wav_bytes(_tone()), "audio/wav")},
        data={"transcript": "Today was a great day, I felt calm and grateful and hopeful about everything"},
    ).json()
    assert blended["acoustic_signal"] == acoustic_only["risk_signal"]
    assert blended["content_signal"] is not None and blended["content_signal"] < 0.3
    assert blended["risk_signal"] < acoustic_only["risk_signal"]
    assert blended["sentiment"] == "positive"
    assert blended["emotion"] == acoustic_only["emotion"]


def test_voice_endpoint_never_softens_a_crisis_disclosure_in_the_words() -> None:
    """A calm-sounding (even silent) recording never suppresses a crisis
    statement in the transcribed words - same floor rule used for crisis
    detection everywhere else in the app."""
    client = TestClient(main.app)
    response = client.post(
        "/analyze-voice",
        files={"file": ("quiet.wav", _wav_bytes(np.zeros(SAMPLE_RATE * 2, dtype=np.float32)), "audio/wav")},
        data={"transcript": "I want to kill myself"},
    )
    body = response.json()
    assert body["crisis_language"] is True
    assert body["risk_signal"] >= 0.9


def test_label_confidence_to_emotion_probabilities_covers_every_label() -> None:
    for label in main.VOICE_EMOTION_LABELS:
        probabilities = main._label_confidence_to_emotion_probabilities(label, confidence=7)
        assert set(probabilities) == set(main.VOICE_EMOTION_LABELS)
        assert all(0.0 <= value <= 1.0 for value in probabilities.values())
        assert probabilities[label] == max(probabilities.values())
    low = main._label_confidence_to_emotion_probabilities("calm", confidence=0)
    high = main._label_confidence_to_emotion_probabilities("calm", confidence=10)
    assert high["calm"] > low["calm"]
    assert high["calm"] < 1.0  # never a hard 100% from a single judgment call


def test_qwen_voice_emotion_reply_pattern_parses_the_expected_format() -> None:
    match = main._QWEN_VOICE_EMOTION_REPLY_PATTERN.search("LABEL=happy CONFIDENCE=8")
    assert match and match.group(1) == "happy" and match.group(2) == "8"
    # Tolerates the model adding stray whitespace or casing without failing closed.
    match = main._QWEN_VOICE_EMOTION_REPLY_PATTERN.search("  label = Calm   confidence=3  ")
    assert match and match.group(1).lower() == "calm" and match.group(2) == "3"
    assert main._QWEN_VOICE_EMOTION_REPLY_PATTERN.search("I heard someone speaking calmly.") is None


def test_qwen_omni_voice_emotion_is_none_without_a_configured_key(monkeypatch) -> None:
    monkeypatch.delenv("DASHSCOPE_API_KEY", raising=False)
    result = asyncio.run(main._qwen_omni_voice_emotion(_tone(), SAMPLE_RATE))
    assert result is None


def test_qwen_omni_voice_emotion_fails_closed_on_an_unparseable_reply(monkeypatch) -> None:
    monkeypatch.setenv("DASHSCOPE_API_KEY", "test-key")

    class FakeResponse:
        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict:
            return {"choices": [{"message": {"content": "I'm not able to describe that."}}]}

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs) -> None:
            pass

        async def __aenter__(self) -> "FakeAsyncClient":
            return self

        async def __aexit__(self, *args) -> bool:
            return False

        async def post(self, *args, **kwargs) -> FakeResponse:
            return FakeResponse()

    monkeypatch.setattr(httpx, "AsyncClient", FakeAsyncClient)
    result = asyncio.run(main._qwen_omni_voice_emotion(_tone(), SAMPLE_RATE))
    assert result is None


def test_voice_endpoint_prefers_qwen_omni_over_the_local_model_when_configured(stub_model, monkeypatch) -> None:
    """The cascade's whole point: a configured, successfully-parsed hosted
    read must win over the always-available local model, the same way
    Claude/Qwen already take priority over the text heuristic."""
    monkeypatch.setenv("DASHSCOPE_API_KEY", "test-key")

    class FakeResponse:
        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict:
            return {"choices": [{"message": {"content": "LABEL=happy CONFIDENCE=9"}}]}

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs) -> None:
            pass

        async def __aenter__(self) -> "FakeAsyncClient":
            return self

        async def __aexit__(self, *args) -> bool:
            return False

        async def post(self, *args, **kwargs) -> FakeResponse:
            return FakeResponse()

    monkeypatch.setattr(httpx, "AsyncClient", FakeAsyncClient)
    client = TestClient(main.app)
    response = client.post("/analyze-voice", files={"file": ("voice.wav", _wav_bytes(_tone()), "audio/wav")})
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["provider"] == main.QWEN_VOICE_EMOTION_MODEL_ID
    assert body["emotion"]["happy"] == max(body["emotion"].values())
    # The local model still runs (so a fast fallback is ready if Qwen fails),
    # but Qwen's reading is what actually wins once it succeeds.
    assert stub_model.calls == 1
