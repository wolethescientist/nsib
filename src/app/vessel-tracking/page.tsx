import Link from "next/link";
import { FadeIn } from "@/components/ui/MotionWrapper";
import styles from "./vessel-tracking.module.css";


const stats = [
  { label: "Coverage", value: "Nigerian Waters" },
  { label: "Data Source", value: "AIS / VDES" },
  { label: "Update Rate", value: "~2 minutes" },
  { label: "System Status", value: "Operational", green: true },
];

export default function VesselTrackerPage() {
  return (
    <main style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", flexDirection: "column", background: "#040d1a" }}>

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
                <h1 className={styles.headerTitle}>Live Vessel Tracker</h1>
                <p className={styles.headerSub}>
                  Real-time monitoring of maritime traffic within Nigerian waters via AIS transponder data.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                <div className={styles.liveBadge}>
                  <span className={styles.liveDot} />
                  Live Feed
                </div>
                <Link href="/flight-track" style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}>
                  Switch to Flight Tracker →
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
        <iframe
          className={styles.mapIframe}
          src="/vessel-widget"
          title="Live Vessel Tracker — Nigerian Waters"
          allowFullScreen
        />
      </div>

      {/* ── Footer Bar ──────────────────────────────────────────────────── */}
      <div className={styles.footerBar}>
        <div className="container">
          <div className={styles.footerInner}>
            <p className={styles.footerNote}>
              <strong>Data attribution:</strong> Vessel data is sourced from MyShipTracking (AIS) and is provided for informational purposes only.
              NSIB does not guarantee real-time accuracy.
            </p>
            <div className={styles.footerLinks}>
              <Link href="/operations-centre" className={styles.footerLink}>Operations Centre</Link>
              <Link href="/flight-track" className={styles.footerLink}>Flight Tracker</Link>
              <Link href="/reporting" className={styles.footerLink}>Report Incident</Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
