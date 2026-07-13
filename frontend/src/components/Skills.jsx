import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";
import "./Skills.css";

function SkillBar({ skill, delay }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className="skill-bar">
      <div className="skill-bar__head">
        <span className="skill-bar__name">{skill.name}</span>
        <span className="skill-bar__pct">{skill.level}%</span>
      </div>
      <div className="skill-bar__track">
        <div
          className="skill-bar__fill"
          style={{
            width: isVisible ? `${skill.level}%` : "0%",
            transitionDelay: `${delay * 60}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills({ skills }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="section section-alt">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">// skills</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">What I work with</h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">
            A snapshot of the tools and technologies I reach for most often, grouped by where they
            sit in the stack.
          </p>
        </Reveal>

        <Row className="gy-4">
          {categories.map((category, catIndex) => (
            <Col md={6} key={category}>
              <Reveal delay={(catIndex % 4) + 1} className="panel-card skills__category">
                <h3 className="skills__category-title">{category}</h3>
                {skills
                  .filter((s) => s.category === category)
                  .map((skill, i) => (
                    <SkillBar skill={skill} delay={i} key={skill.name} />
                  ))}
              </Reveal>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}