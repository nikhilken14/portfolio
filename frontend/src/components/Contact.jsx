import { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Reveal from "./Reveal";
import { postContact, getResumeStatus, RESUME_DOWNLOAD_URL } from "../api/client";
import "./Contact.css";
import { FaGithub, FaLinkedin, FaKaggle, FaDownload } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export default function Contact({ profile }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [resumeAvailable, setResumeAvailable] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getResumeStatus()
      .then((res) => {
        if (isMounted) setResumeAvailable(Boolean(res?.available));
      })
      .catch(() => {
        if (isMounted) setResumeAvailable(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await postContact(form);
      setStatus({ state: "success", message: res.message || "Message sent — thank you!" });
      setForm(INITIAL_FORM);
    } catch (err) {
      const detail =
        err?.response?.data?.detail && Array.isArray(err.response.data.detail)
          ? err.response.data.detail.map((d) => d.msg).join(" ")
          : "Something went wrong. Please try again or email me directly.";
      setStatus({ state: "error", message: detail });
    }
  };

  return (
    <section id="contact" className="section section-alt">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">// contact</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">Let's build something</h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">
            Have a role, project, or idea in mind? Send a message and I'll get back to you soon.
          </p>
        </Reveal>

        <Row className="gy-4">
          <Col lg={5}>
            <Reveal delay={1} className="panel-card contact__info h-100">
              <h3 className="contact__info-title">Direct contact</h3>
              <a href={`mailto:${profile?.email}`} className="contact__info-row">
                <i className="bi bi-envelope" />
                {profile?.email || "nikhilkenjale1314@gmail.com"}
              </a>
              <div className="contact__info-row">
                <i className="bi bi-geo-alt" />
                {profile?.location || "Pune, India"}
              </div>
              <div className="contact__info-row">
                <i className="bi bi-download" />
                {
                  <a href={RESUME_DOWNLOAD_URL} download className="contact__resume-link">
                  Resume
                  </a>
                }

              </div>
              <div className="contact__socials">
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub size={24} />
                  </a>
                )}

                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={24} />
                  </a>
                )}

                {profile?.kaggle && (
                  <a href={profile.kaggle} target="_blank" rel="noopener noreferrer">
                    <FaKaggle size={24} />
                  </a>
                )}

                {profile?.leetcode && (
                  <a href={profile.leetcode} target="_blank" rel="noopener noreferrer">
                    <SiLeetcode size={24} />
                  </a>
                )}

              </div>
              
            </Reveal>
          </Col>
          <Col lg={7}>
            <Reveal delay={2} className="panel-card">
              <Form onSubmit={handleSubmit} noValidate>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group controlId="contactName">
                      <Form.Label className="contact__label">Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        placeholder="Your name"
                        className="contact__input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactEmail">
                      <Form.Label className="contact__label">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="contact__input"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="contactSubject">
                      <Form.Label className="contact__label">Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        minLength={2}
                        placeholder="What's this about?"
                        className="contact__input"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="contactMessage">
                      <Form.Label className="contact__label">Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        minLength={5}
                        placeholder="Tell me a bit about it..."
                        className="contact__input"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <button type="submit" className="btn-accent contact__submit" disabled={status.state === "loading"}>
                  {status.state === "loading" ? "Sending..." : "Send message"}
                </button>

                {status.state === "success" && (
                  <p className="contact__status contact__status--success">{status.message}</p>
                )}
                {status.state === "error" && (
                  <p className="contact__status contact__status--error">{status.message}</p>
                )}
              </Form>
            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  );
}