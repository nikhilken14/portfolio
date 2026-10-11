"""MongoDB storage for contact messages and the single current resume."""
from datetime import datetime, timezone

import config

RESUME_DOC_ID = "current_resume"  # one fixed doc: a new upload replaces it

_db = None


def is_mongo_configured() -> bool:
    return bool(config.MONGODB_URI)


def _get_db():
    global _db
    if _db is None:
        from pymongo import MongoClient

        _db = MongoClient(config.MONGODB_URI, serverSelectionTimeoutMS=5000)[config.MONGODB_DB_NAME]
    return _db


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def save_contact_message(entry: dict, email_sent: bool = False) -> None:
    _get_db()["contact_messages"].insert_one(
        {**entry, "received_at": _now(), "email_sent": email_sent}
    )


def list_contact_messages(limit: int = 100) -> list:
    docs = list(_get_db()["contact_messages"].find().sort("received_at", -1).limit(limit))
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs


def save_resume(content: bytes, filename: str, content_type: str) -> None:
    from bson.binary import Binary

    _get_db()["resume_file"].replace_one(
        {"_id": RESUME_DOC_ID},
        {
            "_id": RESUME_DOC_ID,
            "filename": filename,
            "content_type": content_type,
            "content": Binary(content),
            "uploaded_at": _now(),
        },
        upsert=True,
    )


def get_resume() -> dict | None:
    doc = _get_db()["resume_file"].find_one({"_id": RESUME_DOC_ID})
    if not doc:
        return None
    return {
        "filename": doc["filename"],
        "content_type": doc["content_type"],
        "content": bytes(doc["content"]),
    }


def get_resume_meta() -> dict | None:
    doc = _get_db()["resume_file"].find_one({"_id": RESUME_DOC_ID}, {"content": 0})
    if not doc:
        return None
    return {"filename": doc["filename"], "uploaded_at": doc.get("uploaded_at")}


def delete_resume() -> bool:
    return _get_db()["resume_file"].delete_one({"_id": RESUME_DOC_ID}).deleted_count > 0
