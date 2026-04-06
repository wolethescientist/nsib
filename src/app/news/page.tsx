"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  published_at: string;
  author_name: string;
  status: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: "#1B2A6B",
  safety: "#0077B6",
  aviation: "#1B2A6B",
  maritime: "#0077B6",
  railway: "#6A0572",
  press_release: "#2d6a4f",
  announcement: "#e63946",
};

const PLACEHOLDER_NEWS: NewsItem[] = [
  {
    id: "p1",
    title: "NSIB signs MoU with the Nigerian Navy for Maritime Safety",
    excerpt: "The Nigerian Safety Investigation Bureau has formalised a partnership with the Nigerian Navy to strengthen maritime accident investigation procedures and information sharing.",
    content: "",
    category: "maritime",
    image_url: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=800&auto=format&fit=crop",
    published_at: "2024-10-05T00:00:00Z",
    author_name: "NSIB Communications",
    status: "published",
  },
  {
    id: "p2",
    title: "Director General Keynote at Annual Transport Safety Summit",
    excerpt: "Capt. Alex Badeh Jr. delivered a keynote address at the 2024 National Transport Safety Summit, outlining NSIB's five-year strategic safety agenda.",
    content: "",
    category: "announcement",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    published_at: "2024-09-14T00:00:00Z",
    author_name: "NSIB Communications",
    status: "published",
  },
  {
    id: "p3",
    title: "New Safety Recommendations Issued for Domestic Airlines",
    excerpt: "Following recent investigations, NSIB has issued a set of mandatory safety recommendations to all domestic airline operators concerning pre-departure checklists.",
    content: "",
    category: "aviation",
    image_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
    published_at: "2024-09-02T00:00:00Z",
    author_name: "NSIB Communications",
    status: "published",
  },
  {
    id: "p4",
    title: "NSIB Completes Preliminary Investigation into Lagos-Ibadan Rail Incident",
    excerpt: "The bureau has concluded its preliminary investigation phase and released initial findings for the January 2024 derailment on the Lagos-Ibadan corridor.",
    content: "",
    category: "railway",
    image_url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop",
    published_at: "2024-08-20T00:00:00Z",
    author_name: "NSIB Communications",
    status: "published",
  },
  {
    id: "p5",
    title: "NSIB Hosts International Safety Investigators Workshop",
    excerpt: "Investigators from 12 countries gathered in Abuja for a four-day workshop on cross-border accident investigation protocols organized by the NSIB.",
    content: "",
    category: "general",
    image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    published_at: "2024-07-15T00:00:00Z",
    author_name: "NSIB Communications",
    status: "published",
  },
  {
    id: "p6",
    title: "Press Release: Annual Safety Statistics Report 2023",
    excerpt: "NSIB releases its comprehensive annual safety statistics covering all transportation modes for 2023, showing a 12% reduction in reportable incidents.",
    content: "",
    category: "press_release",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    published_at: "2024-06-01T00:00:00Z",
    author_name: "NSIB Communications",
    status: "published",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function categoryLabel(cat: string) {
  return cat.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news?limit=50")
      .then((r) => r.json())
      .then((data) => {
        const fetched: NewsItem[] = data.news || [];
        // Merge dynamic on top, placeholders fill the rest
        const combined = fetched.length > 0
          ? [...fetched, ...PLACEHOLDER_NEWS].slice(0, 12)
          : PLACEHOLDER_NEWS;
        setNews(combined);
      })
      .catch(() => setNews(PLACEHOLDER_NEWS))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(news.map((n) => n.category)))];

  const filtered = activeCategory === "all"
    ? news
    : news.filter((n) => n.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "6rem" }}>
      {/* Hero */}
      <section style={{
        background: "var(--nsib-navy)",
        color: "white",
        padding: "8rem 2rem 5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 30%, rgba(226,48,48,0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <ScrollReveal>
            <div style={{ display: "inline-block", padding: "0.4rem 1rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              News & Updates
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.25rem", color: "white" }}>
              Latest NSIB News
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.75)", maxWidth: "600px", lineHeight: 1.7 }}>
              Press releases, safety alerts, investigation milestones, and organizational news from the Nigerian Safety Investigation Bureau.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container" style={{ marginTop: "-2rem", position: "relative", zIndex: 10 }}>
        {/* Category Filter */}
        <ScrollReveal>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3rem", background: "white", padding: "1.25rem 1.5rem", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.45rem 1.1rem",
                  borderRadius: "20px",
                  border: "1.5px solid",
                  borderColor: activeCategory === cat ? "var(--nsib-navy)" : "rgba(0,0,0,0.1)",
                  background: activeCategory === cat ? "var(--nsib-navy)" : "transparent",
                  color: activeCategory === cat ? "white" : "#555",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                  letterSpacing: "0.03em",
                }}
              >
                {cat === "all" ? "All News" : categoryLabel(cat)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: "#888" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "var(--nsib-navy)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
            <p>Loading news…</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <ScrollReveal>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0",
                  background: "white",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  marginBottom: "3rem",
                }}>
                  <div style={{ position: "relative", minHeight: "380px" }}>
                    {featured.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.image_url} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                    ) : (
                      <div style={{ background: "linear-gradient(135deg, var(--nsib-navy), #2d3e8f)", height: "100%", position: "absolute", inset: 0 }} />
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(255,255,255,0.1))" }} />
                  </div>
                  <div style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                      <span style={{ padding: "0.3rem 0.85rem", background: CATEGORY_COLORS[featured.category] || "#1B2A6B", color: "white", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {categoryLabel(featured.category)}
                      </span>
                      <span style={{ fontSize: "0.82rem", color: "#888" }}>{formatDate(featured.published_at)}</span>
                    </div>
                    <h2 style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--nsib-navy)", lineHeight: 1.3, marginBottom: "1rem" }}>{featured.title}</h2>
                    <p style={{ color: "#555", lineHeight: 1.7, marginBottom: "1.75rem", fontSize: "0.95rem" }}>{featured.excerpt}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "0.82rem", color: "#999" }}>By {featured.author_name}</span>
                      <Link href={`/news/${featured.id}`} style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--nsib-navy)", textDecoration: "none" }}>
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* News grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "2rem" }}>
              {rest.map((item, i) => (
                <ScrollReveal key={item.id} delay={0.05 * (i % 3)}>
                  <Link href={`/news/${item.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <article style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.05)"; }}
                  >
                    {item.image_url && (
                      <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))" }} />
                      </div>
                    )}
                    <div style={{ padding: "1.75rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
                        <span style={{ padding: "0.25rem 0.7rem", background: CATEGORY_COLORS[item.category] || "#1B2A6B", color: "white", borderRadius: "20px", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {categoryLabel(item.category)}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "#aaa" }}>{formatDate(item.published_at)}</span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--nsib-navy)", lineHeight: 1.45, marginBottom: "0.75rem", flexGrow: 1 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                        {item.excerpt.length > 120 ? item.excerpt.slice(0, 120) + "…" : item.excerpt}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid #f0f0f0" }}>
                        <span style={{ fontSize: "0.78rem", color: "#bbb" }}>By {item.author_name}</span>
                      </div>
                    </div>
                  </article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "5rem 0", color: "#888" }}>
                <p style={{ fontSize: "1.1rem" }}>No news in this category yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 768px) { .news-featured { grid-template-columns: 1fr !important; } }` }} />
    </main>
  );
}
