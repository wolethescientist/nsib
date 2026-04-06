"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Report {
  id: string;
  title: string;
  type: string;
  sector: "aviation" | "maritime" | "railway";
  description?: string;
  file_url: string;
  published_at: string;
  status: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  author_name: string;
}

const SECTOR_IMAGES: Record<string, string> = {
  aviation: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop",
  maritime: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=2070&auto=format&fit=crop",
  railway: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2084&auto=format&fit=crop",
};

const TYPE_LABEL: Record<string, string> = {
  preliminary: "Preliminary",
  final: "Published",
  interim: "Ongoing",
  safety_bulletin: "Bulletin",
};

const SECTOR_LABEL: Record<string, string> = {
  aviation: "Aviation",
  maritime: "Maritime",
  railway: "Railway",
};

const PLACEHOLDER_REPORTS = [
  { type: 'Aviation', title: 'Preliminary Report on Aircraft Incident at MMIA', date: 'Oct 12, 2024', status: 'Preliminary', image: SECTOR_IMAGES.aviation, sector: 'aviation', href: '/air-reports' },
  { type: 'Maritime', title: 'Investigation into Vessel Collision at Apapa Port', date: 'Sep 28, 2024', status: 'Ongoing', image: SECTOR_IMAGES.maritime, sector: 'maritime', href: '/marine-reports' },
  { type: 'Railway', title: 'Final Report on Passenger Train Derailment', date: 'Aug 15, 2024', status: 'Published', image: SECTOR_IMAGES.railway, sector: 'railway', href: '/rail-reports' },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

const PARTNERS = [
  { src: "/images/partners/nema.webp", alt: "National Emergency Management Agency" },
  { src: "/images/partners/nigerian-navy.jpg", alt: "Nigerian Navy" },
  { src: "/images/partners/imo.webp", alt: "International Maritime Organization" },
  { src: "/images/partners/faan.webp", alt: "Federal Airports Authority of Nigeria" },
  { src: "/images/partners/ncaa.webp", alt: "Nigerian Civil Aviation Authority" },
  { src: "/images/partners/nama.webp", alt: "Nigerian Airspace Management Agency" },
  { src: "/images/partners/nigerian-airforce.webp", alt: "Nigerian Air Force" },
  { src: "/images/partners/federal_ministry_of_aviation.webp", alt: "Federal Ministry of Aviation" },
];

function PartnersSlideshow() {
  return (
    <section className={styles.partnersSection}>
      <div className="container">
        <h2 className={styles.partnersTitle}>Key Partners &amp; Collaborations</h2>
      </div>
      <div className={styles.partnersMarqueeWrapper}>
        <div className={styles.partnersMarquee}>
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <div className={styles.partnerLogo} key={i}>
              <Image src={p.src} alt={p.alt} width={150} height={90} style={{ objectFit: "contain" }} unoptimized />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [dynamicReports, setDynamicReports] = useState<Report[]>([]);
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/reports?limit=6")
      .then(r => r.json())
      .then(data => {
        if (data.reports?.length) setDynamicReports(data.reports);
      })
      .catch(() => {/* silently fall back to placeholders */});
  }, []);

  useEffect(() => {
    fetch("/api/news?limit=3")
      .then(r => r.json())
      .then(data => {
        if (data.news?.length) setDynamicNews(data.news);
      })
      .catch(() => {});
  }, []);

  // Merge: show up to 3 dynamic reports first, then placeholders if not enough
  const displayReports = dynamicReports.length >= 3
    ? dynamicReports.slice(0, 3).map(r => ({
        type: SECTOR_LABEL[r.sector] || r.sector,
        title: r.title,
        date: formatDate(r.published_at),
        status: TYPE_LABEL[r.type] || r.type,
        image: SECTOR_IMAGES[r.sector] || SECTOR_IMAGES.aviation,
        sector: r.sector,
        href: r.file_url,
        isDynamic: true,
      }))
    : [
        ...dynamicReports.slice(0, 3).map(r => ({
          type: SECTOR_LABEL[r.sector] || r.sector,
          title: r.title,
          date: formatDate(r.published_at),
          status: TYPE_LABEL[r.type] || r.type,
          image: SECTOR_IMAGES[r.sector] || SECTOR_IMAGES.aviation,
          sector: r.sector,
          href: r.file_url,
          isDynamic: true,
        })),
        ...PLACEHOLDER_REPORTS.slice(dynCards(dynamicReports.length)),
      ];

  return (
    <main className={styles.main}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="/images/nsib_building.jpg" 
            alt="NSIB Headquarters"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.gradientOverlay}></div>
        </div>

        <div className={`container`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Advancing Safety in Nigeria's <br/>
              <span>Transportation Sector</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              We conduct independent investigations into aviation, railway, and maritime accidents to prevent reoccurrences and save lives across the nation.
            </p>
            
            <div className={styles.heroActions}>
              <Link href="/operations-centre" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Enter Operations Centre
              </Link>
              <Link href="/publications" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: '#ffffff', color: 'var(--nsib-navy)' }}>
                Our Latest Findings
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Quick Access Section */}
      <section className={styles.quickAccessSection}>
        <div className="container">
          <ScrollReveal direction="up" delay={0.1} distance={30}>
            <div className={styles.quickAccess}>
              {[
                {
                  title: "Live Flight Tracker",
                  desc: "Monitor real-time aviation data",
                  href: "/flight-track",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5 5-3.2 3.2-2.4-.8L2 16l3 3c.6.6 1.4.9 2.2.9h.1c.8-.1 1.5-.4 2.1-.9l.6-.6 3.2-3.2 5 5 1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>
                },
                {
                  title: "Vessel Tracker",
                  desc: "Maritime operations monitoring",
                  href: "/vessel-tracking",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M12 9V5a2 2 0 0 1 2-2h2"/><path d="M20 21v-4a2 2 0 0 0-2-2h-3.5L12 9l-2.5 6H6a2 2 0 0 0-2 2v4"/></svg>
                },
                {
                  title: "Incident Reports",
                  desc: "Access public safety archives",
                  href: "/publications",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                }
              ].map((item, i) => (
                <Link href={item.href} className={styles.accessItem} key={i}>
                  <div className={styles.iconBox}>{item.icon}</div>
                  <div className={styles.itemText}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <div className={styles.itemArrow}>→</div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Our Mandate Section */}
      <section className={styles.mandateSection}>
        <div className={`container ${styles.mandateGrid}`}>
          <ScrollReveal direction="left" delay={0.1} className={styles.mandateText}>
            <span className={styles.sectionLabel}>Who We Are</span>
            <h2>Fact-Finding, <br/>Not Fault-Finding</h2>
            <p>
              The Nigerian Safety Investigation Bureau (NSIB) is an independent agency of the Federal Government of Nigeria, legally mandated to investigate transportation accidents and serious incidents. 
            </p>
            <p>
              Our objective is not to apportion blame or liability, but to determine the circumstances and causes behind transportation accidents, with the sole purpose of making robust safety recommendations that prevent a recurrence.
            </p>
            <div style={{ marginTop: '2.5rem' }}>
              <Link href="/about" className={styles.textLink}>
                Discover our methodology <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="right" delay={0.3} distance={40} className={styles.mandateImageGroup}>
            <div className={styles.imageMain}>
              <Image 
                src="/images/operations_control_ng.png" 
                alt="Operations Control Room" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.mandateImg} 
              />
            </div>
            <div className={styles.imageOverlay}>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>15+</span>
                <span className={styles.statText}>Years of Safety <br/>Excellence</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3b. DG Section */}
      <section className={styles.dgSection}>
        <div className={`container ${styles.dgGrid}`}>
          <ScrollReveal direction="left" delay={0.2} distance={40} className={styles.dgImageWrapper}>
            <div className={styles.dgImagePlaceholder}>
              <Image 
                src="/images/team/dg_nsib.jpg" 
                alt="Director General" 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.dgImage} 
              />
            </div>
            <div className={styles.dgNamePlate}>
              <h4>Capt. Alex Badeh Jr.</h4>
              <span>Director General / CEO</span>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.4} className={styles.dgContent}>
            <span className={styles.sectionLabel}>Leadership</span>
            <h2>A Commitment to Safety Excellence</h2>
            <blockquote className={styles.dgQuote}>
              &quot;Our overarching mandate is to enhance safety in Nigeria&apos;s transport sector by determining the underlying causes of accidents and recommending proactive measures to prevent recurrences. Excellence in safety is not merely a goal; it&apos;s our fundamental operational standard.&quot;
            </blockquote>
            <Link href="/about/leadership" className="btn btn-outline">
              Read Full Profile
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Core Domains / Sectors */}
      <section className={styles.sectorsSection}>
        <div className="container">
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionLabel}>Our Focus Areas</span>
            <h2>Multimodal Safety Investigations</h2>
          </div>

          <div className={styles.sectorsGrid}>
            {[
              { 
                id: 'aviation', num: '01', title: 'Aviation Safety', desc: 'Investigating civil aviation occurrences within Nigerian airspace or involving Nigerian registered aircraft globally.', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5 5-3.2 3.2-2.4-.8L2 16l3 3c.6.6 1.4.9 2.2.9h.1c.8-.1 1.5-.4 2.1-.9l.6-.6 3.2-3.2 5 5 1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>,
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
              },
              { 
                id: 'maritime', num: '02', title: 'Maritime Safety', desc: 'Conducting impartial investigations into marine casualties and incidents on Nigerian territorial waters.', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M12 9V5a2 2 0 0 1 2-2h2"/><path d="M20 21v-4a2 2 0 0 0-2-2h-3.5L12 9l-2.5 6H6a2 2 0 0 0-2 2v4"/></svg>,
                image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=2070&auto=format&fit=crop"
              },
              { 
                id: 'rail', num: '03', title: 'Railway Safety', desc: 'Analyzing railway accidents and serious incidents to improve the safety of the national rail network.', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>,
                image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2084&auto=format&fit=crop"
              }
            ].map((sector, index) => (
              <ScrollReveal direction="up" delay={0.1 + index * 0.15} distance={40} key={sector.id} className={styles.sectorCard}>
                <div className={styles.sectorImageContainer}>
                   <Image src={sector.image} alt={sector.title} fill className={styles.sectorImg} sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                </div>
                <div className={styles.sectorCardBody}>
                  <div className={styles.sectorIconBadge}>
                    {sector.icon}
                  </div>
                  <h3>{sector.title}</h3>
                  <p>{sector.desc}</p>
                  <Link href={`/${sector.id}-reports`} className={styles.sectorLink}>
                    View Reports <span className={styles.arrow}>→</span>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recent Investigations — now dynamic */}
      <section className={styles.investigationsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Transparency &amp; Reporting</span>
            <h2>Recent Investigations</h2>
          </div>

          <div className={styles.cardsGrid}>
            {displayReports.slice(0, 3).map((item, index) => (
              <ScrollReveal direction="up" delay={0.2 + index * 0.15} distance={40} key={index} className={styles.investigationCard}>
                <div className={styles.invImageWrapper}>
                  <Image src={item.image} alt={item.title} fill className={styles.invImage} sizes="(max-width: 768px) 100vw, 33vw" unoptimized/>
                </div>
                <div className={styles.invCardBody}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardType}>{item.type}</span>
                    <span className={`${styles.cardStatus} ${styles[(item.status?.toLowerCase().replace(/\s/g, '') || 'preliminary')]}`}>{item.status}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardDate}>{item.date}</span>
                    {'isDynamic' in item && item.isDynamic ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.cardAction}>
                        Read Document <span className={styles.arrow}>→</span>
                      </a>
                    ) : (
                      <Link href={`/${item.sector}-reports`} className={styles.cardAction}>
                        Read Document <span className={styles.arrow}>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal direction="up" delay={0.6} className={styles.centerAction}>
            <Link href="/publications" className="btn btn-outline">
              Browse Database
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. News & Updates Mini-Section */}
      <section className={styles.newsSection}>
        <div className={`container ${styles.newsGrid}`}>
          <ScrollReveal direction="right" delay={0.1} className={styles.newsText}>
            <h2>Latest NSIB Updates</h2>
            <p>Press releases, safety alerts, and organizational news.</p>
            <Link href="/news" className="btn btn-primary" style={{ marginTop: '1rem' }}>View All News</Link>
          </ScrollReveal>
          <div className={styles.newsList}>
            {(dynamicNews.length > 0
              ? dynamicNews.map(n => ({ title: n.title, date: formatDate(n.published_at), id: n.id }))
              : [
                  { title: 'NSIB signs MoU with the Nigerian Navy for Maritime Safety', date: 'Oct 05, 2024', id: null },
                  { title: 'Director General Keynote at Annual Transport Safety Summit', date: 'Sep 14, 2024', id: null },
                  { title: 'New Safety Recommendations Issued for Domestic Airlines', date: 'Sep 02, 2024', id: null }
                ]
            ).map((news, i) => (
              <ScrollReveal direction="up" delay={0.2 + i * 0.15} key={i} className={styles.newsItem}>
                <span className={styles.newsDate}>{news.date}</span>
                <h4><Link href={news.id ? `/news/${news.id}` : "/news"}>{news.title}</Link></h4>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Key Partners & Collaborations */}
      <PartnersSlideshow />

      {/* 8. Action CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackgroundPattern}></div>
        <div className={`container ${styles.ctaContainer}`}>
          <ScrollReveal direction="up" delay={0.1} distance={40} className={styles.ctaContent}>
            <h2>Report An Accident or Incident</h2>
            <p>Safety is a collective responsibility. If you witness or are involved in an aviation, maritime, or rail accident, please report it to us immediately.</p>
            <div className={styles.ctaButtons}>
              <Link href="/report-accident" className="btn btn-secondary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
                Secure Reporting Portal
              </Link>
              <Link href="/contact-us" className={styles.textLinkWhite}>
                Emergency Contacts →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

function dynCards(count: number): number {
  return Math.min(count, 3);
}
