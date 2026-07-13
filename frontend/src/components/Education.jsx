import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import "./Education.css";

export default function Education({ education }) {
  return (
    <section id="education" className="section">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">// education</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">Academic Background</h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">The formal foundation behind the day-to-day work.</p>
        </Reveal>

        <Row className="gy-4">
          {education.map((edu, i) => (
            <Col md={6} key={edu.id}>
              <Reveal delay={(i % 4) + 1} className="panel-card education-card h-100">
                <i className="bi bi-mortarboard education-card__icon" />
                <div className="education-card__duration">{edu.duration}</div>
                <h3 className="education-card__degree">{edu.degree}</h3>
                <h3 className="education-card__degree">{edu.cgpa}</h3>
                <div className="education-card__institution">{edu.institution}</div>
                {edu.description && <p className="education-card__desc">{edu.description}</p>}
              </Reveal>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}