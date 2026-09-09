import Reveal from "./Reveal";
import "./Projects.css";

function pad(n) {
  return String(n + 1).padStart(2, "0");
}

function ProjectRow({ project, index }) {
  return (
    <div className="project-row">
      <div className="project-content">
        <div className="project-row__header">
          <div className="project-row__meta">
            <span className="project-row__index">
              {String(index + 1).padStart(2, "0")}.
            </span>
            <h3 className="project-row__title">{project.title}</h3>
          </div>
          {project.featured && (
            <span className="project-row__badge">Featured</span>
          )}
        </div>

        <p className="project-row__desc">{project.description}</p>

        <div className="project-row__footer">
          <div className="project-row__tags">
            {project.tags?.map((tag) => (
              <span className="tag-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-row__link"
            >
              <i className="bi bi-github" />
              <span>View Code</span>
            </a>
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

      <div className="project-list">
        {projects.map((project, i) => (
          <ProjectRow project={project} index={i} key={project.id || i} />
        ))}
      </div>
    </section>
  );
}