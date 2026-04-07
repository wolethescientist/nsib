'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './SocialFeedSection.module.css';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void;
      };
    };
  }
}

interface Props {
  compact?: boolean;
}

function XTimelineEmbed({ height }: { height: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const load = () => {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(container);
      }
    };

    let injected: HTMLScriptElement | null = null;

    if (window.twttr) {
      load();
    } else if (!document.querySelector('script[src*="widgets.js"]')) {
      injected = document.createElement('script');
      injected.src = 'https://platform.twitter.com/widgets.js';
      injected.async = true;
      injected.charset = 'utf-8';
      injected.onload = load;
      document.body.appendChild(injected);
    }

    return () => {
      if (injected) {
        injected.onload = null;
        document.body.removeChild(injected);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.embedWrapper} style={{ minHeight: height }}>
      <a
        className="twitter-timeline"
        data-height={height}
        data-theme="light"
        data-chrome="noheader nofooter noborders"
        href="https://twitter.com/nsibofficial"
      >
        Posts by @nsibofficial
      </a>
    </div>
  );
}

export default function SocialFeedSection({ compact = false }: Props) {
  const height = compact ? 420 : 600;

  return (
    <section className={styles.section}>
      {/* Dot-grid texture */}
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>

        {/* Header row */}
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <span className={styles.overline}>Official Channels</span>
            <h2 className={styles.title}>Follow Us on<br />Social Media</h2>
            <p className={styles.subtitle}>
              Live updates from the Nigerian Safety Investigation Bureau across our official social channels.
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.statBlock}>
              <span className={styles.statNumber}>25K+</span>
              <span className={styles.statLabel}>Followers<br />across platforms</span>
            </div>
          </div>
        </div>

        {/* Feed grid */}
        <div className={styles.grid}>

          {/* Facebook card */}
          <div className={styles.card} style={{ '--platform-color': '#1877F2', '--platform-glow': 'rgba(24,119,242,0.15)' } as React.CSSProperties}>
            <div className={styles.cardHeader}>
              <div className={styles.platformInfo}>
                <div className={styles.platformIcon} style={{ background: '#1877F2' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </div>
                <div>
                  <span className={styles.platformName}>Facebook</span>
                  <span className={styles.platformHandle}>Nigerian Safety Investigation Bureau</span>
                </div>
              </div>
              <a
                href="https://facebook.com/nsibofficial"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.followBtn}
              >
                Follow ↗
              </a>
            </div>
            <div className={styles.embedWrapper} style={{ minHeight: height }}>
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnsibofficial&tabs=timeline&height=${height}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
                width="100%"
                height={height}
                style={{ border: 'none', overflow: 'hidden', display: 'block' }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="NSIB Facebook Page"
              />
            </div>
          </div>

          {/* X / Twitter card */}
          <div className={styles.card} style={{ '--platform-color': '#0f0f0f', '--platform-glow': 'rgba(255,255,255,0.06)' } as React.CSSProperties}>
            <div className={styles.cardHeader}>
              <div className={styles.platformInfo}>
                <div className={styles.platformIcon} style={{ background: '#0f0f0f' }}>
                  {/* X logo */}
                  <svg width="14" height="14" viewBox="0 0 1200 1227" fill="white" aria-hidden="true">
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
                  </svg>
                </div>
                <div>
                  <span className={styles.platformName}>X (Twitter)</span>
                  <span className={styles.platformHandle}>@nsibofficial</span>
                </div>
              </div>
              <a
                href="https://x.com/nsibofficial"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.followBtn}
              >
                Follow ↗
              </a>
            </div>
            <XTimelineEmbed height={height} />
          </div>
        </div>

        {/* Also find us on */}
        <div className={styles.alsoOn}>
          <span className={styles.alsoOnLabel}>Also find us on</span>
          <div className={styles.alsoOnLinks}>
            <Link href="https://instagram.com/nsibofficial" target="_blank" rel="noopener noreferrer" className={styles.alsoOnLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              Instagram
            </Link>
            <Link href="https://linkedin.com/company/nsibofficial" target="_blank" rel="noopener noreferrer" className={styles.alsoOnLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
