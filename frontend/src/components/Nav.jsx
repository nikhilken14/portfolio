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

const SECTION_IDS = ["home", ...LINKS.map(({ id }) => id), "contact", "footer"];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const nav = document.querySelector(".cinematic-nav");
      const navHeight = nav?.getBoundingClientRect().height ?? 86;
      const viewportHeight = window.innerHeight;
      // The current section is the content just below the fixed navbar.
      const probeY = Math.min(viewportHeight - 1, Math.round(navHeight + 32));
      const probeX = Math.round(window.innerWidth / 2);
      const surface = document
        .elementsFromPoint(probeX, probeY)
        .filter((element) => !element.closest(".cinematic-nav"))
        .map((element) => element.closest("section, footer, main > div[id]"))
        .find(Boolean);

      const visible = SECTION_IDS.map((id) => ({
        id,
        element: document.getElementById(id),
      }))
        .filter(({ element }) => element)
        .map(({ id, element }) => ({
          id,
          element,
          rect: element.getBoundingClientRect(),
        }));
      const atProbe = visible.find(
        ({ rect }) => rect.top <= probeY && rect.bottom > probeY,
      );
      const current =
        atProbe ||
        visible.filter(({ rect }) => rect.top <= probeY).at(-1) ||
        visible[0];

      if (current) {
        setActiveSection((previous) =>
          previous === current.id ? previous : current.id,
        );
      }

      const currentSurface = surface || current?.element;
      const dark =
        currentSurface &&
        (currentSurface.id === "home" ||
          currentSurface.id === "footer" ||
          currentSurface.matches(".on-ink, .cinematic-hero, .lexsi-footer"));
      setOnDark((previous) =>
        previous === Boolean(dark) ? previous : Boolean(dark),
      );
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
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
          <span className="cinematic-nav__brand">
            Nikhil<span>.</span>Kenjale
          </span>
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
        <div
          id="nav-links"
          className={`nav__links ${open ? "nav__links--open" : ""}`}
        >
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              className="nav__link"
              href={`#${id}`}
              aria-current={activeSection === id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav__cta"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            <span>Contact</span>
            <LuArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </nav>
  );
}
