"use client";

import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  duration?: number;
  distance?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.7,
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getTransform = () => {
    switch (direction) {
      case "up":    return `translate3d(0, ${distance}px, 0)`;
      case "down":  return `translate3d(0, -${distance}px, 0)`;
      case "left":  return `translate3d(${distance}px, 0, 0)`;
      case "right": return `translate3d(-${distance}px, 0, 0)`;
    }
  };

  // Reset + re-animate whenever the pathname changes (including back-nav)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset: clear any previous animation state
    delete el.dataset.revealed;
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = getTransform();
    // Force reflow so hidden state paints before transition kicks in
    void el.offsetHeight;

    const reveal = () => {
      if (el.dataset.revealed === "true") return;
      el.dataset.revealed = "true";
      el.style.transition = `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "translate3d(0, 0, 0)";
    };

    // Elements currently in viewport → animate immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => reveal());
      return;
    }

    // Elements below → observe for scroll
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // No inline opacity:0 — if useEffect doesn't fire, content stays visible
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
