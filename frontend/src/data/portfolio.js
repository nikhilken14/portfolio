// Single source of truth for page content. Bundled with the site, so every
// section renders instantly even when the API (Render free tier) is asleep.

export const PROFILE = {
  name: "Nikhil Kenjale",
  role: "Software Engineer",
  location: "Pune, India",
  email: "nikhilkenjale1314@gmail.com",
  github: "https://github.com/nikhilken14",
  linkedin: "https://www.linkedin.com/in/nikhilkenjale1314a10/",
  kaggle: "https://www.kaggle.com/kenjalenikhil14",
  leetcode: "https://leetcode.com/u/nikhilkenjale/",
  headline: "I build backend systems and AI applications, from the database to the interface.",
  about:
    "Computer Engineering graduate with hands-on experience in Java, Spring Boot, Python, React and AI/ML. I like building full-stack applications, scalable REST APIs and AI-powered tools with clean architecture, careful problem-solving and modern cloud practices.",
};

export const FACTS = [
  { label: "Based in", value: PROFILE.location },
  { label: "Focus", value: "Backend, generative AI and DevOps" },
  { label: "Practice", value: "400+ coding problems solved" },
];

export const SKILL_GROUPS = [
  { category: "Languages", items: ["Java", "Python", "SQL", "Bash"] },
  { category: "Frontend", items: ["React.js", "HTML5", "CSS3", "Bootstrap"] },
  { category: "Backend", items: ["FastAPI", "Spring Boot", "Node.js"] },
  {
    category: "AI and ML",
    items: ["Machine Learning", "Deep Learning", "PyTorch", "Computer Vision (CNNs, Transfer Learning)"],
  },
  {
    category: "Generative AI",
    items: [
      "Retrieval-Augmented Generation (RAG)",
      "Large Language Models (LLMs)",
      "LangChain / LangGraph",
      "Hugging Face Transformers",
      "QLoRA / PEFT Fine-Tuning",
    ],
  },
  { category: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { category: "Tools and cloud", items: ["Git / GitHub", "Docker", "Linux", "Postman", "AWS / OCI", "Power BI"] },
];

export const PROJECTS = [
  {
    id: 1,
    kind: "AI agent",
    title: "Supply Chain Order Assistant",
    summary: "ReAct agent that answers from PDFs and live order data in one chat.",
    description:
      "A production-style AI assistant for supply-chain operations. A ReAct-style agent answers questions from ingested PDFs via RAG with page-level citations, and calls tools against live order, shipment and inventory data, so one chat interface handles both unstructured and structured queries.",
    tags: ["FastAPI", "React", "ReAct Agent", "RAG", "ChromaDB", "SQLite", "Qwen2.5"],
    github: "https://github.com/nikhilken14/supply-chain-order-assistant",
    featured: true,
  },
  {
    id: 2,
    kind: "Fine-tuning",
    title: "SupplyChainGPT: fine-tuning Qwen2.5-1.5B",
    summary: "QLoRA fine-tune for order tracking, refunds and delivery support.",
    description:
      "Fine-tuned Qwen2.5-1.5B-Instruct into a domain-specific supply-chain support assistant using QLoRA (4-bit NF4) with Unsloth and TRL's SFTTrainer. Trained on a synthetic customer-support dataset covering order tracking, refunds and delivery updates, and fully trainable on free GPU resources.",
    tags: ["QLoRA", "PEFT", "Unsloth", "Hugging Face Transformers", "TRL", "PyTorch"],
    github: "https://github.com/nikhilken14/QLoRA-FineTuning",
    featured: true,
  },
  {
    id: 3,
    kind: "RAG",
    title: "Math RAG Agent",
    summary: "Multimodal math assistant over text, PDF and image input.",
    description:
      "A multimodal (text, PDF, image) math assistant that combines OCR and PDF extraction with a formula-retrieval RAG pipeline over ChromaDB. It is wrapped in a LangChain tool agent with per-session conversation memory, a FastAPI backend and an optional Streamlit demo UI.",
    tags: ["LangChain", "RAG", "ChromaDB", "FastAPI", "OCR", "Streamlit"],
    github: "https://github.com/nikhilken14/math-agent",
    featured: true,
  },
  {
    id: 4,
    kind: "Multi-agent",
    title: "Groq Multi-Agent Content System",
    summary: "Researcher, Judge and Writer agents with a bounded revision loop.",
    description:
      "A Researcher, Judge, Writer pipeline built with LangGraph. The Researcher gathers grounded findings via web search, the Judge returns a structured approve-or-revise verdict that drives a bounded revision loop, and the Writer compiles the approved research into a final Markdown article.",
    tags: ["LangGraph", "LangChain", "Groq API", "Multi-Agent Systems", "Streamlit"],
    github: "https://github.com/nikhilken14/Multi-Agent-Content-System",
    featured: true,
  },
  {
    id: 5,
    kind: "Forecasting",
    title: "US Fuel Price Forecasting",
    summary: "Random Forest and a from-scratch NumPy network, 12-month forecasts.",
    description:
      "Forecasts US fuel prices from oil-market indicators using a tuned Random Forest and a neural network written from scratch in NumPy, with autoregressive lag features, recursive 12-month forecasting, stability clipping and a Power BI dashboard.",
    tags: ["Python", "scikit-learn", "NumPy", "Power BI", "Time Series"],
    github: "https://github.com/nikhilken14/fuel-price-forecasting",
  },
  {
    id: 6,
    kind: "Computer vision",
    title: "Plant Disease Classification (AlexNet)",
    summary: "Transfer learning on PlantVillage with full evaluation reports.",
    description:
      "AlexNet-based transfer learning in PyTorch on the PlantVillage dataset to classify leaf diseases, covering preprocessing, augmentation and evaluation with confusion matrices and classification reports.",
    tags: ["PyTorch", "AlexNet", "Transfer Learning", "Computer Vision", "Torchvision"],
    github: "https://github.com/nikhilken14/alexnet-plant-disease-classification",
  },
  {
    id: 7,
    kind: "Backend",
    title: "Rate-Limited Student Data Retrieval System",
    summary: "Spring Boot API with token-bucket rate limiting and Caffeine caching.",
    description:
      "A Spring Boot REST service with token-bucket rate limiting, Caffeine caching and PostgreSQL optimisation to improve performance, reduce database load and stay available under heavy traffic.",
    tags: ["Spring Boot", "Spring Data JPA", "PostgreSQL", "Caffeine", "REST API"],
    github: "https://github.com/nikhilken14/Rate-Limiter",
  },
  {
    id: 8,
    kind: "DevOps",
    title: "Linux Infrastructure Monitoring and Alerting",
    summary: "Bash monitor for CPU, memory, disk and uptime with email alerts.",
    description:
      "A Bash-based Linux monitoring solution that tracks CPU, memory, disk usage and uptime, with automated email alerts, incident reporting, logging and Cron-scheduled health checks.",
    tags: ["Linux", "Bash", "Cron", "Gmail SMTP", "Mailutils", "msmtp"],
    github: "https://github.com/nikhilken14/linux-server-monitoring-alert-system",
  },
  {
    id: 9,
    kind: "Full-stack",
    title: "Car Rental System",
    summary: "React, Spring Boot and PostgreSQL with live availability.",
    description:
      "A full-stack car rental platform with a React frontend, Spring Boot REST APIs and a PostgreSQL backend, featuring vehicle management, bookings and real-time availability updates.",
    tags: ["React.js", "Spring Boot", "Spring Data JPA", "PostgreSQL", "REST API"],
    github: "https://github.com/nikhilken14/Car-Rental-Application",
  },
];

export const EXPERIENCE = [
  {
    id: 1,
    role: "Apprentice",
    company: "Tata Teleservices",
    duration: "Sep 2025 to Apr 2026",
    points: [
      "Managed end-to-end resolution of network and media-service incidents while consistently meeting SLA targets.",
      "Diagnosed connectivity and switch-level issues using structured troubleshooting, reducing recurring incidents.",
      "Monitored production systems, analysed logs and worked with cross-functional engineering teams to keep services reliable.",
    ],
  },
  {
    id: 2,
    role: "AI Intern",
    company: "TechSaksham",
    duration: "Mar 2025 to Apr 2025",
    points: [
      "Preprocessed data, engineered features and ran exploratory analysis on real-world healthcare datasets to support disease prediction.",
      "Built and evaluated Logistic Regression, SVM and Random Forest models using accuracy, precision, recall and F1-score.",
      "Compared model performance and presented findings to identify the most effective solution for the dataset.",
    ],
  },
];

export const EDUCATION = [
  {
    id: 1,
    degree: "B.E. in Computer Science",
    institution: "Savitribai Phule Pune University",
    duration: "2021 to 2025",
    score: "CGPA 8.7",
    note: "Focused on data structures, distributed systems and web engineering. Graduated with distinction.",
  },
  {
    id: 2,
    degree: "Higher Secondary (PCM)",
    institution: "State Board",
    duration: "2020 to 2021",
    score: "89%",
    note: "Physics, Chemistry and Mathematics, with early electives in Computer Science.",
  },
];

export const CERTIFICATIONS = [
  {
    id: 1,
    name: "OCI Certified AI Foundation Associate",
    issuer: "Oracle",
    date: "October 16, 2025",

    url: "https://drive.google.com/file/d/19tX84gfZdH1JGMAxrHJOX5OWaC-mV-_m/view?usp=drive_link",
  },
  {
    id: 2,
    name: "OCI Certified Foundation Associate",
    issuer: "Oracle",
    date: "October 17, 2025",

    url: "https://drive.google.com/file/d/1lLcs7z0AEXljZTlGC67k6WN3PMQkasIh/view?usp=drive_link",
  },
  {
    id: 3,
    name: "Oracle Data Platform Certified Foundations Associate",
    issuer: "Oracle",
    date: "October 28, 2025",

    url: "https://drive.google.com/file/d/11FjRWkUZM4imWs4LqEeEOx3MJbi1ZZCO/view?usp=drive_link",
  },
  {
    id: 4,
    name: "Oracle Agentic AI Certified Foundations Associate",
    issuer: "Oracle",
    date: "July 11, 2026",

    url: "https://drive.google.com/file/d/1kyMO0Aqy1nt5VRI88WiysAygHZ1eshU8/view?usp=drive_link",
  },
  {
    id: 5,
    name: "Microsoft Certified: Fabric Analytics Engineer Associate",
    issuer: "Microsoft",
    date: "July 30, 2026",

    url: "https://drive.google.com/file/d/1Q_2a5fYVig2nuO0OUoD_a07eM3VSouJf/view?usp=drive_link",
  },
];
