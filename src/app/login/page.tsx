"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail, password: regPassword, full_name: regName }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      setSuccess("Account created. Redirecting to dashboard…");
      setTimeout(() => router.push("/dashboard"), 1200);
    }
  };

  return (
    <div className={styles.page}>
      {/* Brand Panel */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          <Link href="/" style={{
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
          }}>
            <span>←</span>
            <span>Back to Website</span>
          </Link>
          <h1 className={styles.brandTitle}>
            NSIB<br />
            Staff<br />
            <span>Portal</span>
          </h1>
          <p className={styles.brandDesc}>
            Secure access for NSIB staff to upload and manage investigation reports across all transport sectors.
          </p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                </svg>
              </div>
              Upload Aviation, Marine &amp; Rail Reports
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              Secure document management
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              Real-time public visibility
            </li>
          </ul>
        </div>
        <div className={styles.brandAccent} />
      </div>

      {/* Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
              onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
            >
              Sign In
            </button>
            <button
              className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`}
              onClick={() => { setActiveTab("register"); setError(""); setSuccess(""); }}
            >
              Register
            </button>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className={styles.successAlert}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {success}
            </div>
          )}

          {activeTab === "login" ? (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Welcome back</h2>
                <p className={styles.formSubtitle}>Sign in to access the staff portal.</p>
              </div>
              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="you@nsib.gov.ng"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    <>
                      <span>Sign in to Portal</span>
                      <svg className={styles.submitArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Create account</h2>
                <p className={styles.formSubtitle}>Register as an NSIB staff member.</p>
              </div>
              <form className={styles.form} onSubmit={handleRegister}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-name">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    className={styles.input}
                    placeholder="John Doe"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-email">Email Address</label>
                  <input
                    id="reg-email"
                    type="email"
                    className={styles.input}
                    placeholder="you@nsib.gov.ng"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    className={styles.input}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <svg className={styles.submitArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className={styles.divider}>or</div>
          <div className={styles.registerRow}>
            <Link href="/" className={styles.registerLink}>← Return to NSIB website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
