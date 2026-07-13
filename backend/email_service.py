import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")          # the account that SENDS the email
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")  # Gmail App Password, not your login password
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", SMTP_USER)  # the inbox that RECEIVES it

# This exact string is what your Gmail filter will match on.
SUBJECT_TAG = "[Portfolio Contact]"


def is_email_configured() -> bool:
    return bool(SMTP_USER and SMTP_PASSWORD and NOTIFY_EMAIL)


def send_contact_notification(name: str, email: str, subject: str, message: str) -> None:
    """
    Sends a notification email to NOTIFY_EMAIL about a new contact form
    submission. Raises an exception on failure so the caller can decide
    whether to treat it as fatal or just log it.
    """
    if not is_email_configured():
        raise RuntimeError(
            "Email is not configured. Set SMTP_USER, SMTP_PASSWORD, and NOTIFY_EMAIL "
            "as environment variables (see backend/.env.example)."
        )

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = NOTIFY_EMAIL
    msg["Reply-To"] = email  # so you can hit "reply" and it goes straight to them
    msg["Subject"] = f"{SUBJECT_TAG} {subject}"

    # Custom header as a second, more precise filter target if you ever
    # want to filter on headers instead of subject text.
    msg["X-Portfolio-Contact"] = "true"

    body = (
        f"New message from your portfolio site:\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message}\n"
    )
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, NOTIFY_EMAIL, msg.as_string())