'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './help-desk.module.css';

const CATEGORIES = [
  {
    value: 'technical',
    label: 'Technical Support',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: 'inquiry',
    label: 'General Inquiry',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
    ),
  },
  {
    value: 'foi',
    label: 'FOI Request',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    value: 'login',
    label: 'Login Issue',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'normal', label: 'Normal', color: '#2563eb' },
  { value: 'high', label: 'High', color: '#d97706' },
  { value: 'urgent', label: 'Urgent', color: '#dc2626' },
];

export default function HelpDeskPage() {
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [selectedPriority, setSelectedPriority] = useState('normal');

  return (
    <main className={styles.page}>
      {/* Antigravity Hero Section */}
      <section style={{ 
        backgroundColor: 'var(--nsib-navy)', 
        color: 'white', 
        padding: '10rem 0 8rem',
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
          <Link href="/operations-centre" style={{
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
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "white"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          >
            <span>←</span>
            <span>Back to Operations Centre</span>
          </Link>
          <br />
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
            color: 'white',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Support Services
          </div>

          <h1 style={{
            fontSize: "clamp(2.6rem, 5vw, 4.5rem)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "800px",
            marginBottom: "1.5rem",
            textShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            Operational Help Desk
          </h1>

          <p style={{
            fontSize: "1.25rem",
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: 1.6,
            maxWidth: "600px",
            marginBottom: "2rem",
            textShadow: '0 5px 15px rgba(0,0,0,0.2)'
          }}>
            Submit support requests, follow up on existing tickets, and access technical assistance from the NSIB operations team.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
               Help Desk Online
             </div>
             <span>|</span>
             <span>Mon – Fri · 8:00 AM – 5:00 PM WAT</span>
             <span>|</span>
             <span>Avg. response: 24 hrs</span>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
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
        `}} />
      </section>

      {/* Content */}
      <section className={styles.content}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Track Ticket */}
          <div className={styles.statusCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>Track a Ticket</h3>
            </div>
            <p>Enter your ticket ID to check the current status of your support request.</p>
            <div className={styles.searchGroup}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="e.g. TICK-1234"
                aria-label="Ticket ID"
              />
              <button type="button" className={styles.searchBtn}>Check</button>
            </div>
          </div>

          {/* Info */}
          <div className={styles.infoCard}>
            <h4>Direct Channels</h4>
            <ul className={styles.infoList}>
              <li className={styles.infoListItem}>
                <div className={styles.infoListIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <span className={styles.infoListLabel}>Email</span>
                  <span className={styles.infoListValue}>helpdesk@nsib.gov.ng</span>
                </div>
              </li>
              <li className={styles.infoListItem}>
                <div className={styles.infoListIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6 6l.96-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
                  </svg>
                </div>
                <div>
                  <span className={styles.infoListLabel}>Phone</span>
                  <span className={styles.infoListValue}>+234 (0) 9 — 8765 4321</span>
                </div>
              </li>
              <li className={styles.infoListItem}>
                <div className={styles.infoListIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <span className={styles.infoListLabel}>Office Hours</span>
                  <span className={styles.infoListValue}>Mon – Fri, 8 AM – 5 PM WAT</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>Open a New Ticket</h2>
            <span className={styles.formTag}>Secure Submission</span>
          </div>

          <form className={styles.formBody}>
            {/* Category */}
            <fieldset className={styles.fieldset}>
              <span className={styles.fieldLabel}>Category</span>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <label key={cat.value} className={styles.catOption}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={() => setSelectedCategory(cat.value)}
                    />
                    <span className={styles.catCard}>
                      <span className={styles.catIcon}>{cat.icon}</span>
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Name + Email */}
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="hd-name">Full Name</label>
                <input id="hd-name" type="text" className={styles.input} placeholder="Enter your full name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="hd-email">Email Address</label>
                <input id="hd-email" type="email" className={styles.input} placeholder="your@email.com" />
              </div>
            </div>

            {/* Organisation + Phone */}
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="hd-org">Organisation <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                <input id="hd-org" type="text" className={styles.input} placeholder="Your organisation" />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="hd-phone">Phone <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                <input id="hd-phone" type="tel" className={styles.input} placeholder="+234 (0)..." />
              </div>
            </div>

            {/* Priority */}
            <fieldset className={styles.fieldset}>
              <span className={styles.fieldLabel}>Priority</span>
              <div className={styles.priorityRow}>
                {PRIORITIES.map((p) => (
                  <label key={p.value} className={styles.priorityOption}>
                    <input
                      type="radio"
                      name="priority"
                      value={p.value}
                      checked={selectedPriority === p.value}
                      onChange={() => setSelectedPriority(p.value)}
                    />
                    <span className={styles.priorityBadge}>
                      <span className={styles.priorityDot} style={{ background: p.color }} />
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Description */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="hd-desc">Description</label>
              <textarea
                id="hd-desc"
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, or relevant context."
              />
            </div>

            {/* Submit */}
            <div className={styles.submitRow}>
              <span className={styles.submitNote}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your data is handled securely and confidentially.
              </span>
              <button type="submit" className={styles.submitBtn}>
                Submit Ticket
                <svg className={styles.submitArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
