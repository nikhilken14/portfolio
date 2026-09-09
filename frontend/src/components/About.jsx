import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";
import "./About.css";
import Particle from "./Particle";

const STATS = [
  { value: "5+", label: "production style projects", icon: "bi-boxes" },
  { value: "15+", label: "technologies worked with", icon: "bi-layers" },
  { value: "400+", label: "coding problems solved", icon: "bi-braces" },
  { value: "3", label: "domains( backend, AI & DevOps )", icon: "bi-diagram-3" },
];

function StatCard({ stat, index }) {
  const { ref, isVisible } = useReveal();
  const numeric = parseInt(stat.value.replace(/\D/g, ""), 10) || 0;
  const suffix = stat.value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start;
    const duration = 1400;
    let frame;

    function tick(ts) {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numeric));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, numeric]);

  return (
    <div
      ref={ref}
      className={`about__stat ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <i className={`bi ${stat.icon} about__stat-icon`} aria-hidden="true" />
      <div className="about__stat-value">
        {count}
        <span className="about__stat-suffix">{suffix}</span>
      </div>
      <div className="about__stat-label">{stat.label}</div>
    </div>
  );
}

export default function About({ profile }) {
  const about =
    profile?.about ||
    "I'm a full-stack engineer who enjoys turning ambiguous problems into clean, maintainable systems.";
  const location = profile?.location;
  const role = profile?.role;

  return (
    <section id="about" className="about">
      <Particle />
      <Container className="container-narrow">
        <div className="about__grid">
          <div className="about__intro">

            <Reveal delay={1}>
              <h2 className="about-title">
                A little <span className="about__accent">about me</span>
              </h2>
            </Reveal>

            <Reveal delay={2}>
              <p className="about__body">{about}</p>
            </Reveal>

            <Reveal delay={3}>
              <div className="about__meta">
                {role && (
                  <div className="about__meta-item">
                    <i className="bi bi-briefcase about__meta-icon" />
                    <span>{role}</span>
                  </div>
                )}
                {location && (
                  <div className="about__meta-item">
                    <i className="bi bi-geo-alt about__meta-icon" />
                    <span>{location}</span>
                  </div>
                )}
                <div className="about__meta-item about__meta-item--live">
                  <span className="about__meta-pulse" />
                  <span className="about__meta-dot" />
                  <span>Available now</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="about__stats">
            <Row className="g-3">
              {STATS.map((stat, i) => (
                <Col xs={6} key={stat.label}>
                  <StatCard stat={stat} index={i} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Container>
    </section>
  );
}