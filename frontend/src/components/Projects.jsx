import Reveal from "./Reveal";
import "./Projects.css";

// Rotating header gradients so cards read as visually distinct, not repeated.
const HEADER_GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e, #2d1b3d)",
  "linear-gradient(135deg, #1a2e28, #0f3d2d)",
  "linear-gradient(135deg, #2e1a1a, #3d1f0f)",
  "linear-gradient(135deg, #1a1e2e, #1f0f3d)",
];

// Picks a Bootstrap Icon based on the project's tags. Checked most-specific
// first, so e.g. a fine-tuning project and a RAG-agent project - both "AI" -
// still land on different icons instead of collapsing into one bi-cpu bucket.
function getProjectIcon(tags = []) {
  const t = tags.map((x) => x.toLowerCase());
  const has = (...keys) => t.some((tag) => keys.some((k) => tag.includes(k)));

  if (has("qlora", "peft", "unsloth", "trl", "lora", "fine-tun"))
    return "bi-sliders2";
  if (has("ocr", "math", "calculator"))
    return "bi-calculator";
  if (has("langgraph", "multi-agent", "judge", "researcher"))
    return "bi-share";
  if (has("rag", "agent", "langchain", "llm", "qwen", "chromadb"))
    return "bi-cpu";
  if (has("react", "frontend"))
    return "bi-window-stack";
  if (has("spring", "postgres", "rest", "api", "jpa"))
    return "bi-hdd-network";
  if (has("bash", "linux", "cron"))
    return "bi-terminal";
  if (has("numpy", "scikit", "power bi", "time series"))
    return "bi-graph-up";
  return "bi-diagram-3";
}

function ProjectRow({ project, index }) {
  const tags = project.tags || [];
  const gradient = HEADER_GRADIENTS[index % HEADER_GRADIENTS.length];
  const icon = getProjectIcon(tags);

  return (
    <div className="project-card">
      <div
        className="project-card__header"
        style={{ backgroundImage: gradient }}
      >
        <i className={`bi ${icon} project-card__icon`} aria-hidden="true" />
        {project.featured && (
          <span className="project-card__badge">Featured</span>
        )}
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__index">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="project-card__title">{project.title}</h3>
        </div>

        <p className="project-card__desc">{project.description}</p>

        <div className="project-card__tags">
          {tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="project-card__footer">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
            >
              <i className="bi bi-github" aria-hidden="true" />
              <span>View code</span>
            </a>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects = [] }) {
  return (
    <section id="projects" className="projects">
      <div className="pro-container">
        <Reveal delay={1}>
          <h2 className="pro-title">
            Projects <span className="project_accent">worth a look</span>
          </h2>
          <h3 className="sub-title">
            A few projects that reflect how I think about problems from database to AI.
          </h3>
        </Reveal>
      </div>

      <div className="project-grid">
        {projects.map((project, i) => (
          <ProjectRow project={project} index={i} key={project.id || i} />
        ))}
      </div>
    </section>
  );
}