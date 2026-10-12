# Research: SEO Decisions (CypherAi static export)

> Scope: frozen Framer static export under `site/`, served by root `server.mjs`
> (static file server with mobile UA-split + overlay injection). Mobile mirrors
> under `site/m/` governed by `scripts/build-mobile.mjs` (PAGES list + BEGIN/END
> marker parity vs git HEAD). Method: read-only evidence via read/grep.
> Status: LOCKED = decided, do not revisit without a new wave.

## R-01 — Canonical host: www vs apex

**Decision:** LOCKED — `https://www.cypherai.in/` is the single canonical host.
Every canonical, `og:url`, sitemap `<loc>`, `robots.txt` Sitemap line,
`llms.txt` page map, and JSON-LD `@id`/`url` uses www. The apex (`cypherai.in`)
is never canonical and must 301-redirect to www (host-level redirect, outside
this static tree).

**Rationale:** all desktop canonicals are absolute `https://www.cypherai.in/...`;
`sitemap.xml` lists the same www URLs; `robots.txt` Sitemap line points at the
www sitemap; `llms.txt` maps all pages to www URLs. Zero apex canonicals exist.
A single absolute host keeps `canonical == og:url == sitemap loc == JSON-LD url`.

**Alternatives considered:** apex-as-canonical (rejected: rewrite everything for
zero benefit); relative canonicals (rejected: weaker through mirrors/proxies; the
old relative fallback in `site/m/contact/index.html` was drift, since healed).

## R-02 — Source of truth: Framer cloud vs repo SEO layer

**Decision:** LOCKED — the repo (`site/` working tree + git HEAD) is the source
of truth for everything SEO. The Framer cloud project is frozen reference only.
No Framer re-export may overwrite `site/` heads, canonicals, titles, metas,
JSON-LD, `robots.txt`, `sitemap.xml`, `llms.txt`, or the hand-built pages.

**Rationale:** the 8 Framer pages were surgically cut to production
canonicals/titles/metas in Phases 0–1; a fresh export would silently restore
staging heads and wipe the work. The SEO layer (`/seo/`, `/seo/proof/`,
`/contact/` content, discovery files) exists only in the repo.

**Alternatives considered:** Framer-first editing (rejected: head output is
opaque there, parity baselines would invalidate); bidirectional sync (rejected:
no merge tool understands heads + marker blocks).

## R-03 — /seo intent: service page

**Decision:** LOCKED — `/seo/` is a commercial **Service page**, not a blog
post, location page, or glossary entry. Companion `/seo/proof/` is the evidence
warehouse (ledger / methodology / changelog / SLAs). Funnel: `/seo/` persuades
→ `/seo/proof/` verifies → `/contact/` converts (plus WhatsApp CTA).

**Rationale:** single H1, 6 question-form buyer-intent H2s, comparison table,
4-step process, 6-row ledger excerpt, dual CTAs, author/date byline; JSON-LD
Service + WebPage + BreadcrumbList on an Organization identity. One intent per
page — no cannibalization by construction.

**Alternatives considered:** blog/guide intent (rejected: competes with CTA,
dilutes Service schema); location-page program (rejected: triggers 30-page
WARNING / 50-page HARD STOP gates with no local footprint; disavowed on-page).

## R-04 — FAQPage / HowTo policy

**Decision:** LOCKED — **never emit `FAQPage` or `HowTo` JSON-LD on this
commercial site.** FAQ ships as plain HTML so readers and AI answer engines can
cite it without chasing rich-result markup.

**Rationale:** `HowTo` deprecated Sept 2023. `FAQPage` rich results restricted
Aug 2023 to government/healthcare — zero Google benefit on commercial pages.
Repo complies and self-documents the policy inline on `/seo/`. Closed
allowlist: Organization, WebSite, Service, WebPage, BreadcrumbList, Person.

**Alternatives considered:** FAQPage "for AI citation" (rejected: plain quotable
HTML is what gets lifted); HowTo for the 4-step process (rejected: deprecated;
`<ol class="steps">` already expresses sequence).

## R-05 — Title / meta / word-count gates

**Decision:** LOCKED gates for every indexable page:
- `title`: **30–60 characters** (rendered text, entities decoded), unique per URL.
- `meta description`: **120–160 characters**, unique per URL, one CTA verb.
  (`scripts/check-seo.mjs` enforces a wider 100–175 band so WARN-range pages
  report PASS with their grandfathered status recorded here, not as failures.)
- `word count`: hand-built service/evidence pages **≥800 words** (nav/footer
  excluded). Framer case pages frozen-exempt (WARN, no filler).
- `H1`: exactly one per page. Service pages: 3–5 descriptive internal links.

**Rationale (measured):** `/seo/` title ≈60ch (at cap — shorten, never lengthen),
meta ≈155ch, ~1300+ words. `/seo/proof/` title ≈50ch, meta ≈140ch. Homepage
≈53ch/≈125ch. `/contact/` title ≈31ch, meta ≈108ch — WARN, frozen, do not pad.
Case titles fixed to grounded names where the gate script requires ≥30
("Bravo UI/UX App", "Nitro Design System" per homepage portfolio labels).

**Alternatives considered:** relax title gate to 70ch (rejected: truncation risk);
pad thin pages with boilerplate (rejected: violates honest-claims).

## R-06 — CWV targets (LCP / INP / CLS — never FID)

**Decision:** LOCKED — **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at p75 field data.**
`FID` is never referenced. Until a dated field run exists, ledger C-02 stays
labeled **Target**.

**Rationale:** matches current Core Web Vitals thresholds; static-first
hand-built pages (inline CSS, zero render-blocking JS beyond device guards) make
them structurally achievable. Lab ≠ field: only p75 field data with a date
graduates a claim to measured.

**Alternatives considered:** claim lab numbers as results (rejected); keep FID
alongside INP (rejected: retired; `grep FID` must return zero content hits).

## R-07 — Mobile-mirror parity rule

**Decision:** LOCKED — mirror ≡ desktop outside marker blocks, byte-identical
after normalization (`stripMarkers` + `ASSET_NORMALIZE`), verified with
`node scripts/build-mobile.mjs --check`. Mirrors never indexed (no sitemap
entries, desktop canonical kept); bots always get desktop; tablets stay desktop.

**Rationale:** 12 PAGES entries; descriptor guards inject only alternate/redirect
(desktop) and css/js/return-guard/canonical (mirror). Separate-mobile-URL
without canonical split keeps all index signal on desktop URLs.

**Alternatives considered:** responsive-only delete-/m/ (rejected: frozen-export
rewrite out of scope); UA-split without /m/ files (rejected: breaks static hosts).

## R-08 — Builder-must-run-after-commit constraint

**Decision:** LOCKED — `node scripts/build-mobile.mjs` (build mode) runs only on
a **clean tree after `git commit`** of desktop sources (`pristineDesktop()`
reads git HEAD, not the working tree). Sequence: edit desktop → commit → build
→ `--check` → commit mirrors. Never hand-edit `site/m/` outside marker blocks
(the `/contact/` relative-canonical drift was healed via the in-marker channel).

**Alternatives considered:** builder reads working tree (rejected: destroys
idempotence); hand-edit mirrors (rejected: breaks parity by definition).

## Constitution Check

| Principle | Verdict | Evidence |
|---|---|---|
| Honest claims only | **PASS** | C-02 labeled Target; "nothing presented as measured before measured" on-page. |
| Static-first zero-JS | **PASS** | Hand-built pages pure HTML+inline CSS; only device guards + defer scripts. |
| Marker discipline | **PASS** | Generator + checker enforce; drift healed via in-marker channel. |
| Verify-by-grep | **PASS** | Canonical/og:url parity, single-H1, schema allowlist, FID-absence, discovery consistency, `--check` parity all command-verifiable. |

### Probe pack (repo root)
- `grep -o 'rel="canonical" href="[^"]*"' site/index.html site/contact/index.html site/seo/index.html site/seo/proof/index.html`
- Forbidden schema (quoted JSON-LD type strings only — unquoted policy prose
  on /seo/ is intentional and must not match):
  `grep -rn '"FAQPage"\|"HowTo"' site/ --include=index.html` (expect zero)
- Retired metric (whole-word; vendor minified chunks contain `fid`
  substrings, so scope to page markup):
  `grep -rniw "FID" site/index.html site/contact/index.html site/seo/index.html site/seo/proof/index.html site/work/ site/404/` (expect zero)
- `node scripts/build-mobile.mjs --check` (post-commit)
- `node scripts/check-seo.mjs` (anytime; no commit needed)
