import Section from "./Section";
import { EDUCATION } from "../data/portfolio";

export default function Education() {
  return (
    <Section id="education" title="Education" intro="The formal foundation behind the day-to-day work." tone="white">
      <ol>
        {EDUCATION.map((e) => (
          <li className="row" key={e.id}>
            <p className="row__when">{e.duration}</p>
            <div>
              <h3 className="row__title">{e.degree}</h3>
              <p className="row__org">{e.institution}, {e.score}</p>
              <p className="row__note">{e.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
