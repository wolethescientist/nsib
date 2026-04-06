"use client";

import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      {/* Brand Panel */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          <Link href="/operations-centre" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--nsib-slate-light)",
            textDecoration: "none",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--nsib-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--nsib-slate-light)"}
          >
            <span>←</span>
            <span>Back to Operations Centre</span>
          </Link>
          <h1 className={styles.brandTitle}>
            Online<br />
            Learning<br />
            <span>Centre</span>
          </h1>
          <p className={styles.brandDesc}>
            Access NSIB's professional training platform for aviation, marine, and rail safety investigation.
          </p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              Investigation training modules
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              Professional certifications
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              Multi-sector membership plans
            </li>
          </ul>
        </div>
        <div className={styles.brandAccent} />
      </div>

      {/* Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Sign in</h2>
            <p className={styles.formSubtitle}>Access your courses and certificates.</p>
          </div>

          <form className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label className={styles.label} htmlFor="password">Password</label>
                <Link href="#" className={styles.forgotLink}>Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span>Sign in to OLC</span>
              <svg className={styles.submitArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>

          <div className={styles.divider}>or</div>

          <div className={styles.registerRow}>
            <span>Don&apos;t have an account? </span>
            <Link href="/membership-account/membership-levels" className={styles.registerLink}>
              View Memberships →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
