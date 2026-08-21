import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";
import "./Skills.css";

// Converts a 0-100 proficiency level into a 1-5 star rating.
function ratingFromLevel(level) {
  const n = Number(level) || 0;
  return Math.max(1, Math.min(5, Math.round(n / 20)));
}

function StarRating({ rating }) {
  return (
    <div className="star-rating" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i
          key={i}
          className={`bi ${i < rating ? "bi-star-fill star-rating__star star-rating__star--filled" : "bi-star star-rating__star"}`}
          style={{ transitionDelay: `${i * 60}ms` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function SkillRow({ skill, delay }) {
  const { ref, isVisible } = useReveal();
  const rating = ratingFromLevel(skill.level);

  return (
    <div ref={ref} className={`skill-row ${isVisible ? "is-visible" : ""}`} style={{ transitionDelay: `${delay * 55}ms` }}>
      <span className="skill-row__name">{skill.name}</span>
      <StarRating rating={isVisible ? rating : 0} />
    </div>
  );
}

function CategoryCard({ category, skills, index }) {
  return (
    <Reveal delay={(index % 4) + 1} className="skills-card">
      <div className="skills-card__head">
        <span className="skills-card__dot" />
        <h3 className="skills-card__title">{category}</h3>
      </div>
      <div className="skills-card__rule" />
      <div className="skills-card__list">
        {skills.map((skill, i) => (
          <SkillRow skill={skill} delay={i} key={skill.name} />
        ))}
      </div>
    </Reveal>
  );
}

export default function Skills({ skills }) {
  const categories = [...new Set(skills.map((s) => s.category))];
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateProgress() {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? (el.scrollLeft / max) * 100 : 0;
    setProgress(pct);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }

  useEffect(() => {
    updateProgress();
    const el = trackRef.current;
    if (!el) return;
    const onResize = () => updateProgress();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [skills]);

  function scrollByCard(dir) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".skills-card");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section id="skills" className="section section-alt">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">skills.json</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">
            What I <span className="section-title__accent">work with</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">
            A rated snapshot of the tools and technologies I reach for most often, grouped by
            where they sit in the stack. Ratings reflect hands-on proficiency, out of 5.
          </p>
        </Reveal>

        <div className="skills-track" ref={trackRef} onScroll={updateProgress}>
          {categories.map((category, catIndex) => (
            <CategoryCard
              category={category}
              skills={skills.filter((s) => s.category === category)}
              index={catIndex}
              key={category}
            />
          ))}
        </div>

        <div className="skills-nav">
          <div className="skills-nav__track">
            <div className="skills-nav__fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="skills-nav__buttons">
            <button
              className="skills-nav__btn"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous category"
            >
              <i className="bi bi-arrow-left" />
            </button>
            <button
              className="skills-nav__btn"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next category"
            >
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}