import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import ParticleField from "./ParticleField";
import "./ParticleField.css";
import "./Hero.css";

const BOOT_LINES = [
  "booting portfolio-os v2.1.0 ...",
  "loading modules: about, skills, projects, experience, education, contact",
  "connection to backend: OK",
  "type 'help' to see available commands",
];

const HELP_TEXT = [
  "available commands:",
  "  about       - jump to the about section",
  "  skills      - see the tech I work with",
  "  projects    - view selected work",
  "  experience  - view work history",
  "  education   - view academic background",
  "  contact     - get in touch",
  "  whoami      - who is this, anyway?",
  "  clear       - clear the terminal",
  "  start       - enter the site",
];

const SECTION_MAP = {
  about: "about",
  skills: "skills",
  projects: "projects",
  experience: "experience",
  education: "education",
  certifications: "certifications",
  contact: "contact",
};

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero({ profile }) {
  const name = profile?.name || "Nikhil Kenjale";
  const role = profile?.role || "Software Engineer";

  const [lines, setLines] = useState([]);
  const [bootDone, setBootDone] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  // Type out the boot sequence line-by-line on mount.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setLines(BOOT_LINES.map((t) => ({ type: "boot", text: t })));
      setBootDone(true);
      return;
    }
    let cancelled = false;
    (async () => {
      for (const line of BOOT_LINES) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 260));
        setLines((prev) => [...prev, { type: "boot", text: line }]);
      }
      if (!cancelled) setBootDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  function focusInput() {
    inputRef.current?.focus();
  }

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    const echo = { type: "echo", text: raw };
    if (!cmd) {
      setLines((prev) => [...prev, echo]);
      return;
    }

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "help") {
      setLines((prev) => [...prev, echo, ...HELP_TEXT.map((t) => ({ type: "out", text: t }))]);
      return;
    }

    if (cmd === "whoami") {
      setLines((prev) => [
        ...prev,
        echo,
        { type: "out", text: `${name} — ${role}` },
        { type: "out", text: "scroll down or type 'start' to enter the site." },
      ]);
      return;
    }

    if (cmd === "start" || cmd === "enter" || cmd === "ls portfolio") {
      setLines((prev) => [...prev, echo, { type: "out", text: "entering site..." }]);
      setTimeout(() => goTo("about"), 250);
      return;
    }

    if (SECTION_MAP[cmd]) {
      setLines((prev) => [...prev, echo, { type: "out", text: `navigating to ${cmd}...` }]);
      setTimeout(() => goTo(SECTION_MAP[cmd]), 200);
      return;
    }

    setLines((prev) => [
      ...prev,
      echo,
      { type: "err", text: `command not found: ${cmd}. type 'help' for options.` },
    ]);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      runCommand(input);
      setHistory((prev) => [...prev, input]);
      setHistoryIdx(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  }

  return (
    <section id="home" className="hero">
      <div className="hero__field">
        <ParticleField colorA="59, 167, 255" colorB="57, 255, 106" />
      </div>
      <div className="hero__scanline" aria-hidden="true" />

      <Container className="container-narrow hero__inner">
        <h1 className="hero__headline">
          <span className="hero__headline-bracket">{"<"}</span>
          Let's get to know me
          <span className="hero__headline-bracket">{" />"}</span>
        </h1>
        <p className="hero__subhead">
          <span className="hero__prompt-tag">guest@portfolio</span>
          <span className="hero__colon">:</span>
          <span className="hero__path">~</span>
          <span className="hero__colon">$</span> an interactive terminal built by {name.split(" ")[0]}, {role.toLowerCase()}
        </p>

        <div className="term-window hero__terminal" onClick={focusInput}>
          <div className="term-window__bar">
            <span className="term-window__dot term-window__dot--accent2" />
            <span className="term-window__dot term-window__dot--accent" />
            <span className="term-window__dot" />
            <span className="term-window__title">guest@portfolio — zsh</span>
          </div>
          <div className="hero__terminal-body" ref={bodyRef}>
            {lines.map((line, i) => (
              <div key={i} className={`hero__line hero__line--${line.type}`}>
                {line.type === "echo" ? (
                  <>
                    <span className="hero__line-prompt">guest@portfolio:~$</span> {line.text}
                  </>
                ) : (
                  line.text
                )}
              </div>
            ))}
            {bootDone && (
              <div className="hero__line hero__line--input">
                <span className="hero__line-prompt">guest@portfolio:~$</span>
                <input
                  ref={inputRef}
                  className="hero__cmd-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Terminal command input"
                />
                <span className="hero__blink-cursor" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        <div className="hero__quick-actions">
          <button className="hero__quick-btn" onClick={() => runCommand("start")}>
            ./start.sh
          </button>
          <button className="hero__quick-btn" onClick={() => runCommand("help")}>
            man help
          </button>
          <button className="hero__quick-btn" onClick={() => runCommand("contact")}>
            ./contact.sh
          </button>
        </div>
      </Container>

      <button
        className="hero__scroll-hint"
        aria-label="Scroll to about section"
        onClick={() => goTo("about")}
      >
        <span className="hero__scroll-line" />
        scroll
      </button>
    </section>
  );
}
