from fastapi import FastAPI, HTTPException, Header, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

import os
from typing import Optional as Opt

from email_service import send_contact_notification, is_email_configured
from database import (
    save_contact_message,
    list_contact_messages,
    is_mongo_configured,
    save_resume,
    get_resume,
    get_resume_meta,
    delete_resume,
)

app = FastAPI(title="Portfolio API", version="1.0.0")

# Comma-separated list of allowed origins, e.g.
# "https://your-site.netlify.app,http://localhost:5173"
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

BASE_URL = os.getenv("BASE_URL")
app.mount("/data", StaticFiles(directory="data"), name="data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple shared-secret to protect the admin "view messages" endpoint.
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")


# ---------- Models ----------

class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    subject: str = Field(..., min_length=2, max_length=120)
    message: str = Field(..., min_length=5, max_length=2000)


class Skill(BaseModel):
    name: str
    level: int  # 0-100
    category: str


class Project(BaseModel):
    id: int
    title: str
    description: str
    tags: List[str]
    image: Optional[str] = None
    github: Optional[str] = None
    live: Optional[str] = None
    featured: bool = False


class Education(BaseModel):
    id: int
    degree: str
    institution: str
    duration: str
    cgpa: Optional[str] = None
    description: Optional[str] = None


class Experience(BaseModel):
    id: int
    role: str
    company: str
    duration: str
    description: List[str]


class Certification(BaseModel):
    id: int
    name: str
    issuer: str
    date: Optional[str] = None
    badge: str | None = None
    url: Optional[str] = None


# ---------- Portfolio data ----------

PROFILE = {
    "name": "Nikhil Kenjale",
    "role": "Software Engineer",
    "tagline": "Building scalable software, intelligent AI solutions, and modern web applications from backend to frontend.",
    "location": "Pune, India",
    "email": "nikhilkenjale1314@gmail.com",
    "github": "https://github.com/nikhilken14",
    "linkedin": "https://www.linkedin.com/in/nikhilkenjale1314a10/",
    "kaggle": "https://www.kaggle.com/kenjalenikhil14",
    "leetcode": "https://leetcode.com/u/nikhilkenjale/",
    "resume_url": "/static/resume.pdf",
    "about": (
        "Software Engineer with expertise in Java, Spring Boot, Python, and React. "
        "Passionate about building scalable REST APIs, backend systems, and AI-powered "
        "applications using clean architecture, modern development practices, and cloud "
        "technologies."
    ),
}

SKILLS: List[Skill] = [
    # Programming Languages
    Skill(name="Java", level=88, category="Programming"),
    Skill(name="Python", level=92, category="Programming"),
    Skill(name="SQL", level=88, category="Programming"),
    Skill(name="JavaScript", level=70, category="Programming"),
    Skill(name="Bash", level=75, category="Programming"),

    # Frontend
    Skill(name="React.js", level=90, category="Frontend"),
    Skill(name="HTML5", level=95, category="Frontend"),
    Skill(name="CSS3", level=92, category="Frontend"),
    Skill(name="Bootstrap", level=90, category="Frontend"),

    # Backend
    Skill(name="FastAPI", level=90, category="Backend"),
    Skill(name="Spring Boot", level=82, category="Backend"),
    Skill(name="Express.js", level=80, category="Backend"),
    Skill(name="Node.js", level=80, category="Backend"),

    # AI / Machine Learning
    Skill(name="Machine Learning", level=88, category="AI/ML"),
    Skill(name="Deep Learning", level=78, category="AI/ML"),
    Skill(name="PyTorch", level=78, category="AI/ML"),
    Skill(name="Retrieval-Augmented Generation (RAG)", level=82, category="AI/ML"),
    Skill(name="Large Language Models (LLMs)", level=80, category="AI/ML"),
    Skill(name="LangChain / LangGraph", level=75, category="AI/ML"),
    Skill(name="Hugging Face Transformers", level=74, category="AI/ML"),
    Skill(name="QLoRA / PEFT Fine-Tuning", level=70, category="AI/ML"),
    Skill(name="Computer Vision (CNNs, Transfer Learning)", level=72, category="AI/ML"),

    # Databases
    Skill(name="PostgreSQL", level=85, category="Database"),
    Skill(name="MySQL", level=86, category="Database"),
    Skill(name="MongoDB", level=80, category="Database"),
    Skill(name="Redis", level=65, category="Database"),
    Skill(name="ChromaDB (Vector DB)", level=72, category="Database"),

    # DevOps & Tools
    Skill(name="Git / GitHub", level=92, category="Tools"),
    Skill(name="Docker", level=75, category="Tools"),
    Skill(name="Linux", level=80, category="Tools"),
    Skill(name="Postman", level=85, category="Tools"),
    Skill(name="AWS / OCI", level=70, category="Tools"),
    Skill(name="Power BI", level=68, category="Tools"),
    Skill(name="Streamlit", level=75, category="Tools"),
]

PROJECTS: List[Project] = [
    Project(
        id=1,
        title="Supply Chain Order Assistant",
        description="Built a production-style AI assistant for supply-chain operations using a ReAct-style agent that answers questions from ingested PDFs via RAG (with page-level citations) and calls tools against live order/shipment/inventory data — one chat interface handling both unstructured and structured queries.",
        tags=["FastAPI", "React", "ReAct Agent", "RAG", "ChromaDB", "SQLite", "Qwen2.5"],
        github="https://github.com/nikhilken14/supply-chain-order-assistant",
        live="",
        featured=True,
    ),
    Project(
        id=2,
        title="SupplyChainGPT — Fine-Tuning Qwen2.5-1.5B",
        description="Fine-tuned Qwen2.5-1.5B-Instruct into a domain-specific supply-chain support assistant using QLoRA (4-bit NF4) with Unsloth and TRL's SFTTrainer, trained on a synthetic customer-support dataset for order tracking, refunds, and delivery updates — fully trainable on free GPU resources.",
        tags=["QLoRA", "PEFT", "Unsloth", "Hugging Face Transformers", "TRL", "PyTorch"],
        github="https://github.com/nikhilken14/QLoRA-FineTuning",
        live="",
        featured=True,
    ),
    Project(
        id=3,
        title="Math RAG Agent",
        description="A multimodal (text / PDF / image) math assistant combining OCR and PDF extraction with a formula-retrieval RAG pipeline over ChromaDB, wrapped in a LangChain tool agent with per-session conversation memory and a FastAPI backend plus optional Streamlit demo UI.",
        tags=["LangChain", "RAG", "ChromaDB", "FastAPI", "OCR", "Streamlit"],
        github="https://github.com/nikhilken14/math-agent",
        live="",
        featured=True,
    ),
    Project(
        id=4,
        title="Groq Multi-Agent Content System",
        description="A Researcher → Judge → Writer multi-agent pipeline built with LangGraph, where a Researcher gathers grounded findings via web search, a Judge returns a structured approve/revise verdict to drive a bounded revision loop, and a Writer compiles the approved research into a final Markdown article.",
        tags=["LangGraph", "LangChain", "Groq API", "Multi-Agent Systems", "Streamlit"],
        github="https://github.com/nikhilken14/Multi-Agent-Content-System",
        live="",
        featured=True,
    ),
    Project(
        id=5,
        title="US Fuel Price Forecasting",
        description="Forecasted US fuel prices from oil-market indicators using both a tuned Random Forest Regressor and a neural network implemented from scratch in NumPy, with autoregressive lag features, recursive 12-month forecasting, stability clipping, and a Power BI dashboard for the underlying dataset.",
        tags=["Python", "scikit-learn", "NumPy", "Power BI", "Time Series"],
        github="https://github.com/nikhilken14/fuel-price-forecasting",
        live="",
        featured=False,
    ),
    Project(
        id=6,
        title="Plant Disease Classification (AlexNet)",
        description="Trained an AlexNet-based transfer learning model in PyTorch on the PlantVillage dataset to classify plant leaf diseases across multiple categories, covering the full computer vision pipeline from preprocessing and augmentation through evaluation with confusion matrices and classification reports.",
        tags=["PyTorch", "AlexNet", "Transfer Learning", "Computer Vision", "Torchvision"],
        github="https://github.com/nikhilken14/alexnet-plant-disease-classification",
        live="",
        featured=False,
    ),
    Project(
        id=7,
        title="Rate-Limited Student Data Retrieval System",
        description="Built a Spring Boot RESTful service with token-bucket rate limiting, Caffeine caching, and PostgreSQL optimization to improve performance, reduce database load, and maintain high availability under heavy traffic.",
        tags=["Spring Boot", "Spring Data JPA", "PostgreSQL", "Caffeine", "REST API"],
        github="https://github.com/nikhilken14/Rate-Limiter",
        live="",
        featured=False,
    ),
    Project(
        id=8,
        title="Linux Infrastructure Monitoring & Alerting System",
        description="Developed a Bash-based Linux monitoring solution that tracks CPU, memory, disk usage, and system uptime with automated email alerts, incident reporting, logging, and Cron-based scheduled health checks.",
        tags=["Linux", "Bash", "Cron", "Gmail SMTP", "Mailutils", "msmtp"],
        github="https://github.com/nikhilken14/linux-server-monitoring-alert-system",
        live="",
        featured=False,
    ),
    Project(
        id=9,
        title="Car Rental System",
        description="Built a full-stack car rental platform with a React frontend, Spring Boot REST APIs, and PostgreSQL backend featuring vehicle management, bookings, and real-time availability updates.",
        tags=["React.js", "Spring Boot", "Spring Data JPA", "PostgreSQL", "REST API"],
        github="https://github.com/nikhilken14/Car-Rental-Application",
        live="",
        featured=False,
    ),
]

EDUCATION: List[Education] = [
    Education(
        id=1,
        degree="B.E in Computer Science",
        institution="Savitribai Phule Pune University",
        duration="2021 — 2025",
        cgpa="8.7",
        description="Focused on data structures, distributed systems, and web engineering. Graduated with distinction.",
    ),
    Education(
        id=2,
        degree="Higher Secondary (PCM)",
        institution="State Board",
        duration="2020 — 2021",
        cgpa="89%",
        description="Specialized in Physics, Chemistry, and Mathematics with early electives in Computer Science.",
    ),
]

EXPERIENCE: List[Experience] = [
    Experience(
        id=1,
        role="Apprentice",
        company="Tata Teleservices",
        duration="Sep 2025 — Apr 2026",
        description=[
            "Managed end-to-end resolution of network and media-service incidents while consistently meeting SLA targets.",
            "Diagnosed connectivity and switch-level issues using structured troubleshooting techniques, reducing recurring incidents.",
            "Monitored production systems, analyzed logs, and collaborated with cross-functional engineering teams to ensure service reliability.",
        ],
    ),
    Experience(
        id=2,
        role="Software Development Trainee",
        company="TNS India Foundation",
        duration="Feb 2025 — Apr 2025",
        description=[
            "Developed backend modules using Java, Spring Boot, and PostgreSQL following RESTful API and object-oriented design principles.",
            "Built and tested APIs from requirement gathering through implementation, debugging, and mentor-led code reviews.",
            "Worked in Agile sprints, participating in planning sessions, task management, and peer code reviews to improve software quality.",
        ],
    ),
]

CERTIFICATIONS: List[Certification] = [
    Certification(
        id=1,
        name="OCI Certified AI Foundation Associate",
        issuer="Oracle",
        date="October 16, 2025",
        badge=f"{BASE_URL}data/OCI25AICFA.jpeg",
        url="https://drive.google.com/file/d/19tX84gfZdH1JGMAxrHJOX5OWaC-mV-_m/view?usp=drive_link",
    ),
    Certification(
        id=2,
        name="OCI Certified Foundation Associate",
        issuer="Oracle",
        date="October 17, 2025",
        badge=f"{BASE_URL}data/OCI25FNDCFA.jpeg",
        url="https://drive.google.com/file/d/1lLcs7z0AEXljZTlGC67k6WN3PMQkasIh/view?usp=drive_link",
    ),
    Certification(
        id=3,
        name="Oracle Data Platform Certified Foundations Associate",
        issuer="Oracle",
        date="October 28, 2025",
        badge=f"{BASE_URL}data/OCI25DCFAV2.jpg",
        url="https://drive.google.com/file/d/11FjRWkUZM4imWs4LqEeEOx3MJbi1ZZCO/view?usp=drive_link",
    ),
    Certification(
        id=4,
        name="Oracle Agentic AI Certified Foundations Associate",
        issuer="Oracle",
        date="July 11, 2026",
        badge=f"{BASE_URL}data/AAI26OFA.jpg",
        url="https://drive.google.com/file/d/1kyMO0Aqy1nt5VRI88WiysAygHZ1eshU8/view?usp=drive_link",
    ),
    Certification(
        id=5,
        name="Microsoft Certified: Fabric Analytics Engineer Associate",
        issuer="Microsoft",
        date="July 30, 2026",
        badge=f"{BASE_URL}data/fabric.png",
        url = "https://drive.google.com/file/d/1Q_2a5fYVig2nuO0OUoD_a07eM3VSouJf/view?usp=drive_link",
    ),
]


# ---------- Routes ----------

@app.get("/")
def root():
    return {"status": "ok", "message": "Portfolio API is running"}


@app.get("/api/profile")
def get_profile():
    return PROFILE


@app.get("/api/skills", response_model=List[Skill])
def get_skills():
    return SKILLS


@app.get("/api/projects", response_model=List[Project])
def get_projects():
    return PROJECTS


@app.get("/api/education", response_model=List[Education])
def get_education():
    return EDUCATION


@app.get("/api/experience", response_model=List[Experience])
def get_experience():
    return EXPERIENCE


@app.get("/api/certifications", response_model=List[Certification])
def get_certifications():
    return CERTIFICATIONS


@app.post("/api/contact")
def post_contact(payload: ContactMessage):
    entry = payload.model_dump()
    save_contact_message(entry)

    # Best-effort email notification — a submission is still saved
    # even if email sending fails, so no message is ever silently lost.
    email_sent = False
    email_error = None
    if is_email_configured():
        try:
            send_contact_notification(
                name=payload.name,
                email=payload.email,
                subject=payload.subject,
                message=payload.message,
            )
            email_sent = True
        except Exception as exc:
            email_error = str(exc)
            print(f"[contact] Failed to send email notification: {exc}")

    return {
        "success": True,
        "message": "Thanks for reaching out — I'll reply soon.",
        "email_sent": email_sent,
        **({"email_error": email_error} if email_error else {}),
    }


@app.get("/api/admin/messages")
def get_messages(x_admin_token: Opt[str] = Header(default=None)):
    """
    Lightweight, token-protected endpoint to view submitted contact messages
    without needing direct DB access. Set ADMIN_TOKEN in the environment and
    pass it as the 'X-Admin-Token' header to use this.
    """
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=404, detail="Not found")
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing admin token")
    return list_contact_messages()


def _require_admin(x_admin_token: Opt[str]) -> None:
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=404, detail="Not found")
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing admin token")


@app.get("/api/resume/status")
def resume_status():
    """
    Public, non-sensitive check for whether a resume is currently available,
    so the frontend can show/hide the Download Resume button accordingly.
    """
    meta = get_resume_meta()
    if not meta:
        return {"available": False}
    return {"available": True, "filename": meta.get("filename"), "uploaded_at": meta.get("uploaded_at")}


@app.get("/api/resume")
def download_resume():
    """Public endpoint — streams the current resume file for download."""
    resume = get_resume()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume has been uploaded yet")

    return Response(
        content=resume["content"],
        media_type=resume["content_type"] or "application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{resume["filename"]}"'},
    )


@app.post("/api/admin/resume")
async def upload_resume(
    file: UploadFile = File(...),
    x_admin_token: Opt[str] = Header(default=None),
):
    """
    Token-protected resume upload. Replaces any existing resume — there is
    always at most one resume file stored at a time.
    """
    _require_admin(x_admin_token)

    if file.content_type not in ("application/pdf",):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()
    max_size = 10 * 1024 * 1024  # 10MB safety cap
    if len(content) > max_size:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    save_resume(content=content, filename=file.filename, content_type=file.content_type)
    return {"success": True, "filename": file.filename}


@app.delete("/api/admin/resume")
def remove_resume(x_admin_token: Opt[str] = Header(default=None)):
    """Token-protected resume removal."""
    _require_admin(x_admin_token)
    deleted = delete_resume()
    return {"success": True, "deleted": deleted}


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "mongo_configured": is_mongo_configured(),
        "email_configured": is_email_configured(),
    }