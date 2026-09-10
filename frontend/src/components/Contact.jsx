import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FiArrowUpRight, FiSend } from "react-icons/fi";
import { postContact } from "../api/client";
import "./Contact.css";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export default function Contact({ profile }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });

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
        message: "Message received I'll get back to you soon.",
      });
      setForm(INITIAL_FORM);
    } catch (err) {
      const detail =
        err?.response?.data?.detail && Array.isArray(err.response.data.detail)
          ? err.response.data.detail.map((d) => d.msg).join(" ")
          : "Something went wrong. Please try again or email me directly.";
      setStatus({ state: "error", message: detail });
    }
  };

  const email = profile?.email || "nikhilkenjale1314@gmail.com";

  return (
    <section id="contact" className="contact-section">
      <Container className="contact-container">
        <Row className="gy-5 align-items-center">
          {/* Left Column: Heading & Info */}
          <Col lg={6} className="contact-left">
            <h1 className="contact-headline">
              Let’s build <br />
              something <br />
              that holds.
            </h1>
            <p className="contact-subtext">
              Have a role, project, or complex problem in mind? Send a note
              and I’ll get back to you.
            </p>
            <a href={`mailto:${email}`} className="contact-email-link">
              <span>{email}</span>
              <FiArrowUpRight className="arrow-icon" />
            </a>
          </Col>

          {/* Right Column: Form */}
          <Col lg={6} className="contact-right">
            <Form onSubmit={handleSubmit} noValidate className="contact-form">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="contactName">
                    <Form.Label className="field-label">NAME</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="dark-input"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="contactEmail">
                    <Form.Label className="field-label">EMAIL</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="dark-input"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group controlId="contactSubject">
                    <Form.Label className="field-label">SUBJECT</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                      className="dark-input"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group controlId="contactMessage">
                    <Form.Label className="field-label">MESSAGE</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about the work..."
                      required
                      className="dark-input dark-textarea"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <button
                type="submit"
                className="blue-submit-btn"
                disabled={status.state === "loading"}
              >
                <span>
                  {status.state === "loading" ? "Sending..." : "Send message"}
                </span>
                <FiSend size={16} />
              </button>

              {status.state === "success" && (
                <p className="status-msg success">{status.message}</p>
              )}
              {status.state === "error" && (
                <p className="status-msg error">{status.message}</p>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
}