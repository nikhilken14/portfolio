import useReveal from "../hooks/useReveal";

/**
 * Wraps children in a scroll-triggered fade/slide-up reveal.
 * `delay` (0-4) staggers groups of cards without needing inline styles.
 */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const { ref, isVisible } = useReveal();
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <Tag ref={ref} className={`reveal ${delayClass} ${isVisible ? "is-visible" : ""} ${className}`}>
      {children}
    </Tag>
  );
}