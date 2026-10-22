import {
  LuArrowUp,
  LuArrowUpRight,
  LuDownload,
  LuMapPin,
} from "react-icons/lu";
import { PROFILE } from "../data/portfolio";
import { RESUME_URL } from "../api/client";

const navigation = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Skills", "#skills"],
  ["Certifications", "#certifications"],
  ["Contact", "#contact"],
];
const socials = [
  ["GitHub", PROFILE.github],
  ["LinkedIn", PROFILE.linkedin],
  ["Kaggle", PROFILE.kaggle],
  ["LeetCode", PROFILE.leetcode],
];

export default function Footer({ resumeAvailable }) {
  return (
    <footer id="footer" className="footer lexsi-footer">
      <div className="wrap">
        <div className="lexsi-footer__inner">
          <div className="lexsi-footer__about">
            <a
              href="#home"
              className="lexsi-footer__brand"
              aria-label="Back to home"
            >
              Nikhil<span className="lexsi-footer__dot">.</span>Kenjale
            </a>
            <LuMapPin>{PROFILE.location}</LuMapPin>
            <p>
              I design and build reliable software, scalable backend systems,
              data pipelines, and AI-powered applications that solve real-world
              problems.
            </p>
            {resumeAvailable && (
              <a
                className="footer-resume"
                href={RESUME_URL}
                download="Nikhil_Kenjale_Resume.pdf"
              >
                <LuDownload aria-hidden="true" /> Download Resume{" "}
                <LuArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>
          <nav className="lexsi-footer__column" aria-label="Footer navigation">
            <h3>NAVIGATION</h3>
            {navigation.map(([title, href]) => (
              <a key={href} href={href}>
                {title}
              </a>
            ))}
          </nav>
          <div className="lexsi-footer__column">
            <h3>SOCIALS</h3>
            {socials
              .filter(([, href]) => href)
              .map(([title, href]) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {title} <LuArrowUpRight aria-hidden="true" />
                </a>
              ))}
          </div>
        </div>
        <div className="lexsi-footer__bottom">
          <span>
            © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
          </span>
          <a href="#home">
            Back to top <LuArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
