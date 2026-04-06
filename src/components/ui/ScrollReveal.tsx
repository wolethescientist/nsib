"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  duration?: number;
  distance?: number; // kept for API compat, controlled via CSS now
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.7,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already revealed on a previous render — stay visible instantly.
    if (el.classList.contains("sr-revealed")) return;

    const reveal = () => {
      if (el.classList.contains("sr-revealed")) return;
      // Apply transition first, then add the class that drives it.
      el.style.transition = `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
      el.classList.add("sr-revealed");
    };

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      // Element is visible on load — reveal after two rAFs so the CSS
      // hidden state has already painted and the transition plays cleanly.
      requestAnimationFrame(() => requestAnimationFrame(reveal));
      return;
    }

    // Below the fold — use IntersectionObserver.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // Run once on mount only — no pathname dependency needed because the
  // CSS attribute already sets the hidden state server-side.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} data-sr={direction} className={className}>
      {children}
    </div>
  );
}
