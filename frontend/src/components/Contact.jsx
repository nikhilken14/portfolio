
import { useEffect, useRef, useState } from "react";
import { LuArrowUpRight, LuSend, LuCircleCheck } from "react-icons/lu";
import { PROFILE } from "../data/portfolio";
import { postContact, hasApi } from "../api/client";

const EMPTY = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const LIMITS = {
  name: [2, 80],
  subject: [2, 120],
  message: [5, 2000],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(form) {
  const errors = {};

  for (const [key, [min, max]] of Object.entries(LIMITS)) {
    const length = form[key].trim().length;

    if (length < min) {
      errors[key] = `At least ${min} characters required.`;
    } else if (length > max) {
      errors[key] = `Maximum ${max} characters allowed.`;
    }
  }

  if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}

function Field({ id, label, error, count, children }) {
  return (
    <div className={`contact-field ${error ? "contact-field--error" : ""}`}>
      <div className="contact-field__heading">
        <label htmlFor={id}>{label}</label>
        {count !== undefined && (
          <span className="contact-field__count">{count}</span>
        )}
      </div>

      {children}

      {error && (
        <p className="contact-field__error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [slow, setSlow] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const sentRef = useRef(null);

  const isSending = status === "sending";

  useEffect(() => {
    if (!isSending) return;

    const timeout = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timeout);
  }, [isSending]);

  useEffect(() => {
    if (status === "sent") {
      sentRef.current?.focus();
    }
  }, [status]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    if (status === "error") {
      setStatus("idle");
      setServerMsg("");
    }
  }

  function fallbackEmail() {
    const params = new URLSearchParams({
      subject: form.subject.trim(),
      body: `From: ${form.name.trim()}\nReply to: ${form.email.trim()}\n\n${form.message.trim()}`,
    });

    return `mailto:${PROFILE.email}?${params.toString()}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSending) return;

    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length) {
      document
        .getElementById(`contact-${Object.keys(found)[0]}`)
        ?.focus();
      return;
    }

    if (!hasApi) {
      window.location.href = fallbackEmail();
      return;
    }

    setStatus("sending");
    setSlow(false);
    setServerMsg("");

    try {
      await postContact({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setForm(EMPTY);
      setErrors({});
      setStatus("sent");
    } catch (error) {
      if (error?.status === 422) {
        const next = {};
        const details = error?.data?.detail;

        if (Array.isArray(details)) {
          for (const item of details) {
            const key = item.loc?.[1];
            if (key && key in EMPTY) {
              next[key] = "Please check this field.";
            }
          }
        }

        setErrors(next);
        setServerMsg("Please review your message details.");
      } else if (error?.status === 429) {
        setServerMsg(
          "Too many requests. Please try again later."
        );
      } else {
        setServerMsg(
          "Unable to send your message right now."
        );
      }

      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="section editorial-contact"
      aria-labelledby="contact-title"
    >
      <div className="wrap">
        <div className="editorial-contact__grid">
          <div>
            <p className="editorial-contact__label">
              // CONTACT
            </p>

            <h2
              id="contact-title"
              className="editorial-contact__title"
            >
              Let's build what
              <br />
              <em>comes next.</em>
            </h2>
          </div>

          <div className="editorial-contact__aside">
            <p>
              Have a product, system, or question
              worth exploring? I'd love to hear about it.
            </p>

            <button
              type="button"
              className="editorial-contact__button"
              aria-expanded={formOpen}
              aria-controls="contact-form-panel"
              onClick={() => setFormOpen((prev) => !prev)}
            >
              <span>{formOpen ? "Close form" : "Say hello"}</span>
              <LuArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Updated contact form - no contact details strip */}
        <div
          id="contact-form-panel"
          className="editorial-contact__form"
          hidden={!formOpen}
        >
          <div className="contact-form-header">
            <div>
              <span className="contact-form-header__eyebrow">
                START A CONVERSATION
              </span>

              <h3>Tell me about your idea.</h3>

              <p>
                Share a few details, and I'll get back to you.
              </p>
            </div>

            <span className="contact-form-header__index">
              01 / 04
            </span>
          </div>

          {status === "sent" ? (
            <div className="contact-success" ref={sentRef} tabIndex={-1} role="status">
              <LuCircleCheck aria-hidden="true" />

              <h3>Message sent successfully.</h3>

              <p>
                Thanks for reaching out. I'll reply as soon as possible.
              </p>

              <button
                type="button"
                onClick={() => setStatus("idle")}
              >
                Send another message
                <LuArrowUpRight aria-hidden="true" />
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="contact-form__row">
                <Field id="contact-name" label="Your name" error={errors.name}>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="John Doe"
                    maxLength={80}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-err" : undefined}
                    disabled={isSending}
                    required
                  />
                </Field>

                <Field id="contact-email" label="Email address" error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "contact-email-err" : undefined}
                    disabled={isSending}
                    required
                  />
                </Field>
              </div>

              <Field id="contact-subject" label="Subject" error={errors.subject}>
                <input
                  id="contact-subject"
                  name="subject"
                  placeholder="Let's discuss a project"
                  maxLength={120}
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "contact-subject-err" : undefined}
                  disabled={isSending}
                  required
                />
              </Field>

              <Field
                id="contact-message"
                label="Your message"
                error={errors.message}
                count={`${form.message.length}/2000`}
              >
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  maxLength={2000}
                  placeholder="Tell me about your project, idea, or opportunity..."
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-err" : undefined}
                  disabled={isSending}
                  required
                />
              </Field>

              {/* Anti-spam honeypot */}
              <div className="hp" aria-hidden="true">
                <label>
                  Website
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                  />
                </label>
              </div>

              <div className="contact-form__footer">
                <p>
                  Your details are used only to respond to your message.
                </p>

                <button
                  type="submit"
                  className="contact-form__submit"
                  disabled={isSending}
                >
                  <span>{isSending ? "Sending..." : "Send message"}</span>
                  <LuSend aria-hidden="true" />
                </button>
              </div>

              <div aria-live="polite">
                {isSending && slow && (
                  <p className="contact-form__notice">
                    The server is starting up. Please keep this page open.
                  </p>
                )}

                {status === "error" && (
                  <p className="contact-form__notice contact-form__notice--error">
                    {serverMsg} You can also{" "}
                    <a href={fallbackEmail()}>email me directly</a>.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
