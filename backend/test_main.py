import numpy as np
from fastapi.testclient import TestClient

from main import analyze_voice_signal, app, VOICE_SAMPLE_RATE


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["service"] == "mindhx"


def test_text_analysis_flags_crisis_language() -> None:
    response = client.post("/analyze-text", json={"text": "I want to kill myself", "language": "en"})
    assert response.status_code == 200
    assert response.json()["crisis_language"] is True


def test_phq9_item_nine_short_circuits() -> None:
    response = client.post("/score-phq9", json={"answers": [0, 0, 0, 0, 0, 0, 0, 0, 1]})
    body = response.json()
    assert response.status_code == 200
    assert body["item_9_crisis"] is True
    assert body["routing_decision"] == "refer_immediately"


def test_risk_assessment_returns_referral_for_elevated_phq() -> None:
    response = client.post("/risk-assess", json={"phq9_answers": [2, 2, 2, 2, 2, 2, 2, 2, 0]})
    body = response.json()
    assert response.status_code == 200
    assert body["crisis_flag"] is False
    assert body["routing_decision"] == "refer"


def test_voice_signal_flags_flat_pattern_for_monotone_paused_audio() -> None:
    duration_seconds = 4
    t = np.arange(0, duration_seconds, 1 / VOICE_SAMPLE_RATE)
    tone = 0.3 * np.sin(2 * np.pi * 150 * t)
    tone[(t % 1.0) > 0.4] = 0.0  # simulate long pauses between words
    result = analyze_voice_signal(tone.astype(np.float32), word_count=10)
    assert "reduced_pitch_variability" in result["vocal_flags"]
    assert "high_pause_ratio" in result["vocal_flags"]
    assert result["vocal_pattern"] == "flat_or_subdued"


def test_voice_signal_reports_typical_pattern_for_varied_pitch() -> None:
    duration_seconds = 4
    t = np.arange(0, duration_seconds, 1 / VOICE_SAMPLE_RATE)
    sweep = 0.3 * np.sin(2 * np.pi * (100 + 80 * (t / t[-1])) * t)
    result = analyze_voice_signal(sweep.astype(np.float32), word_count=40)
    assert result["vocal_flags"] == []
    assert result["vocal_pattern"] == "typical_variation"


def test_analyze_voice_clinical_provider_requires_configuration(monkeypatch) -> None:
    monkeypatch.setenv("VOICE_BIOMARKER_PROVIDER", "clinical_api")
    monkeypatch.delenv("VOICE_BIOMARKER_API_URL", raising=False)
    monkeypatch.delenv("VOICE_BIOMARKER_API_KEY", raising=False)
    response = client.post(
        "/analyze-voice",
        files={"file": ("clip.webm", b"\x00" * 10, "audio/webm")},
        data={"transcript": "hello"},
    )
    assert response.status_code == 503


def test_risk_assessment_folds_in_voice_flags() -> None:
    response = client.post("/risk-assess", json={
        "phq9_answers": [1, 1, 1, 1, 1, 1, 1, 1, 0],
        "voice_analysis": {"vocal_flags": ["reduced_pitch_variability", "high_pause_ratio"], "vocal_pattern": "flat_or_subdued"},
    })
    body = response.json()
    assert response.status_code == 200
    assert "reduced pitch variability" in body["explanation"][-1]
    assert body["risk_score"] > round(8 / 27 * 0.75, 2)