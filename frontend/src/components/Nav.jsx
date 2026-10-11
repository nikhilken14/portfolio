import { useEffect, useState } from "react";
import { LuArrowUpRight, LuMenu, LuX } from "react-icons/lu";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const nav = document.querySelector(".cinematic-nav");
      const height = nav?.getBoundingClientRect().height ?? 76;
      // Check the surface behind the middle of the fixed navbar.
      const y = Math.min(window.innerHeight - 1, Math.round(height / 2));
      const x = Math.round(window.innerWidth / 2);
      const candidates = document.elementsFromPoint(x, y);
      // Prefer actual section beneath navbar; ignore nav descendants.
      const section = candidates
        .filter((el) => !el.closest(".cinematic-nav"))
        .map((el) => el.closest("section, footer, main > div[id]"))
        .find(Boolean);
      const sectionId = section?.id;
      const dark = sectionId === "home" || sectionId === "footer" ||
        Boolean(section?.matches(".on-ink, .cinematic-hero, .lexsi-footer"));
      // Fallback for layouts where the visible surface is not a section.
      if (!section) {
        const overlaps = (id) => {
          const rect = document.getElementById(id)?.getBoundingClientRect();
          return !!rect && rect.top <= y && rect.bottom > y;
        };
        setOnDark(overlaps("home") || overlaps("footer"));
      } else {
        setOnDark(dark);
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <nav
      className={`nav cinematic-nav ${onDark ? "nav--home" : "nav--light"} ${open ? "nav--open" : ""}`}
      aria-label="Primary navigation"
    >
      <div className="wrap nav__bar">
        <a className="nav__brand" href="#home" onClick={() => setOpen(false)}>
          <span className="cinematic-nav__brand">Nikhil<span>.</span>Kenjale</span>
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
        </button>
        <div id="nav-links" className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {LINKS.map(({ id, label }) => (
            <a key={id} className="nav__link" href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="nav__cta" href="#contact" onClick={() => setOpen(false)}>
            <span>Contact</span><LuArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </nav>
  );
}
