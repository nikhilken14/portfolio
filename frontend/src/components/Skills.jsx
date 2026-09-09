import { useState } from "react";
import { Container } from "react-bootstrap";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";
import "./Skills.css";

// Map common tech names to DevIcon CSS classes, Bootstrap Icons, or direct SVG URLs
const ICON_MAP = {
  // Programming
  Java: "devicon-java-plain colored",
  Python: "devicon-python-plain colored",
  SQL: "devicon-postgresql-plain colored",
  JavaScript: "devicon-javascript-plain colored",
  Bash: "devicon-bash-plain colored",

  // Frontend
  "React.js": "devicon-react-original colored",
  HTML5: "devicon-html5-plain colored",
  CSS3: "devicon-css3-plain colored",
  Bootstrap: "devicon-bootstrap-plain colored",

  // Backend
  FastAPI: "devicon-fastapi-plain colored",
  "Spring Boot": "devicon-spring-plain colored",
  "Express.js": "devicon-express-original",
  "Node.js": "devicon-nodejs-plain colored",

  // AI / ML
  "Machine Learning": "devicon-tensorflow-line colored",
  "Deep Learning": "devicon-pytorch-original colored",
  PyTorch: "devicon-pytorch-original colored",
  "Computer Vision (CNNs, Transfer Learning)": "devicon-opencv-plain colored",

  // GenAI
  "Retrieval-Augmented Generation (RAG)": "bi bi-cpu-fill",
  "Large Language Models (LLMs)": "bi bi-robot",
  "LangChain / LangGraph": "bi bi-diagram-3-fill",
  "Hugging Face Transformers": "bi bi-emoji-smile-fill",
  "QLoRA / PEFT Fine-Tuning": "bi bi-sliders",

  // Database
  PostgreSQL: "devicon-postgresql-plain colored",
  MySQL: "devicon-mysql-plain colored",
  MongoDB: "devicon-mongodb-plain colored",
  Redis: "devicon-redis-plain colored",
  "ChromaDB (Vector DB)": "bi bi-database-fill-gear",

  // Tools & Cloud
  "Git / GitHub": "devicon-git-plain colored",
  Docker: "devicon-docker-plain colored",
  Linux: "devicon-linux-plain",
  Postman: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
  "AWS / OCI": "devicon-amazonwebservices-plain-wordmark colored",
  "Power BI": "bi bi-bar-chart-fill",
};

// Helper to normalize strings (strips spaces, slashes, dashes, casing)
const normalize = (str) =>
  str ? str.toLowerCase().replace(/[\s/_-]/g, "") : "";

function SkillCard({ skill, index }) {
  const { ref, isVisible } = useReveal();
  const icon = ICON_MAP[skill.name] || "bi bi-code-slash";
  const isImageUrl =
    typeof icon === "string" &&
    (icon.startsWith("http://") ||
      icon.startsWith("https://") ||
      icon.startsWith("/"));

  return (
    <div
      ref={ref}
      className={`skill-item-card ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="skill-item-card__header">
        <div className="skill-item-card__icon">
          {isImageUrl ? (
            <img
              src={icon}
              alt={skill.name}
              style={{ width: "22px", height: "22px", objectFit: "contain" }}
            />
          ) : (
            <i className={icon} />
          )}
        </div>
        <span className="skill-item-card__name">{skill.name}</span>
      </div>
    </div>
  );
}

export default function Skills({ skills = [] }) {
  // Extract unique categories from backend payload
  const categories = [...new Set(skills.map((s) => s.category))].filter(
    Boolean
  );
  const [activeTab, setActiveTab] = useState(categories[0] || "All");

  // Filter skills while ignoring casing/space differences
  const filteredSkills =
    activeTab === "All"
      ? skills
      : skills.filter(
          (s) => normalize(s.category) === normalize(activeTab)
        );

  return (
    <section id="skills" className="skills-section">
      <Reveal delay={1}>
          <h2 className="skill-title">
            What I <span className="skill_accent">work with</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="skill-sub">
            An interactive snapshot of the primary tools, frameworks, and
            technologies I reach for when building scalable systems.
          </p>
        </Reveal>
      <Container className="container-narrow">
        {/* Category Tabs */}
        <Reveal delay={3}>
          <div className="skills-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`skills-tab__btn ${
                  normalize(activeTab) === normalize(cat) ? "is-active" : ""
                }`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Responsive Grid */}
        <div className="skills-grid">
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={`${skill.category}-${skill.name}`}
              skill={skill}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}