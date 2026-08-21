import Reveal from "./Reveal";
import "./Projects.css";

function pad(n) {
  return String(n).padStart(2, "0");
}

function ProjectRow({ project, index }) {
  const flipped = index % 2 === 1;

  return (
    <Reveal delay={(index % 4) + 1} className={`project-row ${flipped ? "project-row--flip" : ""}`}>
      <div className="project-row__index" aria-hidden="true">
        {pad(index + 1)}.
      </div>

      <div className="project-row__content">
        {project.featured && <span className="project-row__badge">featured</span>}
        <h3 className="project-row__title">{project.title}</h3>
        <p className="project-row__desc">{project.description}</p>
        <div className="project-row__tags">
          {project.tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="project-row__links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-row__link">
              <i className="bi bi-github" /> view code
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-row__link">
              <i className="bi bi-box-arrow-up-right" /> live demo
            </a>
          )}
        </div>
      </div>

      <div className="project-row__visual" aria-hidden="true">
        <div className="pv-block pv-block--glyph">{"</>"}</div>
        <div className="pv-block pv-block--blob">
          <span className="pv-blob" />
        </div>
        <div className="pv-block pv-block--static" />
        <a
          className="pv-block pv-block--arrow"
          href={project.live || project.github || "#projects"}
          target={project.live || project.github ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={`Open ${project.title}`}
        >
          <i className="bi bi-arrow-right" />
        </a>
      </div>
    </Reveal>
  );
}

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section projects">
      <div className="container-narrow">
        <Reveal>
          <p className="eyebrow">projects.list()</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">
            Selected <span className="section-title__accent">work</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">
            A few projects that reflect how I think about problems — from database to pixel.
          </p>
        </Reveal>
      </div>

      <div className="projects__list">
        {projects.map((project, i) => (
          <ProjectRow project={project} index={i} key={project.id} />
        ))}
      </div>
    </section>
  );
}
