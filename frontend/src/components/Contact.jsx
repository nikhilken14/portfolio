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
  const [flight, setFlight] = useState(null); // { type: "bug" | "plane", key: number }

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
      await postContact(form);
      setStatus({
        state: "success",
        message: "We got your mail — we'll connect back to you soon.",
      });
      setForm(INITIAL_FORM);
      setFlight({ type: "plane", key: Date.now() });
    } catch (err) {
      const detail =
        err?.response?.data?.detail && Array.isArray(err.response.data.detail)
          ? err.response.data.detail.map((d) => d.msg).join(" ")
          : "Something went wrong. Please try again or email me directly.";
      setStatus({ state: "error", message: detail });
      setFlight({ type: "bug", key: Date.now() });
    }
  };

  return (
    <section id="contact" className="section section-alt">
      <Container className="container-narrow">
        <Reveal>
          <p className="eyebrow">contact.send()</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">
            Let's <span className="section-title__accent">build something</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="section-sub">
            Have a role, project, or idea in mind? Send a message and I'll get back to you soon.
          </p>
        </Reveal>

        <Reveal delay={3} className="term-window contact__single">
          <div className="term-window__bar">
            <span className="term-window__dot term-window__dot--accent2" />
            <span className="term-window__dot term-window__dot--accent" />
            <span className="term-window__dot" />
            <span className="term-window__title">send_message.sh</span>
          </div>

          {flight && (
            <div
              key={flight.key}
              className={`contact__flyover contact__flyover--${flight.type}`}
              onAnimationEnd={() => setFlight(null)}
              aria-hidden="true"
            >
              <i className={`bi ${flight.type === "bug" ? "bi-bug-fill" : "bi-send-fill"}`} />
            </div>
          )}

          <div className="term-window__body">
            <div className="contact__info-strip">
              <a href={`mailto:${profile?.email}`} className="contact__info-pill">
                <i className="bi bi-envelope" />
                {profile?.email || "nikhilkenjale1314@gmail.com"}
              </a>
              <span className="contact__info-pill">
                <i className="bi bi-geo-alt" />
                {profile?.location || "Pune, India"}
              </span>
              <a href={RESUME_DOWNLOAD_URL} download className="contact__info-pill">
                <i className="bi bi-download" />
                Resume
              </a>
              <span className="contact__info-strip-spacer" />
              <div className="contact__socials contact__socials--inline">
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub size={18} />
                  </a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={18} />
                  </a>
                )}
                {profile?.kaggle && (
                  <a href={profile.kaggle} target="_blank" rel="noopener noreferrer">
                    <FaKaggle size={18} />
                  </a>
                )}
                {profile?.leetcode && (
                  <a href={profile.leetcode} target="_blank" rel="noopener noreferrer">
                    <SiLeetcode size={18} />
                  </a>
                )}
              </div>
            </div>

            <Form onSubmit={handleSubmit} noValidate className="contact__form">
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
                <Col md={6}>
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
                  <Form.Group controlId="contactMessageFull">
                    <Form.Label className="contact__label">Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
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
                {status.state === "loading" ? "sending..." : "$ send --message"}
              </button>

              {status.state === "success" && (
                <p className="contact__status contact__status--success">{status.message}</p>
              )}
              {status.state === "error" && (
                <p className="contact__status contact__status--error">{status.message}</p>
              )}
            </Form>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}