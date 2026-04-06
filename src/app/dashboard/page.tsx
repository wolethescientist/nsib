"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";

type Sector = "aviation" | "maritime" | "railway";
type ReportType = "preliminary" | "final" | "interim" | "safety_bulletin";
type NewsCategory = "general" | "safety" | "aviation" | "maritime" | "railway" | "press_release" | "announcement";

interface Report {
  id: string;
  title: string;
  type: ReportType;
  sector: Sector;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  published_at: string;
  created_at: string;
  status: string;
  uploader_name: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  image_url: string | null;
  published_at: string;
  author_name: string;
  status: string;
}

interface User {
  userId: string;
  email: string;
  role: string;
}

const SECTORS = [
  { value: "aviation", label: "Aviation", color: "#1B2A6B", icon: "✈" },
  { value: "maritime", label: "Maritime", color: "#0077B6", icon: "⚓" },
  { value: "railway", label: "Railway", color: "#6A0572", icon: "🚆" },
];

const REPORT_TYPES = [
  { value: "preliminary", label: "Preliminary" },
  { value: "final", label: "Final" },
  { value: "interim", label: "Interim" },
  { value: "safety_bulletin", label: "Safety Bulletin" },
];

const NEWS_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "safety", label: "Safety Alert" },
  { value: "aviation", label: "Aviation" },
  { value: "maritime", label: "Maritime" },
  { value: "railway", label: "Railway" },
  { value: "press_release", label: "Press Release" },
  { value: "announcement", label: "Announcement" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newsImageInputRef = useRef<HTMLInputElement>(null);
  const eventFlyerInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"overview" | "upload" | "reports" | "news" | "manage-news" | "events">("overview");

  // News state
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsExcerpt, setNewsExcerpt] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState<NewsCategory>("general");
  const [newsImageUrl, setNewsImageUrl] = useState("");
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsImagePreview, setNewsImagePreview] = useState("");
  const [newsImageUploading, setNewsImageUploading] = useState(false);
  const [newsImageMode, setNewsImageMode] = useState<"upload" | "url">("upload");
  const [newsDate, setNewsDate] = useState(new Date().toISOString().split("T")[0]);
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsError, setNewsError] = useState("");
  const [newsSuccess, setNewsSuccess] = useState("");

  // Events state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("general");
  const [eventRegistrationLink, setEventRegistrationLink] = useState("");
  const [eventFlyerFile, setEventFlyerFile] = useState<File | null>(null);
  const [eventFlyerPreview, setEventFlyerPreview] = useState("");
  const [eventFlyerUploading, setEventFlyerUploading] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventError, setEventError] = useState("");
  const [eventSuccess, setEventSuccess] = useState("");

  const handleEventFlyerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEventFlyerFile(file);
    setEventFlyerPreview(URL.createObjectURL(file));
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) {
      setEventError("Title and event date are required.");
      return;
    }
    setEventSubmitting(true);
    setEventError("");
    setEventSuccess("");
    try {
      let flyerUrl: string | undefined;
      if (eventFlyerFile) {
        setEventFlyerUploading(true);
        const fd = new FormData();
        fd.append("file", eventFlyerFile);
        const imgRes = await fetch("/api/events/upload-image", { method: "POST", body: fd });
        const imgData = await imgRes.json();
        setEventFlyerUploading(false);
        if (!imgRes.ok) throw new Error(imgData.error || "Flyer upload failed");
        flyerUrl = imgData.url;
      }

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          event_date: new Date(eventDate).toISOString(),
          end_date: eventEndDate ? new Date(eventEndDate).toISOString() : undefined,
          location: eventLocation,
          category: eventCategory,
          image_url: flyerUrl,
          registration_link: eventRegistrationLink || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");
      setEventSuccess("Event published successfully!");
      setEventTitle(""); setEventDescription(""); setEventDate(""); setEventEndDate("");
      setEventLocation(""); setEventCategory("general"); setEventRegistrationLink("");
      setEventFlyerFile(null); setEventFlyerPreview("");
      if (eventFlyerInputRef.current) eventFlyerInputRef.current.value = "";
    } catch (err) {
      setEventError(err instanceof Error ? err.message : "Submission failed");
    }
    setEventSubmitting(false);
    setTimeout(() => setEventSuccess(""), 3000);
  };

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSector, setUploadSector] = useState<Sector>("aviation");
  const [uploadType, setUploadType] = useState<ReportType>("final");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Stats
  const [stats, setStats] = useState({ total: 0, aviation: 0, maritime: 0, railway: 0 });

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const res = await fetch("/api/reports?limit=100");
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
        setStats({
          total: data.reports.length,
          aviation: data.reports.filter((r: Report) => r.sector === "aviation").length,
          maritime: data.reports.filter((r: Report) => r.sector === "maritime").length,
          railway: data.reports.filter((r: Report) => r.sector === "railway").length,
        });
      }
    } catch (e) {
      console.error("Failed to fetch reports", e);
    }
    setReportsLoading(false);
  }, []);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const res = await fetch("/api/news?limit=100");
      const data = await res.json();
      if (data.news) setNews(data.news);
    } catch (e) {
      console.error("Failed to fetch news", e);
    }
    setNewsLoading(false);
  }, []);

  useEffect(() => {
    // Check auth
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.replace("/login");
        } else {
          setUser(data.user);
          setLoading(false);
          fetchReports();
          fetchNews();
        }
      })
      .catch(() => router.replace("/login"));
  }, [router, fetchReports, fetchNews]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle || !uploadSector) {
      setUploadError("Please fill in all required fields and select a file.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    setUploadProgress(10);

    try {
      // Step 1: Upload file to storage
      const formData = new FormData();
      formData.append("file", uploadFile);

      setUploadProgress(30);
      const uploadRes = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(60);
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "File upload failed");
      }

      // Step 2: Save report metadata
      setUploadProgress(80);
      const reportRes = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle,
          type: uploadType,
          sector: uploadSector,
          description: uploadDesc,
          file_url: uploadData.url,
          file_name: uploadData.name,
          file_size: uploadData.size,
          published_at: new Date(uploadDate).toISOString(),
        }),
      });

      setUploadProgress(100);
      const reportData = await reportRes.json();

      if (!reportRes.ok) {
        throw new Error(reportData.error || "Failed to save report");
      }

      setUploadSuccess("Report uploaded successfully!");
      setUploadFile(null);
      setUploadTitle("");
      setUploadDesc("");
      setUploadDate(new Date().toISOString().split("T")[0]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchReports();
      setTimeout(() => {
        setUploadSuccess("");
        setActiveSection("reports");
      }, 2000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    }

    setUploading(false);
    setTimeout(() => setUploadProgress(0), 1000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report? This cannot be undone.")) return;
    const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchReports();
    } else {
      const data = await res.json();
      alert(data.error || "Delete failed");
    }
  };

  const handleNewsImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewsImageFile(file);
    setNewsImagePreview(URL.createObjectURL(file));
    setNewsImageUrl("");
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsExcerpt) {
      setNewsError("Title and excerpt are required.");
      return;
    }
    setNewsSubmitting(true);
    setNewsError("");
    setNewsSuccess("");
    try {
      let finalImageUrl = newsImageUrl || null;

      if (newsImageFile) {
        setNewsImageUploading(true);
        const fd = new FormData();
        fd.append("file", newsImageFile);
        const imgRes = await fetch("/api/news/upload-image", { method: "POST", body: fd });
        const imgData = await imgRes.json();
        setNewsImageUploading(false);
        if (!imgRes.ok) throw new Error(imgData.error || "Image upload failed");
        finalImageUrl = imgData.url;
      }

      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newsTitle,
          excerpt: newsExcerpt,
          content: newsContent,
          category: newsCategory,
          image_url: finalImageUrl,
          published_at: new Date(newsDate).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish news");
      setNewsSuccess("News article published successfully!");
      setNewsTitle(""); setNewsExcerpt(""); setNewsContent("");
      setNewsImageUrl(""); setNewsImageFile(null); setNewsImagePreview("");
      if (newsImageInputRef.current) newsImageInputRef.current.value = "";
      setNewsDate(new Date().toISOString().split("T")[0]);
      fetchNews();
      setTimeout(() => { setNewsSuccess(""); setActiveSection("manage-news"); }, 2000);
    } catch (err) {
      setNewsError(err instanceof Error ? err.message : "Failed to publish");
      setNewsImageUploading(false);
    }
    setNewsSubmitting(false);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Delete this news article? This cannot be undone.")) return;
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchNews();
    } else {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading portal…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandLogo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <span className={styles.brandName}>NSIB</span>
            <span className={styles.brandSub}>Staff Portal</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeSection === "overview" ? styles.navItemActive : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Overview
          </button>
          <button
            className={`${styles.navItem} ${activeSection === "upload" ? styles.navItemActive : ""}`}
            onClick={() => setActiveSection("upload")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Report
          </button>
          <button
            className={`${styles.navItem} ${activeSection === "reports" ? styles.navItemActive : ""}`}
            onClick={() => setActiveSection("reports")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            Manage Reports
          </button>
          <button
            className={`${styles.navItem} ${activeSection === "news" ? styles.navItemActive : ""}`}
            onClick={() => setActiveSection("news")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" />
            </svg>
            Post News
          </button>
          <button
            className={`${styles.navItem} ${activeSection === "manage-news" ? styles.navItemActive : ""}`}
            onClick={() => setActiveSection("manage-news")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
              <path d="M17.586 3.586a2 2 0 1 1 2.828 2.828L12 15l-4 1 1-4 8.586-8.414z" />
            </svg>
            Manage News
          </button>
          <button
            className={`${styles.navItem} ${activeSection === "events" ? styles.navItemActive : ""}`}
            onClick={() => setActiveSection("events")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Create Event
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userBadge}>
            <div className={styles.userAvatar}>{user?.email?.[0]?.toUpperCase()}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.email}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
          <Link href="/" className={styles.siteLink}>← Back to Website</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Overview */}
        {activeSection === "overview" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Dashboard Overview</h1>
              <p className={styles.pageDesc}>Manage NSIB investigation reports across all transport sectors.</p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(27,42,107,0.1)", color: "var(--nsib-navy)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </div>
                <div>
                  <div className={styles.statNum}>{stats.total}</div>
                  <div className={styles.statLabel}>Total Reports</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(27,42,107,0.08)", color: "#1B2A6B" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5 5-3.2 3.2-2.4-.8L2 16l3 3c.6.6 1.4.9 2.2.9h.1c.8-.1 1.5-.4 2.1-.9l.6-.6 3.2-3.2 5 5 1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>
                </div>
                <div>
                  <div className={styles.statNum}>{stats.aviation}</div>
                  <div className={styles.statLabel}>Aviation Reports</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(0,119,182,0.1)", color: "#0077B6" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M12 9V5a2 2 0 0 1 2-2h2"/><path d="M20 21v-4a2 2 0 0 0-2-2h-3.5L12 9l-2.5 6H6a2 2 0 0 0-2 2v4"/></svg>
                </div>
                <div>
                  <div className={styles.statNum}>{stats.maritime}</div>
                  <div className={styles.statLabel}>Maritime Reports</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(106,5,114,0.08)", color: "#6A0572" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>
                </div>
                <div>
                  <div className={styles.statNum}>{stats.railway}</div>
                  <div className={styles.statLabel}>Railway Reports</div>
                </div>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h2 className={styles.sectionTitle}>Quick Actions</h2>
              <div className={styles.actionCards}>
                <button className={styles.actionCard} onClick={() => setActiveSection("upload")}>
                  <div className={styles.actionIcon} style={{ background: "linear-gradient(135deg, var(--nsib-navy), var(--nsib-navy-light))" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h3>Upload New Report</h3>
                  <p>Add a new investigation report to the public archive</p>
                </button>
                <button className={styles.actionCard} onClick={() => setActiveSection("reports")}>
                  <div className={styles.actionIcon} style={{ background: "linear-gradient(135deg, #0077B6, #0096D6)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <h3>Manage Reports</h3>
                  <p>View, edit, or delete existing investigation reports</p>
                </button>
                <Link href="/" className={styles.actionCard} style={{ textDecoration: "none" }}>
                  <div className={styles.actionIcon} style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <h3>View Public Site</h3>
                  <p>See how reports appear to the public on the website</p>
                </Link>
              </div>
            </div>

            {/* Recent reports preview */}
            {reports.length > 0 && (
              <div className={styles.recentSection}>
                <h2 className={styles.sectionTitle}>Recently Uploaded</h2>
                <div className={styles.recentList}>
                  {reports.slice(0, 5).map(r => (
                    <div key={r.id} className={styles.recentItem}>
                      <div className={styles.recentIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      </div>
                      <div className={styles.recentInfo}>
                        <span className={styles.recentTitle}>{r.title}</span>
                        <span className={styles.recentMeta}>{r.sector} · {formatDate(r.created_at)}</span>
                      </div>
                      <div className={`${styles.sectorBadge} ${styles[`sector_${r.sector}`]}`}>{r.sector}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Section */}
        {activeSection === "upload" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Upload Report</h1>
              <p className={styles.pageDesc}>Upload a new investigation report to the NSIB public archive.</p>
            </div>

            {uploadError && (
              <div className={styles.alertError}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className={styles.alertSuccess}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {uploadSuccess}
              </div>
            )}

            <form className={styles.uploadForm} onSubmit={handleUploadSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formLeft}>
                  {/* Drop Zone */}
                  <div
                    className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ""} ${uploadFile ? styles.dropZoneHasFile : ""}`}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                      className={styles.fileInput}
                      onChange={handleFileSelect}
                    />
                    {uploadFile ? (
                      <div className={styles.fileSelected}>
                        <div className={styles.fileIcon}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <span className={styles.fileName}>{uploadFile.name}</span>
                        <span className={styles.fileSize}>{formatBytes(uploadFile.size)}</span>
                        <button
                          type="button"
                          className={styles.fileRemove}
                          onClick={e => { e.stopPropagation(); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        >
                          Change file
                        </button>
                      </div>
                    ) : (
                      <div className={styles.dropZoneContent}>
                        <div className={styles.dropIcon}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <p className={styles.dropTitle}>Drag &amp; drop your file here</p>
                        <p className={styles.dropSub}>or <strong>click to browse</strong></p>
                        <p className={styles.dropFormats}>PDF, Word, Excel, Images · Max 50MB</p>
                      </div>
                    )}
                  </div>

                  {/* Sector Selection */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Transport Sector *</label>
                    <div className={styles.sectorGrid}>
                      {SECTORS.map(s => (
                        <label key={s.value} className={`${styles.sectorOption} ${uploadSector === s.value ? styles.sectorOptionActive : ""}`}>
                          <input
                            type="radio"
                            name="sector"
                            value={s.value}
                            checked={uploadSector === s.value}
                            onChange={() => setUploadSector(s.value as Sector)}
                            className={styles.sectorInput}
                          />
                          <span className={styles.sectorEmoji}>{s.icon}</span>
                          <span>{s.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.formRight}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="report-title">Report Title *</label>
                    <input
                      id="report-title"
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Preliminary Report on Aircraft Incident at MMIA"
                      required
                      value={uploadTitle}
                      onChange={e => setUploadTitle(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="report-type">Report Type</label>
                    <select
                      id="report-type"
                      className={styles.formSelect}
                      value={uploadType}
                      onChange={e => setUploadType(e.target.value as ReportType)}
                    >
                      {REPORT_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="report-date">Publication Date</label>
                    <input
                      id="report-date"
                      type="date"
                      className={styles.formInput}
                      value={uploadDate}
                      onChange={e => setUploadDate(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="report-desc">Description</label>
                    <textarea
                      id="report-desc"
                      className={styles.formTextarea}
                      placeholder="Brief summary of the report contents…"
                      rows={4}
                      value={uploadDesc}
                      onChange={e => setUploadDesc(e.target.value)}
                    />
                  </div>

                  {uploading && uploadProgress > 0 && (
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <span className={styles.progressLabel}>{uploadProgress < 60 ? "Uploading file…" : uploadProgress < 90 ? "Saving record…" : "Almost done…"}</span>
                    </div>
                  )}

                  <button type="submit" className={styles.submitBtn} disabled={uploading}>
                    {uploading ? (
                      <><span className={styles.btnSpinner}></span> Uploading…</>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Publish Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Reports Management */}
        {activeSection === "reports" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Manage Reports</h1>
              <button className={styles.uploadTrigger} onClick={() => setActiveSection("upload")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Upload New
              </button>
            </div>

            {reportsLoading ? (
              <div className={styles.loadingInner}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading reports…</p>
              </div>
            ) : reports.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <h3>No reports yet</h3>
                <p>Upload your first report to get started.</p>
                <button className={styles.submitBtn} onClick={() => setActiveSection("upload")}>Upload a Report</button>
              </div>
            ) : (
              <div className={styles.reportsTable}>
                <div className={styles.tableHeader}>
                  <span>Title</span>
                  <span>Sector</span>
                  <span>Type</span>
                  <span>Date</span>
                  <span>File</span>
                  <span>Actions</span>
                </div>
                {reports.map(r => (
                  <div key={r.id} className={styles.tableRow}>
                    <div className={styles.reportTitle}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      <span title={r.title}>{r.title.length > 55 ? r.title.slice(0, 55) + "…" : r.title}</span>
                    </div>
                    <div className={`${styles.sectorBadge} ${styles[`sector_${r.sector}`]}`}>{r.sector}</div>
                    <div className={styles.typeBadge}>{r.type?.replace("_", " ")}</div>
                    <div className={styles.dateCell}>{formatDate(r.published_at || r.created_at)}</div>
                    <div className={styles.fileCell}>
                      {r.file_name ? r.file_name.slice(0, 20) + (r.file_name.length > 20 ? "…" : "") : "—"}
                      {r.file_size ? <span> ({formatBytes(r.file_size)})</span> : null}
                    </div>
                    <div className={styles.actionCell}>
                      <a href={r.file_url} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
                        View
                      </a>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(r.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Post News Section */}
        {activeSection === "news" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Post News Article</h1>
              <p className={styles.pageDesc}>Publish news, press releases, and announcements to the NSIB website.</p>
            </div>

            {newsError && (
              <div className={styles.alertError}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {newsError}
              </div>
            )}
            {newsSuccess && (
              <div className={styles.alertSuccess}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {newsSuccess}
              </div>
            )}

            <form className={styles.uploadForm} onSubmit={handleNewsSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formLeft}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Category *</label>
                    <div className={styles.sectorGrid}>
                      {NEWS_CATEGORIES.map(c => (
                        <label key={c.value} className={`${styles.sectorOption} ${newsCategory === c.value ? styles.sectorOptionActive : ""}`}>
                          <input type="radio" name="news-cat" value={c.value} checked={newsCategory === c.value} onChange={() => setNewsCategory(c.value as NewsCategory)} className={styles.sectorInput} />
                          <span>{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cover Image <span style={{ fontWeight: 400, color: "#999" }}>(optional)</span></label>
                    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "0.75rem" }}>
                      <button type="button" onClick={() => setNewsImageMode("upload")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.875rem", fontWeight: newsImageMode === "upload" ? 600 : 400, color: newsImageMode === "upload" ? "var(--nsib-navy)" : "#6b7280", borderBottom: newsImageMode === "upload" ? "2px solid var(--nsib-navy)" : "2px solid transparent", paddingBottom: "2px" }}>Upload file</button>
                      <button type="button" onClick={() => setNewsImageMode("url")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.875rem", fontWeight: newsImageMode === "url" ? 600 : 400, color: newsImageMode === "url" ? "var(--nsib-navy)" : "#6b7280", borderBottom: newsImageMode === "url" ? "2px solid var(--nsib-navy)" : "2px solid transparent", paddingBottom: "2px" }}>Paste URL</button>
                    </div>
                    {newsImageMode === "upload" ? (
                      <div
                        className={styles.dropZone}
                        style={{ minHeight: "100px", padding: "1rem" }}
                        onClick={() => newsImageInputRef.current?.click()}
                      >
                        <input
                          ref={newsImageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className={styles.fileInput}
                          onChange={handleNewsImageSelect}
                        />
                        {newsImagePreview ? (
                          <div className={styles.fileSelected}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={newsImagePreview} alt="preview" style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "8px" }} />
                            <button type="button" className={styles.fileRemove} onClick={e => { e.stopPropagation(); setNewsImageFile(null); setNewsImagePreview(""); if (newsImageInputRef.current) newsImageInputRef.current.value = ""; }}>Change image</button>
                          </div>
                        ) : (
                          <div className={styles.dropZoneContent}>
                            <div className={styles.dropIcon}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                            </div>
                            <p className={styles.dropSub}><strong>Click to upload</strong> · JPEG, PNG, WebP, GIF · Max 10MB</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <input id="news-image" type="url" className={styles.formInput} placeholder="https://images.unsplash.com/…" value={newsImageUrl} onChange={e => setNewsImageUrl(e.target.value)} />
                        {newsImageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={newsImageUrl} alt="preview" style={{ marginTop: "0.75rem", width: "100%", height: "140px", objectFit: "cover", borderRadius: "10px", border: "1px solid #e5e7eb" }} />
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.formRight}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="news-title">Headline *</label>
                    <input id="news-title" type="text" className={styles.formInput} placeholder="e.g. NSIB Signs MoU with Nigerian Navy" required value={newsTitle} onChange={e => setNewsTitle(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="news-excerpt">Summary / Excerpt *</label>
                    <textarea id="news-excerpt" className={styles.formTextarea} placeholder="One-paragraph summary displayed on the news page…" rows={3} required value={newsExcerpt} onChange={e => setNewsExcerpt(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="news-content">Full Content <span style={{ fontWeight: 400, color: "#999" }}>(optional)</span></label>
                    <textarea id="news-content" className={styles.formTextarea} placeholder="Full article body text…" rows={5} value={newsContent} onChange={e => setNewsContent(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="news-date">Publication Date</label>
                    <input id="news-date" type="date" className={styles.formInput} value={newsDate} onChange={e => setNewsDate(e.target.value)} />
                  </div>
                  <button type="submit" className={styles.submitBtn} disabled={newsSubmitting || newsImageUploading}>
                    {newsImageUploading ? (<><span className={styles.btnSpinner}></span> Uploading image…</>) : newsSubmitting ? (<><span className={styles.btnSpinner}></span> Publishing…</>) : (<>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /></svg>
                      Publish Article
                    </>)}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Manage News */}
        {activeSection === "manage-news" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Manage News</h1>
              <button className={styles.uploadTrigger} onClick={() => setActiveSection("news")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Post New
              </button>
            </div>

            {newsLoading ? (
              <div className={styles.loadingInner}><div className={styles.loadingSpinner}></div><p>Loading…</p></div>
            ) : news.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                </svg>
                <h3>No news articles yet</h3>
                <p>Post your first article to get started.</p>
                <button className={styles.submitBtn} onClick={() => setActiveSection("news")}>Post News</button>
              </div>
            ) : (
              <div className={styles.reportsTable}>
                <div className={styles.tableHeader}>
                  <span>Headline</span>
                  <span>Category</span>
                  <span>Date</span>
                  <span>Author</span>
                  <span>Actions</span>
                </div>
                {news.map(n => (
                  <div key={n.id} className={styles.tableRow}>
                    <div className={styles.reportTitle}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /></svg>
                      <span title={n.title}>{n.title.length > 55 ? n.title.slice(0, 55) + "…" : n.title}</span>
                    </div>
                    <div className={styles.typeBadge}>{n.category.replace("_", " ")}</div>
                    <div className={styles.dateCell}>{formatDate(n.published_at)}</div>
                    <div className={styles.dateCell}>{n.author_name}</div>
                    <div className={styles.actionCell}>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteNews(n.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Events Section */}
        {activeSection === "events" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>Create Event</h1>
              <p className={styles.pageDesc}>Publish upcoming events to the public events page.</p>
            </div>

            {eventSuccess && (
              <div className={styles.successBanner}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {eventSuccess}
              </div>
            )}
            {eventError && (
              <div className={styles.errorBanner}>{eventError}</div>
            )}

            <form onSubmit={handleEventSubmit} className={styles.newsForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Event Title *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Transport Safety Summit 2025"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    className={styles.input}
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>End Date & Time (optional)</label>
                  <input
                    type="datetime-local"
                    className={styles.input}
                    value={eventEndDate}
                    onChange={e => setEventEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={eventLocation}
                    onChange={e => setEventLocation(e.target.value)}
                    placeholder="e.g. NSIB Headquarters, Abuja"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={eventCategory}
                    onChange={e => setEventCategory(e.target.value)}
                  >
                    {[["general","General"],["conference","Conference"],["workshop","Workshop"],["seminar","Seminar"],["training","Training"],["safety_drill","Safety Drill"]].map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={eventDescription}
                  onChange={e => setEventDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the event, agenda, audience, and objectives..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Event Flyer <span style={{ fontWeight: 400, textTransform: "none", color: "#999" }}>(optional)</span></label>
                <div
                  className={styles.dropZone}
                  style={{ minHeight: "110px", padding: "1rem", cursor: "pointer" }}
                  onClick={() => eventFlyerInputRef.current?.click()}
                >
                  <input
                    ref={eventFlyerInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className={styles.fileInput}
                    onChange={handleEventFlyerSelect}
                  />
                  {eventFlyerPreview ? (
                    <div className={styles.fileSelected}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={eventFlyerPreview} alt="flyer preview" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }} />
                      <button
                        type="button"
                        className={styles.fileRemove}
                        onClick={e => { e.stopPropagation(); setEventFlyerFile(null); setEventFlyerPreview(""); if (eventFlyerInputRef.current) eventFlyerInputRef.current.value = ""; }}
                      >
                        Change image
                      </button>
                    </div>
                  ) : (
                    <div className={styles.dropZoneContent}>
                      <div className={styles.dropIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <p className={styles.dropTitle}>Upload event flyer</p>
                      <p className={styles.dropSub}>Click to browse</p>
                      <p className={styles.dropFormats}>JPEG, PNG, WebP · max 10 MB</p>
                    </div>
                  )}
                </div>
                {eventFlyerUploading && (
                  <p style={{ fontSize: "0.82rem", color: "var(--nsib-slate-light)", marginTop: "0.4rem" }}>Uploading flyer…</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Registration Link (optional)</label>
                <input
                  type="url"
                  className={styles.input}
                  value={eventRegistrationLink}
                  onChange={e => setEventRegistrationLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={eventSubmitting || eventFlyerUploading}>
                {eventSubmitting ? (eventFlyerUploading ? "Uploading flyer…" : "Publishing…") : "Publish Event"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
