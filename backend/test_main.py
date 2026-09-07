import numpy as np
from fastapi.testclient import TestClient

from database import init_db
from main import _prosodic_features, _prosodic_risk_signal, app

init_db()
client = TestClient(app)


def test_register_login_and_read_me() -> None:
    register_response = client.post("/auth/register", json={"email": "patient@example.com", "password": "correct-horse-battery"})
    assert register_response.status_code == 201
    assert "access_token" in register_response.json()

    duplicate_response = client.post("/auth/register", json={"email": "patient@example.com", "password": "another-password"})
    assert duplicate_response.status_code == 409

    login_response = client.post("/auth/login", json={"email": "patient@example.com", "password": "correct-horse-battery"})
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    wrong_password_response = client.post("/auth/login", json={"email": "patient@example.com", "password": "wrong"})
    assert wrong_password_response.status_code == 401

    me_response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "patient@example.com"

    unauthenticated_response = client.get("/auth/me")
    assert unauthenticated_response.status_code == 401


def test_checkins_require_auth_and_round_trip() -> None:
    unauthenticated_response = client.post("/checkins", json={"risk_score": 0.5, "band": "watch", "routing_decision": "no_referral_needed"})
    assert unauthenticated_response.status_code == 401

    register_response = client.post("/auth/register", json={"email": "history-user@example.com", "password": "correct-horse-battery"})
    token = register_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/checkins",
        json={"risk_score": 0.42, "band": "watch", "routing_decision": "no_referral_needed", "themes": ["anxiety", "hardship"]},
        headers=headers,
    )
    assert create_response.status_code == 201
    assert create_response.json()["themes"] == ["anxiety", "hardship"]

    list_response = client.get("/checkins", headers=headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["band"] == "watch"


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["service"] == "mindhx"


def test_profile_session_is_ephemeral() -> None:
    response = client.post("/session/start", json={"profile": {"age_range": "25-34", "marital_status": "single", "life_context": "working"}})
    body = response.json()
    assert response.status_code == 200
    assert body["session_token"]
    assert "does not persist" in body["privacy"]


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
    assert set(body["components"]) == {"phq9", "gad7", "k10", "text", "voice", "combined_signal", "attribution"}
    assert body["components"]["attribution"]["method"] == "additive_signal_attribution"
    assert {item["name"] for item in body["components"]["attribution"]["contributions"]} == {"phq9", "gad7", "k10", "text"}


def test_gad7_and_k10_scores_route_to_structured_referral() -> None:
    response = client.post(
        "/risk-assess",
        json={
            "phq9_answers": [0] * 9,
            "gad7_answers": [2] * 7,
            "k10_answers": [3] * 10,
            "profile": {"age_range": "25-34", "preferred_language": "ur"},
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert body["gad7"]["severity_band"] == "moderate"
    assert body["k10"]["severity_band"] == "severe"
    assert body["support_plan"]["route"] == "psychiatric_referral"
    assert body["support_plan"]["meditation"] == []


def test_prosodic_risk_signal_higher_for_flat_paused_audio() -> None:
    """Operates on already-decoded PCM arrays, so it exercises the heuristic math without
    needing PyAV (which requires a native ffmpeg build) to be installed."""
    sample_rate = 16000
    duration = 2
    t = np.linspace(0, duration, sample_rate * duration, endpoint=False)

    mostly_silent = np.zeros_like(t)
    mostly_silent[: sample_rate // 4] = 0.05 * np.sin(2 * np.pi * 200 * t[: sample_rate // 4])
    mostly_silent[-sample_rate // 4:] = 0.05 * np.sin(2 * np.pi * 200 * t[-sample_rate // 4:])

    continuous_varied = (0.3 + 0.2 * np.sin(2 * np.pi * 3 * t)) * np.sin(2 * np.pi * 220 * t)

    quiet_features = _prosodic_features(mostly_silent.astype(np.float32), sample_rate)
    active_features = _prosodic_features(continuous_varied.astype(np.float32), sample_rate)

    assert quiet_features["pause_ratio"] > active_features["pause_ratio"]
    assert _prosodic_risk_signal(quiet_features) > _prosodic_risk_signal(active_features)


def test_themes_detect_trauma_and_frustration_from_raw_text() -> None:
    response = client.post(
        "/risk-assess",
        json={
            "phq9_answers": [0] * 9,
            "gad7_answers": [0] * 7,
            "k10_answers": [1] * 10,
            "typed_text": "I keep having flashbacks and I am so frustrated with everything",
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert "trauma" in body["themes"]
    assert "frustration" in body["themes"]
    assert body["support_plan"]["meditation"]
    assert body["support_plan"]["strategies"]


def test_crisis_route_excludes_non_urgent_support() -> None:
    response = client.post(
        "/risk-assess",
        json={"phq9_answers": [0, 0, 0, 0, 0, 0, 0, 0, 1]},
    )
    body = response.json()
    assert body["support_plan"]["route"] == "crisis"
    assert body["support_plan"]["meditation"] == []
    assert "religious_support" not in body["support_plan"]


def test_ai_chat_retrieves_grounded_support() -> None:
    response = client.post("/ai/chat", json={"message": "I am feeling anxious and worried", "risk_clear": True})
    body = response.json()
    assert response.status_code == 200
    assert body["status"] == "grounded_support"
    assert body["sources"]
    assert body["generation"]["diagnosis"] is False


def test_ai_chat_responds_in_urdu_when_requested() -> None:
    response = client.post("/ai/chat", json={"message": "I am feeling anxious and worried", "language": "ur", "risk_clear": True})
    body = response.json()
    assert response.status_code == 200
    assert body["status"] == "grounded_support"
    assert all(ord(character) > 127 for character in body["sources"][0]["title"] if character.isalpha())


def test_ai_chat_escalates_crisis_before_retrieval() -> None:
    response = client.post("/ai/chat", json={"message": "I want to kill myself", "risk_clear": True})
    assert response.status_code == 200
    assert response.json()["status"] == "escalate"