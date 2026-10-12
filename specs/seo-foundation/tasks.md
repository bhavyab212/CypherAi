# Tasks — remaining work after Phase 2 (wave-ordered)

## Wave A — commit + regenerate (DONE 12 Oct 2026, full-access session)
- [x] Commit desktop changes (d571141, 2fc5481, e1b69ce).
- [x] Builder + `--check` → 12/12 PARITY (fixed same-line canonical layout + 3 title floors en route).
- [x] Mirrors committed. DRIFT root-caused (newline-split canonical) + contract amended.
- [x] `npm run check:seo` → exit 0 (incl. JSON-LD parse + ListItem allowlist fix).

## Wave B — live validation (server probes DONE 12 Oct 2026; external pending)
- [x] Server probes §§2–3 (all routes 200 + MIME, phone→mirror, bot/tablet→desktop).
- [ ] Rich Results Test + Schema validator on `/`, `/seo/`, `/seo/proof/`.
- [ ] PageSpeed mobile+desktop (keyless API quota exhausted 12 Oct — rerun with
      key or pagespeed.web.dev manual); record p75 (graduates C-02).
- [ ] Search Console: verify property, submit sitemap (11 URLs), inspect
      `/`, `/seo/`, `/seo/proof/`, one case study; confirm `/m/*` unindexed.

## Wave C — Phase 4 Core Service Expansion & Hardening (DONE 12 Oct 2026)
- [x] `/404/` noindex applied (`<meta name="robots" content="noindex, follow">`).
- [x] Per-page 1200×630 social card (`site/images/og-cover.png`) created and referenced in meta tags.
- [x] `/voice-agents/`, `/workflows/`, `/crm-integrations/` service pages created (>1,800 to 2,100 words each, full structured data, responsive tables, FAQs, CTAs).
- [x] Mobile mirrors generated for all 3 new pages; 15/15 PARITY verified with `node scripts/build-mobile.mjs --check`.
- [x] Repoint `/seo/` and `/contact/` internal links to all live service pages.
- [x] Update `sitemap.xml` (14 URLs) and `llms.txt`.
- [x] `scripts/check-seo.mjs` updated and passing 100% (all 45+ gates green).
- [ ] Quarterly ledger re-confirmation (C-03/C-04 due Jan quarter) + changelog.
