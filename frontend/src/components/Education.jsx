import { Container } from "react-bootstrap";
import Reveal from "./Reveal";
import "./Education.css";

export default function Education({ education }) {
  return (
    <section id="education" className="edu-section">
      <Reveal delay={1}>
          <h2 className="edu-section-title">
            Academic <span className="edu_accent">Background</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="edu-section-sub">The formal foundation behind the day-to-day work.</p>
        </Reveal>
      <Container className="edu-container-narrow">
        <div className="edu-grid-layout">
          {education.map((edu, i) => {
            const isEven = i % 2 === 0;
            return (
              <Reveal key={edu.id} delay={(i % 4) + 1} className="w-100">
                <div className={`edu-split-row ${isEven ? "" : "edu-split-row-reverse"}`}>
                  <div className="edu-content-box">
                    <div className="edu-card__duration">{edu.duration}</div>
                    <h3 className="edu-card__degree">{edu.degree}</h3>
                    <div className="edu-card__institution">
                      {edu.institution}
                    </div>
                    <p style={{ color: "white" }}>{edu.cgpa}</p>
                    {edu.description && <p className="edu-card__desc">{edu.description}</p>}
                  </div>
                  <div className="edu-icon-box">
                    <div className="edu-card__icon-wrap">
                      <i className="bi bi-mortarboard edu-card__icon" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}