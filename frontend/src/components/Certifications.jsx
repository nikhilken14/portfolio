import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import "./Certifications.css";

export default function Certifications({ certifications }) {
  return (
    <section id="certifications" className="section">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">// certifications</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">Certifications</h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">Credentials that back up the skills above.</p>
        </Reveal>

        <Row className="gy-4">
          {certifications.map((cert, i) => (
            <Col md={6} lg={4} key={cert.id}>
              <Reveal delay={(i % 4) + 1} className="panel-card cert-card h-100">
                <i className="bi bi-patch-check cert-card__icon" />
                <h3 className="cert-card__name">{cert.name}</h3>
                <div className="cert-card__issuer">{cert.issuer}</div>
                {cert.date && <div className="cert-card__date">{cert.date}</div>}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-card__link"
                  >
                    View credential <i className="bi bi-box-arrow-up-right" />
                  </a>
                )}
              </Reveal>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
