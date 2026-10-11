export default function Section({ id, title, intro, tone = "paper", children }) {
  return <section id={id} className={`section ${tone === "ink" ? "on-ink" : `section--${tone}`}`} aria-labelledby={`${id}-title`}><div className="wrap section__grid"><header className="section__head"><span className="section__eyebrow">// {id.toUpperCase()}</span><h2 id={`${id}-title`} className="section__title">{title}<span className="section__accent">.</span></h2>{intro && <p className="section__intro">{intro}</p>}</header><div className="section__body">{children}</div></div></section>;
}
