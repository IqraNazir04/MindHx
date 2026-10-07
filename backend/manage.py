"""Operator commands that must never be reachable over HTTP.

Admin access is granted here, against the database, rather than through an
ADMIN_EMAILS-style env var matched at register/login time: emails aren't
verified, so matching on email alone let anyone who registered an admin's
address first become an admin.

Usage (from the repo root, with the same DATABASE_URL the API uses):
    python backend/manage.py promote someone@example.com
    python backend/manage.py demote someone@example.com
    python backend/manage.py create-admin          # prompts for email and password
"""

import getpass
import sys

from auth import hash_password, password_weakness
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


def create_admin(email: str, password: str) -> None:
    """Creates an admin account with the given email and password, or - if the
    email already exists - sets its password and makes it an admin. Run from the
    terminal only, so the password never goes through HTTP or the chat."""
    init_db()
    db = SessionLocal()
    try:
        normalized = email.strip().lower()
        user = db.query(User).filter(User.email == normalized).first()
        if user:
            user.hashed_password = hash_password(password)
            user.is_admin = True
        else:
            user = User(email=normalized, hashed_password=hash_password(password), is_admin=True)
            db.add(user)
        db.commit()
    finally:
        db.close()


def run_create_admin() -> int:
    email = input("Admin email: ").strip()
    if "@" not in email:
        print("That doesn't look like an email address.")
        return 1
    password = getpass.getpass("Admin password (min 8 characters): ")
    if len(password) < 8 or len(password) > 72:
        print("Password must be between 8 and 72 characters.")
        return 1
    weakness = password_weakness(password)
    if weakness:
        print(weakness)
        return 1
    if password != getpass.getpass("Repeat password: "):
        print("Passwords don't match.")
        return 1
    create_admin(email, password)
    print(f"Admin account ready for {email.lower()}. Sign in at /admin/login.")
    return 0


def main(argv: list[str]) -> int:
    if len(argv) == 2 and argv[1] == "create-admin":
        return run_create_admin()
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
