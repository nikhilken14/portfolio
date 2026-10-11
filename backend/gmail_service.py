"""
Send contact notifications through the Gmail API (HTTPS, port 443).

Render's free tier blocks outbound SMTP (25/465/587), so smtplib cannot work
there. The Gmail API uses plain HTTPS with an OAuth2 refresh token instead.
"""
import base64
import html
import logging
import threading
import time
from email.message import EmailMessage

import httpx

import config

log = logging.getLogger("gmail")

TOKEN_URL = "https://oauth2.googleapis.com/token"
SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
SUBJECT_TAG = "[Portfolio Contact]"  # stable string for a Gmail filter
TIMEOUT = httpx.Timeout(10.0)


class EmailError(Exception):
    """Raised with a message that is safe to log (never contains secrets)."""


_lock = threading.Lock()
_token: dict = {"value": None, "expires_at": 0.0}


def is_email_configured() -> bool:
    return all(
        [
            config.GMAIL_CLIENT_ID,
            config.GMAIL_CLIENT_SECRET,
            config.GMAIL_REFRESH_TOKEN,
            config.GMAIL_SENDER,
            config.NOTIFY_EMAIL,
        ]
    )


def _clean_header(value: str, limit: int = 200) -> str:
    """Strip control characters so user input can never inject headers."""
    return "".join(ch for ch in value if ch.isprintable())[:limit].strip()


def _access_token(client: httpx.Client, force: bool = False) -> str:
    with _lock:
        if not force and _token["value"] and time.time() < _token["expires_at"] - 60:
            return _token["value"]
        try:
            resp = client.post(
                TOKEN_URL,
                data={
                    "client_id": config.GMAIL_CLIENT_ID,
                    "client_secret": config.GMAIL_CLIENT_SECRET,
                    "refresh_token": config.GMAIL_REFRESH_TOKEN,
                    "grant_type": "refresh_token",
                },
            )
        except httpx.HTTPError as exc:
            raise EmailError(f"Could not reach Google OAuth: {type(exc).__name__}") from exc

        if resp.status_code != 200:
            err = ""
            try:
                err = resp.json().get("error", "")
            except ValueError:
                pass
            if err == "invalid_grant":
                raise EmailError(
                    "Gmail refresh token is expired or revoked. Re-run "
                    "scripts/get_gmail_refresh_token.py and update GMAIL_REFRESH_TOKEN."
                )
            raise EmailError(f"Google OAuth refused the request ({resp.status_code} {err})")

        data = resp.json()
        _token["value"] = data["access_token"]
        _token["expires_at"] = time.time() + int(data.get("expires_in", 3600))
        return _token["value"]


def build_message(name: str, email: str, subject: str, message: str) -> EmailMessage:
    name_c, subject_c, email_c = _clean_header(name), _clean_header(subject), _clean_header(email)
    msg = EmailMessage()
    msg["From"] = config.GMAIL_SENDER
    msg["To"] = config.NOTIFY_EMAIL
    msg["Reply-To"] = f"{name_c} <{email_c}>" if name_c else email_c
    msg["Subject"] = f"{SUBJECT_TAG} {subject_c}"
    msg["X-Portfolio-Contact"] = "true"

    msg.set_content(
        f"New message from your portfolio site\n\n"
        f"Name: {name_c}\nEmail: {email_c}\nSubject: {subject_c}\n\n{message}\n"
    )
    msg.add_alternative(
        "<div style=\"font-family:system-ui,sans-serif;font-size:15px;line-height:1.55\">"
        f"<p><b>{html.escape(name_c)}</b> &lt;{html.escape(email_c)}&gt;</p>"
        f"<p><b>Subject:</b> {html.escape(subject_c)}</p>"
        f"<blockquote style=\"margin:0;padding-left:12px;border-left:3px solid #ccc;"
        f"white-space:pre-wrap\">{html.escape(message)}</blockquote>"
        "<p style=\"color:#777;font-size:12px\">Hit reply to answer the sender directly.</p></div>",
        subtype="html",
    )
    return msg


def _send_raw(client: httpx.Client, raw: str) -> None:
    token = _access_token(client)
    for attempt in range(3):
        try:
            resp = client.post(
                SEND_URL, headers={"Authorization": f"Bearer {token}"}, json={"raw": raw}
            )
        except httpx.HTTPError as exc:
            if attempt == 2:
                raise EmailError(f"Could not reach Gmail API: {type(exc).__name__}") from exc
            time.sleep(0.5 * (attempt + 1))
            continue

        if resp.status_code == 200:
            return
        if resp.status_code == 401 and attempt == 0:
            token = _access_token(client, force=True)  # cached token went stale
            continue
        if resp.status_code in (429, 500, 502, 503, 504) and attempt < 2:
            time.sleep(0.5 * (attempt + 1))
            continue
        raise EmailError(f"Gmail API error {resp.status_code}: {resp.text[:200]}")
    raise EmailError("Gmail API did not accept the message")


def send_contact_notification(
    name: str, email: str, subject: str, message: str, *, client: httpx.Client | None = None
) -> None:
    if not is_email_configured():
        raise EmailError("Gmail API is not configured (see backend/.env.example).")
    msg = build_message(name, email, subject, message)
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    if client is not None:
        _send_raw(client, raw)
    else:
        with httpx.Client(timeout=TIMEOUT) as c:
            _send_raw(c, raw)
