"""Loads local settings from a gitignored .env file (backend/.env, then the
repo-root .env), so local development picks up OPENAI_API_KEY and friends
without exporting them in every terminal. Real environment variables always
win, and when neither file exists (e.g. in the Docker image) this does
nothing. Import it before anything that reads os.environ at import time."""

from pathlib import Path

from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parent
for _env_file in (_BACKEND_DIR / ".env", _BACKEND_DIR.parent / ".env"):
    load_dotenv(_env_file, override=False)
