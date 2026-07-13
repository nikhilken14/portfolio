import os
import json
from datetime import datetime, timezone
from bson.binary import Binary

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "portfolio")

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
JSON_FALLBACK_FILE = os.path.join(DATA_DIR, "messages.json")
RESUME_FALLBACK_FILE = os.path.join(DATA_DIR, "resume.bin")
RESUME_META_FILE = os.path.join(DATA_DIR, "resume_meta.json")

# A single fixed document holds "the current resume" — uploading a new one
# overwrites it, so there's never more than one at a time.
RESUME_DOC_ID = "current_resume"

_client = None
_collection = None
_resume_collection = None


def _get_client():
    global _client
    if _client is None:
        from pymongo import MongoClient

        _client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    return _client


def _get_collection():
    """Lazily creates a single shared MongoDB client/collection for messages."""
    global _collection
    if _collection is not None:
        return _collection
    db = _get_client()[MONGODB_DB_NAME]
    _collection = db["contact_messages"]
    return _collection


def _get_resume_collection():
    global _resume_collection
    if _resume_collection is not None:
        return _resume_collection
    db = _get_client()[MONGODB_DB_NAME]
    _resume_collection = db["resume_file"]
    return _resume_collection


def is_mongo_configured() -> bool:
    return bool(MONGODB_URI)


def save_contact_message(entry: dict) -> None:
    """Persists a contact form submission to MongoDB, or a local JSON file as a fallback."""
    entry = {**entry, "received_at": datetime.now(timezone.utc).isoformat()}

    if is_mongo_configured():
        collection = _get_collection()
        collection.insert_one(entry)
        return

    # Local JSON fallback (dev only — not durable on Render's free tier)
    os.makedirs(DATA_DIR, exist_ok=True)
    try:
        with open(JSON_FALLBACK_FILE, "r") as f:
            messages = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        messages = []

    messages.append(entry)
    with open(JSON_FALLBACK_FILE, "w") as f:
        json.dump(messages, f, indent=2, default=str)


def list_contact_messages(limit: int = 100) -> list:
    """Returns the most recent contact messages (used by an optional admin endpoint)."""
    if is_mongo_configured():
        collection = _get_collection()
        docs = list(collection.find().sort("received_at", -1).limit(limit))
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    try:
        with open(JSON_FALLBACK_FILE, "r") as f:
            messages = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        messages = []
    return list(reversed(messages))[:limit]


# ---------- Resume file storage ----------

def save_resume(content: bytes, filename: str, content_type: str) -> None:
    """Stores (or replaces) the single current resume file."""
    if is_mongo_configured():
        collection = _get_resume_collection()
        collection.replace_one(
            {"_id": RESUME_DOC_ID},
            {
                "_id": RESUME_DOC_ID,
                "filename": filename,
                "content_type": content_type,
                "content": Binary(content),
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
            },
            upsert=True,
        )
        return

    os.makedirs(DATA_DIR, exist_ok=True)
    with open(RESUME_FALLBACK_FILE, "wb") as f:
        f.write(content)
    with open(RESUME_META_FILE, "w") as f:
        json.dump(
            {
                "filename": filename,
                "content_type": content_type,
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
            },
            f,
        )


def get_resume() -> dict | None:
    """Returns {filename, content_type, content} for the current resume, or None."""
    if is_mongo_configured():
        collection = _get_resume_collection()
        doc = collection.find_one({"_id": RESUME_DOC_ID})
        if not doc:
            return None
        return {
            "filename": doc["filename"],
            "content_type": doc["content_type"],
            "content": bytes(doc["content"]),
        }

    if not os.path.exists(RESUME_FALLBACK_FILE) or not os.path.exists(RESUME_META_FILE):
        return None
    with open(RESUME_META_FILE, "r") as f:
        meta = json.load(f)
    with open(RESUME_FALLBACK_FILE, "rb") as f:
        content = f.read()
    return {"filename": meta["filename"], "content_type": meta["content_type"], "content": content}


def get_resume_meta() -> dict | None:
    """Returns just {filename, uploaded_at} without loading the file bytes — used for status checks."""
    if is_mongo_configured():
        collection = _get_resume_collection()
        doc = collection.find_one({"_id": RESUME_DOC_ID}, {"content": 0})
        if not doc:
            return None
        return {"filename": doc["filename"], "uploaded_at": doc.get("uploaded_at")}

    if not os.path.exists(RESUME_META_FILE):
        return None
    with open(RESUME_META_FILE, "r") as f:
        return json.load(f)


def delete_resume() -> bool:
    """Deletes the current resume, if any. Returns True if something was actually removed."""
    if is_mongo_configured():
        collection = _get_resume_collection()
        result = collection.delete_one({"_id": RESUME_DOC_ID})
        return result.deleted_count > 0

    existed = os.path.exists(RESUME_FALLBACK_FILE)
    for path in (RESUME_FALLBACK_FILE, RESUME_META_FILE):
        if os.path.exists(path):
            os.remove(path)
    return existed