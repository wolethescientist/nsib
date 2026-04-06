"use client";

import { useEffect, useRef } from "react";

export function VesselWidget({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // VesselFinder reads these globals before aismap.js initialises the map
    const config = document.createElement("script");
    config.text = [
      'var width="100%";',
      'var height="100%";',
      'var latitude="5.5";',
      'var longitude="4.5";',
      'var zoom="6";',
      'var names=false;',
    ].join("");
    el.appendChild(config);

    const widget = document.createElement("script");
    widget.id = "vesselfinder-aismap";
    widget.src = "https://www.vesselfinder.com/aismap.js";
    widget.type = "text/javascript";
    el.appendChild(widget);

    return () => {
      el.innerHTML = "";
      document.getElementById("vesselfinder-aismap")?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: "inherit" }}
    />
  );
}
