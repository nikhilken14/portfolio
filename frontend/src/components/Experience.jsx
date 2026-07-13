import { Container } from "react-bootstrap";
import Reveal from "./Reveal";
import "./Experience.css";

export default function Experience({ experience }) {
  return (
    <section id="experience" className="section section-alt">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">// experience</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">Where I've worked</h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">
            A timeline of roles that shaped how I build ordered from most to least recent.
          </p>
        </Reveal>

        <div className="timeline">
          {experience.map((exp, i) => (
            <Reveal delay={(i % 4) + 1} key={exp.id} className="timeline__item">
              <div className="timeline__marker" />
              <div className="timeline__content panel-card">
                <div className="timeline__head">
                  <h3 className="timeline__role">{exp.role}</h3>
                  <span className="timeline__duration">{exp.duration}</span>
                </div>
                <div className="timeline__company">{exp.company}</div>
                <ul className="timeline__points">
                  {exp.description.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}