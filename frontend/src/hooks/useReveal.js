import { useEffect, useRef, useState } from "react";

/**
 * Adds a "reveal" class toggle once an element scrolls into view.
 * Lightweight alternative to a full animation library — keeps bundle small
 * and respects prefers-reduced-motion via CSS.
 */
export default function useReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}