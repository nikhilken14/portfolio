import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import "./Projects.css";

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">// projects</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">Selected work</h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">
            A few projects that reflect how I think about problems from data model to interface.
          </p>
        </Reveal>

        <Row className="gy-4">
          {projects.map((project, i) => (
            <Col md={6} lg={4} key={project.id}>
              <Reveal delay={(i % 4) + 1} className="panel-card project-card h-100">
                {project.featured && <span className="project-card__badge">Featured</span>}
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__tags">
                  {project.tags.map((tag) => (
                    <span className="tag-chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-card__links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-card__link">
                      <i className="bi bi-github" /> Code
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-card__link">
                      <i className="bi bi-box-arrow-up-right" /> Live
                    </a>
                  )}
                </div>
              </Reveal>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}