import Section from "./Section";
import { PROFILE, FACTS } from "../data/portfolio";

export default function About() {
  return (
    <Section id="about" title="About" intro="Who I am and what I like building." tone="white">
      <p className="about__statement">{PROFILE.about}</p>
      <dl className="facts">
        {FACTS.map((f) => (
          <div className="facts__row" key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
