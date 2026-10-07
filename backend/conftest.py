"""Pytest bootstrap: points the test run at a throwaway SQLite file so the
suite is idempotent - previously it wrote straight into backend/mindhx.db,
the same file local dev uses, so a second run (or a rerun without deleting
that file) failed on stale rows (duplicate emails, etc.) even though nothing
was actually broken. This module is imported by pytest before any test
module, so setting DATABASE_URL here is picked up by database.py's
module-level os.getenv read.
"""

import atexit
import os
import tempfile

_db_fd, _db_path = tempfile.mkstemp(prefix="mindhx-test-", suffix=".db")
os.close(_db_fd)
os.environ["DATABASE_URL"] = f"sqlite:///{_db_path}"
# Every TestClient request comes from the same address, so the per-IP
# limits would trip across unrelated tests. The rate-limit test turns the
# limiter back on for itself.
os.environ["RATE_LIMITS"] = "off"
# Most tests save several check-ins for one account back to back; the
# cooldown test turns the 7-day limit back on for itself.
os.environ["CHECKIN_COOLDOWN_DAYS"] = "0"
# Blank (not unset) so the backend/.env loader can't fill in real keys -
# tests must never make paid API calls. Tests that need a provider set a
# fake key and mock the client themselves.
os.environ["ANTHROPIC_API_KEY"] = ""
os.environ["OPENAI_API_KEY"] = ""


@atexit.register
def _cleanup_test_db() -> None:
    try:
        os.remove(_db_path)
    except OSError:
        pass
