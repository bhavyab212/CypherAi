# Head Contract — required `<head>` per page class

Classes: **Framer-export** (`/`, `/work/`, `/work/*`) and **hand-built**
(`/contact/`, `/seo/`, `/seo/proof/`, `/404/`). Mirrors preserve per
mirror-contract.

## 1. `<title>` — exactly one, unique site-wide, **30–60ch** (rendered).
Format `[hook] | CypherAi`. (`/seo/` at 60ch cap — shorten, never lengthen.)

## 2. `<meta name="description">` — exactly one, unique, **120–160ch** with one
CTA verb. (`check-seo.mjs` enforces 100–175 so grandfathered WARN pages report
honestly; `/contact/` ≈108ch WARN/frozen.)

## 3. `<meta name="robots">` — `index, follow` on indexable pages. `/404/`:
`noindex` recommended (open item — Framer default currently applies).

## 4. Canonical — exactly one, absolute `https://www.cypherai.in/<path>`,
trailing slash matching sitemap loc. AMENDED (Phase 2): the Phase 0–1 cutover
replaced all staging `framer.app` canonicals in-repo, so the "keep export
canonical" rule is retired — production absolute canonicals are now the
baseline, and any `*.framer.app` href is a Critical regression. Mirrors reuse
the desktop canonical INSIDE the marker block with the `removed` record. Never
a `/m/` canonical.

## 5. Open Graph / Twitter — `og:url` == canonical (absolute). Required:
`og:type` website, `og:title`, `og:description`, `og:image` (absolute;
current placeholder `/images/favicon.png`), `twitter:card` summary,
`twitter:title`, `twitter:description`.

## 6. JSON-LD — ALLOWED: Organization, WebSite, Service, WebPage,
BreadcrumbList (+ structural child ListItem), Person. FORBIDDEN: `FAQPage` for Google benefit (Aug 2023:
gov/healthcare only), `HowTo` always (deprecated Sept 2023). Ids/urls absolute
and canonical-consistent.

## 7. Favicon — `<link rel="icon" href="/images/favicon.png">` every page.

## 8. Mobile alternate (desktop only, inside marker block):
`<link rel="alternate" media="only screen and (max-width: 809px)" href="/m/<path>">`.
Mirrors carry canonical + reverse guard instead.

## 9. Base tags — charset utf-8, viewport, `<html lang="en">` every page.

## 10. NEVER in `<head>` — staging/dev URLs, second canonical, `/m/`
canonical, FAQPage/HowTo JSON-LD, render-blocking scripts beyond the
device-split guard.
