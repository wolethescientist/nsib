# Social Media Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live Facebook + X (Twitter) feed section to the NSIB home page and create a dedicated `/social` page.

**Architecture:** Two native platform embeds (Facebook Page Plugin iframe + X Timeline widget script) wrapped in a single reusable `SocialFeedSection` component. No API keys, no backend changes. The component is client-side only to avoid SSR hydration issues with third-party scripts.

**Tech Stack:** Next.js (App Router), React, CSS Modules, TypeScript. No new dependencies.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/ui/SocialFeedSection.tsx` | Create | Facebook iframe + X timeline widget, compact/full prop |
| `src/components/ui/SocialFeedSection.module.css` | Create | Section layout, grid, platform label styles |
| `src/app/social/page.tsx` | Create | Dedicated `/social` page with full-height feeds + follow buttons |
| `src/app/page.tsx` | Edit | Insert `<SocialFeedSection compact />` between Upcoming Events and Partners (line ~638) |

---

## Task 1: Create `SocialFeedSection` component

**Files:**
- Create: `src/components/ui/SocialFeedSection.tsx`

- [ ] **Step 1: Create the component file**

```tsx
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

    if (window.twttr) {
      load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      script.onload = load;
      document.body.appendChild(script);
    }
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
                src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnsibofficial&tabs=timeline&width=500&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="100%"
                height={height}
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
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
```

- [ ] **Step 2: Verify TypeScript compiles (no build errors yet — just a sanity check)**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: errors only about missing CSS module (that's fine, we add it next). Zero type errors on the component itself.

---

## Task 2: Create `SocialFeedSection.module.css`

**Files:**
- Create: `src/components/ui/SocialFeedSection.module.css`

- [ ] **Step 1: Create the stylesheet**

```css
.section {
  padding: 8rem 0;
  background-color: var(--nsib-gray-50);
}

.inner {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.accent {
  display: block;
  width: 48px;
  height: 4px;
  background: var(--nsib-red);
  border-radius: 2px;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--nsib-navy);
  margin: 0;
}

.subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.feedCol {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.platformLabel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--nsib-navy);
}

.widgetContainer {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background: var(--nsib-white);
  width: 100%;
}

.widgetContainer iframe {
  display: block;
  width: 100%;
}

@media (max-width: 768px) {
  .section {
    padding: 5rem 0;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.75rem;
  }
}
```

- [ ] **Step 2: Commit Task 1 + 2**

```bash
git add src/components/ui/SocialFeedSection.tsx src/components/ui/SocialFeedSection.module.css
git commit -m "feat: add SocialFeedSection component with Facebook and X embeds"
```

---

## Task 3: Create the `/social` page

**Files:**
- Create: `src/app/social/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import SocialFeedSection from '@/components/ui/SocialFeedSection';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Social Media | NSIB',
  description: 'Follow the Nigerian Safety Investigation Bureau on social media for the latest updates.',
};

export default function SocialPage() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heroTitle}>Stay Connected</h1>
          <p className={styles.heroSubtitle}>
            Follow NSIB on social media for real-time updates on investigations, safety advisories, and events.
          </p>
        </div>
      </section>

      {/* Live Feeds */}
      <SocialFeedSection compact={false} />

      {/* Follow buttons for all 4 platforms */}
      <section className={styles.followSection}>
        <div className={`container ${styles.followInner}`}>
          <h2 className={styles.followTitle}>All Our Channels</h2>
          <div className={styles.followGrid}>
            <Link href="https://facebook.com/nsibofficial" target="_blank" rel="noopener noreferrer" className={`${styles.followBtn} ${styles.facebook}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              Facebook
            </Link>
            <Link href="https://x.com/nsibofficial" target="_blank" rel="noopener noreferrer" className={`${styles.followBtn} ${styles.xTwitter}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
              X (Twitter)
            </Link>
            <Link href="https://instagram.com/nsibofficial" target="_blank" rel="noopener noreferrer" className={`${styles.followBtn} ${styles.instagram}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              Instagram
            </Link>
            <Link href="https://linkedin.com/company/nsibofficial" target="_blank" rel="noopener noreferrer" className={`${styles.followBtn} ${styles.linkedin}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create `src/app/social/page.module.css`**

```css
.hero {
  background: var(--nsib-navy);
  padding: 6rem 0 4rem;
}

.heroInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.heroTitle {
  font-size: 3rem;
  font-weight: 700;
  color: var(--nsib-white);
  margin: 0;
}

.heroSubtitle {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.78);
  max-width: 560px;
  margin: 0;
}

.followSection {
  padding: 6rem 0;
  background: var(--nsib-white);
}

.followInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.followTitle {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--nsib-navy);
  margin: 0;
}

.followGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.followBtn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  color: var(--nsib-white);
}

.followBtn:hover {
  opacity: 0.88;
  transform: translateY(-2px);
}

.facebook  { background: #1877F2; }
.xTwitter  { background: #000000; }
.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
.linkedin  { background: #0A66C2; }

@media (max-width: 640px) {
  .heroTitle { font-size: 2rem; }
  .followBtn { width: 100%; justify-content: center; }
  .followGrid { flex-direction: column; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/social/page.tsx src/app/social/page.module.css
git commit -m "feat: add /social page with full-height feeds and follow buttons"
```

---

## Task 4: Wire `SocialFeedSection` into the home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add the import at the top of `page.tsx`**

Find the existing imports block (around line 8-9 where other components are imported) and add:

```tsx
import SocialFeedSection from "@/components/ui/SocialFeedSection";
```

- [ ] **Step 2: Insert the section between Upcoming Events and Partners**

Find this block (around line 635–639):

```tsx
      {/* ── 11. UPCOMING EVENTS ── */}
      <CalendarEventsSection events={displayEvents} />

      {/* ── 12. PARTNERS ── */}
      <PartnersSlideshow />
```

Replace with:

```tsx
      {/* ── 11. UPCOMING EVENTS ── */}
      <CalendarEventsSection events={displayEvents} />

      {/* ── 12. SOCIAL FEED ── */}
      <SocialFeedSection compact />

      {/* ── 13. PARTNERS ── */}
      <PartnersSlideshow />
```

> Note: the existing comment numbers for Partners (12) and CTA (13) shift by one — update those comment numbers too so the sequence stays readable.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add social feed section to home page before partners"
```

---

## Task 5: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Check home page social section**

Open `http://localhost:3000` and scroll to the section between Upcoming Events and Partners. Verify:
- "Follow Us on Social Media" heading is visible
- Facebook iframe loads (may show a login prompt or the page feed depending on Facebook's public settings)
- X timeline widget loads (may take 1–2 seconds for the script to initialize)
- On mobile viewport (< 768px), columns stack vertically

- [ ] **Step 3: Check the `/social` page**

Open `http://localhost:3000/social`. Verify:
- Navy hero with "Stay Connected" heading renders
- Both feed embeds render at taller height (600px)
- All 4 follow buttons are visible with correct brand colors
- Links open the correct social profile URLs in a new tab

- [ ] **Step 4: Final commit (if any minor fixes were made)**

```bash
git add -A
git commit -m "fix: social feed polish after manual review"
```

---

## Notes

- **Facebook embed:** Facebook's Page Plugin shows public posts. If the NSIB Facebook page is not yet public or the page name `nsibofficial` doesn't match exactly, update the `href` in the iframe `src` to the correct URL-encoded page URL.
- **X embed height:** The Twitter widget respects `data-height` on the anchor tag. If the widget renders taller than expected, adjust the `height` values in the `compact ? 400 : 600` logic.
- **No API keys needed** for either embed — they load entirely via the platform's public embed infrastructure.
