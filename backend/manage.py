"""Operator commands that must never be reachable over HTTP.

Admin access is granted here, against the database, rather than through an
ADMIN_EMAILS-style env var matched at register/login time: emails aren't
verified, so matching on email alone let anyone who registered an admin's
address first become an admin.

Usage (from the repo root, with the same DATABASE_URL the API uses):
    python backend/manage.py promote someone@example.com
    python backend/manage.py demote someone@example.com
"""

import sys

from database import SessionLocal, init_db
from models import User


def set_admin(email: str, is_admin: bool) -> bool:
    """Sets is_admin for an existing account. Returns False if no account
    has that email - the person has to register (and pick their own
    password) first."""
    init_db()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email.strip().lower()).first()
        if not user:
            return False
        user.is_admin = is_admin
        db.commit()
        return True
    finally:
        db.close()


def main(argv: list[str]) -> int:
    if len(argv) != 3 or argv[1] not in {"promote", "demote"}:
        print(__doc__)
        return 2
    command, email = argv[1], argv[2]
    if not set_admin(email, command == "promote"):
        print(f"No account found for {email}. They need to register first.")
        return 1
    print(f"{email} is {'now' if command == 'promote' else 'no longer'} an admin.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
