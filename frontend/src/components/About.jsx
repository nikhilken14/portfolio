import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import "./About.css";

const STATS = [
  { value: "5+", label: "production-style projects" },
  { value: "15+", label: "technologies worked with" },
  { value: "400+", label: "coding problems solved" },
  { value: "3", label: "domains explored (Backend, AI & DevOps)" },
];

export default function About({ profile }) {
  const about =
    profile?.about ||
    "I'm a full-stack engineer who enjoys turning ambiguous problems into clean, maintainable systems.";
  const location = profile?.location;

  return (
    <section id="about" className="section">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">// about</p>
        </Reveal>
        <Row className="gy-5 align-items-start">
          <Col lg={7}>
            <Reveal delay={1}>
              <h2 className="section-title">A little about me</h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="about__body">{about}</p>
            </Reveal>
            <Reveal delay={3}>
              <div className="about__meta">
                <div className="about__meta-item">
                  <i className="bi bi-geo-alt about__meta-icon" />
                  {location}
                </div>
                <div className="about__meta-item">
                  <i className="bi bi-briefcase about__meta-icon" />
                  Open to new opportunities
                </div>
              </div>
            </Reveal>
          </Col>
          <Col lg={5}>
            <Row className="gy-4">
              {STATS.map((stat, i) => (
                <Col xs={6} key={stat.label}>
                  <Reveal delay={i + 1} className="about__stat panel-card">
                    <div className="about__stat-value">{stat.value}</div>
                    <div className="about__stat-label">{stat.label}</div>
                  </Reveal>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}