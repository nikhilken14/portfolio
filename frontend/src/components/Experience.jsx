import Section from "./Section";
import { EXPERIENCE } from "../data/portfolio";

export default function Experience() {
  return (
    <Section id="experience" title="Experience" intro="Roles that shaped how I build, most recent first.">
      <ol>
        {EXPERIENCE.map((e) => (
          <li className="row" key={e.id}>
            <p className="row__when">{e.duration}</p>
            <div>
              <h3 className="row__title">{e.role}</h3>
              <p className="row__org">{e.company}</p>
              <ul className="row__points">
                {e.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
