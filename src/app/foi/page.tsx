"use client";

import React, { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';

// SVGs
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const documents = [
  {
    id: 1,
    title: "NSIB FOI Operational Manual",
    category: "Manual",
    date: "2024",
    description: "The complete guide outlining the legal frameworks, timelines, and procedures for processing public information requests.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Annual FOI Compliance Report 2023",
    category: "Report",
    date: "2023",
    description: "Year-in-review documentation of all successfully processed information requests and compliance metrics for the Bureau.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Proactive Disclosures: Financials Q1",
    category: "Disclosure",
    date: "2024",
    description: "Mandatory public financial disclosure outlining operational budgets, procurement facts, and resource allocations.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
  }
];

export default function FOIPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main style={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      paddingBottom: '8rem',
      overflowX: 'hidden',
      perspective: '1000px'
    }}>
      {/* Antigravity Hero Section */}
      <section style={{ 
        backgroundColor: 'var(--nsib-navy)', 
        color: 'white', 
        padding: '8rem 2rem 6rem',
        position: 'relative',
        transformStyle: 'preserve-3d',
        overflow: 'hidden'
      }}>
        {/* Dynamic Background Layers */}
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
        <div className="floating-element" style={{ position: 'absolute', top: '15%', right: '15%', width: '150px', height: '150px', borderRadius: '15px', background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', transform: 'rotateZ(20deg)', zIndex: 1 }} />
        <div className="floating-element-slow" style={{ position: 'absolute', bottom: '-5%', left: '8%', width: '250px', height: '250px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(226,48,48,0.15) 0%, rgba(226,48,48,0) 100%)', backdropFilter: 'blur(20px)', zIndex: 1 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal>
            <Link href="/publications" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem",
              transition: "color 0.2s ease",
              textDecoration: "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "white"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            >
              <span>←</span>
              <span>Back to News & Pubs</span>
            </Link>
            <br />
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Transparency & Accountability
            </div>
            <h1 style={{ 
              color: 'white', 
              fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              textShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              Freedom of <br/> Information
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255, 255, 255, 0.8)', 
              maxWidth: '650px', 
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              textShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}>
              We are committed to absolute transparency. Access our proactive disclosures, regulatory compliance manuals, or formally request an investigation document.
            </p>

            {/* Actions Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              {/* Integrated Hero Search */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1.5rem', color: 'rgba(255,255,255,0.6)' }}>
                  <SearchIcon />
                </div>
                <input 
                  type="text" 
                  className="hero-search-input"
                  placeholder="Search FOI documents..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.5rem 1.1rem 3.5rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    outline: 'none',
                    fontSize: '1.05rem',
                    color: 'white',
                    fontFamily: 'inherit',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.05)';
                    const icon = e.target.previousElementSibling as HTMLElement;
                    if (icon) icon.style.color = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                    const icon = e.target.previousElementSibling as HTMLElement;
                    if (icon) icon.style.color = 'rgba(255,255,255,0.6)';
                  }}
                />
              </div>

              {/* Make an FOI Request CTA */}
              <button 
                className="submit-report-btn"
                onClick={() => alert("Trigger FOI Request Modal here")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem 2rem',
                  backgroundColor: 'white',
                  color: 'var(--nsib-navy)',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                }}
              >
                <SendIcon />
                Make an FOI Request
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>

        {/* Antigravity Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', 
          gap: '3rem 2rem' 
        }}>
          {filteredDocs.length > 0 ? (
            filteredDocs.map((item, index) => (
              <ScrollReveal key={item.id} delay={0.1 * (index % 3)}>
                <div 
                  className="foi-card"
                  style={{ 
                    position: 'relative',
                    background: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 30px 60px rgba(27, 42, 107, 0.15)';
                    const img = e.currentTarget.querySelector('.card-img') as HTMLElement;
                    if (img) img.style.transform = 'scale(1.1)';
                    const btn = e.currentTarget.querySelector('.dl-btn') as HTMLElement;
                    if (btn) {
                        btn.style.backgroundColor = 'var(--nsib-navy)';
                        btn.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.05)';
                    const img = e.currentTarget.querySelector('.card-img') as HTMLElement;
                    if (img) img.style.transform = 'scale(1)';
                    const btn = e.currentTarget.querySelector('.dl-btn') as HTMLElement;
                    if (btn) {
                        btn.style.backgroundColor = 'rgba(27, 42, 107, 0.05)';
                        btn.style.color = 'var(--nsib-navy)';
                    }
                  }}
                >
                  {/* Image Header */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <div 
                      className="card-img"
                      style={{ 
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)'
                      }} 
                    />
                    {/* Gradient Overlay */}
                    <div style={{ 
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(27, 42, 107, 0.1) 0%, rgba(27, 42, 107, 0.8) 100%)'
                    }} />
                    
                    {/* Badge */}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '1.25rem', 
                      left: '1.25rem',
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Type: {item.category}</span>
                    </div>

                    {/* Date Badge At Top */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '1.25rem', 
                      right: '1.25rem',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                      {item.date}
                    </div>
                  </div>

                  {/* Card Content body */}
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--nsib-navy)', lineHeight: 1.4, fontWeight: 700 }}>
                      {item.title}
                    </h3>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', flexGrow: 1 }}>
                      {item.description}
                    </p>
                    
                    {/* Action Section */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginTop: 'auto', 
                        borderTop: '1px solid rgba(0,0,0,0.05)', 
                        paddingTop: '1.5rem' 
                    }}>
                        <span style={{ color: 'var(--nsib-slate)', fontSize: '0.85rem', fontWeight: 600 }}>
                            Download {item.category}
                        </span>
                        
                        <button className="dl-btn" style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'center', 
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(27, 42, 107, 0.05)',
                            color: 'var(--nsib-navy)', 
                            transition: 'all 0.3s',
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                            <DownloadIcon />
                        </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '6rem 2rem', 
              backgroundColor: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1px dashed var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <SearchIcon />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>No Documents found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS Animations & Reset for scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { display: none; }
        
        .hero-search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

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
        .floating-element {
            animation: float 8s ease-in-out infinite;
        }
        .floating-element-slow {
            animation: floatSlow 12s ease-in-out infinite;
        }
      `}} />
    </main>
  );
}
