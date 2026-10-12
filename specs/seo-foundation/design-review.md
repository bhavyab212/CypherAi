# Design Review Gate — Phase 3 (12 Oct 2026)

Two independent read-only tracks + lead pass. Verdict: PASS WITH FIXES (all
applied, gates green). Slop: low-moderate (export cruft, not LLM soup).

## R1 — hand-built pages (premium-minimal bar)

| Dimension | Score | Note |
|---|---|---|
| Typography | 7 | Inter declared-but-unloaded → system-ui committed on /seo/*. |
| Hierarchy | 7 | Question-H2s kept; FAQ H2 added (was orphaned H3s). |
| Spacing | 6 | 760px discipline kept; monotonous accepted for austere brief. |
| Color | 7 | Single-accent kept; contact orbs accepted as conversion layer. |
| Imagery | 4→6 | Real 1200×630 OG card generated (`images/og-cover.png`); proof visuals still open. |
| Nav/IA | 8 | Skip links added to /seo/*; contact keeps slim nav by design. |
| Trust | 8 | Scarcity eyebrow replaced (founder-led/24h); Gmail kept — no invented mailbox. |
| CTA | 7 | Bottom ghost now points at /seo/proof/ (was Back-to-home). |
| Mobile | 5→7 | Table scroll-wrap + CTA stacking in inline CSS and phone.css. |
| Accessibility | 6→7 | 44px iconbtn/cal-day, placeholder+faint to #55555c, skip links. |
| Performance | 7 | /seo/ 20KB, proof 9KB measured; contact weight accepted as conversion cost. |

## R2 — Framer export system

Scores: Typography 7, Hierarchy 6, Spacing 6, Color 7, Motion 5, Imagery 5,
Responsive 6, Overlay 7, Accessibility 4, Performance 4.
Applied: favicon typo/dup eliminated (18 heads → single favicon.png),
placeholder overlay injection disabled in server.mjs (function kept),
asset cache policy (immutable hashed / 1h site-owned / no-cache HTML).
Deferred to Framer-side waves (recorded, not hidden): semantic SSR landmarks,
appear-system reduced-motion flag, @font-face display/preconnect campaign,
alt-text precision, token-hash renaming, yoyo-gate wiring, DPR hack.

## Do-not-touch (respected)
Hydration blob, appear initial states, breakpoint classes, token hashes, chunk
hashes, phone-split guards + UA patterns, script load order, hide-edit
selectors, unicode-range subsets, homepage JSON-LD.
