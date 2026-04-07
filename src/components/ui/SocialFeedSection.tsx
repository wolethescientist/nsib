'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './SocialFeedSection.module.css';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTimeline: (
          source: { sourceType: string; screenName: string },
          el: HTMLElement,
          options: Record<string, unknown>
        ) => Promise<HTMLElement | null>;
      };
    };
  }
}

interface Props {
  compact?: boolean;
}

// Facebook Page Plugin always renders an internal page header (~85px).
// There is no parameter to remove it. We clip it by pushing the iframe
// up with a negative top margin and hiding overflow on the wrapper.
const FB_HEADER_HEIGHT = 85;

function FacebookEmbed({ height }: { height: number }) {
  const iframeHeight = height + FB_HEADER_HEIGHT;

  return (
    <div className={styles.fbWrapper}>
      {/* Clip wrapper: exact visible height, hides the internal FB header */}
      <div className={styles.fbInner} style={{ height }}>
        <iframe
          src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnsibofficial&tabs=timeline&width=500&height=${iframeHeight}&small_header=true&adapt_container_width=false&hide_cover=true&show_facepile=false`}
          width="500"
          height={iframeHeight}
          style={{
            border: 'none',
            overflow: 'hidden',
            display: 'block',
            marginTop: `-${FB_HEADER_HEIGHT}px`,
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="NSIB Facebook Page"
        />
      </div>
    </div>
  );
}

function XTimelineEmbed({ height }: { height: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const render = () => {
      if (cancelled || !container || !window.twttr?.widgets) return;
      container.innerHTML = '';
      window.twttr.widgets
        .createTimeline(
          { sourceType: 'profile', screenName: 'nsibofficial' },
          container,
          { height, theme: 'light', chrome: 'noheader nofooter noborders transparent' }
        )
        .then((el) => {
          if (!cancelled) setStatus(el ? 'loaded' : 'failed');
        })
        .catch(() => {
          if (!cancelled) setStatus('failed');
        });
    };

    let injected: HTMLScriptElement | null = null;

    const tryRender = () => {
      if (window.twttr?.widgets) {
        render();
      } else if (!document.querySelector('script[src*="widgets.js"]')) {
        injected = document.createElement('script');
        injected.src = 'https://platform.twitter.com/widgets.js';
        injected.async = true;
        injected.charset = 'utf-8';
        injected.onload = render;
        document.body.appendChild(injected);
      } else {
        // Script injected but not ready yet — poll
        const interval = setInterval(() => {
          if (window.twttr?.widgets) {
            clearInterval(interval);
            render();
          }
        }, 100);
        timer = setTimeout(() => {
          clearInterval(interval);
          if (!cancelled) setStatus('failed');
        }, 8000); // give up after 8s
      }
    };

    tryRender();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (injected) {
        injected.onload = null;
        if (document.body.contains(injected)) document.body.removeChild(injected);
      }
    };
  }, [height]);

  return (
    <div className={styles.xWrapper} style={{ minHeight: height }}>
      {/* Skeleton shown while loading */}
      {status === 'loading' && (
        <div className={styles.skeleton} style={{ height }}>
          <div className={styles.skeletonLine} style={{ width: '60%' }} />
          <div className={styles.skeletonLine} style={{ width: '90%' }} />
          <div className={styles.skeletonLine} style={{ width: '75%' }} />
          <div className={styles.skeletonGap} />
          <div className={styles.skeletonLine} style={{ width: '55%' }} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
        </div>
      )}
      {/* Fallback if embed fails or account has restricted embeds */}
      {status === 'failed' && (
        <div className={styles.xFallback} style={{ height }}>
          <svg width="32" height="32" viewBox="0 0 1200 1227" fill="currentColor" aria-hidden="true" className={styles.xFallbackIcon}>
            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
          </svg>
          <p className={styles.xFallbackText}>View our latest posts on X</p>
          <a
            href="https://x.com/nsibofficial"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.xFallbackLink}
          >
            Open @nsibofficial ↗
          </a>
        </div>
      )}
      {/* Actual embed container */}
      <div
        ref={containerRef}
        className={styles.xEmbed}
        style={{ display: status === 'loaded' ? 'block' : 'none' }}
      />
    </div>
  );
}

export default function SocialFeedSection({ compact = false }: Props) {
  const height = compact ? 420 : 600;

  return (
    <section className={styles.section}>
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>

        {/* Header */}
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
          <div
            className={styles.card}
            style={{ '--platform-color': '#1877F2', '--platform-glow': 'rgba(24,119,242,0.18)' } as React.CSSProperties}
          >
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
              <a href="https://facebook.com/nsibofficial" target="_blank" rel="noopener noreferrer" className={styles.followBtn}>
                Follow ↗
              </a>
            </div>
            <div className={styles.cardBody}>
              <FacebookEmbed height={height} />
            </div>
          </div>

          {/* X card */}
          <div
            className={styles.card}
            style={{ '--platform-color': '#0f0f0f', '--platform-glow': 'rgba(255,255,255,0.06)' } as React.CSSProperties}
          >
            <div className={styles.cardHeader}>
              <div className={styles.platformInfo}>
                <div className={styles.platformIcon} style={{ background: '#0f0f0f' }}>
                  <svg width="14" height="14" viewBox="0 0 1200 1227" fill="white" aria-hidden="true">
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
                  </svg>
                </div>
                <div>
                  <span className={styles.platformName}>X (Twitter)</span>
                  <span className={styles.platformHandle}>@nsibofficial</span>
                </div>
              </div>
              <a href="https://x.com/nsibofficial" target="_blank" rel="noopener noreferrer" className={styles.followBtn}>
                Follow ↗
              </a>
            </div>
            <div className={styles.cardBody}>
              <XTimelineEmbed height={height} />
            </div>
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
