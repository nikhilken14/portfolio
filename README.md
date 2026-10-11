# Portfolio: React + FastAPI

- `frontend/` Vite + React, deployed to Netlify. All page content lives in `src/data/portfolio.js`.
- `backend/` FastAPI on Render. It only handles the contact form, the resume PDF and the admin endpoints.

## Local development

```bash
# backend
cd backend && python -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env        # fill in values
uvicorn main:app --reload   # http://localhost:8000
pytest                      # 16 tests, no network needed

# frontend
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## Sending email from Render's free tier (Gmail API)

Render's free tier blocks outbound SMTP (ports 25, 465, 587), so the contact form uses the
Gmail API over HTTPS instead.

1. Google Cloud Console: create a project and enable the **Gmail API**.
2. **OAuth consent screen**: set Publishing status to **In production**. In "Testing" mode
   refresh tokens expire after 7 days and email would silently stop. (You will see an
   "unverified app" warning once when authorising your own account; that is expected.)
3. **Credentials**: create an OAuth client ID of type **Desktop app**.
4. Run `GMAIL_CLIENT_ID=... GMAIL_CLIENT_SECRET=... python backend/scripts/get_gmail_refresh_token.py`
   and sign in with the Gmail account that should send the mail.
5. Put `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_SENDER` and
   `NOTIFY_EMAIL` into Render's environment. Remove the old `SMTP_*` variables.
6. Verify: `curl -X POST https://<api>/api/admin/test-email -H "X-Admin-Token: <token>"`.

## Deploy checklist

- Netlify: set `VITE_API_URL` to the Render URL (no trailing slash).
- Render: set `ALLOWED_ORIGINS` to the Netlify URL, plus `MONGODB_URI` and `ADMIN_TOKEN`.
- Messages are stored in MongoDB (if configured) and emailed. A submission is only reported as
  successful if at least one of those worked.
- Upload your resume at `/admin.html` (needs `ADMIN_TOKEN`); the Download button appears automatically.

## Security: rotate your credentials

The uploaded zip contained real `.env` files. If they were ever committed or shared, rotate the
Gmail app password, the MongoDB user password and `ADMIN_TOKEN`. `.gitignore` now excludes `.env`.


**Local admin authentication update:** See `LOCAL_ADMIN_MIGRATION.md` and `local-admin/README.md`. Any older `ADMIN_TOKEN`/public `admin.html` instructions above are superseded by the Ed25519 local-only admin implementation.
