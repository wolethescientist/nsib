"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./open-ticket.module.css";

type TicketStatus = "open" | "pending" | "closed";

interface TicketData {
  id: string;
  title: string;
  category: string;
  status: TicketStatus;
  priority: string;
  submitted: string;
  lastUpdated: string;
  assignedTo: string;
  timeline: { event: string; note: string; time: string; latest?: boolean }[];
}

const MOCK_TICKETS: Record<string, TicketData> = {
  "TICK-59392": {
    id: "TICK-59392",
    title: "Aviation Incident Report — LOS-ABJ Flight",
    category: "Aviation · Incident Report",
    status: "open",
    priority: "High",
    submitted: "28 Mar 2026",
    lastUpdated: "3 Apr 2026",
    assignedTo: "Aviation Directorate",
    timeline: [
      {
        event: "Ticket Submitted",
        note: "Initial report received and logged into the NSIB system.",
        time: "28 Mar 2026, 09:14",
      },
      {
        event: "Under Review",
        note: "Assigned to Aviation Directorate for preliminary assessment.",
        time: "29 Mar 2026, 11:30",
      },
      {
        event: "Additional Information Requested",
        note: "Investigator has requested supplementary flight manifest documents.",
        time: "1 Apr 2026, 14:07",
      },
      {
        event: "Active Investigation",
        note: "Field team dispatched. On-site assessment underway.",
        time: "3 Apr 2026, 08:45",
        latest: true,
      },
    ],
  },
  "TICK-10281": {
    id: "TICK-10281",
    title: "Marine Vessel Grounding — Warri Port",
    category: "Marine · Accident Report",
    status: "pending",
    priority: "Medium",
    submitted: "15 Feb 2026",
    lastUpdated: "22 Mar 2026",
    assignedTo: "Marine Directorate",
    timeline: [
      {
        event: "Ticket Submitted",
        note: "Report received from Warri Port Authority.",
        time: "15 Feb 2026, 16:20",
      },
      {
        event: "Acknowledged",
        note: "Ticket logged and routed to Marine Directorate.",
        time: "16 Feb 2026, 09:00",
      },
      {
        event: "Awaiting Documentation",
        note: "Pending receipt of vessel manifest and port authority logs.",
        time: "22 Mar 2026, 13:50",
        latest: true,
      },
    ],
  },
};

type ViewState = "idle" | "loading" | "found" | "notfound";

export default function OpenTicketPage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewState>("idle");
  const [ticket, setTicket] = useState<TicketData | null>(null);

  function handleLookup() {
    const id = query.trim().toUpperCase();
    if (!id) return;

    setView("loading");

    setTimeout(() => {
      const found = MOCK_TICKETS[id];
      if (found) {
        setTicket(found);
        setView("found");
      } else {
        setTicket(null);
        setView("notfound");
      }
    }, 900);
  }

  function handleReset() {
    setQuery("");
    setView("idle");
    setTicket(null);
  }

  const statusLabel: Record<TicketStatus, string> = {
    open: "Active",
    pending: "Awaiting Info",
    closed: "Closed",
  };

  return (
    <div className={styles.page}>
      {/* Antigravity Hero Section */}
      <section className="page-hero" style={{
        backgroundColor: 'var(--nsib-navy)',
        color: 'white',
        padding: '10rem 2rem 8rem',
        position: 'relative',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
        marginBottom: '4rem'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(226, 48, 48, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(226, 48, 48, 0.2)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E23030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <path d="M11 8v3l2 2" />
                </svg>
              </div>
              <span style={{ 
                padding: '0.4rem 1rem', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '50px', 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                letterSpacing: '0.05em', 
                textTransform: 'uppercase',
                backdropFilter: 'blur(10px)'
              }}>Operations Centre</span>
            </div>
            
            <h1 style={{ 
              color: 'white', 
              fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              textShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              Check Ticket Status
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255, 255, 255, 0.8)', 
              maxWidth: '600px', 
              lineHeight: 1.6,
              textShadow: '0 5px 15px rgba(0,0,0,0.2)',
              marginBottom: '2rem'
            }}>
              Enter your ticket ID to securely track the status and history of your support request.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }} />
                <span>Secure lookup</span>
              </div>
              <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div>No login required</div>
              <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div>Real-time status</div>
            </div>
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
      <div className={styles.content}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Lookup Card */}
          <div className={styles.lookupCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Ticket Lookup</h3>
            </div>
            <p className={styles.cardDesc}>
              Enter the ticket ID you received when you submitted your request.
            </p>

            <label className={styles.fieldLabel} htmlFor="ticket-input">
              Ticket ID
            </label>
            <div className={styles.inputGroup}>
              <input
                id="ticket-input"
                type="text"
                className={styles.ticketInput}
                placeholder="e.g. TICK-59392"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
              <button className={styles.lookupBtn} onClick={handleLookup} disabled={view === "loading"}>
                <span>Lookup Ticket</span>
                <svg className={styles.lookupBtnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className={styles.infoCard}>
            <h4>Reference Info</h4>
            <ul className={styles.infoList}>
              <li className={styles.infoListItem}>
                <div className={styles.infoListIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 2v4M16 2v4M4 10h16" />
                  </svg>
                </div>
                <div>
                  <span className={styles.infoListLabel}>Format</span>
                  <span className={styles.infoListValue}>TICK-XXXXX</span>
                </div>
              </li>
              <li className={styles.infoListItem}>
                <div className={styles.infoListIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <span className={styles.infoListLabel}>Response Time</span>
                  <span className={styles.infoListValue}>1–3 business days</span>
                </div>
              </li>
              <li className={styles.infoListItem}>
                <div className={styles.infoListIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.07 19 19.45 19.45 0 0 1 5 12.93 19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <span className={styles.infoListLabel}>Support Line</span>
                  <span className={styles.infoListValue}>+234 (0) 9-523-5019</span>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        {/* Result Panel */}
        <main className={styles.resultPanel}>
          {view === "idle" && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>No Ticket Loaded</h2>
              <p className={styles.emptyDesc}>
                Enter a ticket ID in the lookup form to view its status, assigned directorate, and full activity history.
              </p>
              <span className={styles.emptyExample}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                Try: TICK-59392 or TICK-10281
              </span>
            </div>
          )}

          {view === "loading" && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Searching NSIB records…</p>
            </div>
          )}

          {view === "notfound" && (
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className={styles.errorTitle}>Ticket Not Found</h2>
              <p className={styles.errorDesc}>
                No record was found for <strong>{query.trim().toUpperCase()}</strong>. Please check the ID and try again.
              </p>
              <button className={styles.errorLink} onClick={handleReset}>
                ← Try another ticket
              </button>
            </div>
          )}

          {view === "found" && ticket && (
            <>
              <div className={styles.resultHeader}>
                <div className={styles.resultHeaderLeft}>
                  <span className={styles.resultTicketId}>{ticket.id}</span>
                  <h2 className={styles.resultTitle}>{ticket.title}</h2>
                  <span className={styles.resultCategory}>{ticket.category}</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[ticket.status]}`}>
                  <span className={styles.statusDot} />
                  {statusLabel[ticket.status]}
                </span>
              </div>

              <div className={styles.resultMeta}>
                <div className={styles.metaBlock}>
                  <div className={styles.metaBlockLabel}>Submitted</div>
                  <div className={styles.metaBlockValue}>{ticket.submitted}</div>
                </div>
                <div className={styles.metaBlock}>
                  <div className={styles.metaBlockLabel}>Last Updated</div>
                  <div className={styles.metaBlockValue}>{ticket.lastUpdated}</div>
                </div>
                <div className={styles.metaBlock}>
                  <div className={styles.metaBlockLabel}>Assigned To</div>
                  <div className={styles.metaBlockValue}>{ticket.assignedTo}</div>
                </div>
              </div>

              <div className={styles.timelineSection}>
                <h3 className={styles.timelineSectionTitle}>Activity Timeline</h3>
                <div className={styles.timeline}>
                  {[...ticket.timeline].reverse().map((item, i) => (
                    <div className={styles.timelineItem} key={i}>
                      <div className={styles.timelineLeft}>
                        <div className={`${styles.timelineDot}${item.latest ? ` ${styles.latest}` : ""}`} />
                        <div className={styles.timelineLine} />
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineEvent}>{item.event}</div>
                        <div className={styles.timelineNote}>{item.note}</div>
                        <div className={styles.timelineTime}>{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
