"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Shared Components ──────────────────────────────────────────────────────

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === "left" ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
  </svg>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; text: string }> = {
    "Public":    { bg: "#1B2A6B", text: "#fff" },
    "Archived":  { bg: "#64748B", text: "#fff" },
    "Restricted":{ bg: "#E23030", text: "#fff" },
  };
  const c = map[status] ?? { bg: "#64748B", text: "#fff" };
  return (
    <span style={{
      display: "inline-block", padding: "0.2rem 0.65rem", borderRadius: "10px",
      fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.05em", backgroundColor: c.bg, color: c.text, whiteSpace: "nowrap",
    }}>{status}</span>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const map: Record<string, string> = {
    "Procurement": "#1B2A6B", "Financial": "#0077B6", "Admin": "#6A0572", "Legal": "#2d6a4f", "Policy": "#D97706"
  };
  return (
    <span style={{
      display: "inline-block", padding: "0.2rem 0.55rem", borderRadius: "10px",
      fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.05em", backgroundColor: map[type] ?? "#64748B", color: "#fff", whiteSpace: "nowrap",
    }}>{type}</span>
  );
};

const DownloadBtn = () => (
  <button onClick={(e) => { e.stopPropagation(); }} style={{
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    padding: "0.35rem 0.8rem", backgroundColor: "#E23030", color: "white",
    border: "none", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700,
    cursor: "pointer", transition: "all 0.18s ease", whiteSpace: "nowrap",
  }}
  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#B92424"; e.currentTarget.style.transform = "translateY(-1px)"; }}
  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#E23030"; e.currentTarget.style.transform = "none"; }}
  ><DownloadIcon />PDF</button>
);

const TabNav = ({ active }: { active: string }) => {
  const tabs = [
    { id: "all",      label: "All Publications",    href: "/publications" },
    { id: "forms",    label: "Forms & Checklists",   href: "/investigation-forms-and-checklists" },
    { id: "manuals",  label: "Investigation Manuals",href: "/investigation-manuals" },
    { id: "foi",      label: "FOI Docs",             href: "/foi" },
  ] as const;
  return (
    <div style={{ display: "flex", borderBottom: "2px solid #E2E8F0", marginBottom: "2rem", overflowX: "auto", gap: 0 }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        return (
          <Link key={tab.id} href={tab.href} style={{
            padding: "0.85rem 1.5rem", fontSize: "0.9rem", fontWeight: isActive ? 700 : 600,
            color: isActive ? "#E23030" : "#3A3A3A",
            borderBottom: isActive ? "2px solid #E23030" : "2px solid transparent",
            marginBottom: "-2px", whiteSpace: "nowrap", transition: "color 0.2s", textDecoration: "none",
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#1B2A6B"; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#3A3A3A"; }}
          >{tab.label}</Link>
        );
      })}
    </div>
  );
};

const TH = ({ children, width }: { children: React.ReactNode; width?: string }) => (
  <th style={{
    padding: "0.85rem 1rem", fontSize: "0.72rem", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.95)",
    borderBottom: "2px solid rgba(255,255,255,0.15)", textAlign: "left",
    whiteSpace: "nowrap", width: width || "auto",
  }}>{children}</th>
);

const TD = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <td style={{
    padding: "0.9rem 1rem", fontSize: "0.855rem",
    color: muted ? "#6A6B70" : "#1E293B",
    borderBottom: "1px solid #F1F5F9", verticalAlign: "middle",
  }}>{children}</td>
);

// ─── Data ───────────────────────────────────────────────────────────────────

type FOIRecord = {
  sn: number;
  datePublished: string;
  refNo: string;
  title: string;
  type: string;
  status: string;
};

const foiRecords: FOIRecord[] = [
  { sn: 1,  datePublished: "2026-03-31", refNo: "FOI-2026-Q1-FN", title: "NSIB Q1 2026 Budget Execution Report",            type: "Financial",   status: "Public" },
  { sn: 2,  datePublished: "2026-02-15", refNo: "FOI-2026-PR-02", title: "Procurement Plan for FY 2026",                    type: "Procurement", status: "Public" },
  { sn: 3,  datePublished: "2026-01-10", refNo: "FOI-2025-AN-01", title: "NSIB Annual FOI Compliance Report 2025",          type: "Admin",       status: "Public" },
  { sn: 4,  datePublished: "2025-12-30", refNo: "FOI-2025-Q4-FN", title: "NSIB Q4 2025 Financial Summary",                  type: "Financial",   status: "Public" },
  { sn: 5,  datePublished: "2025-11-20", refNo: "FOI-2025-HR-05", title: "Staff Nominal Roll Summary (Redacted)",           type: "Admin",       status: "Public" },
  { sn: 6,  datePublished: "2025-10-15", refNo: "FOI-2025-PR-08", title: "Contract Award: Metallurgical Lab Equipment",     type: "Procurement", status: "Public" },
  { sn: 7,  datePublished: "2025-09-30", refNo: "FOI-2025-Q3-FN", title: "NSIB Q3 2025 Budget Execution Report",            type: "Financial",   status: "Public" },
  { sn: 8,  datePublished: "2025-08-12", refNo: "FOI-2025-PL-02", title: "FOI Request Treatment and Response Policy",       type: "Policy",      status: "Public" },
  { sn: 9,  datePublished: "2025-07-05", refNo: "FOI-2025-LG-03", title: "Legal Framework for Information Disclosure",      type: "Legal",       status: "Public" },
  { sn: 10, datePublished: "2025-06-30", refNo: "FOI-2025-Q2-FN", title: "NSIB Q2 2025 Financial Summary",                  type: "Financial",   status: "Public" },
  { sn: 11, datePublished: "2025-05-18", refNo: "FOI-2025-PR-04", title: "Contract Award: IT Network Upgrade",              type: "Procurement", status: "Public" },
  { sn: 12, datePublished: "2025-04-10", refNo: "FOI-2025-PR-03", title: "Bidding Notice: Vehicle Fleet Maintenance",       type: "Procurement", status: "Public" },
  { sn: 13, datePublished: "2025-03-31", refNo: "FOI-2025-Q1-FN", title: "NSIB Q1 2025 Budget Execution Report",            type: "Financial",   status: "Public" },
  { sn: 14, datePublished: "2025-02-28", refNo: "FOI-2025-AD-02", title: "List of NSIB Board Members and Allowances",       type: "Admin",       status: "Public" },
  { sn: 15, datePublished: "2025-01-15", refNo: "FOI-2024-AN-01", title: "NSIB Annual FOI Compliance Report 2024",          type: "Admin",       status: "Public" },
  { sn: 16, datePublished: "2024-12-30", refNo: "FOI-2024-Q4-FN", title: "NSIB Q4 2024 Financial Summary",                  type: "Financial",   status: "Archived" },
  { sn: 17, datePublished: "2024-10-05", refNo: "FOI-2024-PR-11", title: "Contract Award: Abuja HQ Facility Management",    type: "Procurement", status: "Archived" },
  { sn: 18, datePublished: "2024-06-30", refNo: "FOI-2024-Q2-FN", title: "NSIB Q2 2024 Budget Execution Report",            type: "Financial",   status: "Archived" },
  { sn: 19, datePublished: "2024-03-15", refNo: "FOI-2024-PL-01", title: "Data Protection and Privacy Policy",              type: "Policy",      status: "Public" },
  { sn: 20, datePublished: "2023-12-31", refNo: "FOI-2023-AN-01", title: "NSIB Annual FOI Compliance Report 2023",          type: "Admin",       status: "Archived" },
];

const ITEMS_PER_PAGE = 20;
const YEARS = ["2026", "2025", "2024", "2023"];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── Page ───────────────────────────────────────────────────────────────────

export default function FOIPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return foiRecords
      .filter(r => {
        const matchSearch = !q ||
          r.title.toLowerCase().includes(q) ||
          r.refNo.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q);
        const matchYear = !yearFilter || r.datePublished.startsWith(yearFilter);
        return matchSearch && matchYear;
      })
      .sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
  }, [search, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleYear   = (v: string) => { setYearFilter(v); setPage(1); };

  return (
    <main style={{ paddingBottom: "8rem", backgroundColor: "var(--bg-primary)", overflowX: "hidden" }}>
      {/* ── Hero ── */}
      <section ref={containerRef} style={{
        backgroundColor: "var(--nsib-navy)", color: "white",
        padding: "12rem 2rem 10rem", position: "relative",
        overflow: "hidden", marginBottom: "4rem", perspective: "1000px",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at top right, rgba(0, 168, 255, 0.2) 0%, transparent 40%), radial-gradient(circle at bottom center, rgba(255, 255, 255, 0.1) 0%, transparent 60%)", zIndex: 0 }} />
        <motion.div style={{ position: "absolute", top: "15%", right: "10%", width: "180px", height: "180px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.1)", zIndex: 1, y: y1 }}
          animate={{ rotateZ: [15, 20, 15], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div style={{ position: "absolute", bottom: "5%", left: "8%", width: "300px", height: "300px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(0,168,255,0.08) 0%, rgba(0,168,255,0) 100%)", backdropFilter: "blur(24px)", zIndex: 1, y: y2 }}
          animate={{ scale: [1, 1.05, 1], y: [0, -15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="container" style={{ position: "relative", zIndex: 2, opacity: opacityFade }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ color: "white", fontSize: "clamp(3.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", textShadow: "0 20px 40px rgba(0,0,0,0.4)", letterSpacing: "-0.02em" }}>
              Freedom of<br/>Information
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.85)", maxWidth: "600px", lineHeight: 1.7, textShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>
              Access transparent records, financial summaries, procurement details, and FOI compliance reports in accordance with the FOI Act.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <div className="container" style={{ maxWidth: "1400px" }}>
        <TabNav active="foi" />

        {/* Toolbar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: "380px" }}>
            <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "0.9rem", color: "#94A3B8", pointerEvents: "none" }}><SearchIcon /></div>
            <input type="text" placeholder="Search by title, ref no, type…"
              value={search} onChange={e => handleSearch(e.target.value)}
              style={{ width: "100%", padding: "0.7rem 1rem 0.7rem 2.6rem", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "0.875rem", color: "#1E293B", backgroundColor: "white", outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#1B2A6B"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
          </div>
          <select value={yearFilter} onChange={e => handleYear(e.target.value)}
            style={{ padding: "0.7rem 1rem", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "0.875rem", color: "#1E293B", backgroundColor: "white", cursor: "pointer", outline: "none" }}>
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#64748B", whiteSpace: "nowrap" }}>
            Showing <strong style={{ color: "#1B2A6B" }}>{paged.length}</strong> of <strong style={{ color: "#1B2A6B" }}>{filtered.length}</strong> records
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
              <thead>
                <tr style={{ backgroundColor: "#1B2A6B" }}>
                  <TH width="52px">S/N</TH>
                  <TH width="120px">Date Published</TH>
                  <TH width="160px">Reference No.</TH>
                  <TH>Document Title</TH>
                  <TH width="120px">Type</TH>
                  <TH width="100px">Status</TH>
                  <TH width="80px">Download</TH>
                </tr>
              </thead>
              <tbody>
                {paged.length > 0 ? paged.map((r, idx) => {
                  const rowBg = idx % 2 === 0 ? "white" : "#F8FAFC";
                  return (
                    <tr key={r.sn} style={{ backgroundColor: rowBg, transition: "background 0.15s", cursor: "default" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EEF2FF")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = rowBg)}>
                      <TD muted>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TD>
                      <TD muted>{formatDate(r.datePublished)}</TD>
                      <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle", borderBottom: "1px solid #F1F5F9" }}><span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#1B2A6B" }}>{r.refNo}</span></td>
                      <TD><span style={{ fontWeight: 600, color: "#1E293B" }}>{r.title}</span></TD>
                      <TD><TypeBadge type={r.type} /></TD>
                      <TD><StatusBadge status={r.status} /></TD>
                      <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle", borderBottom: "1px solid #F1F5F9" }}><DownloadBtn /></td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={7} style={{ padding: "4rem 2rem", textAlign: "center", color: "#94A3B8" }}><div style={{ fontSize: "0.95rem" }}>No records match your search criteria.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderTop: "1px solid #F1F5F9", backgroundColor: "white", flexWrap: "wrap", gap: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "#64748B" }}>Page {page} of {totalPages}</span>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1.5px solid #E2E8F0", backgroundColor: "white", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, transition: "all 0.15s", color: "#1B2A6B" }}><ChevronIcon dir="left" /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} style={{ width: "36px", height: "36px", borderRadius: "8px", border: n === page ? "1.5px solid #1B2A6B" : "1.5px solid #E2E8F0", backgroundColor: n === page ? "#1B2A6B" : "white", color: n === page ? "white" : "#1B2A6B", fontSize: "0.85rem", fontWeight: n === page ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1.5px solid #E2E8F0", backgroundColor: "white", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, transition: "all 0.15s", color: "#1B2A6B" }}><ChevronIcon dir="right" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status:</span>
          {["Public", "Archived", "Restricted"].map((label) => {
             const m = {"Public": "#1B2A6B", "Archived": "#64748B", "Restricted": "#E23030"} as any;
             return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: m[label], display: "inline-block" }} />
                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>{label}</span>
              </div>
             )
          })}
        </div>
      </div>
    </main>
  );
}
