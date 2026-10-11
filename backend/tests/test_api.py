import pytest
import time, uuid, base64, hashlib
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives import serialization
from fastapi.testclient import TestClient
import config, database, gmail_service as gmail, main

client = TestClient(main.app)
PRIVATE = Ed25519PrivateKey.generate()
PUBLIC_B64 = base64.b64encode(PRIVATE.public_key().public_bytes(serialization.Encoding.Raw, serialization.PublicFormat.Raw)).decode()

def signed(method, path, body=b"", nonce=None, ts=None):
    ts = str(ts or int(time.time()))
    nonce = nonce or str(uuid.uuid4())
    msg = "\n".join((method,path,ts,nonce,hashlib.sha256(body).hexdigest())).encode()
    return {"X-Admin-Timestamp":ts,"X-Admin-Nonce":nonce,"X-Admin-Signature":base64.b64encode(PRIVATE.sign(msg)).decode()}
GOOD = {"name": "Ann", "email": "ann@example.com", "subject": "Hello", "message": "Nice portfolio!"}


@pytest.fixture(autouse=True)
def reset(monkeypatch):
    main.contact_limiter.hits.clear()
    monkeypatch.setattr(config, "MONGODB_URI", None)
    monkeypatch.setattr(gmail, "is_email_configured", lambda: True)
    monkeypatch.setattr(config, "ADMIN_PUBLIC_KEY_B64", PUBLIC_B64)
    main._nonce_seen.clear()
    main.admin_limiter.hits.clear()


def test_contact_success_when_email_sent(monkeypatch):
    sent = []
    monkeypatch.setattr(gmail, "send_contact_notification", lambda **k: sent.append(k))
    r = client.post("/api/contact", json=GOOD)
    assert r.status_code == 200 and r.json()["email_sent"] is True and sent


def test_contact_fails_loudly_when_nothing_delivered(monkeypatch):
    def boom(**k): raise gmail.EmailError("down")
    monkeypatch.setattr(gmail, "send_contact_notification", boom)
    r = client.post("/api/contact", json=GOOD)
    assert r.status_code == 502 and "down" not in r.text  # no internal detail leaked


def test_contact_saved_even_if_email_fails(monkeypatch):
    saved = []
    def boom(**k): raise gmail.EmailError("down")
    monkeypatch.setattr(gmail, "send_contact_notification", boom)
    monkeypatch.setattr(config, "MONGODB_URI", "mongodb://x")
    monkeypatch.setattr(database, "save_contact_message", lambda e, email_sent=False: saved.append(e))
    r = client.post("/api/contact", json=GOOD)
    assert r.status_code == 200 and r.json()["email_sent"] is False and saved


def test_honeypot_skips_sending(monkeypatch):
    monkeypatch.setattr(gmail, "send_contact_notification", lambda **k: pytest.fail("sent"))
    assert client.post("/api/contact", json={**GOOD, "website": "spam.com"}).json()["success"]


def test_rate_limit(monkeypatch):
    monkeypatch.setattr(gmail, "send_contact_notification", lambda **k: None)
    codes = [client.post("/api/contact", json=GOOD).status_code for _ in range(config.CONTACT_LIMIT + 1)]
    assert codes[-1] == 429 and codes[0] == 200


def test_validation():
    assert client.post("/api/contact", json={**GOOD, "email": "nope"}).status_code == 422


def test_public_cors_preflight():
    r = client.options("/api/contact", headers={
        "Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"})
    assert r.status_code == 200


def test_admin_auth():
    assert client.get("/api/admin/messages").status_code == 401
    assert client.get("/api/admin/messages", headers={"X-Admin-Token": "secret"}).status_code == 401
    assert client.get("/api/admin/messages", headers=signed("GET", "/api/admin/messages")).status_code == 200


def test_replay_rejected():
    headers=signed("GET", "/api/admin/messages")
    assert client.get("/api/admin/messages",headers=headers).status_code == 200
    assert client.get("/api/admin/messages",headers=headers).status_code == 401


def test_expired_signature_rejected():
    h=signed("GET", "/api/admin/messages",ts=int(time.time())-360)
    assert client.get("/api/admin/messages",headers=h).status_code == 401


def test_wrong_path_rejected():
    h=signed("GET", "/api/admin/messages")
    assert client.delete("/api/admin/resume",headers=h).status_code == 401


def test_resume_upload_rejects_fake_pdf(monkeypatch):
    monkeypatch.setattr(config, "MONGODB_URI", "mongodb://x")
    # Signed multipart needs byte-identical request body.
    from requests import Request as R
    req=R('POST','http://testserver/api/admin/resume',files={'file':('a.pdf',b'not a pdf','application/pdf')}).prepare()
    r=client.post('/api/admin/resume',content=req.body,headers={**signed('POST','/api/admin/resume',req.body),'Content-Type':req.headers['Content-Type']})
    assert r.status_code == 400


def test_resume_status_without_mongo():
    assert client.get("/api/resume/status").json() == {"available": False}
    assert client.get("/api/resume").status_code == 404


def test_origin_trailing_slash_normalised():
    assert config._origins("https://a.app/, http://b.dev") == ["https://a.app", "http://b.dev"]
