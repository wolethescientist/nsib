"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const events = [
  {
    year: "1989",
    title: "Accident Investigation Bureau Created",
    body: "Following the establishment of the Federal Civil Aviation Authority (FCAA), the AIB was created as a separate investigative department under the Federal Ministry of Aviation — the first step toward a truly independent investigation body.",
  },
  {
    year: "2006",
    title: "AIB Formally Established as Autonomous Agency",
    body: "The Civil Aviation Act 2006, Section 29, formally created the Accident Investigation Bureau as an autonomous agency reporting to the President through the Aviation Minister. A Commissioner served as Chief Executive Officer.",
  },
  {
    year: "2021",
    title: "Engr. Akin Olateru Appointed Commissioner / CEO",
    body: "Engr. Akin Olateru was appointed Commissioner and Chief Executive Officer, steering the bureau through its most significant transformation since independence.",
  },
  {
    year: "2022",
    title: "NSIB Act 2022 — Multimodal Expansion",
    body: "The bureau became the Nigerian Safety Investigation Bureau (NSIB) under the NSIB Act 2022, expanding its mandate beyond aviation to cover maritime, rail, and road transport incidents. The Commissioner role was replaced by a Director-General.",
  },
  {
    year: "2023",
    title: "Capt. Alex Badeh Jr. Assumes Office as Director-General",
    body: "Capt. Alex Badeh Jr. assumed office, articulating a vision centred on inspiring safety advancements across all transport modes rather than merely investigating tragedies.",
  },
];

export default function HistoryPage() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("tl-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    itemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ paddingBottom: "6rem", overflowX: 'hidden' }}>
      {/* Antigravity Hero Section */}
      <section className="page-hero" style={{
        backgroundColor: 'var(--nsib-navy)',
        color: 'white',
        padding: '10rem 2rem 8rem',
        position: 'relative',
        transformStyle: 'preserve-3d',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(226, 48, 48, 0.15) 0%, transparent 50%)',
          zIndex: 0
        }} />
        
        {/* Floating background elements */}
        <div className="floating-element" style={{ position: 'absolute', top: '10%', right: '10%', width: '150px', height: '150px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', transform: 'rotateZ(15deg)', zIndex: 1 }} />
        <div className="floating-element-slow" style={{ position: 'absolute', bottom: '-10%', left: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(226,48,48,0.2) 0%, rgba(226,48,48,0) 100%)', backdropFilter: 'blur(20px)', zIndex: 1 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: "800px" }}>
            <Link href="/about" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem",
              textDecoration: "none",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "white"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            >
              <span>←</span>
              <span>Back to About</span>
            </Link>
            <div style={{
              display: 'inline-flex',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginLeft: '1.5rem'
            }}>
              Our Legacy
            </div>
            <h1 style={{ 
              color: 'white', 
              fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              textShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              History of the NSIB
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255, 255, 255, 0.8)', 
              maxWidth: '600px', 
              lineHeight: 1.6,
              textShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}>
              The Nigerian Safety Investigation Bureau evolved over three decades from a
              single-mode aviation investigator to Nigeria's authoritative multimodal
              transport safety body.
            </p>
          </div>
        </div>
      </section>

      {/* Background prose */}
      <div className="container" style={{ marginTop: "3rem" }}>
        <div
          className="glass-panel"
          style={{ padding: "2.5rem", lineHeight: "1.9" }}
        >
          <h2 className="text-navy" style={{ fontSize: "1.3rem", marginBottom: "1.25rem" }}>
            Background
          </h2>
          {[
            "The Nigerian Safety Investigation Bureau (NSIB) operates under the Federal Ministry of Aviation and Transportation. It investigates transportation accidents and serious incidents occurring in or over Nigeria, or involving Nigerian-registered aircraft, ships, trains, or vehicles elsewhere.",
            "NSIB evolved from its predecessor, the Accident Investigation Bureau (AIB), which previously focused solely on aviation incidents. The bureau's establishment act — the NSIB Act 2022 — replaced the earlier AIB provisions under the Civil Aviation Act 2006.",
            "Historically, accident investigations fell under the Civil Aviation Department (CAD) within the Ministry of Aviation. To comply with ICAO standards on airworthiness and accident investigation, these functions were separated. In 1989 the Federal Civil Aviation Authority (FCAA) was established, and the AIB was created as a separate investigative department.",
            "The 2001 Nigerian Civil Aviation Policy recommended establishing a financially independent investigation bureau with broader responsibilities. Under the NSIB Act 2022 the organisation is now led by a Director-General serving as Chief Executive Officer.",
          ].map((para, i) => (
            <p key={i} className="text-slate" style={{ marginBottom: "1rem" }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Alternating Timeline */}
      <div className="container" style={{ marginTop: "5rem" }}>
        <h2
          className="text-navy"
          style={{ textAlign: "center", marginBottom: "3.5rem", fontSize: "1.5rem", letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          Timeline
        </h2>

        <div style={{ position: "relative", maxWidth: "960px", margin: "0 auto" }}>
          {/* Centre spine */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 0,
              bottom: 0,
              width: "2px",
              background: "linear-gradient(to bottom, transparent, var(--nsib-red) 6%, var(--nsib-red) 94%, transparent)",
            }}
          />

          {events.map((ev, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={ev.year}
                ref={(el) => { itemsRef.current[i] = el; }}
                className={isLeft ? "tl-item tl-left" : "tl-item tl-right"}
                style={{
                  display: "flex",
                  justifyContent: isLeft ? "flex-end" : "flex-start",
                  paddingLeft: isLeft ? 0 : "calc(50% + 2.5rem)",
                  paddingRight: isLeft ? "calc(50% + 2.5rem)" : 0,
                  marginBottom: "3rem",
                  position: "relative",
                }}
              >
                {/* Year badge on the spine */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "1.1rem",
                    zIndex: 2,
                    background: "var(--nsib-red)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.1em",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ev.year}
                </div>

                {/* Card */}
                <div
                  className="glass-panel"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "1.75rem 2rem",
                  }}
                >
                  <span
                    className="text-red"
                    style={{
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {ev.year}
                  </span>
                  <h3
                    className="text-navy"
                    style={{ fontSize: "1.05rem", marginTop: "0.4rem", marginBottom: "0.75rem", lineHeight: "1.4" }}
                  >
                    {ev.title}
                  </h3>
                  <p className="text-slate" style={{ fontSize: "0.95rem", lineHeight: "1.75" }}>
                    {ev.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Entrance animation states */
        .tl-item {
          opacity: 0;
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .tl-left  { transform: translateX(-48px); }
        .tl-right { transform: translateX(48px); }

        .tl-item.tl-visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* Hero animations */
        @keyframes float {
            0% { transform: translateY(0px) rotateZ(15deg); }
            50% { transform: translateY(-20px) rotateZ(10deg); }
            100% { transform: translateY(0px) rotateZ(15deg); }
        }
        @keyframes floatSlow {
            0% { transform: translateY(0px) rotateZ(0deg) scale(1); }
            50% { transform: translateY(-15px) rotateZ(5deg) scale(1.05); }
            100% { transform: translateY(0px) rotateZ(0deg) scale(1); }
        }
        .floating-element { animation: float 8s ease-in-out infinite; }
        .floating-element-slow { animation: floatSlow 12s ease-in-out infinite; }

        /* Mobile: collapse to single column */
        @media (max-width: 640px) {
          .tl-item {
            padding-left: 1.5rem !important;
            padding-right: 0 !important;
            justify-content: flex-start !important;
          }
          .tl-item .glass-panel { max-width: 100% !important; }
          /* hide spine badge on mobile — year shown inside card */
          .tl-item > div[aria-hidden] { display: none; }
        }
      `}</style>
    </main>
  );
}
