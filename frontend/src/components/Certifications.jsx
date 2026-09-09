import Reveal from "./Reveal";
import "./Certifications.css";

export default function Certifications({ certifications }) {
  // Duplicate array to ensure a seamless infinite marquee loop
  const infiniteCertifications = [...certifications, ...certifications];

  return (
    <section id="certifications" className="sci-certifications">
      <Reveal delay={1}>
          <h2 className="sci-section-title">
            Certifications
          </h2>
        </Reveal>

        <Reveal delay={2}>
          <p className="sci-section-sub">
            Credentials that validate my technical expertise.
          </p>
        </Reveal>

      {/* Marquee Wrapper */}
      <div className="sci-marquee-container">
        <div className="sci-marquee-track">
          {infiniteCertifications.map((cert, i) => (
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              key={`${cert.id}-${i}`}
              className="sci-cert-card text-decoration-none"
            >
              <div className="sci-panel-card h-100">
                <div className="sci-card-badge-frame">
                  <img
                    src={cert.badge}
                    alt={cert.name}
                    className="sci-card-badge"
                  />
                </div>

                <h3 className="sci-card-name">
                  {cert.name}
                </h3>

                <div className="sci-card-issuer">
                  {cert.issuer}
                </div>

                {cert.date && (
                  <div className="sci-card-date">
                    {cert.date}
                  </div>
                )}

                <div className="sci-card-view">
                  View Certificate
                  <i className="bi bi-arrow-up-right"></i>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}