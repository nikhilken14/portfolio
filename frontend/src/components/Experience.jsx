import { Container } from "react-bootstrap";
import Reveal from "./Reveal";
import "./Experience.css";

export default function Experience({ experience }) {
  return (
    <section id="experience" className="exp-light-v3">
      <Reveal delay={1}>
        <h2 className="exp-light-v3__title">
          Where <span className="exp_accent">I&apos;ve Worked</span>
        </h2>
      </Reveal>
      <Reveal delay={2}>
        <p className="exp-light-v3__subtitle">
            A timeline of roles that shaped how I build, ordered from most to least recent.
        </p>
      </Reveal>

      <Container className="exp-light-v3__container">
        <div className="exp-light-v3__timeline">
          <div className="exp-light-v3__track">
            <div className="exp-light-v3__track-glow" />
          </div>

          {experience.map((exp, i) => (
            <Reveal delay={(i % 4) + 1} key={exp.id} className="exp-light-v3__item">
              <div className="exp-light-v3__node">
                <span className="exp-light-v3__pulse" />
                <span className="exp-light-v3__core" />
              </div>

              <div className="exp-light-v3__card">
                <div className="exp-light-v3__card-top">
                  <div className="exp-light-v3__meta-left">
                    <h3 className="exp-light-v3__role">{exp.role}</h3>
                    <div className="exp-light-v3__company">
                      <i className="bi bi-building" /> {exp.company}
                    </div>
                  </div>
                  <span className="exp-light-v3__duration">{exp.duration}</span>
                </div>

                <ul className="exp-light-v3__list">
                  {exp.description.map((point, idx) => (
                    <li key={idx}>
                      <span className="exp-light-v3__bullet" />
                      <span>{point}</span>
                    </li>
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