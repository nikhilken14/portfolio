"""Central, typed access to environment configuration."""
import os

from dotenv import load_dotenv

load_dotenv()


def _origins(raw: str) -> list[str]:
    # Browsers send Origin without a trailing slash; a pasted "https://x.app/"
    # would otherwise silently break CORS.
    return [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]


ALLOWED_ORIGINS = _origins(os.getenv("ALLOWED_ORIGINS", "http://localhost:5173"))
ADMIN_PUBLIC_KEY_B64 = os.getenv("ADMIN_PUBLIC_KEY_B64") or None

MONGODB_URI = os.getenv("MONGODB_URI") or None
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "portfolio")

GMAIL_CLIENT_ID = os.getenv("GMAIL_CLIENT_ID")
GMAIL_CLIENT_SECRET = os.getenv("GMAIL_CLIENT_SECRET")
GMAIL_REFRESH_TOKEN = os.getenv("GMAIL_REFRESH_TOKEN")
GMAIL_SENDER = os.getenv("GMAIL_SENDER")
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL") or GMAIL_SENDER

# Contact form abuse limits (per client IP, in-memory; fine for one instance).
CONTACT_LIMIT = int(os.getenv("CONTACT_LIMIT", "5"))
CONTACT_WINDOW_SECONDS = int(os.getenv("CONTACT_WINDOW_SECONDS", "3600"))
