import { LuArrowUpRight } from "react-icons/lu";
import Section from "./Section";
import { CERTIFICATIONS } from "../data/portfolio";

export default function Certifications() {
  return (
    <Section id="certifications" title="Certifications" intro="Credentials in cloud, data and agentic AI.">
      <ul className="certs certs--text-only">
        {CERTIFICATIONS.map((credential) => (
          <li key={credential.id}>
            <a className="cert" href={credential.url} target="_blank" rel="noopener noreferrer">
              <div className="cert__body">
                <span className="cert__eyebrow">{credential.issuer} / Credential</span>
                <h3 className="cert__name">{credential.name}</h3>
                <p className="cert__meta">{credential.date}</p>
                <span className="cert__view">View credential <LuArrowUpRight aria-hidden="true" /></span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
