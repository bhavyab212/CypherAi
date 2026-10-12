# Spec: SEO foundation for cypherai.in (static export)

## Goal
`www.cypherai.in` is fully indexable, AI-citable, and honestly measured: every
public URL serves 200 with a production canonical, discovery files exist, one
service page (`/seo/`) plus evidence warehouse (`/seo/proof/`) carry the
commercial intent, and every claim is verifiable.

## Non-goals
Location-page programs (30/50-page gates), FAQPage/HowTo markup, responsive
retrofit of the frozen Framer export, rebranding, apex-as-canonical.

## Requirements
1. All 11 content URLs serve 200 with absolute www canonical == og:url ==
   sitemap loc == JSON-LD url. `/404/` canonicalized but never sitemapped.
2. `robots.txt` (bot allows incl. OAI-SearchBot/PerplexityBot/Googlebot-Extended),
   `sitemap.xml` (11 locs), `llms.txt` (entity + page map) present and correct.
3. `/seo/` (locked title/meta/H1/6 question H2s, ≥800 words, table, process
   list, stat callout, 6 plain-HTML FAQs, Service/WebPage/BreadcrumbList
   JSON-LD) and `/seo/proof/` (ledger/methodology/SLAs/changelog) live with
   mirrors, nav links, and sitemap/llms entries.
4. Proof ledger: 6 rows with id/claim/number/source/date/status/verifyUrl;
   statuses honest (target/process/practice/measured); changelog mandatory.
5. Gates enforced by `scripts/check-seo.mjs` (exit 0) covering staging-refs,
   heads, sitemap coverage, robots, schema allowlist, mirror markers, llms.
6. Mirror discipline: 12 PAGES rows, parity via `--check` post-commit.

## Acceptance
`npm run check:seo` exit 0; `--check` 12 PARITY post-commit; staging grep 0;
validators (Rich Results, Schema, PageSpeed) recorded; Search Console sitemap
accepted with 11 URLs.

## Open items (kept, not silently dropped)
- `/404/` noindex (recommended, not applied — Framer default stands).
- Per-page 1200×630 social cards (og:image is favicon placeholder).
- Measured CWV runs (C-02 stays Target until dated field data exists).
- `/voice-agents`, `/workflows`, `/crm-integrations` pages (locked-spec links
  adapted to live routes until built).
