import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle network — a constellation of nodes that
 * drift, connect when close, and gently respond to the pointer.
 * No dependencies; respects prefers-reduced-motion by rendering one static frame.
 */
export default function ParticleField({
  density = 60,
  linkDistance = 130,
  colorA = "124, 107, 255",
  colorB = "41, 241, 201",
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let rafId;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height) / (18000 / (density / 60)));
      particles = Array.from({ length: Math.max(24, Math.min(count, 130)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() > 0.5 ? colorA : colorB,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          p.x += (dx / (dist || 1)) * force * 0.6;
          p.y += (dy / (dist || 1)) * force * 0.6;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const opacity = 1 - dist / linkDistance;
            ctx.strokeStyle = `rgba(${a.hue}, ${opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.hue}, 0.85)`;
        ctx.shadowColor = `rgba(${p.hue}, 0.9)`;
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    function handlePointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function handlePointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement.addEventListener("pointermove", handlePointerMove);
    canvas.parentElement.addEventListener("pointerleave", handlePointerLeave);

    if (reduceMotion) {
      // draw a single static frame, no animation loop
      step();
    } else {
      rafId = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("pointermove", handlePointerMove);
      canvas.parentElement?.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [density, linkDistance, colorA, colorB]);

  return <canvas ref={canvasRef} className={`particle-field ${className}`} aria-hidden="true" />;
}
