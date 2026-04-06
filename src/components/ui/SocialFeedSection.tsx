'use client';

import { useEffect, useRef } from 'react';
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
    <div ref={containerRef} className={styles.widgetContainer} style={{ minHeight: height }}>
      <a
        className="twitter-timeline"
        data-height={height}
        data-theme="light"
        href="https://twitter.com/nsibofficial"
      >
        Posts by @nsibofficial
      </a>
    </div>
  );
}

export default function SocialFeedSection({ compact = false }: Props) {
  const height = compact ? 400 : 600;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <span className={styles.accent} />
          <h2 className={styles.title}>Follow Us on Social Media</h2>
          <p className={styles.subtitle}>Stay updated with the latest from NSIB across our social channels.</p>
        </div>

        <div className={styles.grid}>
          {/* Facebook */}
          <div className={styles.feedCol}>
            <div className={styles.platformLabel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1B2A6B" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span>Facebook</span>
            </div>
            <div className={styles.widgetContainer} style={{ minHeight: height }}>
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnsibofficial&tabs=timeline&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="100%"
                height={height}
                style={{ border: 'none', overflow: 'hidden' }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="NSIB Facebook Page"
              />
            </div>
          </div>

          {/* X / Twitter */}
          <div className={styles.feedCol}>
            <div className={styles.platformLabel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1B2A6B" aria-hidden="true">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
            </svg>
              <span>X (Twitter)</span>
            </div>
            <XTimelineEmbed height={height} />
          </div>
        </div>
      </div>
    </section>
  );
}
