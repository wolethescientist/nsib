import Link from "next/link";
import { FadeIn } from "@/components/ui/MotionWrapper";
import styles from "./flight-track.module.css";

const FLIGHT_TRACKER_IFRAME_SRC = "https://globe.adsbexchange.com/?lat=9.082&lon=8.675&zoom=6&hideSidebar&hideButtons";

const stats = [
  { label: "Coverage", value: "Nigerian Airspace" },
  { label: "Data Source", value: "ADS-B / Mode-S" },
  { label: "Update Rate", value: "~8 seconds" },
  { label: "System Status", value: "Operational", green: true },
];

export default function FlightTrackerPage() {
  const hasIframe = FLIGHT_TRACKER_IFRAME_SRC.trim().length > 0;

  return (
    <main style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", flexDirection: "column", background: "#080e24" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className={styles.header}>
        <div className="container">
          <FadeIn delay={0.05}>
            <div className={styles.headerInner}>
              <div>
                <Link href="/operations-centre" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "1.5rem",
                  textDecoration: "none",
                  transition: "color 0.2s"
                }}>
                  <span>←</span>
                  <span>Back to Operations Centre</span>
                </Link>
                <h1 className={styles.headerTitle}>Live Flight Tracker</h1>
                <p className={styles.headerSub}>
                  Real-time monitoring of aircraft operating within Nigerian airspace via ADS-B surveillance data.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                <div className={styles.liveBadge}>
                  <span className={styles.liveDot} />
                  Live Feed
                </div>
                <Link href="/vessel-tracking" style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}>
                  Switch to Marine Tracker →
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────────────────────────── */}
      <div className={styles.statsStrip}>
        <div className="container" style={{ padding: 0, maxWidth: "100%" }}>
          <div className={styles.statsInner}>
            {stats.map((s) => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={`${styles.statValue} ${s.green ? styles.statValueGreen : ""}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <div className={styles.mapOuter}>
        {/* Decorative radar overlays — hidden when iframe loads */}
        {!hasIframe && (
          <>
            <div className={styles.radarGrid} />
            <div className={styles.radarRings} />
            <div className={styles.mapPlaceholder}>
              <div className={styles.placeholderIcon}>
                {/* Plane SVG */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5 5-3.2 3.2-2.4-.8L2 16l3 3c.6.6 1.4.9 2.2.9h.1c.8-.1 1.5-.4 2.1-.9l.6-.6 3.2-3.2 5 5 1.2-.7c.4-.2.7-.6.6-1.1z"/>
                </svg>
              </div>
              <p className={styles.placeholderTitle}>Flight Tracker Widget</p>
              <p className={styles.placeholderNote}>
                Set <code style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.06)", padding: "0.1rem 0.3rem", borderRadius: 3 }}>FLIGHT_TRACKER_IFRAME_SRC</code> at the top of this file to embed your chosen provider.
              </p>
            </div>
          </>
        )}

        {hasIframe && (
          <iframe
            className={styles.mapIframe}
            src={FLIGHT_TRACKER_IFRAME_SRC}
            title="Live Flight Tracker — Nigerian Airspace"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {/* ── Footer Bar ──────────────────────────────────────────────────── */}
      <div className={styles.footerBar}>
        <div className="container">
          <div className={styles.footerInner}>
            <p className={styles.footerNote}>
              <strong>Data attribution:</strong> Flight data is sourced from third-party ADS-B providers and is provided for informational purposes only.
              NSIB does not guarantee real-time accuracy.
            </p>
            <div className={styles.footerLinks}>
              <Link href="/operations-centre" className={styles.footerLink}>Operations Centre</Link>
              <Link href="/vessel-tracking" className={styles.footerLink}>Marine Tracker</Link>
              <Link href="/reporting" className={styles.footerLink}>Report Incident</Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
