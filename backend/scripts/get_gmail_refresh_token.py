"""
One-time helper: obtain a Gmail API refresh token for the account that will SEND
contact notifications.

Prereqs (Google Cloud Console):
  1. Create a project, enable the "Gmail API".
  2. OAuth consent screen: set Publishing status to "In production"
     (in "Testing", refresh tokens expire after 7 days).
  3. Credentials -> Create OAuth client ID -> type "Desktop app".
     Copy the client ID and secret.

Run:   GMAIL_CLIENT_ID=... GMAIL_CLIENT_SECRET=... python scripts/get_gmail_refresh_token.py
Then put the printed values in your Render environment variables.
"""
import http.server
import os
import sys
import threading
import urllib.parse
import webbrowser

import httpx

CLIENT_ID = os.environ.get("GMAIL_CLIENT_ID")
CLIENT_SECRET = os.environ.get("GMAIL_CLIENT_SECRET")
PORT = 8765
REDIRECT = f"http://localhost:{PORT}/"
SCOPE = "https://www.googleapis.com/auth/gmail.send"


def auth_url() -> str:
    q = urllib.parse.urlencode(
        {
            "client_id": CLIENT_ID,
            "redirect_uri": REDIRECT,
            "response_type": "code",
            "scope": SCOPE,
            "access_type": "offline",
            "prompt": "consent",  # forces Google to return a refresh token
        }
    )
    return f"https://accounts.google.com/o/oauth2/v2/auth?{q}"


def main() -> int:
    if not (CLIENT_ID and CLIENT_SECRET):
        print("Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET first.")
        return 1
    result: dict = {}
    done = threading.Event()

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            result["code"] = params.get("code", [None])[0]
            result["error"] = params.get("error", [None])[0]
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"Done. You can close this tab and return to the terminal.")
            done.set()

        def log_message(self, *_):
            pass

    server = http.server.HTTPServer(("localhost", PORT), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = auth_url()
    print("Opening browser. If it does not open, visit:\n", url)
    webbrowser.open(url)
    done.wait(300)
    server.shutdown()

    if not result.get("code"):
        print("Authorisation failed:", result.get("error") or "timed out")
        return 1
    resp = httpx.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": result["code"],
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT,
            "grant_type": "authorization_code",
        },
        timeout=15,
    )
    data = resp.json()
    if "refresh_token" not in data:
        print("No refresh token returned:", data)
        return 1
    print("\nAdd these to Render (Environment):\n")
    print(f"GMAIL_CLIENT_ID={CLIENT_ID}")
    print(f"GMAIL_CLIENT_SECRET={CLIENT_SECRET}")
    print(f"GMAIL_REFRESH_TOKEN={data['refresh_token']}")
    print("GMAIL_SENDER=<the Gmail address you just signed in with>")
    return 0


if __name__ == "__main__":
    sys.exit(main())
