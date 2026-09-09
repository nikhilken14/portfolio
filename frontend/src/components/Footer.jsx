import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaArrowUp, FaGithub, FaLinkedin, FaKaggle, FaDownload } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import "./Footer.css";

export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="sharp-footer">
      <Container fluid className="sharp-footer__inner">
        <Row className="sharp-footer__row g-0">
          
          {/* Column 1: Brand & Tagline */}
          <Col lg={4} md={12} className="sharp-footer__col border-dotted-right">
            <div>
              <h2 className="sharp-footer__name">{profile?.name || "Nikhil Kenjale"}</h2>
              <p className="sharp-footer__sub">{profile?.title || "Software Engineer"}</p>
              
            </div>
            <a 
                  href={profile?.resumeUrl || "/resume.pdf"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download
                  className="sharp-footer__resume-btn"
                >
                <FaDownload/> <span> Resume</span>
                </a>
            
            <p className="sharp-footer__stack">BUILT WITH REACT & FASTAPI</p>
          </Col>

          {/* Column 2: Navigation */}
          <Col lg={4} md={6} className="sharp-footer__col border-dotted-right">
            <div>
            <span className="sharp-footer__label">NAVIGATION</span>
            <Row className="sharp-footer__nav-grid g-0">
              <Col xs={6} className="d-flex flex-column gap-2">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
              </Col>
              <Col xs={6} className="d-flex flex-column gap-2">
                <a href="#experience">Experience</a>
                <a href="#skills">Skills</a>
              </Col>
            </Row>
            </div>
          </Col>

          {/* Column 3: Social & Resume */}
          <Col lg={4} md={6} className="sharp-footer__col">
            <div>
              <div className="sharp-footer__social-header">
                <span className="sharp-footer__label">SOCIAL</span>
                <button className="sharp-footer__back-top" onClick={backToTop} type="button">
                  <span>BACK TO TOP</span>
                  <span className="sharp-footer__back-top-box">
                    <FaArrowUp size={11} />
                  </span>
                </button>
              </div>

              <div className="sharp-footer__social-links">
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub /> <span>GitHub</span>
                  </a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin /> <span>LinkedIn</span>
                  </a>
                )}
                {profile?.kaggle && (
                  <a href={profile.kaggle} target="_blank" rel="noopener noreferrer">
                    <FaKaggle /> <span>Kaggle</span>
                  </a>
                )}
                {profile?.leetcode && (
                  <a href={profile.leetcode} target="_blank" rel="noopener noreferrer">
                    <SiLeetcode /> <span>LeetCode</span>
                  </a>
                )}
                
              </div>
            </div>

            <div className="sharp-footer__copyright">
              © {year} {profile?.name?.toUpperCase() || "NIKHIL KENJALE"}. ALL RIGHTS RESERVED
            </div>
          </Col>

        </Row>
      </Container>
    </footer>
  );
}