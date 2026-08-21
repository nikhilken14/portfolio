import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";
import "./About.css";

const STATS = [
  { value: "5+", label: "production-style projects" },
  { value: "15+", label: "technologies worked with" },
  { value: "400+", label: "coding problems solved" },
  { value: "3", label: "domains explored (Backend, AI & DevOps)" },
];

const GLYPHS = ["{ }", "</>", ";", "( )", "#!", "=>"];

function StatCard({ stat, delay }) {
  const { ref, isVisible } = useReveal();
  const numeric = parseInt(stat.value.replace(/\D/g, ""), 10) || 0;
  const suffix = stat.value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start;
    const duration = 1300;
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
    <div ref={ref} className={`about__stat panel-card reveal ${delay ? `reveal-delay-${delay}` : ""} ${isVisible ? "is-visible" : ""}`}>
      <div className="about__stat-value">
        {count}
        {suffix}
      </div>
      <div className="about__stat-label">{stat.label}</div>
    </div>
  );
}

// Types the given text out character-by-character once it scrolls into view.
function useTypeOnReveal(text, speed = 16) {
  const { ref, isVisible } = useReveal();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!isVisible) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setTyped(text);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [isVisible, text, speed]);

  return { ref, typed, isVisible };
}

export default function About({ profile }) {
  const about =
    profile?.about ||
    "I'm a full-stack engineer who enjoys turning ambiguous problems into clean, maintainable systems.";
  const location = profile?.location;
  const { ref: typeRef, typed, isVisible: typedVisible } = useTypeOnReveal(about, 14);

  return (
    <section id="about" className="section about">
      <span className="about__glyph about__glyph--1" aria-hidden="true">{GLYPHS[0]}</span>
      <span className="about__glyph about__glyph--2" aria-hidden="true">{GLYPHS[1]}</span>
      <span className="about__glyph about__glyph--3" aria-hidden="true">{GLYPHS[4]}</span>
      <span className="about__glyph about__glyph--4" aria-hidden="true">{GLYPHS[5]}</span>

      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">about.exe</p>
        </Reveal>
        <Row className="gy-5 align-items-start">
          <Col lg={7}>
            <Reveal delay={1}>
              <h2 className="section-title">
                A little <span className="section-title__accent">about me</span>
              </h2>
            </Reveal>

            <div className="term-window about__term" ref={typeRef}>
              <div className="term-window__bar">
                <span className="term-window__dot term-window__dot--accent2" />
                <span className="term-window__dot term-window__dot--accent" />
                <span className="term-window__dot" />
                <span className="term-window__title">cat about.txt</span>
              </div>
              <div className="term-window__body about__term-body">
                <span className="about__term-prompt">$ cat about.txt</span>
                <p className="about__body">
                  {typed}
                  {typedVisible && typed.length < about.length && (
                    <span className="about__type-cursor" aria-hidden="true" />
                  )}
                </p>
              </div>
            </div>

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
                <div className="about__meta-item about__meta-item--live">
                  <span className="about__meta-dot" />
                  status: online
                </div>
              </div>
            </Reveal>
          </Col>
          <Col lg={5}>
            <Row className="gy-4">
              {STATS.map((stat, i) => (
                <Col xs={6} key={stat.label}>
                  <StatCard stat={stat} delay={(i % 4) + 1} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
