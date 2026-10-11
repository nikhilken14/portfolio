import { LuArrowUpRight, LuDownload } from "react-icons/lu";
import { PROFILE } from "../data/portfolio";
import { RESUME_URL } from "../api/client";

export default function Hero({ resumeAvailable }) {
  return (
    <section
      id="home"
      className="hero cinematic-hero on-ink"
      aria-labelledby="hero-title"
    >
      <div className="wrap cinematic-hero__frame">
        <div className="cinematic-hero__content">
          <p className="cinematic-hero__eyebrow">
            SOFTWARE & AI ENGINEER <span /> {PROFILE.location.toUpperCase()}
          </p>
          <h1 id="hero-title" className="cinematic-hero__title">
            Building trusted
            <br />
            <em>autonomous systems</em>
            <br />
            for the real world.
          </h1>
          <p className="cinematic-hero__description">
            I design intelligent products and dependable infrastructure that
            turn frontier ideas into useful, human-centered systems.
          </p>
          <div className="cinematic-hero__actions">
            <a href="#projects" className="cinematic-hero__action">
              Explore my work <LuArrowUpRight aria-hidden="true" />
            </a>
            <a href="#contact" className="cinematic-hero__action">
              Let's collaborate <LuArrowUpRight aria-hidden="true" />
            </a>
            {resumeAvailable && (
              <a
                href={RESUME_URL}
                download="Nikhil_Kenjale_Resume.pdf"
                className="cinematic-hero__action"
                aria-label="Download Nikhil Kenjale Resume"
              >
                <LuDownload aria-hidden="true" />
                Resume
                <LuArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
