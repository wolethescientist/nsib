"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

export default function PublicationsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const publications = [
    { type: "Press Release", date: "April 12, 2026", title: "NSIB Commences Investigation into Rail Incident at Rigasa", excerpt: "The Nigerian Safety Investigation Bureau has deployed investigators to the site of yesterday's incident involving the Abuja-Kaduna line..." },
    { type: "Aviation Report", date: "March 28, 2026", title: "Final Report: Incident involving Boeing 737 at Lagos Airport", excerpt: "The final investigation report details the sequence of events and safety recommendations following the runway excursion incident..." },
    { type: "Safety Bulletin", date: "February 15, 2026", title: "Marine Safety Advisory: Wet Season Operations", excerpt: "An advisory detailing critical safety measures and operational guidelines for marine vessel operators during the upcoming wet season." },
    { type: "Investigation Manual", date: "January 10, 2026", title: "Standard Operating Procedures for Rail Accident Investigation", excerpt: "Updated procedural guidelines for field investigators responding to rail-related accidents and incidents across the national network." },
    { type: "MOU", date: "December 05, 2025", title: "MOU Signed with the Nigerian Airspace Management Agency (NAMA)", excerpt: "A strategic memorandum of understanding to enhance data sharing and collaborative safety initiatives within the aviation sector." }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <main style={{ paddingBottom: '8rem', backgroundColor: "var(--bg-primary)" }}>
      {/* Antigravity Hero Section */}
      <section 
        ref={containerRef}
        className="page-hero"
        style={{
          backgroundColor: 'var(--nsib-navy)',
          color: 'white',
          padding: '12rem 2rem 10rem',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '6rem',
          perspective: '1000px'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(226, 48, 48, 0.12) 0%, transparent 60%)',
          zIndex: 0
        }} />
        
        {/* Parallax Floating Elements */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '15%', 
            right: '10%', 
            width: '180px', 
            height: '180px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)', 
            backdropFilter: 'blur(12px)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
            zIndex: 1,
            y: y1
          }} 
          animate={{
            rotateZ: [15, 20, 15],
            rotateX: [10, 15, 10],
            rotateY: [-10, -5, -10],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '5%', 
            left: '8%', 
            width: '300px', 
            height: '300px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, rgba(226,48,48,0.15) 0%, rgba(226,48,48,0) 100%)', 
            backdropFilter: 'blur(24px)', 
            zIndex: 1,
            y: y2
          }} 
          animate={{
            scale: [1, 1.05, 1],
            y: [0, -15, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="container" 
          style={{ position: 'relative', zIndex: 2, opacity: opacityFade }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ maxWidth: "800px" }}>
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 style={{ 
                color: 'white', 
                fontSize: 'clamp(3.5rem, 6vw, 4.5rem)', 
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                textShadow: '0 20px 40px rgba(0,0,0,0.4)',
                letterSpacing: '-0.02em'
              }}>
                News & Publications
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ 
                fontSize: '1.25rem', 
                color: 'rgba(255, 255, 255, 0.85)', 
                maxWidth: '600px', 
                lineHeight: 1.7,
                textShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              Access our latest press releases, official accident investigation reports, safety bulletins, and organizational manuals through our comprehensive digital archive.
            </motion.p>
          </div>
        </motion.div>
      </section>

      <div className="container responsive-grid-250">
        {/* Sidebar Navigation */}
        <aside>
          <div style={{ 
            position: 'sticky', 
            top: '120px', 
            padding: '2rem',
            backgroundColor: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 15px 35px -5px rgba(0,0,0,0.05), 0 5px 15px rgba(0,0,0,0.02)'
          }}>
            <h3 className="text-navy" style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', borderBottom: '2px solid var(--nsib-red)', paddingBottom: '0.75rem', display: 'inline-block' }}>Categories</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'All Publications', active: true },
                { name: 'Aviation Reports', active: false },
                { name: 'Marine Reports', active: false },
                { name: 'Rail Reports', active: false },
                { name: 'Investigation Manuals', active: false },
                { name: 'MOUs', active: false }
              ].map((category, idx) => (
                <li key={idx}>
                  <Link 
                    href="#" 
                    style={{ 
                      display: 'block',
                      padding: '0.75rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      color: category.active ? 'var(--nsib-red)' : 'var(--nsib-slate)',
                      fontWeight: category.active ? '700' : '500',
                      backgroundColor: category.active ? 'rgba(226, 48, 48, 0.05)' : 'transparent',
                      transition: 'all 0.2s ease-out',
                    }}
                    onMouseEnter={(e) => {
                      if (!category.active) {
                        e.currentTarget.style.backgroundColor = 'rgba(27, 42, 107, 0.04)';
                        e.currentTarget.style.color = 'var(--nsib-navy)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!category.active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--nsib-slate)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content Feed */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {publications.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.01,
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255,255,255,0.6)" 
              }}
              className="glass-panel" 
              style={{ 
                padding: '2.5rem', 
                display: 'flex', 
                gap: '2.5rem', 
                alignItems: 'flex-start',
                transition: 'border-color 0.3s ease',
                cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.85)'
              }}
            >
              <div style={{ 
                width: '72px', 
                height: '72px', 
                backgroundColor: 'rgba(27,42,107,0.04)', 
                borderRadius: 'var(--radius-md)', 
                flexShrink: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 5px 15px rgba(0,0,0,0.03)',
                border: '1px solid rgba(255,255,255,0.5)'
              }}>
                <span style={{ fontSize: '2rem', opacity: 0.9 }}>
                  {item.type.includes('Aviation') ? '✈️' : 
                   item.type.includes('Marine') ? '🚢' : 
                   item.type.includes('Rail') ? '🚆' : '📄'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ 
                    backgroundColor: 'rgba(27,42,107,0.08)', 
                    color: 'var(--nsib-navy)', 
                    padding: '0.3rem 1rem', 
                    borderRadius: '20px', 
                    fontWeight: '700',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {item.type}
                  </span>
                  <span className="text-slate-light" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    {item.date}
                  </span>
                </div>
                <h3 className="text-navy" style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: 1.3, fontWeight: '700' }}>
                  {item.title}
                </h3>
                <p className="text-slate" style={{ fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {item.excerpt}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--nsib-red)', fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  <span>Read Full Publication</span>
                  <span style={{ transition: 'transform 0.2s', display: 'inline-block' }}>
                    &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
