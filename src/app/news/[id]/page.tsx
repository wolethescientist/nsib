"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  published_at: string;
  author_name: string;
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function categoryLabel(cat: string) {
  return cat.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setItem(data.news);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "var(--nsib-navy)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
      </main>
    );
  }

  if (notFound || !item) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", color: "var(--nsib-navy)" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Article not found</h1>
        <p style={{ color: "#666" }}>This news article may have been removed or the link is incorrect.</p>
        <Link href="/news" style={{ marginTop: "1rem", padding: "0.75rem 1.75rem", background: "var(--nsib-navy)", color: "white", borderRadius: "10px", fontWeight: 600, textDecoration: "none" }}>← Back to News</Link>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "6rem" }}>
      {/* Hero */}
      <section style={{ background: "var(--nsib-navy)", color: "white", padding: "8rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 30%, rgba(226,48,48,0.1) 0%, transparent 50%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "860px" }}>
          <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: "8px", padding: "0.4rem 1rem", fontSize: "0.82rem", cursor: "pointer", marginBottom: "2rem" }}>
            ← Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ padding: "0.3rem 0.9rem", background: CATEGORY_COLORS[item.category] || "#1B2A6B", color: "white", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {categoryLabel(item.category)}
            </span>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>{formatDate(item.published_at)}</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1.25rem" }}>{item.title}</h1>
          <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>{item.excerpt}</p>
          <p style={{ marginTop: "1.75rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>By {item.author_name}</p>
        </div>
      </section>

      {/* Cover image */}
      {item.image_url && (
        <div className="container" style={{ maxWidth: "860px", marginTop: "-2rem", position: "relative", zIndex: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.title}
            style={{ width: "100%", height: "420px", objectFit: "cover", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
          />
        </div>
      )}

      {/* Article body */}
      <div className="container" style={{ maxWidth: "860px", marginTop: item.image_url ? "3rem" : "1rem" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "clamp(2.5rem, 5vw, 5rem)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {item.content ? (
            item.content.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} style={{ fontSize: "1.2rem", lineHeight: 1.85, color: "#2d3748", marginBottom: "1.75rem", fontWeight: 400 }}>
                  {para}
                </p>
              ) : null
            )
          ) : (
            <p style={{ fontSize: "1.2rem", color: "#888", fontStyle: "italic" }}>Full article content not available.</p>
          )}
        </div>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <Link href="/news" style={{ padding: "0.85rem 2rem", background: "var(--nsib-navy)", color: "white", borderRadius: "12px", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>
            ← All News
          </Link>
        </div>
      </div>
    </main>
  );
}
