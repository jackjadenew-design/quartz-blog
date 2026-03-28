# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the card-heavy homepage with an unbounded, typography-driven layout using ghosted numerals, horizontal rules, and whitespace.

**Architecture:** Four files change: `content/index.md` (new HTML structure), `quartz/styles/custom.scss` (all visual changes), `quartz.config.ts` (font config), `quartz.layout.ts` (footer). All visual changes are CSS-only — no Quartz component source files are modified.

**Tech Stack:** Quartz 4 (Preact SSG), SCSS, Markdown with inline HTML

---

## File Structure

| File | Role | Action |
|---|---|---|
| `content/index.md` | Homepage markup — hero, categories, recent notes trigger | Modify |
| `quartz/styles/custom.scss` | All custom styles — hero, categories, recent notes, footer, article title | Modify |
| `quartz.config.ts` | Quartz config — font origin setting | Modify |
| `quartz.layout.ts` | Page layout — footer component | Modify |

---

### Task 1: Switch Font Origin to Local

**Files:**
- Modify: `quartz.config.ts:23`

- [ ] **Step 1: Change fontOrigin to "local"**

In `quartz.config.ts`, change line 23:

```typescript
      fontOrigin: "local",
```

This was previously `"googleFonts"`. The `"local"` option is defined in `quartz/util/theme.ts` and causes Quartz to skip all Google Fonts `<link>` tags in `Head.tsx` and font fetching in `componentResources.ts`.

- [ ] **Step 2: Build and verify no Google Fonts requests**

Run: `npx quartz build 2>&1 | tail -5`

Then check the generated HTML no longer contains Google Fonts links:

Run: `grep -c "fonts.googleapis.com" public/index.html`

Expected: `0` (no matches)

- [ ] **Step 3: Commit**

```bash
git add quartz.config.ts
git commit -m "perf: switch fontOrigin to local, remove unused Google Fonts requests"
```

---

### Task 2: Update Homepage Markup

**Files:**
- Modify: `content/index.md`

- [ ] **Step 1: Replace content/index.md with new structure**

Replace the entire content of `content/index.md` with:

```markdown
---
title: 赵少杰的博客
description: 聚焦人工智能、地理与遥感科学与个人思考的简体中文博客。
cssclasses:
  - home-page
---

<section class="home-hero">
  <span class="home-hero-year" aria-hidden="true"></span>
  <p class="home-eyebrow">Personal Blog · AI · Geoscience · Life</p>
  <h1>赵少杰的博客</h1>
  <div class="home-hero-rule"></div>
  <p class="home-lead">一名研究者的长期写作空间，记录人工智能、地理与遥感科学，以及研究之外的生活与反思。这里更强调完整文章与持续表达，而不是知识库式的碎片整理。</p>
</section>

<section class="home-categories">
  <p class="home-section-label">Sections</p>
  <div class="home-category-grid">
    <a class="home-category-col" href="./AI/">
      <span class="home-category-number">01</span>
      <span class="home-category-tag">AI</span>
      <p class="home-category-title">人工智能</p>
      <p class="home-category-desc">大模型、智能体与科研工作流</p>
    </a>
    <a class="home-category-col" href="./Geoscience/">
      <span class="home-category-number">02</span>
      <span class="home-category-tag">Geoscience</span>
      <p class="home-category-title">地理与遥感</p>
      <p class="home-category-desc">遥感、空间数据与地学研究</p>
    </a>
    <a class="home-category-col" href="./Life/">
      <span class="home-category-number">03</span>
      <span class="home-category-tag">Life</span>
      <p class="home-category-title">生活与思考</p>
      <p class="home-category-desc">阅读、日常与个人反思</p>
    </a>
  </div>
</section>

<script>
  document.querySelector(".home-hero-year").textContent = new Date().getFullYear();
</script>
```

Key changes from the old markup:
- Removed `.home-panel` wrapper divs (no more card containers)
- Hero section uses `.home-hero` directly (no `.home-panel` parent)
- Added `.home-hero-year` span for the ghosted year numeral
- Added `.home-hero-rule` div for the thin horizontal rule accent
- Category section uses `.home-categories` wrapper instead of `.home-panel`
- Category items are `.home-category-col` (columns) instead of `.home-category-card` (cards)
- Removed `.home-section-heading`, `.home-section-title`, `.home-section-note` — replaced by simpler `.home-section-label`
- Shortened category descriptions
- Removed `.home-category-label` and `.home-category-meta` spans
- Added inline script to set current year dynamically

- [ ] **Step 2: Build and verify HTML renders**

Run: `npx quartz build 2>&1 | tail -5`

Expected: `Done processing 5 files` with no errors.

- [ ] **Step 3: Commit**

```bash
git add content/index.md
git commit -m "markup: restructure homepage for unbounded layout with numbered columns"
```

---

### Task 3: Restyle Homepage — Hero Section

**Files:**
- Modify: `quartz/styles/custom.scss`

- [ ] **Step 1: Remove old home-panel and home-hero card styles**

In `quartz/styles/custom.scss`, find and replace the `.home-panel` card container rules (lines 278-287) that apply shared card styling:

Replace this block:

```scss
.home-panel,
.section-landing,
body[data-slug="index"] .recent-notes,
.page-listing .section,
.recent-notes .section {
  border: 1px solid var(--panel-border);
  border-radius: 1.6rem;
  background: linear-gradient(180deg, var(--panel-bg-strong) 0%, var(--panel-bg) 100%);
  box-shadow: var(--card-shadow);
}
```

With:

```scss
.section-landing,
.page-listing .section,
.recent-notes .section {
  border: 1px solid var(--panel-border);
  border-radius: 1.6rem;
  background: linear-gradient(180deg, var(--panel-bg-strong) 0%, var(--panel-bg) 100%);
  box-shadow: var(--card-shadow);
}
```

This removes `.home-panel` and `body[data-slug="index"] .recent-notes` from the shared card styles. The section-landing and page-listing cards are unchanged (out of scope).

- [ ] **Step 2: Remove old home-panel padding and home-hero::after orb**

Find and remove the `.home-panel` padding rule:

```scss
.home-panel {
  position: relative;
  overflow: hidden;
  padding: clamp(1.5rem, 3vw, 2.6rem);
}
```

Find and remove the `.home-hero::after` radial gradient orb:

```scss
.home-hero::after {
  content: "";
  position: absolute;
  right: -5rem;
  bottom: -6rem;
  width: 18rem;
  height: 18rem;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--secondary) 18%, transparent) 0,
    transparent 72%
  );
  pointer-events: none;
}
```

- [ ] **Step 3: Add new hero styles**

Add these new styles (place them where the old `.home-panel` / `.home-hero::after` rules were):

```scss
.home-hero {
  position: relative;
  padding: clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3.5rem);
  border-bottom: 1px solid var(--lightgray);
}

.home-hero-year {
  position: absolute;
  right: 0;
  top: clamp(1.5rem, 4vw, 3rem);
  font-family: var(--bodyFont);
  font-size: clamp(5rem, 10vw, 8rem);
  font-weight: 700;
  color: color-mix(in srgb, var(--secondary) 6%, transparent);
  line-height: 1;
  letter-spacing: -0.04em;
  user-select: none;
  pointer-events: none;
}

.home-hero-rule {
  width: 3rem;
  height: 2px;
  background: var(--secondary);
  margin-bottom: 1.2rem;
}
```

- [ ] **Step 4: Update the hero h1 rule**

Find the existing `.home-hero h1` rule:

```scss
.home-hero h1 {
  margin: 0;
  max-width: 8ch;
  font-size: clamp(3rem, 8vw, 4.9rem);
  line-height: 0.94;
  letter-spacing: -0.06em;
}
```

Replace with:

```scss
.home-hero h1 {
  margin: 0 0 1.2rem;
  font-size: clamp(3rem, 2.2rem + 2.5vw, 4.8rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
}
```

Changes: removed `max-width: 8ch` (no longer needed without card container), added bottom margin for spacing before the rule, adjusted font-size clamp slightly.

- [ ] **Step 5: Build and visually verify**

Run: `npx quartz build 2>&1 | tail -5`

Then open `public/index.html` in a browser to verify the hero section renders correctly with ghosted year, thin rule, and no card border.

- [ ] **Step 6: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style: restyle hero section — unbounded layout with ghosted year"
```

---

### Task 4: Restyle Homepage — Category Section

**Files:**
- Modify: `quartz/styles/custom.scss`

- [ ] **Step 1: Remove old category card styles**

Find and remove the following blocks from `custom.scss`:

The `.home-category-grid` rule:

```scss
.home-category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
```

The `.home-category-card` rule:

```scss
.home-category-card {
  display: flex;
  min-height: 14.5rem;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.4rem;
  border: 1px solid color-mix(in srgb, var(--panel-border) 84%, transparent);
  border-radius: 1.35rem;
  background: color-mix(in srgb, var(--panel-bg-strong) 92%, white 8%);
  color: var(--dark);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;
}
```

The `.home-category-card:hover` rule:

```scss
.home-category-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--secondary) 58%, var(--panel-border) 42%);
  color: var(--dark);
}
```

The `.home-category-label` rule:

```scss
.home-category-label {
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--darkgray) 78%, var(--secondary) 22%);
}
```

The `.home-category-card p` rule:

```scss
.home-category-card p {
  margin: 0;
  color: color-mix(in srgb, var(--darkgray) 88%, var(--secondary) 12%);
  line-height: 1.8;
}
```

The `.home-category-meta` rule:

```scss
.home-category-meta {
  margin-top: auto;
  color: var(--secondary);
  font-size: 0.95rem;
}
```

Also remove the old `.home-section-heading` and related rules:

```scss
.home-section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1.3rem;
}

.home-section-heading h2 {
  margin: 0.35rem 0 0;
  font-size: clamp(1.7rem, 1.52rem + 0.6vw, 2.15rem);
  line-height: 1.12;
  letter-spacing: -0.035em;
}
```

And the `.home-section-title` rule:

```scss
.home-section-title {
  margin-top: 0.35rem;
  font-family: var(--headerFont);
  font-size: clamp(1.7rem, 1.52rem + 0.6vw, 2.15rem);
  line-height: 1.12;
  letter-spacing: -0.035em;
}
```

And the `.home-section-note` rule:

```scss
.home-section-note {
  max-width: 26rem;
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.8;
  color: color-mix(in srgb, var(--darkgray) 84%, var(--secondary) 16%);
}
```

- [ ] **Step 2: Add new category styles**

Add these new styles where the old category rules were:

```scss
.home-categories {
  padding: clamp(2rem, 4vw, 3rem) 0;
  border-bottom: 1px solid var(--lightgray);
}

.home-section-label {
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--tertiary);
  margin: 0 0 clamp(1.2rem, 2vw, 1.8rem);
}

.home-category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.home-category-col {
  display: block;
  text-decoration: none;
  color: inherit;
  padding-right: clamp(0.8rem, 2vw, 1.5rem);
  transition: opacity 0.2s ease;
}

.home-category-col:hover {
  opacity: 0.7;
  color: inherit;
}

.home-category-col + .home-category-col {
  border-left: 1px solid var(--lightgray);
  padding-left: clamp(0.8rem, 2vw, 1.5rem);
}

.home-category-number {
  display: block;
  font-family: var(--headerFont);
  font-size: clamp(1.8rem, 1.5rem + 1vw, 2.4rem);
  font-weight: 700;
  color: color-mix(in srgb, var(--secondary) 10%, transparent);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.home-category-tag {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tertiary);
  margin-bottom: 0.4rem;
}

.home-category-title {
  margin: 0 0 0.45rem;
  font-family: var(--headerFont);
  font-size: clamp(1.05rem, 0.95rem + 0.3vw, 1.25rem);
  font-weight: 600;
  color: var(--dark);
  line-height: 1.2;
}

.home-category-desc {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--darkgray);
}
```

- [ ] **Step 3: Update responsive rules for categories**

Find the existing responsive rule for `.home-category-grid` inside `@media all and (max-width: 1100px)`:

```scss
@media all and (max-width: 1100px) {
  .home-category-grid {
    grid-template-columns: 1fr;
  }

  .home-section-heading {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

Replace with:

```scss
@media all and (max-width: 700px) {
  .home-category-grid {
    grid-template-columns: 1fr;
  }

  .home-category-col {
    padding-right: 0;
  }

  .home-category-col + .home-category-col {
    border-left: none;
    padding-left: 0;
    padding-top: 1.2rem;
    margin-top: 1.2rem;
    border-top: 1px solid var(--lightgray);
  }
}
```

Note: breakpoint changed from 1100px to 700px (matches mockup), and `.home-section-heading` rule removed (that element no longer exists).

- [ ] **Step 4: Build and visually verify**

Run: `npx quartz build 2>&1 | tail -5`

Open `public/index.html` in a browser. Verify numbered columns (01, 02, 03) with vertical dividers, no card borders.

- [ ] **Step 5: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style: restyle categories — numbered columns with vertical dividers"
```

---

### Task 5: Restyle Homepage — Recent Articles

**Files:**
- Modify: `quartz/styles/custom.scss`

- [ ] **Step 1: Add recent notes homepage overrides**

The existing `.recent-notes` styles in `custom.scss` (around lines 526-539) apply to the homepage via `body[data-slug="index"]`. Find:

```scss
body[data-slug="index"] .recent-notes {
  padding: clamp(1.5rem, 3vw, 2.3rem);
}

body[data-slug="index"] .recent-notes > h3 {
  margin: 0 0 1.15rem;
  font-size: clamp(1.6rem, 1.42rem + 0.5vw, 1.95rem);
  line-height: 1.12;
  letter-spacing: -0.035em;
}
```

Replace with:

```scss
body[data-slug="index"] .recent-notes {
  padding: clamp(2rem, 4vw, 3rem) 0;
  border-bottom: 1px solid var(--lightgray);
}

body[data-slug="index"] .recent-notes > h3 {
  font-size: 0.78rem;
  font-family: var(--bodyFont);
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--tertiary);
  margin: 0 0 clamp(0.8rem, 1.5vw, 1.2rem);
  line-height: 1.4;
}

body[data-slug="index"] .recent-notes .section {
  grid-template-columns: 1fr !important;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.8rem 0;
  border: none;
  border-bottom: 1px solid color-mix(in srgb, var(--lightgray) 80%, transparent);
  border-radius: 0;
  background: none;
  box-shadow: none;
}

body[data-slug="index"] .recent-notes .section:last-child {
  border-bottom: none;
}

body[data-slug="index"] .recent-notes .section:hover {
  transform: none;
  border-color: color-mix(in srgb, var(--lightgray) 80%, transparent);
  opacity: 0.7;
}

body[data-slug="index"] .recent-notes .section > .meta {
  font-size: 0.78rem;
  color: var(--tertiary);
  min-width: 5.5rem;
  font-variant-numeric: tabular-nums;
  margin: 0;
  letter-spacing: 0;
  text-transform: none;
}

body[data-slug="index"] .recent-notes .section .desc {
  flex: 1;
}

body[data-slug="index"] .recent-notes .section .desc h3 {
  font-family: var(--headerFont);
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1.3;
}

body[data-slug="index"] .recent-notes .section .summary {
  display: none;
}

body[data-slug="index"] .recent-notes .section > .tags {
  margin: 0;
  gap: 0;
}

body[data-slug="index"] .recent-notes .section > .tags li:not(:first-child) {
  display: none;
}

body[data-slug="index"] .recent-notes .section > .tags a.tag-link {
  font-size: 0.7rem;
  color: var(--tertiary);
  padding: 0.12rem 0.5rem;
  border: 1px solid var(--lightgray);
  border-radius: 0;
  background: none;
}
```

- [ ] **Step 2: Add responsive hide for tags**

Inside the existing `@media all and (max-width: 800px)` block, add:

```scss
  body[data-slug="index"] .recent-notes .section > .tags {
    display: none;
  }
```

- [ ] **Step 3: Remove old index-specific footer margin**

Find and remove:

```scss
body[data-slug="index"] .page-footer {
  margin-top: clamp(1.5rem, 3vw, 2.3rem);
}
```

- [ ] **Step 4: Build and visually verify**

Run: `npx quartz build 2>&1 | tail -5`

Open `public/index.html` in a browser. Verify recent articles render as ruled index rows: date | title | tag.

- [ ] **Step 5: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style: restyle recent articles — ruled index rows"
```

---

### Task 6: Add Footer and Fix Article Title Width

**Files:**
- Modify: `quartz.layout.ts:9`
- Modify: `quartz/styles/custom.scss`

- [ ] **Step 1: Replace Spacer with Footer in layout**

In `quartz.layout.ts`, find line 9:

```typescript
  footer: Component.Spacer(),
```

Replace with:

```typescript
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com",
      "Google Scholar": "https://scholar.google.com",
    },
  }),
```

Note: The user should replace these placeholder URLs with their actual profile links.

- [ ] **Step 2: Add footer style overrides**

In `quartz/styles/custom.scss`, add at the end (before the responsive media queries):

```scss
footer {
  border-top: 1px solid var(--lightgray);
  padding: clamp(2rem, 3vw, 3rem) 0;
  margin-bottom: 0;
  opacity: 1;

  & > p {
    font-size: 0.78rem;
    color: var(--gray);
  }

  & ul {
    margin-top: 0;
    gap: 0.75rem;

    & a {
      font-size: 0.78rem;
      font-weight: 400;
      color: var(--tertiary);
    }

    & a:hover {
      color: var(--secondary);
    }
  }
}
```

This overrides the default Quartz footer styles (opacity: 0.7, margin-bottom: 4rem) to match the scholarly aesthetic.

- [ ] **Step 3: Fix article title max-width**

In `quartz/styles/custom.scss`, find:

```scss
.article-title {
  margin: 1rem 0 0 !important;
  max-width: 12ch;
  font-size: clamp(2.5rem, 2rem + 1.8vw, 4rem) !important;
  line-height: 1.04;
  letter-spacing: -0.05em;
}
```

Replace with:

```scss
.article-title {
  margin: 1rem 0 0 !important;
  max-width: 20ch;
  font-size: clamp(2.5rem, 2rem + 1.8vw, 4rem) !important;
  line-height: 1.04;
  letter-spacing: -0.05em;
}
```

- [ ] **Step 4: Build and visually verify**

Run: `npx quartz build 2>&1 | tail -5`

Open `public/index.html` — verify footer renders with "Created with Quartz" text and links. Open an article page — verify title width allows ~20 Chinese characters before wrapping.

- [ ] **Step 5: Commit**

```bash
git add quartz.layout.ts quartz/styles/custom.scss
git commit -m "feat: add footer with links, fix article title width for Chinese"
```

---

### Task 7: Clean Up Removed CSS Rules

**Files:**
- Modify: `quartz/styles/custom.scss`

- [ ] **Step 1: Remove orphaned CSS rules**

The following CSS rules reference class names that no longer exist in `content/index.md` after Task 2. Find and remove each one:

Remove `.home-section-title, .home-category-title` shared rule (the old one that set both):

```scss
.home-section-title,
.home-category-title {
  margin: 0;
  color: var(--dark);
}
```

Remove the `.home-category-title` rule that set `font-size: 1.5rem` (the new `.home-category-title` was already added in Task 4):

```scss
.home-category-title {
  font-size: 1.5rem;
  line-height: 1.14;
  letter-spacing: -0.03em;
}
```

Remove the `.article.home-page` grid rule (the `<article>` no longer needs grid since sections handle their own spacing):

```scss
article.home-page {
  display: grid;
  gap: clamp(1.6rem, 3vw, 2.5rem);
}
```

Update the `home-page` anchor hiding rule — the new markup no longer has `<h2>` headings but still has `<h1>` (which Quartz injects anchor links into). Find:

```scss
.home-page h1 > a[role="anchor"],
.home-page h2 > a[role="anchor"] {
  display: none;
}
```

Replace with:

```scss
.home-page h1 > a[role="anchor"] {
  display: none;
}
```

- [ ] **Step 2: Remove old mobile overrides for removed elements**

In the `@media all and (max-width: 800px)` block, find and remove:

```scss
  .home-panel,
  .section-landing,
  body[data-slug="index"] .recent-notes,
  .page-listing .section,
  .recent-notes .section {
    border-radius: 1.25rem;
  }

  .home-panel,
  .section-landing,
  body[data-slug="index"] .recent-notes {
    padding: 1.25rem;
  }
```

Replace with (keeping only the non-homepage rules):

```scss
  .section-landing,
  .page-listing .section,
  .recent-notes .section {
    border-radius: 1.25rem;
  }

  .section-landing {
    padding: 1.25rem;
  }
```

Also find and remove the `.home-hero h1` mobile rule:

```scss
  .home-hero h1 {
    max-width: none;
  }
```

This is no longer needed since the `max-width` constraint was already removed in Task 3.

- [ ] **Step 3: Build and verify no errors**

Run: `npx quartz build 2>&1 | tail -5`

Expected: `Done processing 5 files` with no errors.

- [ ] **Step 4: Full visual check**

Open `public/index.html` in a browser. Verify:
- Hero: ghosted year, thin rule, no card border
- Categories: numbered columns with vertical dividers
- Recent articles: ruled index rows
- Footer: copyright + links
- No visual regressions

- [ ] **Step 5: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "chore: clean up orphaned CSS rules from old card-based homepage"
```
