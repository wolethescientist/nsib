"use client";

import React, { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import AuthRedirectButton from '@/components/ui/AuthRedirectButton';

// SVGs
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const reports = [
  {
    id: 1,
    title: "Vessel Collision in the Gulf of Guinea",
    status: "Final Report",
    date: "Feb 18, 2024",
    description: "Detailed investigation into the mid-sea collision involving a commercial tanker and a fishing vessel. Covers navigational errors and weather anomalies.",
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Capsizing of Passenger Ferry near Calabar Coast",
    status: "Preliminary",
    date: "Jan 30, 2024",
    description: "Initial safety findings regarding overloading and structural integrity failure of an inland passenger ferry.",
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Engine Room Fire on Cargo Ship MV-Triton",
    status: "Safety Advisory",
    date: "Dec 12, 2023",
    description: "Advisory document releasing interim findings associated with electrical faults and delayed fire suppression activation.",
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=800&auto=format&fit=crop"
  }
];

export default function MarineReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter(rep => 
    rep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    rep.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        {/* Dynamic Marine Background Layers */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at top right, rgba(0, 168, 255, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(27, 42, 107, 0.4) 0%, transparent 60%)',
          zIndex: 0
        }} />
        
        {/* Floating background elements */}
        <div className="floating-element" style={{ position: 'absolute', top: '10%', right: '15%', width: '200px', height: '200px', borderRadius: '40px', background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', transform: 'rotateZ(-15deg)', zIndex: 1 }} />
        <div className="floating-element-slow" style={{ position: 'absolute', bottom: '-5%', left: '8%', width: '280px', height: '280px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,168,255,0.1) 0%, rgba(0,168,255,0) 100%)', backdropFilter: 'blur(20px)', zIndex: 1 }} />
        
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
              Transportation Safety
            </div>
            <h1 style={{ 
              color: 'white', 
              fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              textShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              Marine Accident <br/> Reports
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255, 255, 255, 0.8)', 
              maxWidth: '650px', 
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              textShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}>
              Access formal navigational investigations, safety records, and findings of maritime incidents across Nigerian waters. Submit any marine hazard or accident directly for investigation.
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
                  placeholder="Search marine reports..." 
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

              {/* Submit Report CTA */}
              <AuthRedirectButton 
                className="submit-report-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem 2rem',
                  backgroundColor: 'var(--nsib-red)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: '0 15px 30px rgba(226, 48, 48, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(226, 48, 48, 0.4), 0 0 0 4px rgba(226, 48, 48, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(226, 48, 48, 0.3)';
                }}
              >
                <UploadIcon />
                Submit New Report
              </AuthRedirectButton>
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
          {filteredReports.length > 0 ? (
            filteredReports.map((item, index) => (
              <ScrollReveal key={item.id} delay={0.1 * (index % 3)}>
                <div 
                  className="report-card"
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
                    
                    {/* Status Badge */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '1.25rem', 
                      left: '1.25rem',
                      background: item.status === 'Final Report' ? 'var(--nsib-navy)' : item.status === 'Safety Advisory' ? 'var(--nsib-red)' : 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                      {item.status}
                    </div>

                    {/* Date Badge */}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '1.25rem', 
                      left: '1.25rem',
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.date}</span>
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
                            Download Document
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
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>No Reports found</h3>
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
