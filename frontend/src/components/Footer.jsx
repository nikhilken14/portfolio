import "./Footer.css";

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container-narrow footer__inner">
        <span className="footer__brand">
          <span className="footer__bracket">{"<"}</span>
          {"Nikhil.Kenjale"}
          <span className="footer__bracket">{"/>"}</span>
        </span>
        <span className="footer__note">
          Built with React, react-bootstrap &amp; FastAPI · © {year}
        </span>
      </div>
    </footer>
  );
}