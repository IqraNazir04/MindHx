"""Password hashing and JWT session tokens for the optional account feature.

JWT_SECRET_KEY must be set explicitly in any real deployment. If it's
unset, we generate a random one for this process only - tokens issued
before a restart become invalid, which is a safe failure mode (nobody
stays "logged in" on a secret nobody chose), unlike silently shipping a
fixed default secret that would let anyone forge tokens.
"""

import hashlib
import os
import secrets
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from database import get_db
from models import LoginSession, User
from ratelimit import client_ip

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    JWT_SECRET_KEY = secrets.token_urlsafe(32)
    print("WARNING: JWT_SECRET_KEY is not set - using a random per-process secret. "
          "Set JWT_SECRET_KEY in the environment for any real deployment; otherwise "
          "every restart invalidates all issued tokens.")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
PASSWORD_RESET_EXPIRE_MINUTES = int(os.getenv("PASSWORD_RESET_EXPIRE_MINUTES", "30"))
# Login history older than this is deleted the next time that user signs in.
LOGIN_HISTORY_RETENTION_DAYS = int(os.getenv("LOGIN_HISTORY_RETENTION_DAYS", "90"))
# last_seen_at is refreshed at most this often, so an active session costs
# one extra write every few minutes rather than one per request.
LAST_SEEN_UPDATE_INTERVAL = timedelta(minutes=5)

bearer_scheme = HTTPBearer(auto_error=False)


# bcrypt only looks at the first 72 *bytes* of a password, and bcrypt 5.x
# raises ValueError past that instead of silently truncating. Request
# models cap passwords at 72 characters, but one Urdu letter is 2 bytes in
# UTF-8 (an emoji is 4), so a character limit alone isn't enough.
BCRYPT_MAX_PASSWORD_BYTES = 72


def password_too_long(password: str) -> bool:
    return len(password.encode("utf-8")) > BCRYPT_MAX_PASSWORD_BYTES


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if password_too_long(plain_password):
        return False  # Could never have been set, and bcrypt would raise.
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user: User, session: LoginSession) -> str:
    payload = {"sub": user.id, "sid": session.id, "ver": user.token_version or 0, "exp": session.expires_at}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def start_login_session(db: Session, user: User, request: Request, method: str) -> str:
    """Records a sign-in in the user's login history and returns an access
    token tied to it. Also prunes that user's history past the retention
    window, so it doesn't grow forever."""
    now = datetime.now(timezone.utc)
    db.query(LoginSession).filter(
        LoginSession.user_id == user.id,
        LoginSession.created_at < now - timedelta(days=LOGIN_HISTORY_RETENTION_DAYS),
    ).delete(synchronize_session=False)
    session = LoginSession(
        user_id=user.id,
        method=method,
        ip_address=client_ip(request)[:64],
        user_agent=(request.headers.get("user-agent") or "")[:300] or None,
        created_at=now,
        last_seen_at=now,
        expires_at=now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return create_access_token(user, session)


def end_login_sessions(db: Session, user_id: str, reason: str, keep_session_id: Optional[str] = None) -> int:
    """Ends every still-open session for a user (except keep_session_id).
    Doesn't commit - callers commit alongside their own change."""
    query = db.query(LoginSession).filter(LoginSession.user_id == user_id, LoginSession.ended_at.is_(None))
    if keep_session_id:
        query = query.filter(LoginSession.id != keep_session_id)
    return query.update({"ended_at": datetime.now(timezone.utc), "end_reason": reason}, synchronize_session=False)


@dataclass
class AuthContext:
    user: User
    # None only for tokens issued before login sessions existed; those stay
    # valid until they expire (at most JWT_EXPIRE_MINUTES after deploy).
    session: Optional[LoginSession]


def _auth_from_token(token: str, db: Session) -> Optional[AuthContext]:
    """The user and login session a token belongs to, or None if the token
    is invalid or expired, its session was signed out, or it was issued
    before the user's last password change (see User.token_version)."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except PyJWTError:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    user = db.get(User, user_id)
    if not user or payload.get("ver", 0) != (user.token_version or 0):
        return None

    session = None
    session_id = payload.get("sid")
    if session_id:
        session = db.get(LoginSession, session_id)
        if not session or session.user_id != user.id or session.ended_at is not None:
            return None
        now = datetime.now(timezone.utc)
        if now - as_aware_utc(session.last_seen_at) >= LAST_SEEN_UPDATE_INTERVAL:
            session.last_seen_at = now
            db.commit()
    return AuthContext(user=user, session=session)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    if not credentials:
        raise unauthorized
    auth = _auth_from_token(credentials.credentials, db)
    if not auth:
        raise unauthorized
    return auth.user


def get_current_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> AuthContext:
    """Like get_current_user, but also returns the login session the
    request's token belongs to - for the session/login-history endpoints."""
    auth = _auth_from_token(credentials.credentials, db) if credentials else None
    if not auth:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    return auth


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Like get_current_user, but also requires is_admin - for /admin/*
    endpoints. 403, not 404, is deliberate: this only gates *access* to
    admin actions, not the existence of anything sensitive."""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


def generate_reset_token() -> str:
    """The raw, high-entropy token put in the emailed reset link. Only its
    hash (see hash_reset_token) is ever stored, so a leaked database can't
    be used to forge password resets."""
    return secrets.token_urlsafe(32)


def hash_reset_token(token: str) -> str:
    # A fast hash is fine here (unlike bcrypt for passwords): the token
    # itself already has 256 bits of entropy, so it isn't brute-forceable
    # the way a human-chosen password is.
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def as_aware_utc(value: datetime) -> datetime:
    """SQLite (local dev) hands back naive datetimes for DateTime(timezone=True)
    columns; Postgres (production) hands back timezone-aware ones. Normalize
    to aware-UTC before comparing so expiry checks work on both."""
    return value if value.tzinfo is not None else value.replace(tzinfo=timezone.utc)


def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Like get_current_user, but returns None instead of raising 401 - for
    endpoints (like /ai/chat) that must work for anonymous callers too, while
    still personalizing when a valid token is present."""
    if not credentials:
        return None
    auth = _auth_from_token(credentials.credentials, db)
    return auth.user if auth else None
