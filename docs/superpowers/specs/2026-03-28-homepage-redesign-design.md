# Homepage Redesign — Scholarly & Authoritative

**Date:** 2026-03-28
**Scope:** Homepage visual redesign + secondary fixes (fonts, footer, title width, decorative orb)
**Tone:** Scholarly, authoritative — like an academic journal landing page
**Mockup:** `.superpowers/brainstorm/34605-1774699124/content/full-homepage.html`

## Summary

Replace the current card-heavy homepage with an unbounded, typography-driven layout. Structure comes from horizontal rules, vertical dividers, and whitespace — not bordered containers. A ghosted year numeral in the hero and numbered category columns (01/02/03) create a layered visual language throughout.

## Design Decisions

### 1. Hero Section — Layered Composition

**Current:** Title + eyebrow + description wrapped in a `.home-panel` card with border, rounded corners, box-shadow, and a nearly-invisible radial gradient orb.

**New:**
- Remove card container (border, border-radius, box-shadow, background gradient)
- Remove `.home-hero::after` radial gradient orb
- Add a large ghosted year numeral ("2026") positioned absolute, top-right, using `color-mix(in srgb, var(--secondary) 6%, transparent)`. Font-size ~`clamp(5rem, 10vw, 8rem)`.
- Add a thin 3rem horizontal rule (`2px solid var(--secondary)`) between title and description as a visual anchor
- Title stays serif (`var(--titleFont)`), large, tight letter-spacing
- Generous vertical padding: `clamp(3rem, 6vw, 5rem)` top, `clamp(2rem, 4vw, 3.5rem)` bottom
- Bottom border: `1px solid var(--lightgray)` to separate from categories

**The year numeral** is dynamic — it should render the current year, not a hardcoded "2026". Use an inline `<script>` in `content/index.md` that sets `textContent` to `new Date().getFullYear()` on the year element. This runs client-side and stays current without rebuilds.

### 2. Category Section — Numbered Columns

**Current:** 3-column grid of `.home-category-card` elements, each with border, rounded corners, min-height, background, and hover lift effect.

**New:**
- Remove all card styling (border, border-radius, background, box-shadow, min-height, hover transform)
- 3-column CSS grid, no gap — columns separated by `border-left: 1px solid var(--lightgray)` on 2nd and 3rd columns
- Each column contains:
  - Ghosted number (01, 02, 03) — `color-mix(in srgb, var(--secondary) 10%, transparent)`, `clamp(1.8rem, 1.5rem + 1vw, 2.4rem)` serif font
  - English tag label (uppercase, small, tertiary color)
  - Chinese title (serif, 600 weight)
  - Short description (~15 characters, truncated from current longer text)
- Hover: `opacity: 0.7` transition instead of translateY lift
- Responsive (<=700px): stack to single column, replace left borders with top borders
- Section has a "Sections" uppercase kicker label above the grid
- Bottom border: `1px solid var(--lightgray)`

**Category descriptions are shortened:**
- AI: "大模型、智能体与科研工作流"
- Geoscience: "遥感、空间数据与地学研究"
- Life: "阅读、日常与个人反思"

### 3. Recent Articles — Ruled Index

**Current:** `.recent-notes` wrapped in the same card container, each article in a `.section` card with border, rounded corners, summary, and tags.

**New:**
- Remove card container from `.recent-notes` and individual `.section` items
- "最新文章" uppercase kicker label
- Each article rendered as a single row: `date | title | tag`
  - Date: `0.78rem`, tertiary color, `min-width: 5.5rem`, `font-variant-numeric: tabular-nums`
  - Title: serif font, `1.02rem`, 600 weight, dark color, `flex: 1`
  - Tag: `0.7rem`, tertiary color, `border: 1px solid var(--lightgray)`, `padding: 0.12rem 0.5rem`
- Rows separated by `border-bottom: 1px solid` (lighter than section dividers)
- No summaries — just date + title + tag for scanability
- Hover: `opacity: 0.7`
- Responsive (<=700px): hide tags to prevent overflow

**Implementation note:** The RecentNotes component currently renders `<div class="section">` with a date `<p class="meta">`, a `<div class="desc"><h3>` for title, `<p class="summary">`, and `<ul class="tags">`. The new layout needs these same DOM elements restyled via CSS to appear as a flat row. The summary can be hidden with `display: none`. The tags list renders each tag as a separate `<li>` — for the ruled index, only the first tag should be visible (CSS `:first-child` + hide others).

### 4. Footer

**Current:** `Component.Spacer()` — renders invisible empty space.

**New:**
- Replace `Component.Spacer()` with `Component.Footer()` in `quartz.layout.ts`
- Configure with minimal content: "© 2026 赵少杰" on the left, links on the right
- Style: `border-top: 1px solid var(--lightgray)`, `padding: clamp(2rem, 3vw, 3rem) 0`, `font-size: 0.78rem`, `color: var(--gray)`
- Links: GitHub, Google Scholar (or whatever the user prefers — placeholder for now)

**Implementation note:** Quartz's built-in `Component.Footer()` accepts a `links` option. Check the component source for the exact API.

### 5. Remove Wasted Google Fonts

**Current:** `quartz.config.ts` specifies `fontOrigin: "googleFonts"` with Schibsted Grotesk, Source Sans Pro, IBM Plex Mono. These are loaded via `<link>` tags but completely overridden by `custom.scss` system font stacks.

**New:**
- Change `fontOrigin` from `"googleFonts"` to `"local"` in `quartz.config.ts`
- This is a supported Quartz option (defined in `quartz/util/theme.ts` as `"googleFonts" | "local"`)
- When set to `"local"`, Quartz skips all Google Fonts `<link>` tags in `Head.tsx` and skips font fetching in `componentResources.ts`
- The existing system font stacks in `custom.scss` handle all rendering — no other changes needed
- The `typography` config values become unused but can remain as documentation of intent

### 6. Fix Article Title Width

**Current:** `.article-title { max-width: 12ch }` — too narrow for Chinese titles (12 Chinese characters).

**New:** Change to `max-width: 20ch`. This gives Chinese titles up to ~20 characters before wrapping, which accommodates most academic-length titles while still creating visual drama from the large font size.

### 7. Section Separation Pattern

All three homepage sections (hero, categories, recent) plus the footer are separated by `1px solid var(--lightgray)` horizontal rules. This replaces the current card borders as the primary structural element. The rhythm is:

```
[sidebar header]
─────────────── (muted border, from sidebar)
[hero with ghosted year]
─────────────── (lightgray)
[numbered categories 01 02 03]
─────────────── (lightgray)
[recent articles ruled index]
─────────────── (lightgray)
[footer]
```

## Files to Modify

| File | Changes |
|---|---|
| `quartz.config.ts` | Change font config to prevent wasted Google Fonts loading |
| `quartz.layout.ts` | Replace `Component.Spacer()` footer with `Component.Footer()` |
| `quartz/styles/custom.scss` | Major: restyle hero, categories, recent notes, add footer styles, fix article title width, remove orb |
| `content/index.md` | Update HTML structure: remove `.home-panel` wrappers, add year element, simplify category card markup, shorten descriptions |

## Files NOT Modified

- `quartz/components/RecentNotes.tsx` — restyle via CSS only, no component changes needed
- `quartz/components/PageList.tsx` — unchanged, only affects non-homepage listing pages
- `quartz/components/ContentMeta.tsx` — unchanged, not part of homepage redesign
- `quartz/styles/base.scss` — unchanged, custom.scss overrides handle everything

## Out of Scope

- Article page typography and reading experience
- Table of Contents reintroduction
- Section landing page (AI/Geoscience/Life index) redesign
- Dark mode palette changes (the current dark palette is well-tuned)
- Mobile navigation patterns beyond basic responsive stacking
