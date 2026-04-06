# Social Media Feed — Design Spec
**Date:** 2026-04-06  
**Platforms:** Facebook + X (Twitter)  
**Approach:** Native platform embeds (no API keys, no paid services)

---

## Overview

Add a live social media feed to the NSIB site so that posts on Facebook and X appear on the site automatically. Consists of two deliverables:

1. **Home page section** — compact 2-column feed widget inserted before the Partners slideshow
2. **`/social` page** — dedicated full-page social hub with larger widgets + static follow buttons for Instagram and LinkedIn

---

## Architecture

No backend changes. Both embeds are client-side only:

- **Facebook:** Official Page Plugin `<iframe>` pointing to `facebook.com/nsibofficial`. Renders a scrollable feed of the latest posts. No API key required — just the page URL.
- **X/Twitter:** Twitter timeline embed via `widgets.twitter.com/widgets.js` script pointing to `x.com/nsibofficial`. Renders a scrollable timeline. No API key required.

Both widgets must be rendered client-side only (`'use client'` + dynamic import with `ssr: false`) to avoid hydration mismatches from third-party scripts.

---

## Components

### `SocialFeedSection` (`src/components/ui/SocialFeedSection.tsx`)
Reusable section used on both the home page and the `/social` page.

Props:
- `compact?: boolean` — if true, renders shorter widgets (home page); if false, renders taller widgets (social page)

Internals:
- Section wrapper with NSIB navy/red header ("Follow Us on Social Media")
- 2-column responsive grid (stacks to 1 column on mobile)
- Left column: Facebook Page Plugin iframe
- Right column: X Timeline embed
- Each column has a platform label with icon above the widget

### `/social` page (`src/app/social/page.tsx`)
- Uses `PublicShell` (Navbar + Footer)
- Page hero: "Stay Connected" heading, brief copy
- `<SocialFeedSection compact={false} />`
- Below the feeds: a row of 4 social follow buttons (Facebook, X, Instagram, LinkedIn) linking to the respective profile URLs already defined in the Footer

---

## Widget Dimensions

| Context | Facebook height | X height |
|---|---|---|
| Home page (compact) | 400px | 400px |
| /social page | 600px | 600px |

Both widgets are fluid width (100% of their column).

---

## Placement on Home Page

Inserted between the existing **Upcoming Events** section and the **Partners Slideshow** (line ~639 in `page.tsx`). Order becomes:

> ... Investigations → Management → News+Downloads → Upcoming Events → **Social Feed** → Partners → CTA

---

## Styling

- Section header matches existing section header patterns (navy background, white text, red accent line)
- Widget containers have a subtle border and box-shadow matching the NSIB card style
- Platform labels use the existing navy color with SVG platform icons
- Responsive: 2-column on ≥768px, 1-column on mobile (Facebook first, X second)
- CSS module: `SocialFeedSection.module.css`

---

## Out of Scope

- Instagram and LinkedIn live feeds (platform API restrictions — not feasible without paid aggregator)
- Admin approval workflow
- Supabase involvement
- Any server-side data fetching

---

## Files Changed / Created

| File | Action |
|---|---|
| `src/components/ui/SocialFeedSection.tsx` | Create |
| `src/components/ui/SocialFeedSection.module.css` | Create |
| `src/app/social/page.tsx` | Create |
| `src/app/page.tsx` | Edit — insert `<SocialFeedSection compact />` before `<PartnersSlideshow />` |
