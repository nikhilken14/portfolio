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
          {/* Eyebrow updated to include your full name for Google entity recognition */}
          <p className="cinematic-hero__eyebrow">
            NIKHIL KENJALE — SOFTWARE & AI ENGINEER <span />
          </p>

          <h1 id="hero-title" className="cinematic-hero__title">
            Building trusted
            <br />
            <em>autonomous systems</em>
            <br />
            for the real world.
          </h1>

          {/* Description enhanced with exact key keywords matching your target snippet */}
          <p className="cinematic-hero__description">
            I am Nikhil Kenjale, a software engineer in Pune building backend
            systems with Java, Spring Boot, Python, and FastAPI, plus RAG and
            agent-based AI applications.
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
