# Mirror Contract — `/m/` phone mirrors (`site/m/`)

Generator: `scripts/build-mobile.mjs`. 12 PAGES rows: `/`, `/work/`,
`/work/bravo|nitro|project-1|2|3|strida/`, `/contact/`, `/seo/`, `/seo/proof/`,
`/404/`.

## 1. Marker anatomy
Delimiters `<!-- cypher-phone:begin -->` … `<!-- cypher-phone:end -->`. All
injected content strictly between them; nothing else may differ from desktop.
- **Desktop block:** `alternate` link (`/m/<path>`) + forward-guard script
  (narrow viewport + mobile UA; never bots/tablets; loop-guarded on `/m/`;
  `?view=desktop`/sessionStorage opt-out wins). Anchor: after
  `<!-- Start of headStart -->`, else viewport meta, else `<head>`.
- **Mirror block:** `removed`-canonical record + `phone.css` + `phone.js`
  (defer) + reverse-guard script + preserved desktop canonical (absolute).
  Canonical source: removed desktop href, else `desktopPath` fallback.

## 2. Inside vs outside
INSIDE: the above only. OUTSIDE: byte-identical modulo `ASSET_NORMALIZE`
(`"./repeatless-import/` → `"/repeatless-import/`, mirrors only; never written
back to desktop).

## 3. Parity procedure
`node scripts/build-mobile.mjs --check` → 12× `PARITY m/…`, exit 0.
`DRIFT`/`MISSING` → rebuild or revert, never hand-edit mirrors (marker-block
canonical alignment excepted as a documented healing channel).
Layout rule (learned Oct 2026): keep `<link rel="canonical">` and
`<meta property="og:url">` on the SAME line (Framer style). The builder's
remove/restore round-trip cannot reproduce a newline split between them and
`--check` reports DRIFT on hand-built pages that split them.

## 4. Commit-before-rebuild (HARD)
Edit desktop → `git commit` → run builder → `--check` → commit mirrors.
Builder reads pristine desktop from git HEAD; uncommitted edits are invisible
to it by design.
