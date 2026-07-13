import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader">
      <div className="loader__mark">
        <span className="loader__bracket">{"<"}</span>
        <span className="loader__dot" />
        <span className="loader__bracket">{"/>"}</span>
      </div>
      <p className="loader__text">loading portfolio…</p>
    </div>
  );
}