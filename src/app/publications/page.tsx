"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Icons ─────────────────────────────────────────────────────────────────
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

// ─── Status Badge ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; text: string }> = {
    "Final Report":    { bg: "#1B2A6B", text: "#fff" },
    "Preliminary":     { bg: "#D97706", text: "#fff" },
    "Safety Advisory": { bg: "#E23030", text: "#fff" },
    "Published":       { bg: "#1B2A6B", text: "#fff" },
    "In Force":        { bg: "#1B2A6B", text: "#fff" },
    "Active":          { bg: "#1B2A6B", text: "#fff" },
    "Public":          { bg: "#1B2A6B", text: "#fff" },
    "Current":         { bg: "#1B2A6B", text: "#fff" },
    "Renewed":         { bg: "#2d6a4f", text: "#fff" },
    "Amended":         { bg: "#D97706", text: "#fff" },
    "Under Review":    { bg: "#D97706", text: "#fff" },
    "Draft":           { bg: "#D97706", text: "#fff" },
    "Archived":        { bg: "#64748B", text: "#fff" },
    "Repealed":        { bg: "#E23030", text: "#fff" },
    "Expired":         { bg: "#E23030", text: "#fff" },
    "Obsolete":        { bg: "#E23030", text: "#fff" },
    "Restricted":      { bg: "#E23030", text: "#fff" },
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

// ─── Category Badge ─────────────────────────────────────────────────────────
const CategoryBadge = ({ cat }: { cat: string }) => {
  const map: Record<string, { bg: string; color: string }> = {
    Aircraft:    { bg: "#EFF6FF", color: "#1E40AF" },
    Maritime:    { bg: "#ECFDF5", color: "#065F46" },
    Rail:        { bg: "#FFF7ED", color: "#92400E" },
    News:        { bg: "#F3E8FF", color: "#6B21A8" },
    Legislation: { bg: "#FEF2F2", color: "#991B1B" },
    MoU:         { bg: "#FEF3C7", color: "#92400E" },
    Form:        { bg: "#E0F2FE", color: "#0369A1" },
    Manual:      { bg: "#FCE7F3", color: "#9D174D" },
    FOI:         { bg: "#FFEDD5", color: "#C2410C" },
  };
  const c = map[cat] ?? { bg: "#F1F5F9", color: "#334155" };
  return (
    <span style={{
      display: "inline-block",
      padding: "0.2rem 0.6rem",
      borderRadius: "8px",
      fontSize: "0.68rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      backgroundColor: c.bg,
      color: c.color,
      whiteSpace: "nowrap",
    }}>{cat}</span>
  );
};

// ─── Download Button ────────────────────────────────────────────────────────
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

// ─── Tab Nav ────────────────────────────────────────────────────────────────
const TabNav = ({ active }: { active: string }) => {
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

// ─── Table Header Cell ──────────────────────────────────────────────────────
const TH = ({ children, width }: { children: React.ReactNode; width?: string }) => (
  <th style={{
    padding: "0.85rem 1rem", textAlign: "left",
    fontSize: "0.72rem", fontWeight: 700,
    color: "white", textTransform: "uppercase",
    letterSpacing: "0.07em", whiteSpace: "nowrap",
    width, borderRight: "1px solid rgba(255,255,255,0.1)",
  }}>{children}</th>
);

// ─── Table Data Cell ────────────────────────────────────────────────────────
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
};

const allPublications: PubRecord[] = [
  // ── Aircraft ──
  { sn:  1, dateReleased: "2026-03-15", reportNo: "AIR/001/2026", category: "Aircraft", operator: "Air Peace",                 regNo: "5N-APJ",         occurrence: "Runway Excursion",         status: "Final Report" },
  { sn:  2, dateReleased: "2026-02-28", reportNo: "AIR/002/2026", category: "Aircraft", operator: "Dana Air",                  regNo: "5N-SAB",         occurrence: "Engine Failure",           status: "Preliminary" },
  { sn:  3, dateReleased: "2026-02-10", reportNo: "AIR/003/2026", category: "Aircraft", operator: "Arik Air",                  regNo: "5N-MHG",         occurrence: "Bird Strike",              status: "Final Report" },
  { sn:  4, dateReleased: "2025-12-20", reportNo: "AIR/004/2025", category: "Aircraft", operator: "Ibom Air",                  regNo: "5N-IBJ",         occurrence: "Hard Landing",             status: "Final Report" },
  { sn:  5, dateReleased: "2025-11-05", reportNo: "AIR/005/2025", category: "Aircraft", operator: "United Nigeria Airlines",   regNo: "5N-UNA",         occurrence: "Tail Strike",              status: "Safety Advisory" },
  { sn:  6, dateReleased: "2025-10-18", reportNo: "AIR/006/2025", category: "Aircraft", operator: "Overland Airways",          regNo: "5N-OLR",         occurrence: "Loss of Control",          status: "Preliminary" },
  { sn:  7, dateReleased: "2025-09-22", reportNo: "AIR/007/2025", category: "Aircraft", operator: "Green Africa Airways",      regNo: "5N-GAA",         occurrence: "Fuel Exhaustion",          status: "Final Report" },
  { sn:  8, dateReleased: "2025-08-14", reportNo: "AIR/008/2025", category: "Aircraft", operator: "Air Peace",                 regNo: "5N-APK",         occurrence: "Landing Gear Failure",     status: "Final Report" },
  { sn:  9, dateReleased: "2025-07-30", reportNo: "AIR/009/2025", category: "Aircraft", operator: "ValueJet",                  regNo: "5N-VJT",         occurrence: "Unstabilised Approach",    status: "Safety Advisory" },
  { sn: 10, dateReleased: "2025-06-11", reportNo: "AIR/010/2025", category: "Aircraft", operator: "Azman Air",                 regNo: "5N-AZM",         occurrence: "Ground Collision",         status: "Preliminary" },
  { sn: 11, dateReleased: "2025-05-03", reportNo: "AIR/011/2025", category: "Aircraft", operator: "Arik Air",                  regNo: "5N-MHF",         occurrence: "Aborted Takeoff",          status: "Final Report" },
  { sn: 12, dateReleased: "2025-04-19", reportNo: "AIR/012/2025", category: "Aircraft", operator: "Dana Air",                  regNo: "5N-DAB",         occurrence: "Hydraulic Failure",        status: "Final Report" },
  { sn: 13, dateReleased: "2025-03-25", reportNo: "AIR/013/2025", category: "Aircraft", operator: "Ibom Air",                  regNo: "5N-IBK",         occurrence: "Runway Incursion",         status: "Safety Advisory" },
  { sn: 14, dateReleased: "2025-02-12", reportNo: "AIR/014/2025", category: "Aircraft", operator: "Air Peace",                 regNo: "5N-APL",         occurrence: "CFIT Warning",             status: "Preliminary" },
  { sn: 15, dateReleased: "2024-12-07", reportNo: "AIR/015/2024", category: "Aircraft", operator: "United Nigeria Airlines",   regNo: "5N-UNB",         occurrence: "Smoke in Cabin",           status: "Final Report" },
  { sn: 16, dateReleased: "2024-11-14", reportNo: "AIR/016/2024", category: "Aircraft", operator: "Overland Airways",          regNo: "5N-OLS",         occurrence: "Propeller Malfunction",    status: "Final Report" },
  { sn: 17, dateReleased: "2024-10-02", reportNo: "AIR/017/2024", category: "Aircraft", operator: "Green Africa Airways",      regNo: "5N-GAB",         occurrence: "Windshear Encounter",      status: "Safety Advisory" },
  { sn: 18, dateReleased: "2024-09-18", reportNo: "AIR/018/2024", category: "Aircraft", operator: "Azman Air",                 regNo: "5N-AZN",         occurrence: "Electrical Failure",       status: "Preliminary" },
  { sn: 19, dateReleased: "2024-08-29", reportNo: "AIR/019/2024", category: "Aircraft", operator: "ValueJet",                  regNo: "5N-VJU",         occurrence: "Emergency Landing",        status: "Final Report" },
  { sn: 20, dateReleased: "2024-07-15", reportNo: "AIR/020/2024", category: "Aircraft", operator: "Air Peace",                 regNo: "5N-APM",         occurrence: "Turbulence Incident",      status: "Final Report" },
  // ── Maritime ──
  { sn: 21, dateReleased: "2026-03-20", reportNo: "MAR/001/2026", category: "Maritime", operator: "NLNG Transport Ltd",        regNo: "IMO 9234561",    occurrence: "Grounding",                status: "Final Report" },
  { sn: 22, dateReleased: "2026-02-15", reportNo: "MAR/002/2026", category: "Maritime", operator: "Starz Maritime Ltd",        regNo: "IMO 8901234",    occurrence: "Collision",                status: "Preliminary" },
  { sn: 23, dateReleased: "2026-01-30", reportNo: "MAR/003/2026", category: "Maritime", operator: "Total Marine Services",     regNo: "IMO 9456782",    occurrence: "Fire on Board",            status: "Final Report" },
  { sn: 24, dateReleased: "2025-12-12", reportNo: "MAR/004/2025", category: "Maritime", operator: "Conoil Marine Ltd",         regNo: "IMO 7823456",    occurrence: "Cargo Leakage",            status: "Safety Advisory" },
  { sn: 25, dateReleased: "2025-11-08", reportNo: "MAR/005/2025", category: "Maritime", operator: "Arco Marine Ltd",           regNo: "REG NMT-0098",   occurrence: "Capsizing",                status: "Final Report" },
  { sn: 26, dateReleased: "2025-10-25", reportNo: "MAR/006/2025", category: "Maritime", operator: "FGN Inland Waterways",      regNo: "REG IWT-0234",   occurrence: "Grounding",                status: "Preliminary" },
  { sn: 27, dateReleased: "2025-09-14", reportNo: "MAR/007/2025", category: "Maritime", operator: "Brass Marine Ltd",          regNo: "IMO 9102938",    occurrence: "Equipment Failure",        status: "Final Report" },
  { sn: 28, dateReleased: "2025-08-30", reportNo: "MAR/008/2025", category: "Maritime", operator: "Apapa Shipping Ltd",        regNo: "IMO 8756341",    occurrence: "Loss of Propulsion",       status: "Safety Advisory" },
  { sn: 29, dateReleased: "2025-07-19", reportNo: "MAR/009/2025", category: "Maritime", operator: "Gulf Shipping Co",          regNo: "IMO 9345678",    occurrence: "Structural Failure",       status: "Final Report" },
  { sn: 30, dateReleased: "2025-06-05", reportNo: "MAR/010/2025", category: "Maritime", operator: "Atlantic Maritime Ltd",     regNo: "IMO 8234901",    occurrence: "Collision at Berth",       status: "Preliminary" },
  { sn: 31, dateReleased: "2025-05-22", reportNo: "MAR/011/2025", category: "Maritime", operator: "NMA Vessel Ltd",            regNo: "REG NMA-0567",   occurrence: "Engine Room Fire",         status: "Final Report" },
  { sn: 32, dateReleased: "2025-04-08", reportNo: "MAR/012/2025", category: "Maritime", operator: "Chevron Marine Ltd",        regNo: "IMO 9512837",    occurrence: "Oil Spill",                status: "Safety Advisory" },
  { sn: 33, dateReleased: "2025-03-17", reportNo: "MAR/013/2025", category: "Maritime", operator: "Niger Delta Transport",     regNo: "REG NDT-0123",   occurrence: "Capsizing",                status: "Preliminary" },
  { sn: 34, dateReleased: "2025-02-03", reportNo: "MAR/014/2025", category: "Maritime", operator: "Cross River Maritime",      regNo: "IMO 8634512",    occurrence: "Grounding",                status: "Final Report" },
  { sn: 35, dateReleased: "2024-12-28", reportNo: "MAR/015/2024", category: "Maritime", operator: "Rivers State Ferry Svc",    regNo: "REG RSF-0089",   occurrence: "Collision",                status: "Final Report" },
  { sn: 36, dateReleased: "2024-11-15", reportNo: "MAR/016/2024", category: "Maritime", operator: "Delta Marine Ltd",          regNo: "IMO 9234778",    occurrence: "Cargo Incident",           status: "Safety Advisory" },
  { sn: 37, dateReleased: "2024-10-09", reportNo: "MAR/017/2024", category: "Maritime", operator: "Lagos Ferry Services",      regNo: "REG LFS-0456",   occurrence: "Engine Failure",           status: "Preliminary" },
  { sn: 38, dateReleased: "2024-09-22", reportNo: "MAR/018/2024", category: "Maritime", operator: "NESCO Marine",              regNo: "IMO 8901567",    occurrence: "Structural Damage",        status: "Final Report" },
  { sn: 39, dateReleased: "2024-08-14", reportNo: "MAR/019/2024", category: "Maritime", operator: "Petrolog Marine",           regNo: "IMO 9178923",    occurrence: "Near Miss",                status: "Final Report" },
  { sn: 40, dateReleased: "2024-07-01", reportNo: "MAR/020/2024", category: "Maritime", operator: "Jebba Marine Ltd",          regNo: "REG JBM-0012",   occurrence: "Overloading",              status: "Safety Advisory" },
  // ── Rail ──
  { sn: 41, dateReleased: "2026-03-10", reportNo: "RAL/001/2026", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-LAG-EXP-01", occurrence: "Derailment",               status: "Final Report" },
  { sn: 42, dateReleased: "2026-02-20", reportNo: "RAL/002/2026", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-ABJ-CGO-04", occurrence: "Collision",                status: "Preliminary" },
  { sn: 43, dateReleased: "2026-01-15", reportNo: "RAL/003/2026", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE1-003",  occurrence: "Signal Failure",           status: "Final Report" },
  { sn: 44, dateReleased: "2025-12-05", reportNo: "RAL/004/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-KAD-001",    occurrence: "Track Obstruction",        status: "Safety Advisory" },
  { sn: 45, dateReleased: "2025-11-18", reportNo: "RAL/005/2025", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-BLUE-002",   occurrence: "Overhead Line Fault",      status: "Preliminary" },
  { sn: 46, dateReleased: "2025-10-30", reportNo: "RAL/006/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-PWH-FRT-07", occurrence: "Brake Failure",            status: "Final Report" },
  { sn: 47, dateReleased: "2025-09-12", reportNo: "RAL/007/2025", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE2-001",  occurrence: "Door System Malfunction",  status: "Final Report" },
  { sn: 48, dateReleased: "2025-08-25", reportNo: "RAL/008/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-IBA-LCS-02", occurrence: "Level Crossing Collision", status: "Safety Advisory" },
  { sn: 49, dateReleased: "2025-07-08", reportNo: "RAL/009/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-ENT-007",    occurrence: "Buffer Stop Collision",    status: "Preliminary" },
  { sn: 50, dateReleased: "2025-06-21", reportNo: "RAL/010/2025", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-RED-003",    occurrence: "Platform Incident",        status: "Final Report" },
  { sn: 51, dateReleased: "2025-05-10", reportNo: "RAL/011/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-BEN-FRT-04", occurrence: "Derailment",               status: "Final Report" },
  { sn: 52, dateReleased: "2025-04-05", reportNo: "RAL/012/2025", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE1-009",  occurrence: "Fire Onboard",             status: "Safety Advisory" },
  { sn: 53, dateReleased: "2025-03-20", reportNo: "RAL/013/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-LAG-EXP-05", occurrence: "Trespasser Fatality",      status: "Preliminary" },
  { sn: 54, dateReleased: "2025-02-15", reportNo: "RAL/014/2025", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-JOS-FRT-02", occurrence: "Runaway Wagon",            status: "Final Report" },
  { sn: 55, dateReleased: "2024-12-19", reportNo: "RAL/015/2024", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-BLUE-006",   occurrence: "Electrical Fault",         status: "Final Report" },
  { sn: 56, dateReleased: "2024-11-08", reportNo: "RAL/016/2024", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-ABK-003",    occurrence: "Landslide Obstruction",    status: "Safety Advisory" },
  { sn: 57, dateReleased: "2024-10-14", reportNo: "RAL/017/2024", category: "Rail", operator: "Abuja Metro",                  regNo: "ABM-LINE2-007",  occurrence: "Collision at Station",     status: "Preliminary" },
  { sn: 58, dateReleased: "2024-09-30", reportNo: "RAL/018/2024", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-ENU-FRT-09", occurrence: "Hot Axle Box",             status: "Final Report" },
  { sn: 59, dateReleased: "2024-08-12", reportNo: "RAL/019/2024", category: "Rail", operator: "Nigerian Railway Corp",        regNo: "NRC-LAG-EXP-08", occurrence: "Overcrowding Incident",    status: "Final Report" },
  { sn: 60, dateReleased: "2024-07-20", reportNo: "RAL/020/2024", category: "Rail", operator: "Lagos Light Rail",             regNo: "LLR-RED-011",    occurrence: "Track Crack",              status: "Safety Advisory" },

  // ── News ──
  { sn: 61, dateReleased: "2026-03-28", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Maritime", occurrence: "NSIB Signs MoU with the Nigerian Navy for Maritime Safety", status: "Published" },
  { sn: 62, dateReleased: "2026-03-15", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Announcement", occurrence: "Director General Keynote at Annual Transport Safety Summit", status: "Published" },
  { sn: 63, dateReleased: "2026-03-02", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Aviation", occurrence: "New Safety Recommendations Issued for Domestic Airlines", status: "Published" },
  { sn: 64, dateReleased: "2026-02-18", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Railway", occurrence: "NSIB Completes Preliminary Investigation into Lagos-Ibadan Rail Incident", status: "Published" },
  { sn: 65, dateReleased: "2026-02-05", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "General", occurrence: "NSIB Hosts International Safety Investigators Workshop", status: "Published" },
  { sn: 66, dateReleased: "2026-01-20", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Press Release", occurrence: "Press Release: Annual Safety Statistics Report 2025", status: "Published" },
  { sn: 67, dateReleased: "2025-12-12", reportNo: "-", category: "News", operator: "NSIB Aviation Dept", regNo: "Safety Alert", occurrence: "Safety Alert: Increased Bird Strike Activities at Major Airports", status: "Published" },
  { sn: 68, dateReleased: "2025-11-28", reportNo: "-", category: "News", operator: "NSIB IT Unit", regNo: "Announcement", occurrence: "NSIB Launches New Online Occurrence Reporting Portal", status: "Published" },
  { sn: 69, dateReleased: "2025-11-10", reportNo: "-", category: "News", operator: "NSIB Maritime Dept", regNo: "Maritime", occurrence: "Maritime Advisory: Updated Navigational Protocols for Lagos Port Complex", status: "Published" },
  { sn: 70, dateReleased: "2025-10-25", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Aviation", occurrence: "NSIB Partners with ICAO for Regional Capacity Building Programme", status: "Published" },
  { sn: 71, dateReleased: "2025-10-08", reportNo: "-", category: "News", operator: "NSIB Rail Dept", regNo: "Railway", occurrence: "Rail Safety: Recommendations for Level Crossing Improvements", status: "Published" },
  { sn: 72, dateReleased: "2025-09-22", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "General", occurrence: "NSIB Investigator Training Programme Graduates 45 New Investigators", status: "Published" },
  { sn: 73, dateReleased: "2025-09-05", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Press Release", occurrence: "Press Release: NSIB Response to Dana Air Engine Failure Incident", status: "Published" },
  { sn: 74, dateReleased: "2025-08-18", reportNo: "-", category: "News", operator: "NSIB Aviation Dept", regNo: "Safety Alert", occurrence: "Safety Alert: Fuel Contamination Warning for Aviation Operators", status: "Published" },
  { sn: 75, dateReleased: "2025-07-30", reportNo: "-", category: "News", operator: "NSIB Maritime Dept", regNo: "Maritime", occurrence: "NSIB Delegation Attends IMO Sub-Committee on Casualty Investigation", status: "Published" },
  { sn: 76, dateReleased: "2025-07-12", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Announcement", occurrence: "Announcement: Public Consultation on Draft Safety Regulation Amendments", status: "Published" },
  { sn: 77, dateReleased: "2025-06-25", reportNo: "-", category: "News", operator: "NSIB Rail Dept", regNo: "Railway", occurrence: "NSIB Releases Final Report on Abuja Metro Signal Failure Incident", status: "Published" },
  { sn: 78, dateReleased: "2025-06-08", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "General", occurrence: "Annual Report 2024: Bureau Highlights and Strategic Outlook", status: "Published" },
  { sn: 79, dateReleased: "2025-05-20", reportNo: "-", category: "News", operator: "NSIB Communications", regNo: "Press Release", occurrence: "Press Release: NSIB Welcomes New Board Members", status: "Published" },
  { sn: 80, dateReleased: "2025-05-02", reportNo: "-", category: "News", operator: "NSIB Aviation Dept", regNo: "Safety Alert", occurrence: "Safety Alert: Weather-Related Risks During Harmattan Season", status: "Published" },

  // ── Legislations ──
  { sn: 81, dateReleased: "2026-01-15", reportNo: "LEG/001/2026", category: "Legislation", operator: "General", regNo: "-", occurrence: "NSIB Establishment Act 2022 (Amended 2026)", status: "In Force" },
  { sn: 82, dateReleased: "2025-11-20", reportNo: "LEG/002/2025", category: "Legislation", operator: "Aviation", regNo: "-", occurrence: "Civil Aviation (Amendment) Act 2025", status: "In Force" },
  { sn: 83, dateReleased: "2025-09-10", reportNo: "LEG/003/2025", category: "Legislation", operator: "General", regNo: "-", occurrence: "NSIB Safety Investigation Regulations 2025", status: "In Force" },
  { sn: 84, dateReleased: "2025-08-05", reportNo: "LEG/004/2025", category: "Legislation", operator: "Maritime", regNo: "-", occurrence: "Maritime Operations Safety Act (Amendment) 2025", status: "In Force" },
  { sn: 85, dateReleased: "2025-06-28", reportNo: "LEG/005/2025", category: "Legislation", operator: "Railways", regNo: "-", occurrence: "Railway Safety Regulations 2025", status: "In Force" },
  { sn: 86, dateReleased: "2025-05-15", reportNo: "LEG/006/2025", category: "Legislation", operator: "General", regNo: "-", occurrence: "Transport Accident Investigation (Procedures) Regulations", status: "In Force" },
  { sn: 87, dateReleased: "2025-04-02", reportNo: "LEG/007/2025", category: "Legislation", operator: "Aviation", regNo: "-", occurrence: "Nigerian Airspace Management Agency Act (Consolidated)", status: "In Force" },
  { sn: 88, dateReleased: "2025-02-18", reportNo: "LEG/008/2025", category: "Legislation", operator: "Maritime", regNo: "-", occurrence: "Cabotage Act (Nigeria Coastal and Inland Shipping)", status: "In Force" },
  { sn: 89, dateReleased: "2024-12-10", reportNo: "LEG/009/2024", category: "Legislation", operator: "General", regNo: "-", occurrence: "NSIB (Staff Conditions & Benefits) Regulations 2024", status: "In Force" },
  { sn: 90, dateReleased: "2024-11-05", reportNo: "LEG/010/2024", category: "Legislation", operator: "Aviation", regNo: "-", occurrence: "Civil Aviation Act 2006 (Original)", status: "Amended" },
  { sn: 91, dateReleased: "2024-09-22", reportNo: "LEG/011/2024", category: "Legislation", operator: "Maritime", regNo: "-", occurrence: "Merchant Shipping Act", status: "In Force" },
  { sn: 92, dateReleased: "2024-08-14", reportNo: "LEG/012/2024", category: "Legislation", operator: "Railways", regNo: "-", occurrence: "Nigerian Railway Corporation Act (Cap N129 LFN 2004)", status: "In Force" },
  { sn: 93, dateReleased: "2024-07-01", reportNo: "LEG/013/2024", category: "Legislation", operator: "Aviation", regNo: "-", occurrence: "Federal Airports Authority of Nigeria Act", status: "In Force" },
  { sn: 94, dateReleased: "2024-06-10", reportNo: "LEG/014/2024", category: "Legislation", operator: "Maritime", regNo: "-", occurrence: "International Maritime Organization Conventions (Ratification)", status: "In Force" },
  { sn: 95, dateReleased: "2024-05-05", reportNo: "LEG/015/2024", category: "Legislation", operator: "General", regNo: "-", occurrence: "Accident Investigation (Confidentiality) Regulations 2024", status: "In Force" },
  { sn: 96, dateReleased: "2024-04-18", reportNo: "LEG/016/2024", category: "Legislation", operator: "Aviation", regNo: "-", occurrence: "Nigerian Civil Aviation Regulations (Part 13 - Investigation)", status: "In Force" },
  { sn: 97, dateReleased: "2024-03-02", reportNo: "LEG/017/2024", category: "Legislation", operator: "Maritime", regNo: "-", occurrence: "NIMASA Establishment Act 2007", status: "Amended" },
  { sn: 98, dateReleased: "2024-02-10", reportNo: "LEG/018/2024", category: "Legislation", operator: "Railways", regNo: "-", occurrence: "Railway Infrastructure (Safety Standards) Order 2024", status: "In Force" },
  { sn: 99, dateReleased: "2024-01-20", reportNo: "LEG/019/2024", category: "Legislation", operator: "General", regNo: "-", occurrence: "Freedom of Information Act 2011 (as applicable)", status: "In Force" },
  { sn: 100, dateReleased: "2023-12-05", reportNo: "LEG/020/2023", category: "Legislation", operator: "General", regNo: "-", occurrence: "NSIB Regulations 2023 (Original)", status: "Amended" },

  // ── MoU ──
  { sn: 101, dateReleased: "2026-03-10", reportNo: "-", category: "MoU", operator: "Nigerian Navy", regNo: "Maritime", occurrence: "MoU on Maritime Search, Rescue, and Investigation Support", status: "Active" },
  { sn: 102, dateReleased: "2026-02-15", reportNo: "-", category: "MoU", operator: "Federal Fire Service", regNo: "Multimodal", occurrence: "MoU on First Responder Coordination and Fire Incident Probes", status: "Active" },
  { sn: 103, dateReleased: "2025-11-22", reportNo: "-", category: "MoU", operator: "NCAA", regNo: "Aviation", occurrence: "MoU on Aviation Data Exchange and Regulatory Synergy", status: "Active" },
  { sn: 104, dateReleased: "2025-10-05", reportNo: "-", category: "MoU", operator: "NAMA", regNo: "Aviation", occurrence: "MoU on Air Traffic Control Data and Radar Information Sharing", status: "Active" },
  { sn: 105, dateReleased: "2025-08-30", reportNo: "-", category: "MoU", operator: "NIMASA", regNo: "Maritime", occurrence: "MoU on Marine Accident Investigation and Incident Reporting", status: "Active" },
  { sn: 106, dateReleased: "2025-06-14", reportNo: "-", category: "MoU", operator: "Nigerian Railway Corp (NRC)", regNo: "Railway", occurrence: "MoU on Railway Safety Protocols and Accident Site Access", status: "Active" },
  { sn: 107, dateReleased: "2025-04-10", reportNo: "-", category: "MoU", operator: "NEMA", regNo: "Multimodal", occurrence: "MoU on Emergency Management and Disaster Response Integration", status: "Active" },
  { sn: 108, dateReleased: "2025-02-28", reportNo: "-", category: "MoU", operator: "Univ. of Lagos (UNILAG)", regNo: "Academic", occurrence: "MoU on Academic Research and Safety Engineering Development", status: "Active" },
  { sn: 109, dateReleased: "2024-11-15", reportNo: "-", category: "MoU", operator: "US NTSB", regNo: "International", occurrence: "MoU on Technical Assistance and Investigator Exchange Program", status: "Active" },
  { sn: 110, dateReleased: "2024-09-02", reportNo: "-", category: "MoU", operator: "UK AAIB", regNo: "International", occurrence: "MoU on Bilateral Cooperation in Aircraft Accident Investigation", status: "Renewed" },
  { sn: 111, dateReleased: "2024-07-20", reportNo: "-", category: "MoU", operator: "NiMet", regNo: "Multimodal", occurrence: "MoU on Meteorological Data Sharing for Transport Safety", status: "Active" },
  { sn: 112, dateReleased: "2024-05-18", reportNo: "-", category: "MoU", operator: "Nigerian Defense Academy", regNo: "Academic", occurrence: "MoU on Strategic Safety Leadership and Crisis Management", status: "Active" },
  { sn: 113, dateReleased: "2024-03-05", reportNo: "-", category: "MoU", operator: "Aero Contractors", regNo: "Aviation", occurrence: "MoU on Joint Facility Usage for Technical Tear-down Analysis", status: "Active" },
  { sn: 114, dateReleased: "2023-11-11", reportNo: "-", category: "MoU", operator: "Lagos State Waterways Auth", regNo: "Maritime", occurrence: "MoU on Inland Waterways Safety and Incident Investigation", status: "Active" },
  { sn: 115, dateReleased: "2023-09-24", reportNo: "-", category: "MoU", operator: "FRSC", regNo: "Multimodal", occurrence: "MoU on Road Traffic Crash Data Sharing and Joint Probes", status: "Active" },
  { sn: 116, dateReleased: "2023-08-10", reportNo: "-", category: "MoU", operator: "Singapore TSIB", regNo: "International", occurrence: "MoU on Safety Investigation Methodologies and Best Practices", status: "Active" },
  { sn: 117, dateReleased: "2023-06-15", reportNo: "-", category: "MoU", operator: "Nigerian Police Force", regNo: "Multimodal", occurrence: "MoU on Crime Scene Preservation and Evidence Handling", status: "Active" },
  { sn: 118, dateReleased: "2022-12-05", reportNo: "-", category: "MoU", operator: "Banjul Accord Group (BAGAIA)", regNo: "International", occurrence: "MoU on Regional Aviation Safety Support and Resource Pooling", status: "Renewed" },
  { sn: 119, dateReleased: "2021-10-22", reportNo: "-", category: "MoU", operator: "Cranfield University", regNo: "Academic", occurrence: "MoU on Advanced Investigator Training and Certification", status: "Expired" },
  { sn: 120, dateReleased: "2020-04-18", reportNo: "-", category: "MoU", operator: "FAAN", regNo: "Aviation", occurrence: "MoU on Airport Infrastructure Safety and Emergency Drills", status: "Expired" },

  // ── Form ──
  { sn: 121, dateReleased: "2026-02-15", reportNo: "NSIB-F-001", category: "Form", operator: "Form", regNo: "-", occurrence: "Initial Notification of Aircraft Accident/Incident", status: "Current" },
  { sn: 122, dateReleased: "2026-01-10", reportNo: "NSIB-C-012", category: "Form", operator: "Checklist", regNo: "-", occurrence: "Investigator Go-Team Deployment Checklist", status: "Current" },
  { sn: 123, dateReleased: "2025-11-25", reportNo: "NSIB-F-008", category: "Form", operator: "Form", regNo: "-", occurrence: "Witness Statement Recording Form", status: "Current" },
  { sn: 124, dateReleased: "2025-10-05", reportNo: "NSIB-L-045", category: "Form", operator: "Log", regNo: "-", occurrence: "Chain of Custody Evidence Log", status: "Current" },
  { sn: 125, dateReleased: "2025-08-30", reportNo: "NSIB-C-033", category: "Form", operator: "Checklist", regNo: "-", occurrence: "Maritime Vessel Site Survey Checklist", status: "Current" },
  { sn: 126, dateReleased: "2025-07-22", reportNo: "NSIB-T-004", category: "Form", operator: "Template", regNo: "-", occurrence: "Preliminary Report Standard Template", status: "Current" },
  { sn: 127, dateReleased: "2025-05-18", reportNo: "NSIB-F-092", category: "Form", operator: "Form", regNo: "-", occurrence: "Railway Safety Incident Notification Form", status: "Current" },
  { sn: 128, dateReleased: "2025-03-12", reportNo: "NSIB-C-055", category: "Form", operator: "Checklist", regNo: "-", occurrence: "Flight Data Recorder Recovery Checklist", status: "Current" },
  { sn: 129, dateReleased: "2024-12-05", reportNo: "NSIB-F-019", category: "Form", operator: "Form", regNo: "-", occurrence: "Investigator PPE and Equipment Issuance Form", status: "Current" },
  { sn: 130, dateReleased: "2024-10-14", reportNo: "NSIB-F-022", category: "Form", operator: "Form", regNo: "-", occurrence: "Confidential Safety Reporting Form", status: "Under Review" },
  { sn: 131, dateReleased: "2024-09-02", reportNo: "NSIB-C-078", category: "Form", operator: "Checklist", regNo: "-", occurrence: "Drone Operations Pre-Flight Checklist", status: "Current" },
  { sn: 132, dateReleased: "2024-07-28", reportNo: "NSIB-T-015", category: "Form", operator: "Template", regNo: "-", occurrence: "Final Investigation Report Template (Aviation)", status: "Current" },
  { sn: 133, dateReleased: "2024-05-10", reportNo: "NSIB-L-088", category: "Form", operator: "Log", regNo: "-", occurrence: "Accident Site Access Registry Log", status: "Current" },
  { sn: 134, dateReleased: "2024-02-22", reportNo: "NSIB-F-045", category: "Form", operator: "Form", regNo: "-", occurrence: "Autopsy and Medical History Request Form", status: "Current" },
  { sn: 135, dateReleased: "2023-11-18", reportNo: "NSIB-C-082", category: "Form", operator: "Checklist", regNo: "-", occurrence: "Meteorological Data Collection Checklist", status: "Current" },
  { sn: 136, dateReleased: "2023-08-30", reportNo: "NSIB-F-110", category: "Form", operator: "Form", regNo: "-", occurrence: "Interim Safety Recommendation Form", status: "Current" },
  { sn: 137, dateReleased: "2023-04-15", reportNo: "NSIB-F-001-B", category: "Form", operator: "Form", regNo: "-", occurrence: "Legacy Notification Form (v2022)", status: "Obsolete" },
  { sn: 138, dateReleased: "2022-10-05", reportNo: "NSIB-C-010", category: "Form", operator: "Checklist", regNo: "-", occurrence: "Old Go-Team Dispatch Checklist", status: "Obsolete" },
  { sn: 139, dateReleased: "2022-06-12", reportNo: "NSIB-T-001", category: "Form", operator: "Template", regNo: "-", occurrence: "Legacy Draft Report Template", status: "Obsolete" },
  { sn: 140, dateReleased: "2022-01-20", reportNo: "NSIB-F-050", category: "Form", operator: "Form", regNo: "-", occurrence: "Media Briefing Release Form", status: "Under Review" },

  // ── Manuals ──
  { sn: 141, dateReleased: "2026-03-01", reportNo: "MNL-A-001", category: "Manual", operator: "4th Edition", regNo: "-", occurrence: "Aircraft Accident Investigation Policy and Procedure Manual", status: "Active" },
  { sn: 142, dateReleased: "2026-01-20", reportNo: "MNL-M-002", category: "Manual", operator: "2nd Edition", regNo: "-", occurrence: "Maritime Casualty Investigation Guidelines", status: "Active" },
  { sn: 143, dateReleased: "2025-11-15", reportNo: "MNL-R-003", category: "Manual", operator: "1st Edition", regNo: "-", occurrence: "Railway Safety Incident Analysis Manual", status: "Active" },
  { sn: 144, dateReleased: "2025-09-10", reportNo: "MNL-G-004", category: "Manual", operator: "3rd Edition", regNo: "-", occurrence: "NSIB Human Factors Investigation Manual", status: "Active" },
  { sn: 145, dateReleased: "2025-07-22", reportNo: "MNL-G-005", category: "Manual", operator: "2nd Edition", regNo: "-", occurrence: "Crisis Communications and Family Assistance Manual", status: "Active" },
  { sn: 146, dateReleased: "2025-05-18", reportNo: "MNL-G-006", category: "Manual", operator: "3rd Edition", regNo: "-", occurrence: "FDR and CVR Playback and Analysis Protocols", status: "Active" },
  { sn: 147, dateReleased: "2025-04-05", reportNo: "MNL-A-007", category: "Manual", operator: "2nd Edition", regNo: "-", occurrence: "Helicopter Operations Safety Audit Manual", status: "Active" },
  { sn: 148, dateReleased: "2025-02-14", reportNo: "MNL-G-008", category: "Manual", operator: "1st Edition", regNo: "-", occurrence: "Metallurgical Failure Analysis Guide", status: "Active" },
  { sn: 149, dateReleased: "2024-12-01", reportNo: "MNL-M-009", category: "Manual", operator: "2nd Edition", regNo: "-", occurrence: "Inland Waterways Boat Mishap Probe Manual", status: "Active" },
  { sn: 150, dateReleased: "2024-10-25", reportNo: "MNL-R-010", category: "Manual", operator: "1st Edition", regNo: "-", occurrence: "Train Derailment and Track Defect Investigation Proc.", status: "Draft" },
  { sn: 151, dateReleased: "2024-09-08", reportNo: "MNL-A-011", category: "Manual", operator: "2nd Edition", regNo: "-", occurrence: "Weather-Related Aviation Accident Investigation", status: "Active" },
  { sn: 152, dateReleased: "2024-07-15", reportNo: "MNL-G-012", category: "Manual", operator: "4th Edition", regNo: "-", occurrence: "Investigator Training and Certification Handout", status: "Active" },
  { sn: 153, dateReleased: "2024-05-05", reportNo: "MNL-G-013", category: "Manual", operator: "1st Edition", regNo: "-", occurrence: "Drone / UAV Site Mapping Operational Manual", status: "Active" },
  { sn: 154, dateReleased: "2024-03-22", reportNo: "MNL-A-014", category: "Manual", operator: "3rd Edition", regNo: "-", occurrence: "Air Traffic Control Audio Transcript Procedures", status: "Active" },
  { sn: 155, dateReleased: "2023-12-10", reportNo: "MNL-G-015", category: "Manual", operator: "2nd Edition", regNo: "-", occurrence: "Confidential Aviation Reporting System (CARS) Manual", status: "Active" },
  { sn: 156, dateReleased: "2023-11-05", reportNo: "MNL-G-016", category: "Manual", operator: "3rd Edition", regNo: "-", occurrence: "Evidence Recovery and Chain of Custody Standard", status: "Active" },
  { sn: 157, dateReleased: "2023-08-14", reportNo: "MNL-M-017", category: "Manual", operator: "1st Edition", regNo: "-", occurrence: "Port Terminal Incident Investigation Guide", status: "Active" },
  { sn: 158, dateReleased: "2023-04-20", reportNo: "MNL-A-018", category: "Manual", operator: "3rd Edition", regNo: "-", occurrence: "Legacy Aircraft Accident Probe Manual", status: "Archived" },
  { sn: 159, dateReleased: "2022-11-12", reportNo: "MNL-G-019", category: "Manual", operator: "2nd Edition", regNo: "-", occurrence: "Legacy Human Factors Manual", status: "Archived" },
  { sn: 160, dateReleased: "2021-08-05", reportNo: "MNL-G-020", category: "Manual", operator: "1st Edition", regNo: "-", occurrence: "Basic Safety Investigator Field Guide (2021)", status: "Archived" },

  // ── FOI ──
  { sn: 161, dateReleased: "2026-03-31", reportNo: "FOI-2026-Q1-FN", category: "FOI", operator: "Financial", regNo: "-", occurrence: "NSIB Q1 2026 Budget Execution Report", status: "Public" },
  { sn: 162, dateReleased: "2026-02-15", reportNo: "FOI-2026-PR-02", category: "FOI", operator: "Procurement", regNo: "-", occurrence: "Procurement Plan for FY 2026", status: "Public" },
  { sn: 163, dateReleased: "2026-01-10", reportNo: "FOI-2025-AN-01", category: "FOI", operator: "Admin", regNo: "-", occurrence: "NSIB Annual FOI Compliance Report 2025", status: "Public" },
  { sn: 164, dateReleased: "2025-12-30", reportNo: "FOI-2025-Q4-FN", category: "FOI", operator: "Financial", regNo: "-", occurrence: "NSIB Q4 2025 Financial Summary", status: "Public" },
  { sn: 165, dateReleased: "2025-11-20", reportNo: "FOI-2025-HR-05", category: "FOI", operator: "Admin", regNo: "-", occurrence: "Staff Nominal Roll Summary (Redacted)", status: "Public" },
  { sn: 166, dateReleased: "2025-10-15", reportNo: "FOI-2025-PR-08", category: "FOI", operator: "Procurement", regNo: "-", occurrence: "Contract Award: Metallurgical Lab Equipment", status: "Public" },
  { sn: 167, dateReleased: "2025-09-30", reportNo: "FOI-2025-Q3-FN", category: "FOI", operator: "Financial", regNo: "-", occurrence: "NSIB Q3 2025 Budget Execution Report", status: "Public" },
  { sn: 168, dateReleased: "2025-08-12", reportNo: "FOI-2025-PL-02", category: "FOI", operator: "Policy", regNo: "-", occurrence: "FOI Request Treatment and Response Policy", status: "Public" },
  { sn: 169, dateReleased: "2025-07-05", reportNo: "FOI-2025-LG-03", category: "FOI", operator: "Legal", regNo: "-", occurrence: "Legal Framework for Information Disclosure", status: "Public" },
  { sn: 170, dateReleased: "2025-06-30", reportNo: "FOI-2025-Q2-FN", category: "FOI", operator: "Financial", regNo: "-", occurrence: "NSIB Q2 2025 Financial Summary", status: "Public" },
  { sn: 171, dateReleased: "2025-05-18", reportNo: "FOI-2025-PR-04", category: "FOI", operator: "Procurement", regNo: "-", occurrence: "Contract Award: IT Network Upgrade", status: "Public" },
  { sn: 172, dateReleased: "2025-04-10", reportNo: "FOI-2025-PR-03", category: "FOI", operator: "Procurement", regNo: "-", occurrence: "Bidding Notice: Vehicle Fleet Maintenance", status: "Public" },
  { sn: 173, dateReleased: "2025-03-31", reportNo: "FOI-2025-Q1-FN", category: "FOI", operator: "Financial", regNo: "-", occurrence: "NSIB Q1 2025 Budget Execution Report", status: "Public" },
  { sn: 174, dateReleased: "2025-02-28", reportNo: "FOI-2025-AD-02", category: "FOI", operator: "Admin", regNo: "-", occurrence: "List of NSIB Board Members and Allowances", status: "Public" },
  { sn: 175, dateReleased: "2025-01-15", reportNo: "FOI-2024-AN-01", category: "FOI", operator: "Admin", regNo: "-", occurrence: "NSIB Annual FOI Compliance Report 2024", status: "Public" },
  { sn: 176, dateReleased: "2024-12-30", reportNo: "FOI-2024-Q4-FN", category: "FOI", operator: "Financial", regNo: "-", occurrence: "NSIB Q4 2024 Financial Summary", status: "Archived" },
  { sn: 177, dateReleased: "2024-10-05", reportNo: "FOI-2024-PR-11", category: "FOI", operator: "Procurement", regNo: "-", occurrence: "Contract Award: Abuja HQ Facility Management", status: "Archived" },
  { sn: 178, dateReleased: "2024-06-30", reportNo: "FOI-2024-Q2-FN", category: "FOI", operator: "Financial", regNo: "-", occurrence: "NSIB Q2 2024 Budget Execution Report", status: "Archived" },
  { sn: 179, dateReleased: "2024-03-15", reportNo: "FOI-2024-PL-01", category: "FOI", operator: "Policy", regNo: "-", occurrence: "Data Protection and Privacy Policy", status: "Public" },
  { sn: 180, dateReleased: "2023-12-31", reportNo: "FOI-2023-AN-01", category: "FOI", operator: "Admin", regNo: "-", occurrence: "NSIB Annual FOI Compliance Report 2023", status: "Archived" },

];

const ITEMS_PER_PAGE = 20;
const YEARS = ["2026", "2025", "2024"];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── Page ───────────────────────────────────────────────────────────────────
export default function PublicationsPage() {
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
    return allPublications
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
    <main style={{ paddingBottom: "8rem", backgroundColor: "var(--bg-primary)" }}>

      {/* ── Hero ── */}
      <section
        ref={containerRef}
        className="page-hero"
        style={{
          backgroundColor: "var(--nsib-navy)", color: "white",
          padding: "12rem 2rem 10rem", position: "relative",
          overflow: "hidden", marginBottom: "4rem", perspective: "1000px",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at top right, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(226, 48, 48, 0.12) 0%, transparent 60%)",
          zIndex: 0,
        }} />
        <motion.div style={{
          position: "absolute", top: "15%", right: "10%",
          width: "180px", height: "180px", borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.1)", zIndex: 1, y: y1,
        }}
          animate={{ rotateZ: [15, 20, 15], rotateX: [10, 15, 10], rotateY: [-10, -5, -10], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div style={{
          position: "absolute", bottom: "5%", left: "8%",
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
              Publications &amp; Reports
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.85)", maxWidth: "600px", lineHeight: 1.7, textShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
            >
              Access official accident investigation reports, safety advisories, and findings across aviation, maritime, and rail sectors.
            </motion.p>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              style={{ display: "flex", gap: "2.5rem", marginTop: "2.5rem", flexWrap: "wrap" }}
            >
              {[
                { label: "Total Records", value: "180+" },
                { label: "Aircraft Reports", value: "20" },
                { label: "Maritime Reports", value: "20" },
                { label: "Rail Reports", value: "20" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "white" }}>{s.value}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "0.2rem" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <div className="container" style={{ maxWidth: "1400px" }}>
        <TabNav active="all" />

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
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "960px" }}>
              <thead>
                <tr style={{ backgroundColor: "#1B2A6B" }}>
                  <TH width="52px">S/N</TH>
                  <TH width="110px">Date</TH>
                  <TH width="140px">Ref / Rep No.</TH>
                  <TH width="100px">Category</TH>
                  <TH>Entity / Author</TH>
                  <TH width="140px">Scope / Reg No.</TH>
                  <TH>Title / Subject</TH>
                  <TH width="100px">Status</TH>
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
                      <TD><CategoryBadge cat={r.category} /></TD>
                      <TD>{r.operator}</TD>
                      <TD muted>{r.regNo}</TD>
                      <TD>{r.occurrence}</TD>
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
          {[
            ["Final Report / Public / In Force", "#1B2A6B"], 
            ["Preliminary / Under Review", "#D97706"], 
            ["Advisory / Obsolete", "#E23030"]
          ].map(([label, bg]) => (
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
