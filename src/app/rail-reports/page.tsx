"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Shared Components (Duplicated to avoid touching All Pubs) ──────────────

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === "left" ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
  </svg>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; text: string }> = {
    "Final Report":       { bg: "#1B2A6B", text: "#fff" },
    "Preliminary":        { bg: "#D97706", text: "#fff" },
    "Preliminary Report": { bg: "#D97706", text: "#fff" },
    "Interim Statement":  { bg: "#0284c7", text: "#fff" },
    "Safety Advisory":    { bg: "#E23030", text: "#fff" },
  };
  const c = map[status] ?? { bg: "#64748B", text: "#fff" };
  return (
    <span style={{
      display: "inline-block",
      padding: "0.2rem 0.65rem",
      borderRadius: "10px",
      fontSize: "0.68rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      backgroundColor: c.bg,
      color: c.text,
      whiteSpace: "nowrap",
    }}>{status}</span>
  );
};

const DownloadBtn = () => (
  <button
    onClick={(e) => { e.stopPropagation(); }}
    style={{
      display: "inline-flex", alignItems: "center", gap: "0.35rem",
      padding: "0.35rem 0.8rem",
      backgroundColor: "#E23030", color: "white",
      border: "none", borderRadius: "6px",
      fontSize: "0.72rem", fontWeight: 700,
      cursor: "pointer", transition: "all 0.18s ease",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#B92424"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#E23030"; e.currentTarget.style.transform = "none"; }}
  >
    <DownloadIcon />PDF
  </button>
);

const TabNav = ({ active }: { active: "all" | "aircraft" | "maritime" | "rail" }) => {
  const tabs = [
    { id: "all",           label: "All Publications",       href: "/publications" },
    { id: "aircraft",      label: "Aircraft Reports",       href: "/air-reports" },
    { id: "maritime",      label: "Maritime Reports",       href: "/marine-reports" },
    { id: "rail",          label: "Rail Reports",           href: "/rail-reports" },
    { id: "news",          label: "News & Updates",         href: "/news" },
    { id: "legislations",  label: "Acts & Legislations",    href: "/legislations" },
    { id: "mou",           label: "MoUs",                   href: "/mou" },
    { id: "forms",         label: "Forms & Checklists",     href: "/investigation-forms-and-checklists" },
    { id: "manuals",       label: "Investigation Manuals",  href: "/investigation-manuals" },
    { id: "foi",           label: "FOI Docs",               href: "/foi" },
  ] as const;
  return (
    <div style={{ display: "flex", borderBottom: "2px solid #E2E8F0", marginBottom: "2rem", overflowX: "auto", gap: 0 }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        return (
          <Link key={tab.id} href={tab.href} style={{
            padding: "0.85rem 1.5rem",
            fontSize: "0.9rem", fontWeight: isActive ? 700 : 600,
            color: isActive ? "#E23030" : "#3A3A3A",
            borderBottom: isActive ? "2px solid #E23030" : "2px solid transparent",
            marginBottom: "-2px", whiteSpace: "nowrap",
            transition: "color 0.2s", textDecoration: "none",
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
    padding: "0.85rem 1rem", textAlign: "left",
    fontSize: "0.72rem", fontWeight: 700,
    color: "white", textTransform: "uppercase",
    letterSpacing: "0.07em", whiteSpace: "nowrap",
    width, borderRight: "1px solid rgba(255,255,255,0.1)",
  }}>{children}</th>
);

const TD = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <td style={{
    padding: "0.9rem 1rem",
    fontSize: "0.855rem",
    color: muted ? "#6A6B70" : "#1E293B",
    borderBottom: "1px solid #F1F5F9",
    verticalAlign: "middle",
  }}>{children}</td>
);

// ─── Data ───────────────────────────────────────────────────────────────────

type PubRecord = {
  sn: number;
  dateReleased: string;
  reportNo: string;
  category: string;
  operator: string;
  regNo: string;
  occurrence: string;
  status: string;
  trainType?: string;
};

const railReports: PubRecord[] = [
  { sn: 41, dateReleased: "2026-03-10", reportNo: "RAL/001/2026", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-LAG-EXP-01", occurrence: "Derailment",               status: "Final Report", trainType: "Passenger Train" },
  { sn: 42, dateReleased: "2026-02-20", reportNo: "RAL/002/2026", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-ABJ-CGO-04", occurrence: "Collision",                status: "Preliminary", trainType: "Freight Train" },
  { sn: 43, dateReleased: "2026-01-15", reportNo: "RAL/003/2026", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE1-003",  occurrence: "Signal Failure",           status: "Final Report", trainType: "Light Rail" },
  { sn: 44, dateReleased: "2025-12-05", reportNo: "RAL/004/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-KAD-001",    occurrence: "Track Obstruction",        status: "Safety Advisory", trainType: "Locomotive" },
  { sn: 45, dateReleased: "2025-11-18", reportNo: "RAL/005/2025", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-BLUE-002",   occurrence: "Overhead Line Fault",      status: "Preliminary", trainType: "Mass Transit" },
  { sn: 46, dateReleased: "2025-10-30", reportNo: "RAL/006/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-PWH-FRT-07", occurrence: "Brake Failure",            status: "Final Report", trainType: "Freight Train" },
  { sn: 47, dateReleased: "2025-09-12", reportNo: "RAL/007/2025", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE2-001",  occurrence: "Door System Malfunction",  status: "Final Report", trainType: "Passenger Train" },
  { sn: 48, dateReleased: "2025-08-25", reportNo: "RAL/008/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-IBA-LCS-02", occurrence: "Level Crossing Collision", status: "Safety Advisory" },
  { sn: 48, dateReleased: "2025-08-04", reportNo: "RAL/008/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-LAG-EXP-02", occurrence: "Derailment",               status: "Preliminary", trainType: "High Speed Train" },
  { sn: 49, dateReleased: "2025-07-22", reportNo: "RAL/009/2025", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-RED-005",    occurrence: "Power Outage",             status: "Final Report", trainType: "Light Rail" },
  { sn: 50, dateReleased: "2025-06-11", reportNo: "RAL/010/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-ABJ-FRT-02", occurrence: "Collision",                status: "Interim Statement", trainType: "Freight Train" },
  { sn: 51, dateReleased: "2025-05-30", reportNo: "RAL/011/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-KAD-021",    occurrence: "Track Defect",             status: "Final Report", trainType: "Locomotive" },
  { sn: 52, dateReleased: "2025-04-18", reportNo: "RAL/012/2025", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE1-008",  occurrence: "Emergency Brake Activation", status: "Safety Advisory", trainType: "Passenger Train" },
  { sn: 53, dateReleased: "2025-03-05", reportNo: "RAL/013/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-LAG-CGO-01", occurrence: "Derailment",               status: "Preliminary", trainType: "Freight Train" },
  { sn: 54, dateReleased: "2025-02-28", reportNo: "RAL/014/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-PWH-EXP-04", occurrence: "Fire on board",            status: "Final Report", trainType: "Passenger Train" },
  { sn: 55, dateReleased: "2025-01-14", reportNo: "RAL/015/2025", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-BLUE-009",   occurrence: "Signal Failure",           status: "Interim Statement", trainType: "Mass Transit" },
  { sn: 56, dateReleased: "2024-12-22", reportNo: "RAL/016/2024", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-KAD-FRT-03", occurrence: "Collision",                status: "Final Report", trainType: "Freight Train" },
  { sn: 57, dateReleased: "2024-11-10", reportNo: "RAL/017/2024", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE2-011",  occurrence: "Door System Malfunction",  status: "Preliminary", trainType: "Passenger Train" },
  { sn: 58, dateReleased: "2024-10-05", reportNo: "RAL/018/2024", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-LAG-EXP-08", occurrence: "Track Obstruction",        status: "Final Report", trainType: "Passenger Train" },
  { sn: 59, dateReleased: "2024-09-18", reportNo: "RAL/019/2024", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-RED-001",    occurrence: "Overhead Line Fault",      status: "Safety Advisory", trainType: "Light Rail" },
  { sn: 60, dateReleased: "2024-08-30", reportNo: "RAL/020/2024", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-ABJ-CGO-02", occurrence: "Derailment",               status: "Final Report", trainType: "Freight Train" }
];

const ITEMS_PER_PAGE = 20;
const YEARS = ["2026", "2025", "2024"];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── Page ───────────────────────────────────────────────────────────────────

export default function RailReportsPage() {
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
    return railReports
      .filter(r => {
        const matchSearch = !q ||
          r.reportNo.toLowerCase().includes(q) ||
          r.operator.toLowerCase().includes(q) ||
          r.occurrence.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.regNo.toLowerCase().includes(q);
        const matchYear = !yearFilter || r.dateReleased.startsWith(yearFilter);
        return matchSearch && matchYear;
      })
      .sort((a, b) => new Date(b.dateReleased).getTime() - new Date(a.dateReleased).getTime());
  }, [search, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleYear   = (v: string) => { setYearFilter(v); setPage(1); };

  return (
    <main style={{ paddingBottom: "8rem", backgroundColor: "var(--bg-primary)", overflowX: "hidden" }}>
      {/* ── Hero ── */}
      <section
        ref={containerRef}
        style={{
          backgroundColor: "var(--nsib-navy)", color: "white",
          padding: "12rem 2rem 10rem", position: "relative",
          overflow: "hidden", marginBottom: "4rem", perspective: "1000px",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at top left, rgba(226, 48, 48, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          zIndex: 0,
        }} />
        <motion.div style={{
          position: "absolute", top: "15%", right: "10%",
          width: "180px", height: "180px", borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
          backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.1)", zIndex: 1, y: y1,
        }}
          animate={{ rotateZ: [20, 25, 20], rotateX: [10, 15, 10], rotateY: [-10, -5, -10], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div style={{
          position: "absolute", bottom: "5%", left: "10%",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(226,48,48,0.15) 0%, rgba(226,48,48,0) 100%)",
          backdropFilter: "blur(24px)", zIndex: 1, y: y2,
        }}
          animate={{ scale: [1, 1.05, 1], y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div className="container" style={{ position: "relative", zIndex: 2, opacity: opacityFade }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ color: "white", fontSize: "clamp(3.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", textShadow: "0 20px 40px rgba(0,0,0,0.4)", letterSpacing: "-0.02em" }}
            >
              Rail Accident<br/>Reports
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.85)", maxWidth: "600px", lineHeight: 1.7, textShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
            >
              Access comprehensive accident data, preliminary investigations, and final analyses of all railway incidents.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <div className="container" style={{ maxWidth: "1400px" }}>
        <TabNav active="rail" />

        {/* Toolbar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: "380px" }}>
            <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "0.9rem", color: "#94A3B8", pointerEvents: "none" }}>
              <SearchIcon />
            </div>
            <input
              type="text" placeholder="Search by report no, operator, occurrence…"
              value={search} onChange={e => handleSearch(e.target.value)}
              style={{
                width: "100%", padding: "0.7rem 1rem 0.7rem 2.6rem",
                border: "1.5px solid #E2E8F0", borderRadius: "8px",
                fontSize: "0.875rem", color: "#1E293B",
                backgroundColor: "white", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#1B2A6B"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          {/* Year filter */}
          <select value={yearFilter} onChange={e => handleYear(e.target.value)}
            style={{
              padding: "0.7rem 1rem", border: "1.5px solid #E2E8F0",
              borderRadius: "8px", fontSize: "0.875rem", color: "#1E293B",
              backgroundColor: "white", cursor: "pointer", outline: "none",
            }}
          >
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Count */}
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
                  {/* S/No, Date Released, Report No, Train Operator, Occurrence, Train Type, REG NO., Status, Report Download */}
                  <TH width="52px">S/N</TH>
                  <TH width="110px">Date Released</TH>
                  <TH width="140px">Report No.</TH>
                  <TH>Train Operator</TH>
                  <TH>Occurrence</TH>
                  <TH width="120px">Train Type</TH>
                  <TH width="120px">REG NO.</TH>
                  <TH width="130px">Status</TH>
                  <TH width="80px">Download</TH>
                </tr>
              </thead>
              <tbody>
                {paged.length > 0 ? paged.map((r, idx) => {
                  const rowBg = idx % 2 === 0 ? "white" : "#F8FAFC";
                  return (
                    <tr key={r.sn}
                      style={{ backgroundColor: rowBg, transition: "background 0.15s", cursor: "default" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EEF2FF")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = rowBg)}
                    >
                      <TD muted>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TD>
                      <TD muted>{formatDate(r.dateReleased)}</TD>
                      <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: "#1B2A6B" }}>{r.reportNo}</span>
                      </td>
                      <TD>{r.operator}</TD>
                      <TD>{r.occurrence}</TD>
                      <TD muted>{r.trainType || "-"}</TD>
                      <TD muted>{r.regNo}</TD>
                      <TD><StatusBadge status={r.status} /></TD>
                      <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle", borderBottom: "1px solid #F1F5F9" }}>
                        <DownloadBtn />
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={9} style={{ padding: "4rem 2rem", textAlign: "center", color: "#94A3B8" }}>
                      <div style={{ fontSize: "0.95rem" }}>No records match your search criteria.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          {totalPages > 1 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1rem 1.5rem", borderTop: "1px solid #F1F5F9",
              backgroundColor: "white", flexWrap: "wrap", gap: "1rem",
            }}>
              <span style={{ fontSize: "0.85rem", color: "#64748B" }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "36px", borderRadius: "8px",
                    border: "1.5px solid #E2E8F0", backgroundColor: "white",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.4 : 1, transition: "all 0.15s",
                    color: "#1B2A6B",
                  }}
                >
                  <ChevronIcon dir="left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      border: n === page ? "1.5px solid #1B2A6B" : "1.5px solid #E2E8F0",
                      backgroundColor: n === page ? "#1B2A6B" : "white",
                      color: n === page ? "white" : "#1B2A6B",
                      fontSize: "0.85rem", fontWeight: n === page ? 700 : 500,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >{n}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "36px", borderRadius: "8px",
                    border: "1.5px solid #E2E8F0", backgroundColor: "white",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.4 : 1, transition: "all 0.15s",
                    color: "#1B2A6B",
                  }}
                >
                  <ChevronIcon dir="right" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status:</span>
          {[["Final Report", "#1B2A6B"], ["Preliminary", "#D97706"], ["Safety Advisory", "#E23030"]].map(([label, bg]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: bg, display: "inline-block" }} />
              <span style={{ fontSize: "0.8rem", color: "#64748B" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
