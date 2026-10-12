# Data Model — static-site SEO layer

> Static files only — no database, no CMS. "Validation" = deterministic
> grep/build checks, not runtime code.

## 1. Page

One indexable content URL. Desktop file authoritative; mirror generated.

| Field | Req? | Gate | Notes |
|---|---|---|---|
| `slug` | R | `/`, `/contact/`, `/work/`, `/work/<case>/`, `/seo/`, `/seo/proof/`, `/404/` (non-indexable) | Mirrors under `/m/<slug>`, never slugs. |
| `title` | R | 30–60ch rendered, unique per URL | `[hook] \| CypherAi`. `/seo/` ≈60ch (at cap). |
| `metaDescription` | R | 120–160ch, unique, 1 CTA verb | `/contact/` ≈108ch WARN/frozen. Script band 100–175. |
| `canonical` | R | Absolute `https://www.cypherai.in<slug>` | Equals `og:url` and sitemap `<loc>` (`/404/` excluded from sitemap). |
| `h1` | R | Exactly one | `/seo/`: "AI SEO & Automation Services That Turn Search Into Revenue". |
| `wordCount` | R | Hand-built ≥800 (nav/footer excluded) | Framer pages exempt-frozen. |
| `internalLinks` | R (service) | 3–5 descriptive in-content links | No "click here" anchors. |
| `jsonLd` | R | Allowlist: Organization, WebSite, Service, WebPage, BreadcrumbList (+ListItem child), Person. **Denylist: FAQPage, HowTo.** | Home: Organization+WebSite. `/seo/`: Org+Page+Service+Breadcrumb. `/seo/proof/`: Page+Breadcrumb. |
| `mirror` | R | `m/<slug>index.html`, generated, never hand-edited (markers excepted) | 12 PAGES entries. |
| `freshnessSLA` | R (hand-built) | Cadence + last-verified date in byline/ledger | Stack/integration quarterly; speed per change; schema every publish; process annually. |
| `ledgerStatus` | O | Row refs C-01…C-06 | Only `/seo/` + `/seo/proof/`. |
| `robots` | O | `index, follow` hand-built; Framer default elsewhere | `/404/` never sitemapped. |
| `ogImage` | O | Absolute URL (currently `/images/favicon.png` placeholder) | Per-page 1200×630 cards in a later wave. |

Validation: exactly one `<title>`, meta description, canonical, H1; `canonical ==
og:url`; lengths in-gate; JSON-LD parses with allowlisted `@type`s only; links
resolve to known slugs; bylines carry publish + updated dates.

## 2. Redirect (reserved model — executes at host/CDN, not in this tree)

| Field | Req? | Rule |
|---|---|---|
| `from` | R | Full URL incl. scheme+host (`https://cypherai.in/*`, `http://www.cypherai.in/*`). |
| `to` | R | Absolute www URL preserving path+query. |
| `code` | R | 301 only. No 302/meta-refresh/JS redirects for canonical purposes. |
| `chainLimit` | — | Max 1 hop. |

Validation: every non-www variant resolves to www in one 301; no sitemap URL
redirects; `?view=desktop`/`#` never loop with device guards.

## 3. Mirror (desktop ↔ phone parity)

| Field | Req? | Rule |
|---|---|---|
| `desktop` | R | `site/<slug>index.html` — authoritative. |
| `phone` | R | `site/m/<slug>index.html` — generated, markers excepted. |
| `parityRule` | R | `normalizeForCompare(phone) == normalizeForCompare(pristineDesktop(desktop))`. |
| `desktopGuard` | R | In-marker only: `alternate` link + narrow-screen redirect (bot/tablet/`/m/`-excluded, view overrides). |
| `phoneGuard` | R | In-marker only: phone.css/js + wide-screen return + preserved desktop canonical (absolute; `removed` record for relocated originals). |
| `indexable` | — | Never. No sitemap entry, desktop canonical always. |

Validation: `--check` → 12 PARITY; UA regexes identical in server + guards.

## 4. LedgerClaim (rows C-01…C-06)

| Field | Req? | Gate |
|---|---|---|
| `id` | R | `C-NN`, stable, never reused. |
| `claim` | R | Short name. |
| `number` | R | Figure exactly as stated (ranges "representative", targets "Target"). |
| `source` | R | engagement records / build practice / integration practice / validator / process commitment — never "internal data" alone. |
| `date` | R | `Mon YYYY`, must match changelog. |
| `status` | R | `target` \| `process` \| `practice` \| `measured`. |
| `verifyUrl` | R | Must resolve: site link, PageSpeed analysis URL, validator, or wa.me for SLAs. |

Current rows (12 Oct 2026): C-01 delivery 2–4w (process), C-02 CWV targets
(target), C-03 stack (practice), C-04 CRM (practice), C-05 schema 0 errors
(measured at publish), C-06 SLAs (process).

Transitions: `target→measured` only via dated run + changelog; `any→expired` on
SLA lapse (flagged in place, never deleted); `expired→re-verified` with new date
+ changelog line in same commit. Forbidden: unexplained `measured→target`,
deleting expired rows, changing `number` without `date`, duplicate ids.

## 5. SitemapEntry

| Field | Req? | Rule |
|---|---|---|
| `loc` | R | Absolute www. Exactly 11 (no `/m/*`, `/404/`, queries). |
| `changefreq` / `priority` | O | Advisory hints only. |
| `lastmod` | O | If added, real publish/update date (never build timestamp). |

Validation: 11 `<loc>`s; each returns 200 with matching canonical; robots
Sitemap line equals sitemap URL.

## 6. RobotsRule

`site/robots.txt`: `*: Allow: /` + explicit allows for `OAI-SearchBot`,
`PerplexityBot`, `Googlebot-Extended` + one absolute Sitemap line.

| Field | Req? | Rule |
|---|---|---|
| `agent` | R | `*` + the three AI crawlers. Additions need a wave decision. |
| `directive` | R | `Allow: /`. No `Disallow` may cover a sitemap URL. |
| `sitemap` | R | Exactly one, absolute www. |

Validation: 4× `Allow: /`, zero `Disallow:`, sitemap fetches 200.

## Cross-entity invariants
1. Canonical closure: canonical == loc == og:url == JSON-LD url per sitemap URL.
2. No-indexable-mirror: no phone path in sitemap/llms.txt/content hrefs.
3. Ledger closure: `/seo/` claims verbatim in `/seo/proof/` with identical number+date; dates in changelog.
4. Schema closure: allowlist only; 0 validator errors at every publish.
5. Commit-before-build: desktop-content commits followed by builder + `--check` + mirror commit.
