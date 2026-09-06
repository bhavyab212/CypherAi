// Builds the phone version: mirrors each desktop page byte-for-byte into
// site/m/..., injecting ONLY the override hooks (guarded by markers so the
// parity check can prove the rest is identical).
//
// Usage: node scripts/build-mobile.mjs [--check]
//   build (default) — regenerate site/m mirrors from desktop sources
//   --check         — verify mirrors match desktop except injected lines
//
// Design rules:
// - Injected blocks live strictly between BEGIN/END markers. NOTHING else
//   in the file may be touched — no canonical rewrites outside markers.
// - Parity check compares against git HEAD (pristine desktop), never the
//   working tree, so re-running the build is idempotent.
// - The phone mirror keeps the desktop canonical: the generator injects its
//   own canonical INSIDE the marker block and records the removed original
//   in the block, so stripMarkers() can restore it for comparison.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const site = path.join(root, "site");

const BEGIN = "<!-- cypher-phone:begin -->";
const END = "<!-- cypher-phone:end -->";

// Desktop source -> phone mirror, with the desktop URL path for canonicals.
const PAGES = [
  { src: "index.html", mirror: "m/index.html", desktopPath: "/" },
  { src: "work/index.html", mirror: "m/work/index.html", desktopPath: "/work/" },
  { src: "work/bravo/index.html", mirror: "m/work/bravo/index.html", desktopPath: "/work/bravo/" },
  { src: "work/nitro/index.html", mirror: "m/work/nitro/index.html", desktopPath: "/work/nitro/" },
  { src: "work/project-1/index.html", mirror: "m/work/project-1/index.html", desktopPath: "/work/project-1/" },
  { src: "work/project-2/index.html", mirror: "m/work/project-2/index.html", desktopPath: "/work/project-2/" },
  { src: "work/project-3/index.html", mirror: "m/work/project-3/index.html", desktopPath: "/work/project-3/" },
  { src: "work/strida/index.html", mirror: "m/work/strida/index.html", desktopPath: "/work/strida/" },
  { src: "contact/index.html", mirror: "m/contact/index.html", desktopPath: "/contact/" },
  { src: "404/index.html", mirror: "m/404/index.html", desktopPath: "/404/" },
];

// Client-side layer of the desktop/phone split. Runs first in <head>:
// phones (narrow viewport + mobile UA hints, never bots/tablets) go to the
// /m/ mirror; everyone else stays. Loop-guarded; explicit ?view=desktop or
// sessionStorage choice always wins.
function desktopGuard(mobilePath) {
  const lines = [
    BEGIN,
    '<link rel="alternate" media="only screen and (max-width: 809px)" href="' + mobilePath + '">',
    '<script>',
    '/* Cypher Ai device split — desktop page guard. */',
    '(function () {',
    '  try {',
    "    var q = new URLSearchParams(location.search);",
    "    if (q.get('view') === 'desktop') { try { sessionStorage.setItem('cypher-view', 'desktop'); } catch (e) {} }",
    "    if (sessionStorage.getItem('cypher-view') === 'desktop') return;",
    '    var path = location.pathname;',
    "    if (/^\\/m(\\/|$)/.test(path)) return;",
    "    var ua = navigator.userAgent || '';",
    "    if (/bot|crawl|spider|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|anthropic|openai|perplexity|cohere|diffbot|webdriver|lighthouse|pagespeed|pingdom/i.test(ua)) return;",
    "    var narrow = window.matchMedia('(max-width: 809.98px)').matches || Math.min(screen.width, screen.height) < 810;",
    "    if (narrow) {",
    "      location.replace('" + mobilePath + "' + location.search + location.hash);",
    "    }",
    '  } catch (e) { /* never block rendering */ }',
    '})();',
    '</SC' + 'RIPT>',
    END,
  ];
  return lines.join('\n');
}

// Injected into the phone mirror only: override layer + reverse guard.
// The original canonical is recorded as removed INSIDE the block so the
// parity check can restore it (see stripMarkers). The phone canonical
// reuses the desktop page's own canonical (absolute, e.g. the framer.app
// URL) — standard separate-mobile-URL practice; falls back to the relative
// desktopPath for hand-built pages without one (contact).
function phoneHead(desktopPath, removedCanon) {
  const canonMatch = removedCanon
    ? removedCanon.match(/href="([^"]*)"/)
    : null;
  const canonHref = canonMatch ? canonMatch[1] : desktopPath;
  const removal = removedCanon
    ? '\n<!-- cypher-phone:removed ' + removedCanon + ' -->'
    : '';
  const lines = [
    BEGIN + removal,
    '<link rel="stylesheet" href="/m/phone.css">',
    '<script src="/m/phone.js" defer></SC' + 'RIPT>',
    '<script>',
    '/* Cypher Ai device split — phone page guard (reverse: wide screens go back). */',
    '(function () {',
    '  try {',
    "    var q = new URLSearchParams(location.search);",
    "    if (q.get('view') === 'desktop') { try { sessionStorage.setItem('cypher-view', 'desktop'); } catch (e) {} }",
    "    if (sessionStorage.getItem('cypher-view') === 'desktop') return;",
    "    var ua = navigator.userAgent || '';",
    "    if (/bot|crawl|spider|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|anthropic|openai|perplexity|cohere|diffbot|webdriver|lighthouse|pagespeed|pingdom/i.test(ua)) return;",
    "    var mobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);",
    "    var wide = window.matchMedia('(min-width: 810px)').matches && Math.min(screen.width, screen.height) >= 810;",
    '    if (wide && !mobileUA) {',
    "      var path = location.pathname.replace(/^\\/m(\\/|$)/, '/');",
    "      if (path === '') path = '/';",
    '      location.replace(path + location.search + location.hash);',
    '    }',
    '  } catch (e) { /* never block rendering */ }',
    '})();',
    '</SC' + 'RIPT>',
    '<link rel="canonical" href="' + canonHref + '">',
    END,
  ];
  return lines.join('\n');
}

// Remove our injected blocks and restore the recorded canonical removal,
// yielding the pristine desktop source. Restores at the ORIGINAL position
// (before og:url) so line order matches HEAD exactly, and consumes the
// single separator newline the generator added before BEGIN.
function stripMarkers(html) {
  let out = html;
  for (;;) {
    const b = out.indexOf(BEGIN);
    if (b === -1) break;
    const e = out.indexOf(END, b);
    if (e === -1) break;
    const block = out.slice(b, e + END.length);
    const m = block.match(/<!-- cypher-phone:removed (<link rel="canonical" href="[^"]*">) -->/);
    // Consume the single separator newline the generator added before BEGIN
    // so stripped bytes match HEAD bit-identically.
    const start = b > 0 && out[b - 1] === "\n" ? b - 1 : b;
    out = out.slice(0, start) + out.slice(e + END.length);
    if (m) {
      const og = '<meta property="og:url"';
      const at = out.indexOf(og);
      if (at !== -1) out = out.slice(0, at) + m[1] + out.slice(at);
      else out = m[1] + out;
    }
  }
  return out;
}

// The phone mirror rewrites page-relative asset paths ("./repeatless-import/...")
// to root-absolute ("/repeatless-import/...") because mirrors live one level
// deeper (/m/...) — page-relative paths 404 there and silently drop every
// custom section. Parity normalization applies this rewrite to BOTH sides
// before comparing, so --check proves everything else is byte-identical.
// Never applied to the desktop write-back.
const ASSET_NORMALIZE = (html) =>
  html.replaceAll('"./repeatless-import/', '"/repeatless-import/')
      .replaceAll("'./repeatless-import/", "'/repeatless-import/");

function normalizeForCompare(html) {
  return ASSET_NORMALIZE(stripMarkers(html));
}

function injectAfterHeadStart(html, injection) {
  const anchor = "<!-- Start of headStart -->";
  if (html.includes(anchor)) return html.replace(anchor, anchor + "\n" + injection);
  const m = html.match(/<meta name="viewport"[^>]*>\n?/);
  if (m) return html.replace(m[0], m[0] + "\n" + injection);
  return html.replace(/<head[^>]*>/, (h) => h + "\n" + injection);
}

// Pristine desktop source from git HEAD (falls back to working tree if the
// baseline commit is missing — never in practice).
function pristineDesktop(rel) {
  try {
    return execSync("git show HEAD:site/" + rel, { cwd: root, encoding: "utf8" });
  } catch (e) {
    return readFileSync(path.join(site, rel), "utf8");
  }
}

function mirrorFor(page) {
  const clean = stripMarkers(pristineDesktop(page.src));
  const canon = (clean.match(/<link rel="canonical" href="[^"]*">/) || [null])[0];
  const noCanon = canon ? clean.replace(canon, "") : clean;
  // Mirror-only: page-relative asset paths break one level deep (/m/...).
  // inject.js/solutions.js fetches and the section fragments are fixed at
  // the source; this covers the <script>/<link> tags baked into the page.
  const absAssets = ASSET_NORMALIZE(noCanon);
  return injectAfterHeadStart(absAssets, phoneHead(page.desktopPath, canon));
}

function desktopWithGuard(page) {
  // Byte-faithful to HEAD except the guard block — no asset rewrites here.
  const clean = stripMarkers(pristineDesktop(page.src));
  const mobilePath = page.src === "index.html" ? "/m/" : "/m/" + page.src.slice(0, -"index.html".length);
  return injectAfterHeadStart(clean, desktopGuard(mobilePath));
}

const check = process.argv.includes("--check");
let failed = 0;

for (const page of PAGES) {
  const mirrorFile = path.join(site, page.mirror);
  if (check) {
    if (!existsSync(mirrorFile)) { console.log("MISSING " + page.mirror); failed++; continue; }
    const mirror = readFileSync(mirrorFile, "utf8");
    const a = normalizeForCompare(mirror).trim();
    const b = normalizeForCompare(pristineDesktop(page.src)).trim();
    if (a === b) console.log("PARITY  " + page.mirror);
    else { console.log("DRIFT   " + page.mirror + " (content differs outside injected blocks)"); failed++; }
    continue;
  }
  const out = mirrorFor(page);
  mkdirSync(path.dirname(mirrorFile), { recursive: true });
  writeFileSync(mirrorFile, out);
  console.log("BUILT   " + page.mirror);

  // Desktop guard written back idempotently: always rebuilt from pristine
  // HEAD + guard block, so re-runs never accumulate edits.
  writeFileSync(path.join(site, page.src), desktopWithGuard(page));
}
if (check) {
  console.log(failed ? ("\n" + failed + " page(s) DRIFTED") : "\nAll mirrors identical to desktop (outside injected blocks).");
  process.exit(failed ? 1 : 0);
}
