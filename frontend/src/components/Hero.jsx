import { Container, Row, Col } from "react-bootstrap";
import AiCore3D from "./AiCore3D"; 
import "./Hero.css";

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero({ profile }) {
  const name = profile?.name || "Nikhil Kenjale";
  const role = profile?.role || "Software Engineer";
  const tagline =
    profile?.tagline ||
    "Building scalable software, intelligent AI solutions, and modern web applications from backend to frontend.";

  return (
    <section id="home" className="hero">
      {/* 3D WebGL Background Component */}
      <div className="hero__field" aria-hidden="true">
        <AiCore3D />
      </div>

      <div className="hero__glow-left" aria-hidden="true" />
      <div className="hero__glow-right" aria-hidden="true" />
      <div className="hero__grid-overlay" aria-hidden="true" />

      <Container fluid className="hero__inner">
        <Row className="align-items-center min-vh-100">
          <Col lg={7} xl={6} className="hero__content">
            <div className="hero__status">
              <span className="hero__status-ping" />
              <span className="hero__status-text">{role} — Available for work</span>
            </div>

            <h1 className="hero__headline">
              {name.split(" ")[0]} <br />
              <span className="hero__headline-outline">{name.split(" ")[1] || ""}</span>
            </h1>

            <p className="hero__sub">{tagline}</p>

            <div className="hero__actions">
              <button className="hero__btn-accent" onClick={() => goTo("projects")}>
                <span>EXPLORE WORK</span>
                <i className="bi bi-arrow-right-short" />
              </button>

              <button className="hero__btn-ghost" onClick={() => goTo("contact")}>
                Get in touch
              </button>
            </div>

            <div className="hero__badge-container">
              <span className="hero__badge-label">PROUDLY OPEN SOURCE ON</span>
              <a 
                href={profile?.github || "https://github.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero__badge-link"
              >
                <i className="bi bi-github" /> GitHub
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Floating Bottom Right Panel */}
      <div className="hero__panel-bottom">
        <div className="hero__panel-header">
          <span className="hero__panel-tag">SELECTED HIGHLIGHT</span>
        </div>
        <p className="hero__panel-title">Software & AI </p>
        <button className="hero__panel-action" onClick={() => goTo("projects")}>
          <i className="bi bi-arrow-up-right" />
        </button>
      </div>

      {/* Side Scroll Indicator */}
      <button
        className="hero__scroll-hint"
        aria-label="Scroll to about section"
        onClick={() => goTo("about")}
      >
        <span className="hero__scroll-line" />
        SCROLL
      </button>
    </section>
  );
}