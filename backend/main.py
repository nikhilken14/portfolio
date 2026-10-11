import logging
import re
import hashlib
import base64
import uuid
import threading
import time
from collections import defaultdict, deque
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from cryptography.exceptions import InvalidSignature

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, EmailStr, Field

import config
import database as db
import gmail_service as gmail

log = logging.getLogger("portfolio")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Portfolio API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=False,
    # Only public browser requests need CORS; local admin uses server-to-server HTTPS.
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# ---------- helpers ----------

class RateLimiter:
    """Sliding-window limiter keyed by client IP (single-instance, in-memory)."""

    def __init__(self, limit: int, window: int):
        self.limit, self.window = limit, window
        self.hits: dict[str, deque] = defaultdict(deque)
        self.lock = threading.Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self.lock:
            q = self.hits[key]
            while q and now - q[0] > self.window:
                q.popleft()
            if len(q) >= self.limit:
                return False
            q.append(now)
            return True


contact_limiter = RateLimiter(config.CONTACT_LIMIT, config.CONTACT_WINDOW_SECONDS)


def client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    return fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else "?")


# Replay cache: sufficient for a single Render worker; use shared Redis storage if
# operating multiple workers/instances (otherwise replay rejection is per worker).
_nonce_seen: dict[str, float] = {}
_nonce_lock = threading.Lock()
admin_limiter = RateLimiter(60, 60)


def _public_key():
    raw = config.ADMIN_PUBLIC_KEY_B64
    if not raw:
        raise HTTPException(404, "Not found")
    try:
        key = base64.b64decode(raw, validate=True)
        if len(key) != 32:
            raise ValueError("Invalid public key length")
        return Ed25519PublicKey.from_public_bytes(key)
    except (ValueError, TypeError):
        log.error("ADMIN_PUBLIC_KEY_B64 invalid")
        raise HTTPException(503, "Admin authentication is not configured")


async def require_admin(request: Request):
    """Verify an Ed25519 signature covering verb, path, timestamp, nonce and bytes."""
    key = _public_key()
    if not admin_limiter.allow(client_ip(request)):
        raise HTTPException(429, "Rate limit exceeded")
    timestamp = request.headers.get("X-Admin-Timestamp", "")
    nonce = request.headers.get("X-Admin-Nonce", "")
    sig_b64 = request.headers.get("X-Admin-Signature", "")
    try:
        ts = int(timestamp)
        if abs(int(time.time()) - ts) > 90:
            raise ValueError("expired")
        if len(nonce) != 36 or str(uuid.UUID(nonce)) != nonce:
            raise ValueError("invalid nonce")
        signature = base64.b64decode(sig_b64, validate=True)
        if len(signature) != 64:
            raise ValueError("invalid signature length")
    except (ValueError, TypeError):
        raise HTTPException(401, "Invalid signed request")
    content = await request.body()
    # Query parameters are disallowed to avoid ambiguous canonicalization.
    if request.url.query:
        raise HTTPException(400, "Admin query parameters not supported")
    canonical = "\n".join([request.method.upper(), request.url.path, timestamp, nonce, hashlib.sha256(content).hexdigest()]).encode()
    try:
        key.verify(signature, canonical)
    except InvalidSignature:
        raise HTTPException(401, "Invalid signed request")
    with _nonce_lock:
        now = time.monotonic()
        for n, expiry in list(_nonce_seen.items()):
            if expiry <= now:
                del _nonce_seen[n]
        if nonce in _nonce_seen:
            raise HTTPException(401, "Request replay detected")
        _nonce_seen[nonce] = now + 180



@app.middleware("http")
async def admin_signature_guard(request: Request, call_next):
    if request.url.path.startswith("/api/admin/"):
        try:
            await require_admin(request)
        except HTTPException as exc:
            return Response(content='{"detail":"'+str(exc.detail)+'"}', status_code=exc.status_code, media_type="application/json")
    return await call_next(request)


# ---------- models ----------

class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    subject: str = Field(..., min_length=2, max_length=120)
    message: str = Field(..., min_length=5, max_length=2000)
    website: str = Field("", max_length=200)  # honeypot: humans never fill this


# ---------- routes ----------

@app.get("/")
def root():
    return {"status": "ok", "message": "Portfolio API is running"}


@app.get("/healthcheck")
def healthcheck():
    return {"status": "UP"}


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "mongo_configured": db.is_mongo_configured(),
        "email_configured": gmail.is_email_configured(),
    }


@app.post("/api/contact")
def post_contact(payload: ContactMessage, request: Request):
    if payload.website:  # bot: pretend success, do nothing
        return {"success": True, "email_sent": False}

    if not contact_limiter.allow(client_ip(request)):
        raise HTTPException(429, "Too many messages. Please try again later or email me directly.")

    data = payload.model_dump(exclude={"website"})

    email_sent = False
    if gmail.is_email_configured():
        try:
            gmail.send_contact_notification(**data)
            email_sent = True
        except gmail.EmailError as exc:
            log.error("Contact email failed: %s", exc)

    stored = False
    if db.is_mongo_configured():
        try:
            db.save_contact_message(data, email_sent=email_sent)
            stored = True
        except Exception:
            log.exception("Could not store contact message")

    # Never report success unless the message landed somewhere durable.
    if not (email_sent or stored):
        raise HTTPException(502, "Could not deliver your message. Please email me directly.")

    return {"success": True, "email_sent": email_sent, "stored": stored}


@app.get("/api/resume/status")
def resume_status():
    if not db.is_mongo_configured():
        return {"available": False}
    meta = db.get_resume_meta()
    if not meta:
        return {"available": False}
    return {"available": True, **meta}


@app.get("/api/resume")
def download_resume():
    resume = db.get_resume() if db.is_mongo_configured() else None
    if not resume:
        raise HTTPException(404, "No resume has been uploaded yet")
    safe = re.sub(r"[^A-Za-z0-9._ -]", "_", resume["filename"] or "resume.pdf")
    return Response(
        content=resume["content"],
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe}"',
            "Cache-Control": "public, max-age=300",
        },
    )


@app.get("/api/admin/messages")
def admin_messages():
    if not db.is_mongo_configured():
        return []
    return db.list_contact_messages()


@app.post("/api/admin/resume")
async def admin_upload_resume(
    file: UploadFile = File(...)
):
    if not db.is_mongo_configured():
        raise HTTPException(503, "MongoDB is not configured")
    content = await file.read(4 * 1024 * 1024 + 1)
    if len(content) > 4 * 1024 * 1024:
        raise HTTPException(413, "File too large (max 4MB)")
    if not content.startswith(b"%PDF-") or b"%%EOF" not in content[-2048:]:
        raise HTTPException(400, "Only PDF files are accepted")
    name = re.sub(r"[^A-Za-z0-9._ -]", "_", (file.filename or "resume.pdf"))[:120]
    if not name.lower().endswith(".pdf"):
        raise HTTPException(400, "Filename must end in .pdf")
    db.save_resume(content=content, filename=name, content_type="application/pdf")
    return {"success": True, "filename": name}


@app.delete("/api/admin/resume")
def admin_delete_resume():
    if not db.is_mongo_configured():
        raise HTTPException(503, "MongoDB is not configured")
    return {"success": True, "deleted": db.delete_resume()}


@app.post("/api/admin/test-email")
def admin_test_email():
    """Sends a test notification so Gmail API setup can be verified after deploy."""
    try:
        gmail.send_contact_notification(
            "Setup check", "noreply@example.com", "Gmail API test", "If you can read this, it works."
        )
    except gmail.EmailError as exc:
        log.warning("Admin Gmail test failed: %s", exc)
        raise HTTPException(502, "Email delivery failed; inspect Render logs")
    return {"success": True}
