import Link from "next/link";
import styles from "./reporting-guidelines.module.css";

export default function ReportingGuidelinesPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.floatingElement} />
        <div className={styles.floatingElementSlow} />
        
        <div className={styles.heroInner}>
          <Link href="/operations-centre" style={{
            display: "inline-block",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "1.5rem",
            textDecoration: "none",
          }}>← Back to Operations Centre</Link>
          <p className={styles.heroLabel}>Official Protocol</p>
          <h1 className={styles.heroTitle}>
            Accident <em>Reporting</em><br />Guidelines
          </h1>
          <p className={styles.heroSubtitle}>
            Step-by-step instructions on how to properly report an accident or
            serious incident to the NSIB.
          </p>
        </div>
      </section>

      {/* ── Emergency Banner ── */}
      <div className={styles.emergencyBanner}>
        <div className={styles.emergencyBannerInner}>
          <div className={styles.emergencyLeft}>
            <span className={styles.emergencyIcon}>📞</span>
            <span className={styles.emergencyText}>
              NSIB 24/7 Duty Officer — report immediately after an occurrence
            </span>
          </div>
          <span className={styles.emergencyNumber}>+234 807 709 0900</span>
        </div>
      </div>

      {/* ── Body ── */}
      <section className={styles.body}>
        <div className={styles.bodyInner}>

          {/* When to Report */}
          <div className={styles.whenCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionAccent} />
              <h2 className={styles.sectionTitle}>When to Report</h2>
            </div>
            <p className={styles.whenText}>
              By law, all aviation, maritime, and railway accidents or serious
              incidents occurring within Nigerian territory must be reported to
              the NSIB immediately.
            </p>
            <div className={styles.modesGrid}>
              <div className={styles.modeItem}>
                <span className={styles.modeIcon}>✈️</span>
                <span className={styles.modeName}>Aviation</span>
              </div>
              <div className={styles.modeItem}>
                <span className={styles.modeIcon}>⚓</span>
                <span className={styles.modeName}>Maritime</span>
              </div>
              <div className={styles.modeItem}>
                <span className={styles.modeIcon}>🚂</span>
                <span className={styles.modeName}>Railway</span>
              </div>
            </div>
          </div>

          {/* How to Report */}
          <div className={styles.stepsCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionAccent} />
              <h2 className={styles.sectionTitle}>How to Report</h2>
            </div>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.stepNumWrap}>
                  <span className={styles.stepNum}>01</span>
                </div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>Ensure Immediate Safety</p>
                  <p className={styles.stepDesc}>
                    Alert relevant emergency services — Police, Fire, and
                    Medical — as required to protect life and prevent further
                    harm.
                  </p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.stepNumWrap}>
                  <span className={styles.stepNum}>02</span>
                </div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>Call the NSIB Duty Officer</p>
                  <p className={styles.stepDesc}>
                    Contact the NSIB 24/7 Duty Officer at{" "}
                    <strong>+234 807 709 0900</strong> for immediate
                    notification.
                  </p>
                  <span className={styles.stepBadge}>⚡ Immediately</span>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.stepNumWrap}>
                  <span className={styles.stepNum}>03</span>
                </div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>Preserve the Scene</p>
                  <p className={styles.stepDesc}>
                    Do not move wreckage or tamper with evidence unless it is
                    necessary to save lives. Scene integrity is critical to the
                    investigation.
                  </p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.stepNumWrap}>
                  <span className={styles.stepNum}>04</span>
                </div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>Submit a Written Notification</p>
                  <p className={styles.stepDesc}>
                    File a formal notification via our secure{" "}
                    <Link href="/reporting">Online Reporting Portal</Link>{" "}
                    within 24 hours of the occurrence.
                  </p>
                  <span className={styles.stepBadge}>🕐 Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Required Details */}
          <div className={styles.detailsCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionAccent} />
              <h2 className={styles.sectionTitle}>What Details Are Required?</h2>
            </div>
            <p className={styles.detailsIntro}>
              Your notification must include the following information to allow
              the NSIB to initiate a timely investigation.
            </p>
            <div className={styles.detailsGrid}>
              {[
                "Date of occurrence",
                "Time of occurrence",
                "Specific location",
                "Transport mode involved",
                "Brief factual description",
                "Contact information",
              ].map((item) => (
                <div key={item} className={styles.detailItem}>
                  <span className={styles.detailCheck}>✓</span>
                  <span className={styles.detailLabel}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={styles.cta}>
            <div className={styles.ctaText}>
              <h3>Ready to file a report?</h3>
              <p>
                Use our secure Online Reporting Portal to submit your
                notification.
              </p>
            </div>
            <Link href="/reporting" className={styles.ctaBtn}>
              Go to Reporting Portal
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
