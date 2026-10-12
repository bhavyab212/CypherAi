# Plan: SEO foundation (technical)

Stack: static HTML + `server.mjs` (node:http file server, UA-split, overlay
injection) + `scripts/build-mobile.mjs` (mirror generator, git-HEAD baseline).
No frameworks, no build step for content, no database. Validation:
`scripts/check-seo.mjs` (static gates), `--check` (parity), grep probes,
external validators, Search Console.

## Architecture
- `site/` = shippable artifact. Desktop `index.html` files authoritative;
  `site/m/` mirrors generated (marker blocks excepted). Discovery files
  (`robots.txt`, `sitemap.xml`, `llms.txt`) hand-authored at root.
- `server.mjs` = dev/preview server AND reference for static-host behavior
  (directory index, MIME incl. `.xml`, bot bypass, no-cache).
- `specs/seo-foundation/` = design record (research, data-model, contracts,
  quickstart, spec, plan, tasks). `scripts/check-seo.mjs` = executable gates.

## File map (changed/added Phases 0–2)
- Heads: `site/index.html` (+Organization/WebSite JSON-LD), 8 Framer pages
  (unique titles/metas, production canonicals), `site/contact/index.html`
  (+canonical/OG + seo nav link), 9 mirrors (canonical alignment, titles).
- New: `site/seo/`, `site/seo/proof/` (+mirrors), `site/robots.txt`,
  `site/sitemap.xml`, `site/llms.txt`, `scripts/check-seo.mjs`,
  `specs/seo-foundation/`.
- Infra: `server.mjs` (+`.xml` MIME), `scripts/build-mobile.mjs` (+2 PAGES
  rows), `package.json` (`check:seo`, `build:mobile`), `.gitignore` (dist,
  build, IDE dirs).

## Constitution gates (from research.md)
Honest claims / static-first / marker discipline / verify-by-grep — all PASS
(drift healed; ledger C-02 stays Target).

## Risks
- Builder reads git HEAD: commit before build, or `--check` lies. Mitigated by
  contract + quickstart ordering.
- Framer re-export wipes heads: repo is source of truth (R-02); never re-export
  over `site/` without a wave decision.
- Shell/sandbox limits: `check-seo.mjs` and probes are untested in this
  environment (pwsh blocked) — first local run must confirm exit 0; fix script,
  never weaken gates.
