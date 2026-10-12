# CypherAi Design System: Semantic Specification (DESIGN.md)

> **Single Source of Truth** for engineering web applications, customer portals, internal tools, and high-density CRMs sharing the CypherAi aesthetic and brand identity.
>
> Built to guide developers, AI code agents (Claude, Codex, Gemini), and interface builders (Stitch, Figma, Next.js, React, Tailwind).

---

## 1. Visual Theme & Atmosphere

CypherAi’s design language fuses **Swiss Typography & Industrial Precision** with **Contemporary Minimalist Software Aesthetics**. It balances high-velocity operational density with spacious visual clarity.

- **Vibe:** Authoritative, clinical, tactile, and engineering-led. It looks like a high-end hardware spec sheet or an aerospace mission control terminal translated into a clean enterprise application.
- **Density Spectrum:**
  - **Marketing / Onboarding Surfaces:** *Balanced & Focused* (Density 4–5/10, measure `65ch`, generous padding).
  - **CRM / Analytics / Dashboard Surfaces:** *Cockpit Operational* (Density 8–9/10, tabular figures, dense data grids, 32px–40px row heights, compact borders).
- **Variance:** *Structured & Modular* (Variance 4–6/10). No chaotic layouts; layout rhythm is achieved through asymmetric metadata panels, stat callouts, and clean split-view panes.
- **Motion:** *Subtle, Crisp & Hardware-Accelerated* (Motion 4–5/10). Snappy 150ms–250ms cubic-bezier eases, tactile `-1px` button depressions, smooth drawer reveals, and zero gratuitous floating animations.

---

## 2. Color Palette & Semantic Tokens

CypherAi strictly enforces a **Monochromatic Base** accented by a single high-contrast signature brand color (**Electric International Orange** `#FF3700`) and functional utility tokens.

### 2.1 Core Neutral Scale

| Token Name | Hex Code | Functional Role |
|---|---|---|
| **Canvas White** | `#FFFFFF` | Primary app canvas, light mode cards, modal background |
| **Surface Neutral** | `#F6F6F6` | Table headers, stat backgrounds, input fills, hover states |
| **Warm Canvas Light** | `#F8F8F9` | App shell background, secondary sidebar background |
| **Subtle Divider** | `#ECECEC` | Structural 1px borders, card outlines, subtle dividers |
| **Line Border** | `#E4E4E7` | Form input borders, table cell outlines, active separators |
| **Muted Steel** | `#71717A` | Metadata, timestamps, helper text, uppercase table headers |
| **Soft Charcoal** | `#55555C` | Secondary body text, form placeholders, table data labels |
| **Deep Charcoal Ink** | `#161616` | Primary headlines, primary action buttons, dark accents |
| **Dark Slate Surface** | `#262626` | Dark mode container fill, deep navigation bars |
| **Off-Black Base** | `#0D0D0F` | Dark mode app background, high-contrast modal panels |

### 2.2 Accent & Semantic Signals

| Token Name | Hex Code | Functional Role |
|---|---|---|
| **Cypher Orange (Brand Accent)** | `#FF3700` | Signature brand badge, active indicator dots, primary highlights |
| **Amber Focus** | `#EAB308` | Form input focus ring, warm warnings, pending deal stages |
| **Success Emerald** | `#15803D` | Active call status, completed workflows, connected webhooks |
| **Danger Crimson** | `#B91C1C` | Destructive actions, disconnected APIs, error alerts |

### 2.3 Strict Color Rules
- **No Neon AI Clichés:** Neon purple, blue glow halos, iridescent gradient text, and diffuse neon drop-shadows are strictly banned.
- **Single Accent Rule:** `#FF3700` is the sole visual brand beacon. It must be used sparingly (status dots, hero accents, key badges, notification counters)—never as whole-page backgrounds.
- **Never Pure Black:** Text and primary buttons must use `#161616` (or `#0D0D0F`), never raw `#000000`.

---

## 3. Typographic Architecture

Typography establishes authority through strict scale ratios, tight display tracking, and dedicated tabular figures for financial/operational data.

### 3.1 Font Stacks

```css
/* Primary Interface & Display */
--font-sans: system-ui, -apple-system, "Segoe UI", Inter, "Inter Display", sans-serif;

/* High-Density Data, Metrics, CRM IDs & Code */
--font-mono: "JetBrains Mono", "Geist Mono", "Fragment Mono", monospace;

/* Editorial Counterpoint (Marketing / Case Study Quotes Only) */
--font-serif: "Instrument Serif", Georgia, serif;
```

### 3.2 Scale & Hierarchy

| Role | Size | Line Height | Tracking | Weight | Stack |
|---|---|---|---|---|---|
| **Display / Hero H1** | `32px`–`40px` (clamp `2.2rem`–`2.8rem`) | `1.15`–`1.2` | `-0.03em` | `700` / `800` | Sans |
| **Section Title H2** | `22px`–`26px` (`1.4rem`–`1.6rem`) | `1.25` | `-0.02em` | `700` | Sans |
| **Panel Header H3** | `17px`–`18px` (`1.05rem`–`1.15rem`) | `1.35` | `-0.01em` | `650` | Sans |
| **Lede / Intro Text** | `18px` (`1.125rem`) | `1.55` | `0` | `400` | Sans |
| **Body Default** | `15px`–`16px` (`0.95rem`–`1rem`) | `1.65` | `0` | `400` | Sans |
| **Compact / Data** | `13px`–`14px` (`0.82rem`–`0.875rem`) | `1.45` | `0` | `450` | Sans / Mono |
| **Labels & Badges** | `11px`–`12px` (`0.72rem`–`0.75rem`) | `1.2` | `+0.05em` | `700` (caps) | Sans / Mono |

### 3.3 Typographic Rules
- **Tabular Numbers:** All numeric data, deal values, call durations, latency numbers, and timestamps must use `font-variant-numeric: tabular-nums` or `--font-mono`.
- **Measure:** Prose text containers must never exceed `65ch` (max-width ~`760px`) to prevent eye fatigue.
- **High Contrast Placeholders:** Placeholders must use `#55555C` with `opacity: 1` to strictly satisfy WCAG AA contrast (never low-contrast gray `#9C9CA4`).

---

## 4. UI Component Library (CRM & Application Primitives)

### 4.1 Buttons & Action Controls

```css
/* Primary Action Button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #161616;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
  height: 42px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid #161616;
  cursor: pointer;
  transition: transform 0.12s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.btn-primary:hover {
  background-color: #262626;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.btn-primary:active {
  transform: translateY(1px);
}

/* Secondary / Ghost Button */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #FFFFFF;
  color: #161616;
  font-weight: 600;
  font-size: 14px;
  height: 42px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid #E4E4E7;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #F6F6F6;
  border-color: #D4D4D8;
}

/* Accent Highlight Button (CTA / Live Trigger) */
.btn-accent {
  background-color: #FF3700;
  color: #FFFFFF;
  border: 1px solid #FF3700;
}
.btn-accent:hover {
  background-color: #E63200;
}
```

### 4.2 Data Tables (`table.compare` & Grid Views)

CRM pipelines and log tables must support responsive horizontal panning with locked minimum column widths:

```css
.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #E4E4E7;
  border-radius: 12px;
  background: #FFFFFF;
}

table.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: left;
}

table.data-table th {
  background-color: #F6F6F6;
  color: #71717A;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 12px 16px;
  border-bottom: 1px solid #E4E4E7;
  white-space: nowrap;
}

table.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #ECECEC;
  color: #161616;
  vertical-align: middle;
}

table.data-table tr:hover td {
  background-color: #FAFAFB;
}

table.data-table tr:last-child td {
  border-bottom: none;
}
```

### 4.3 KPI / Stat Callout Blocks

```html
<div class="stat-card">
  <div class="stat-indicator"></div>
  <div class="stat-content">
    <span class="stat-label">Calls Logged This Month</span>
    <span class="stat-value">14,290</span>
    <span class="stat-delta positive">+18.4% vs last period</span>
  </div>
</div>
```

```css
.stat-card {
  display: flex;
  background-color: #F6F6F6;
  border-radius: 12px;
  border: 1px solid #ECECEC;
  overflow: hidden;
  padding: 16px 20px;
  position: relative;
}

.stat-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #161616; /* Or #FF3700 for active/highlight stats */
}

.stat-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #71717A;
  margin-bottom: 6px;
}

.stat-value {
  display: block;
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 800;
  color: #161616;
  line-height: 1.1;
  margin-bottom: 6px;
}

.stat-delta.positive {
  font-size: 12px;
  font-weight: 600;
  color: #15803D;
}
```

### 4.4 Status Badges & Indicator Pills

```html
<!-- Live Agent Active Badge -->
<span class="badge badge-live">
  <span class="dot pulse"></span>
  Live 24/7
</span>

<!-- Pipeline Stage Badge -->
<span class="badge badge-neutral">Stage: Discovery</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #E4E4E7;
  background-color: #FFFFFF;
  color: #161616;
}

.badge-live {
  background-color: #F0FDF4;
  border-color: #BBF7D0;
  color: #15803D;
}

.badge-live .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #15803D;
}

.badge-brand {
  background-color: #FFF5F2;
  border-color: #FED7AA;
  color: #C2410C;
}

.badge-brand .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #FF3700;
}
```

### 4.5 Form Inputs & Search Fields

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-label {
  font-size: 13px;
  font-weight: 650;
  color: #161616;
}

.input-text {
  height: 42px;
  padding: 0 14px;
  font-size: 14px;
  color: #161616;
  background-color: #FFFFFF;
  border: 1px solid #E4E4E7;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-text::placeholder {
  color: #55555C;
  opacity: 1;
}

.input-text:hover {
  border-color: #D4D4D8;
}

.input-text:focus {
  border-color: #161616;
  box-shadow: 0 0 0 2px rgba(22, 22, 22, 0.1);
}
```

---

## 5. App Shell & Application Architecture (CRM Layout)

When building a CRM, internal dashboard, or client hub:

```
+-------------------------------------------------------------------------------+
| TOPBAR (Height: 56px, Border-bottom: 1px solid #ECECEC, Background: #FFFFFF)   |
| [CypherAi Logo]  [Search Contacts/Deals...]          [Live Status] [User Menu]|
+--------------+----------------------------------------------------------------+
| SIDEBAR      | MAIN CONTENT CANVAS (Background: #F8F8F9, min-height: 100vh)   |
| (240px wide) |                                                                |
| - Overview   |  [Page Header / Breadcrumb / Action Row]                       |
| - Contacts   |  +--------------------+ +--------------------+ +--------------+|
| - AI Voice   |  | KPI Metric Card 1  | | KPI Metric Card 2  | | KPI Card 3   ||
| - Workflows  |  +--------------------+ +--------------------+ +--------------+|
| - Pipelines  |                                                                |
| - Logs / API |  +------------------------------------------------------------+|
|              |  | Primary Data Table / Kanban Pipeline / Activity Stream      ||
| [Settings]   |  +------------------------------------------------------------+|
+--------------+----------------------------------------------------------------+
```

### 5.1 Layout Rules
1. **Desktop Shell:**
   - Left Sidebar: `240px` static width, fixed position, border-right `1px solid #ECECEC`.
   - Top Bar: `56px` height, sticky top `0`, `z-index: 40`, background `#FFFFFF` with backdrop blur.
   - Main Viewport: `padding: 28px 32px`, max-width `1600px`, content background `#F8F8F9`.
2. **Mobile Collapse (< 810px):**
   - Sidebar collapses into an off-canvas drawer accessed via a 44px hamburger trigger.
   - Topbar remains fixed with a 44px call/quick-action button.
   - All 3+ column KPI grids collapse to `1fr` single-column cards.
   - Tables activate horizontal scroll-wrap with sticky first-column keys.

---

## 6. Motion & Interaction Standards

1. **Active Feedback:**
   - Interactive elements depress `-1px` on `:active`.
   - Modals enter with subtle scale + fade (`transform: scale(0.98) -> scale(1.0)`, `opacity: 0 -> 1` in `160ms cubic-bezier(0.16, 1, 0.3, 1)`).
2. **Skeleton Shimmer:**
   - Never use generic spinning circular loaders for content areas.
   - Render neutral skeleton shapes (`background: #EEEEF0; animation: shimmer 1.5s infinite; border-radius: 8px`).
3. **Hardware Acceleration:**
   - Animate exclusively via `transform` and `opacity`.
   - Never animate `width`, `height`, `top`, or `padding`.

---

## 7. Anti-Patterns & Banned AI Tells

When generating code or screens for CypherAi apps, **NEVER**:

- ❌ **No Emoji Bullets or Headings:** Never use 🚀, ⚡, 🤖, 💡 as icons or bullets. Use clean SVG micro-icons (Lucide/Heroicons) or clean typography.
- ❌ **No Floating Neon Gradients:** No purple/violet AI glows (`#7C3AED`, `#8B5CF6`).
- ❌ **No Text Overlapping Images:** Every component occupies its own discrete bounding box.
- ❌ **No Generic Low-Contrast Gray:** Never use `#9C9CA4` or `#A1A1AA` for critical text. Use `#55555C` minimum.
- ❌ **No Generic Placeholder Names:** Never generate "Acme Corp", "John Doe", or fake stats like `99.9%`. Use realistic domain data (e.g., "HubSpot API Webhook", "Inbound Call #4092", "Priyansh Razz").
- ❌ **No 3-Card Symmetrical Cliché:** Avoid generic 3 equal floating cards. Use asymmetric split layouts, data tables, or structured KPI rows.
- ❌ **No Full-Page Spinners:** Never block the screen with a centered spinner. Use skeleton loading state bars.

---

## 8. Reusable Starter Stylesheet (`cypher-theme.css`)

Drop this CSS into any new project, CRM, or app template:

```css
:root {
  --cypher-ink: #161616;
  --cypher-ink-soft: #55555C;
  --cypher-ink-muted: #71717A;
  --cypher-canvas: #FFFFFF;
  --cypher-bg-subtle: #F6F6F6;
  --cypher-bg-app: #F8F8F9;
  --cypher-border-subtle: #ECECEC;
  --cypher-border-line: #E4E4E7;
  --cypher-brand-accent: #FF3700;
  --cypher-brand-accent-hover: #E63200;
  --cypher-status-emerald: #15803D;
  --cypher-status-amber: #EAB308;
  --cypher-status-crimson: #B91C1C;

  --font-sans: system-ui, -apple-system, "Segoe UI", Inter, sans-serif;
  --font-mono: "JetBrains Mono", "Geist Mono", monospace;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-pill: 9999px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-sans);
  color: var(--cypher-ink);
  background-color: var(--cypher-bg-app);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
```

---

## 9. Verification & Governance Checklist

Before shipping any new CRM or app screen, verify:

- [ ] Does the page use `#161616` as primary ink and `#FF3700` as the sole brand accent?
- [ ] Are all data numbers, IDs, and financial values using tabular monospace?
- [ ] Do tables have responsive horizontal scroll-wrap (`overflow-x: auto`) for mobile?
- [ ] Are all button and clickable touch targets at least `44px` on mobile screens?
- [ ] Is input placeholder contrast at or above `#55555C`?
- [ ] Are all emojis, purple gradients, and generic cards excluded?
- [ ] Does every action trigger a tactile active state (`translateY(1px)`)?
