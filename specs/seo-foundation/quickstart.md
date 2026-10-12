# Quickstart — validate the static site (no implementation code)

## 0. Prerequisites
Node LTS (stdlib only, no install). Clean checkout
(`git status --short` empty; `--check` compares against HEAD). Port 3000 free
(`PORT=4000 node server.mjs` as alt).

## 1. Start
`npm run dev` → expect `Original Framer export: http://127.0.0.1:3000`.
Also: `npm run check:seo` (static gates, no server needed),
`npm run build:mobile` + `--check` (post-commit only).

## 2. Route probes (plain curl, no phone UA)
- `/` → 200 html. `/contact/ /work/ /seo/ /seo/proof/` → 200 html.
- 6× `/work/*/` → 200 html. `/robots.txt` → 200 text/plain.
  `/sitemap.xml` → 200 `application/xml; charset=utf-8`. `/llms.txt` → 200 text.
- `/nope-xyz/` → 404 plain text `Not found: /nope-xyz/` (correct: `/404/` page
  is NOT auto-served).
- `curl /seo/` head shows alternate → `/m/seo/` + canonical
  `https://www.cypherai.in/seo/`.

## 3. Mobile vs bot
- iPhone UA on `/seo/` → contains `phone.css` (mirror served).
- Googlebot UA → no `phone.css`, contains alternate (desktop for bots).
- iPad UA → no `phone.css` (tablets stay desktop).
- `/m/seo/` → desktop canonical, never `/m/`.

## 4. Parity — `node scripts/build-mobile.mjs --check` → 12 PARITY, exit 0
(post-commit only). DRIFT/MISSING → revert or commit-then-rebuild. Never
hand-edit `site/m/` outside marker blocks.

## 5. Grep checks
- Staging refs: 0 matches for `framer.app|localhost:[0-9]|staging|preview-`
  in served HTML/robots/sitemap (outside `cypher-phone` records — none remain).
- Heads: one title/meta/canonical/og:url/favicon per sitemap page; lengths per
  head-contract. Forbidden schema (quoted type strings only; unquoted policy
  prose on /seo/ must not match): 0 `"HowTo"`; `"FAQPage"` only by approved
  non-Google exception (none). `grep -rniw FID` on page markup → zero hits
  (vendor chunks contain `fid` substrings — out of scope).

## 6. External validators (post §§2–5)
Rich Results Test (no errors; warnings ok), Schema validator (allowlist only),
PageSpeed mobile+desktop on `/` and `/seo/` (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1
p75; field orange at low traffic is normal — act on lab failures).

## 7. Search Console (production only)
Verify property → submit sitemap (11 URLs) → inspect `/`, `/seo/`,
`/seo/proof/`, one case study (canonical self-declared) → `/m/*` never indexed
→ no unexpected FAQ/HowTo enhancements.
