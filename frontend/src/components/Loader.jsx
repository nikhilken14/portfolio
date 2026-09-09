import { useEffect, useState } from "react";
import "./Loader.css";

export default function Loader({ onFinished }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          clearInterval(interval);
          if (onFinished) onFinished();
          return 100;
        }
        return p + Math.max(1, Math.round((100 - p) / 8));
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="loader">
      <p className="loader__mark">Nikhil Kenjale</p>
      <div className="loader__bar">
        <div className="loader__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="loader__pct">{pct}%</p>
    </div>
  );
}