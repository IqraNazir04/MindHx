"""In-memory, per-client sliding-window rate limits.

Guards the endpoints that either cost money per call (OpenAI, Uplift) or
are worth brute-forcing (login, password reset), none of which otherwise
need an account. State lives in this process only - fine for the current
single-backend-process deploy (see start.sh); a multi-instance deploy would
need a shared store such as Redis instead.

The client is identified by the first X-Forwarded-For hop when present
(the browser's address, as set by the Railway edge and passed on by the
Next.js /api proxy), falling back to the socket peer. That header can be
spoofed by a client talking to the backend directly, which is why the
backend only listens on localhost in the combined deploy.

Set RATE_LIMITS=off to disable (the test suite does, except where a test
turns it back on to exercise it).
"""

import os
import threading
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request


class RateLimiter:
    def __init__(self) -> None:
        self.enabled = os.getenv("RATE_LIMITS", "on").lower() not in {"off", "0", "false"}
        self._hits: dict[tuple, deque] = defaultdict(deque)
        self._lock = threading.Lock()

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()

    def check(self, key: tuple, limit: int, window_seconds: int) -> None:
        if not self.enabled:
            return
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and hits[0] <= now - window_seconds:
                hits.popleft()
            if len(hits) >= limit:
                retry_after = int(hits[0] + window_seconds - now) + 1
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please wait a little and try again.",
                    headers={"Retry-After": str(retry_after)},
                )
            hits.append(now)


limiter = RateLimiter()


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(name: str, limit: int, window_seconds: int):
    """A FastAPI dependency: `Depends(rate_limit("login", 10, 300))`."""

    def dependency(request: Request) -> None:
        limiter.check((name, client_ip(request)), limit, window_seconds)

    return dependency
