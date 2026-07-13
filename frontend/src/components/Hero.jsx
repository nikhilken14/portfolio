import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import "./Hero.css";

const ROLES = [
  "Software Engineer",
  "Full-Stack Developer",
  "Java & Spring Boot Developer",
  "React & Python Developer",
  "AI / Machine Learning Enthusiast",
  "Building Scalable Systems",
];

function useTypedRoles() {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 45);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 25);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return text;
}

export default function Hero({ profile }) {
  const typedRole = useTypedRoles();
  const name = profile?.name || "Nikhil Kenjale";
  const tagline =
    profile?.tagline || "I build fast, reliable products end-to-end — from database to pixel.";

  return (
    <section id="home" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <Container className="container-narrow">
        <Row className="align-items-center min-vh-100 py-5">
          <Col lg={7}>
            {/* <Reveal>
              <p className="eyebrow"> </p>
            </Reveal> */}
            <Reveal delay={1}>
              <h1 className="hero__name">
                Hi, I'm <span className="hero__name-accent">{name.split(" ")[0]}</span>
                <br />
                {name.split(" ").slice(1).join(" ")}
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <div className="hero__terminal" role="status" aria-live="polite">
                <span className="hero__prompt">$</span> whoami<span className="hero__cursor-sep"> → </span>
                <span className="hero__typed">{typedRole}</span>
                <span className="hero__cursor">|</span>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <p className="hero__tagline">{tagline}</p>
            </Reveal>
            <Reveal delay={4}>
              <div className="hero__actions">
                <a
                  href="#projects"
                  className="btn-accent"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View my work
                </a>
                <a
                  href="#contact"
                  className="btn-outline-soft"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Get in touch
                </a>
              </div>
            </Reveal>
          </Col>
          <Col lg={5} className="d-none d-lg-block">
            <Reveal delay={2} className="hero__card-wrapper">
              <div className="hero__code-card">
                <div className="hero__code-dots">
                  <span /> <span /> <span />
                </div>
                <pre className="hero__code-block">
{`const developer = {
  name: "${name.split(" ")[0]}",
  stack: "Java", "SQL", "Python",
  focus: "Backend • AI",
  motto: "Write clean code."
};`}
                </pre>
              </div>
            </Reveal>
          </Col>
        </Row>
      </Container>
      <button
        className="hero__scroll-hint"
        aria-label="Scroll to about section"
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className="hero__scroll-line" />
        scroll
      </button>
    </section>
  );
}