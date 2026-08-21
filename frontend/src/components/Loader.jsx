import { useEffect, useState } from "react";
import "./Loader.css";

export default function Loader() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // Purely cosmetic progress readout — resolves once real data arrives,
    // but eases toward 90% in the meantime so it never looks stalled.
    const interval = setInterval(() => {
      setPct((p) => (p < 90 ? p + Math.max(1, Math.round((90 - p) / 10)) : p));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader">
      <div className="loader__grid" aria-hidden="true" />
      <div className="loader__mark">
        <span className="loader__bracket">{"<"}</span>
        <span className="loader__dot" />
        <span className="loader__bracket">{"/>"}</span>
      </div>
      <p className="loader__text">initializing portfolio…</p>
      <div className="loader__bar">
        <div className="loader__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="loader__pct">{pct}%</p>
    </div>
  );
}