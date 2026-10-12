# Route Contract — CypherAi static site (`site/` served by root `server.mjs`)

> Read-only contract. What each public route MUST do. Deviation is a bug.
> Server root = `site/`. Binds `http://127.0.0.1:3000` (`PORT` overrides). All
> responses carry `cache-control: no-cache` and `access-control-allow-origin: *`.

## Serving rules (every route)

- **Directory index:** `findFile()` maps clean URLs to `index.html`
  (`/seo/` → `site/seo/index.html`). Mirrors static-host behavior.
- **Framer duplicates:** `findFile()` also resolves `Name (1).ext` aliases.
- **Path safety:** `..` / `\` → 404. Never serves outside `site/`.
- **Injections (body bytes, not status):** every `.html` gets the
  `hide-edit-button` CSS+JS; homepages (`index.html`, `m/index.html`)
  additionally get `projects-coming-soon`. Idempotent via markers.
- **Mobile split (server layer):** HTML routes only — phone-looking request +
  existing `/m/` mirror → mirror bytes at SAME URL (200, no redirect).
  Client guards are primary (work on any static host); server is accelerator.
- **Bot bypass:** UA matching `BOT_PATTERN` (bot|crawl|spider|slurp|mediapartners|
  baidu|yandex|sogou|exabot|facebot|ia_archiver|ahrefs|semrush|mj12bot|dotbot|
  petalbot|bytespider|gptbot|claudebot|ccbot|anthropic|openai|perplexity|cohere|
  diffbot|webdriver|lighthouse|pagespeed|pingdom|headlesschrome) ALWAYS gets
  desktop. Tablets (`TABLET_UA_PATTERN`) stay desktop.
- **Detection order:** bot → desktop; `Sec-CH-UA-Mobile: ?1` → phone; tablet →
  desktop; `MOBILE_UA_PATTERN` → phone. Missing mirror → silent desktop fallback.

## Route table

| Public route | Source file | Status | Content-Type | Canonical | Mobile |
|---|---|---|---|---|---|
| `/` | `site/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/` | Phone → `m/index.html` bytes; bot/tablet → desktop |
| `/contact/` | `site/contact/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/contact/` (absolute, hand-built) | Phone → `m/contact/index.html`; bot → desktop |
| `/work/` | `site/work/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/work/` | Phone → mirror; bot → desktop |
| `/work/bravo/` | `site/work/bravo/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/work/bravo/` | Phone → mirror; bot → desktop |
| `/work/nitro/` | `site/work/nitro/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/work/nitro/` | Phone → mirror; bot → desktop |
| `/work/project-1/` | `site/work/project-1/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/work/project-1/` | Phone → mirror; bot → desktop |
| `/work/project-2/` | `site/work/project-2/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/work/project-2/` | Phone → mirror; bot → desktop |
| `/work/project-3/` | `site/work/project-3/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/work/project-3/` | Phone → mirror; bot → desktop |
| `/work/strida/` | `site/work/strida/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/work/strida/` | Phone → mirror; bot → desktop |
| `/seo/` | `site/seo/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/seo/` | Phone → mirror; bot → desktop |
| `/seo/proof/` | `site/seo/proof/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/seo/proof/` | Phone → mirror; bot → desktop |
| `/voice-agents/` | `site/voice-agents/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/voice-agents/` | Phone → mirror; bot → desktop |
| `/workflows/` | `site/workflows/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/workflows/` | Phone → mirror; bot → desktop |
| `/crm-integrations/` | `site/crm-integrations/index.html` | 200 | `text/html; charset=utf-8` | `https://www.cypherai.in/crm-integrations/` | Phone → mirror; bot → desktop |
| `/404/` | `site/404/index.html` | 200 only when requested explicitly | `text/html; charset=utf-8` | `https://www.cypherai.in/404/` (`noindex, follow` applied) | Phone → mirror; bot → desktop |
| `/robots.txt` | `site/robots.txt` | 200 | `text/plain; charset=utf-8` | n/a | Never mirrored |
| `/sitemap.xml` | `site/sitemap.xml` | 200 | `application/xml; charset=utf-8` | n/a | Never mirrored |
| `/llms.txt` | `site/llms.txt` | 200 | `text/plain; charset=utf-8` | n/a | Never mirrored |
| `/m/…` | `site/m/…/index.html` | 200 direct | `text/html; charset=utf-8` | Desktop canonical inside marker block | Served as-is; reverse guard returns wide screens (unless `?view=desktop`/session opt-out) |
| anything else | — | 404 `text/plain`, body `Not found: /<target>` | `text/plain; charset=utf-8` | n/a | NOTE: `/404/` page is NOT auto-served. |

## Sitemap coverage (14 URLs)

`/` (1.0, weekly) · `/contact/` · `/work/` (0.8) · `/seo/` (0.9) ·
`/voice-agents/` (0.9) · `/workflows/` (0.9) · `/crm-integrations/` (0.9) ·
`/seo/proof/` · 6× `/work/*/` (0.6, monthly). Absolute www locs. No `/404/`,
`/m/*`, infra files, or query strings.

## robots.txt (actual)

`* → Allow: /` + explicit allows for `OAI-SearchBot`, `PerplexityBot`,
`Googlebot-Extended`. `Sitemap: https://www.cypherai.in/sitemap.xml`. No Disallow.
