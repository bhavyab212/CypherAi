# Tasks — remaining work after Phase 2 (wave-ordered)

## Wave A — commit + regenerate (needs shell/git; blocked in sandbox)
- [ ] Commit desktop changes (site + specs + scripts + package.json).
- [ ] Run `node scripts/build-mobile.mjs`, then `--check` → 12 PARITY.
- [ ] Commit mirrors/guards. If DRIFT: revert hand-edit or rebuild per contract.
- [ ] Run `npm run check:seo` → exit 0. Fix code on failure, never weaken gates.

## Wave B — live validation (needs deploy + network)
- [ ] Start server; run quickstart §§2–3 probes (routes, MIME, mobile/bot/tablet).
- [ ] Rich Results Test + Schema validator on `/`, `/seo/`, `/seo/proof/`.
- [ ] PageSpeed mobile+desktop on `/`, `/seo/`; record p75 (graduates C-02).
- [ ] Search Console: verify property, submit sitemap (11 URLs), inspect
      `/`, `/seo/`, `/seo/proof/`, one case study; confirm `/m/*` unindexed.

## Wave C — backlog (later waves)
- [ ] `/404/` noindex decision (apply or formally waive with rationale).
- [ ] Per-page 1200×630 social cards; replace favicon og:image.
- [ ] `/voice-agents`, `/workflows`, `/crm-integrations` pages; repoint
      `/seo/` internal links to locked-spec targets.
- [ ] Quarterly ledger re-confirmation (C-03/C-04 due Jan quarter) + changelog.
- [ ] Phase 3 plan-design-review gate before any visual redesign.
