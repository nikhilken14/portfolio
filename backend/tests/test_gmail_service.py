import base64, email, httpx, pytest
import config, gmail_service as g


@pytest.fixture(autouse=True)
def configured(monkeypatch):
    for k, v in dict(GMAIL_CLIENT_ID="id", GMAIL_CLIENT_SECRET="sec", GMAIL_REFRESH_TOKEN="rt",
                     GMAIL_SENDER="me@gmail.com", NOTIFY_EMAIL="me@gmail.com").items():
        monkeypatch.setattr(config, k, v)
    g._token.update(value=None, expires_at=0.0)


def mock_client(handler):
    return httpx.Client(transport=httpx.MockTransport(handler))


def test_sends_via_https_and_caches_token():
    calls = []

    def handler(req):
        calls.append(str(req.url))
        if "oauth2" in str(req.url):
            return httpx.Response(200, json={"access_token": "AT", "expires_in": 3600})
        assert req.headers["authorization"] == "Bearer AT"
        return httpx.Response(200, json={"id": "1"})

    with mock_client(handler) as c:
        g.send_contact_notification("Ann", "ann@x.com", "Hi", "hello world", client=c)
        g.send_contact_notification("Ann", "ann@x.com", "Hi", "again", client=c)
    assert sum("oauth2" in u for u in calls) == 1  # token reused


def test_reply_to_and_html_escaping():
    msg = g.build_message("Ann", "ann@x.com", "Hi\r\nBcc: evil@x.com", "<script>x</script>")
    assert msg["Reply-To"] == "Ann <ann@x.com>"
    assert "Bcc" not in msg
    body = msg.get_body(("html",)).get_content()
    assert "<script>" not in body and "&lt;script&gt;" in body
    parsed = email.message_from_bytes(msg.as_bytes())
    assert parsed["Subject"].startswith("[Portfolio Contact]")


def test_refreshes_stale_token_on_401():
    state = {"n": 0}

    def handler(req):
        if "oauth2" in str(req.url):
            state["n"] += 1
            return httpx.Response(200, json={"access_token": f"AT{state['n']}", "expires_in": 3600})
        return httpx.Response(401) if req.headers["authorization"] == "Bearer AT1" else httpx.Response(200, json={})

    with mock_client(handler) as c:
        g.send_contact_notification("Ann", "ann@x.com", "Hi", "hello world", client=c)
    assert state["n"] == 2


def test_revoked_token_gives_actionable_error():
    with mock_client(lambda r: httpx.Response(400, json={"error": "invalid_grant"})) as c:
        with pytest.raises(g.EmailError, match="Re-run"):
            g.send_contact_notification("Ann", "ann@x.com", "Hi", "hello world", client=c)


def test_unconfigured_raises(monkeypatch):
    monkeypatch.setattr(config, "GMAIL_REFRESH_TOKEN", None)
    with pytest.raises(g.EmailError):
        g.send_contact_notification("A", "a@x.com", "Hi", "hello")
