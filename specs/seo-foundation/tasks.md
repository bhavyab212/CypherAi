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

## Wave C — backlog (later waves)
- [ ] `/404/` noindex decision (apply or formally waive with rationale).
- [ ] Per-page 1200×630 social cards; replace favicon og:image.
- [ ] `/voice-agents`, `/workflows`, `/crm-integrations` pages; repoint
      `/seo/` internal links to locked-spec targets.
- [ ] Quarterly ledger re-confirmation (C-03/C-04 due Jan quarter) + changelog.
- [ ] Phase 3 plan-design-review gate before any visual redesign.
