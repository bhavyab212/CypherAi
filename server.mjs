import http from "node:http";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "site");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const OVERLAY_CSS_TAG =
  '<link rel="stylesheet" href="/overlay/projects-coming-soon.css">';
const OVERLAY_JS_TAG =
  '<script src="/overlay/projects-coming-soon.js" defer></script>';
const OVERLAY_MARKER = "projects-coming-soon";

const HIDE_EDIT_CSS_TAG =
  '<link rel="stylesheet" href="/overlay/hide-edit-button.css">';
const HIDE_EDIT_JS_TAG =
  '<script src="/overlay/hide-edit-button.js" defer></script>';
const HIDE_EDIT_MARKER = "hide-edit-button";

// --- Project-card hard-navigation hijack -----------------------------------
// Framer's client-side SPA router (script_main) registers a click handler that
// intercepts same-origin <a> clicks and renders the target route in-place via
// history.pushState, WITHOUT a real page load. Because we replaced the project
// detail pages with standalone static HTML, that in-place render shows the old
// pre-patch Framer bundle (Strida template) until the user hard-refreshes.
//
// This inline classic <script> is injected into <head> and executes synchronously
// during the initial HTML parse, i.e. BEFORE Framer's async <script type="module">
// can fetch + run and attach its own listener. It installs a document-level,
// CAPTURE-phase click listener (capture at document fires before React's
// bubble-phase delegated listener on the render root). For any left-click on a
// link to a replaced project route it calls preventDefault + stopImmediatePropagation
// and forces a real navigation via location.href, so the browser always fetches
// the fresh standalone page instead of letting the SPA hijack it.
const HARD_NAV_MARKER = "cypher-hard-nav";
const HARD_NAV_ROUTES = ["/work/rstate-automation/", "/work/bravo/", "/work/nitro/"];
const HARD_NAV_SCRIPT = `<script data-cypher="${HARD_NAV_MARKER}">
(function () {
  var ROUTES = ${JSON.stringify(HARD_NAV_ROUTES)};
  function isHardRoute(pathname) {
    for (var i = 0; i < ROUTES.length; i++) {
      if (pathname === ROUTES[i] || pathname === ROUTES[i].slice(0, -1)) return true;
    }
    return false;
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var el = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!el) return;
    var href = el.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var url;
    try { url = new URL(href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (!isHardRoute(url.pathname)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.href = url.href;
  }, true);
})();
</script>`;

function isHomepageTarget(target) {
  return target === "index.html" || target === "m/index.html";
}

function injectHardNav(html) {
  if (html.includes(HARD_NAV_MARKER)) return html; // idempotent
  if (html.includes("</head>")) {
    return html.replace("</head>", `${HARD_NAV_SCRIPT}\n</head>`);
  }
  return `${HARD_NAV_SCRIPT}\n${html}`;
}

function injectHideEdit(html) {
  if (html.includes(HIDE_EDIT_MARKER)) return html; // idempotent
  const injection = `<!-- cypher-overlay:hide-edit-button -->\n${HIDE_EDIT_CSS_TAG}\n${HIDE_EDIT_JS_TAG}`;
  if (html.includes("</head>")) {
    return html.replace("</head>", `${injection}\n</head>`);
  }
  return `${injection}\n${html}`;
}

function injectOverlay(html) {
  if (html.includes(OVERLAY_MARKER)) return html; // idempotent
  const injection = `<!-- cypher-overlay:projects-coming-soon -->\n${OVERLAY_CSS_TAG}\n${OVERLAY_JS_TAG}`;
  if (html.includes("</head>")) {
    return html.replace("</head>", `${injection}\n</head>`);
  }
  return `${injection}\n${html}`;
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath).replace(/^\/+/, "").split("?")[0];
  if (decoded.includes("..") || decoded.includes("\\")) return null;
  return decoded;
}

// ---- Desktop / phone version split ----------------------------------------
// Phones get the generated mirror tree under site/m/ (same markup as the
// desktop page plus the phone override layer: "m/index.html" mirrors
// "index.html", "m/work/bravo" mirrors "work/bravo", ...). This is the
// server-side layer: it ships the right HTML on the first byte. The inline
// client script in each page is the primary layer (works on any static host);
// this only accelerates it when served via this server.
//
// Rules: HTML routes only (never assets), never paths already under m/,
// never bots/crawlers (they always get the desktop version so indexing is
// unaffected), never tablets (iPad etc. stay on desktop), and only when the
// phone file actually exists (else desktop).
const BOT_PATTERN = /bot|crawl|spider|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|anthropic|openai|perplexity|cohere|diffbot|webdriver|lighthouse|pagespeed|pingdom|headlesschrome/i;
const MOBILE_UA_PATTERN = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile|phone/i;
const TABLET_UA_PATTERN = /ipad|tablet|playbook|silk|kindle|nexus\s*7|nexus\s*9|nexus\s*10|xoom|sm-t|gt-p|sch-i800/i;

function isMobileRequest(headers) {
  const ua = headers["user-agent"] || "";
  if (BOT_PATTERN.test(ua)) return false;
  // Client Hints (Chromium/Android) — explicit and reliable when present.
  const chMobile = headers["sec-ch-ua-mobile"];
  if (chMobile && chMobile.includes("?1")) return true;
  // Tablets intentionally stay on the desktop version.
  if (TABLET_UA_PATTERN.test(ua)) return false;
  return MOBILE_UA_PATTERN.test(ua);
}

function isHtmlRoute(target) {
  if (!target) return true; // "/" -> index.html
  if (target.endsWith("/")) return true; // directory -> index.html
  if (/\.[a-z0-9]+$/i.test(target) && !/\.html?$/i.test(target)) return false; // assets
  return true;
}

function mobileTargetFor(target) {
  if (!target || target === "") return "m/index.html";
  const normalized = target.endsWith("/") ? `${target}index.html` : target;
  if (normalized === "index.html") return "m/index.html";
  if (/^m(\/|$)/i.test(normalized)) return null; // already phone
  if (!isHtmlRoute(target)) return null;
  const withExt = /\.html?$/i.test(normalized) ? normalized : `${normalized.replace(/\/$/, "")}/index.html`;
  return `m/${withExt}`;
}

function detectMime(filePath, bytes) {
  if (bytes.length > 12 && bytes.subarray(4, 12).toString("ascii") === "ftypavif") return "image/avif";
  return mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function findFile(relative) {
  if (!relative) return null;
  const direct = path.join(root, relative);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;

  // Directory request ("/contact/", "/work/") -> serve its index.html, the
  // same way static hosts do. Without this the dev server 404s on every
  // clean URL even though the deployed site resolves them fine.
  if (existsSync(direct) && statSync(direct).isDirectory()) {
    const indexFile = path.join(direct, "index.html");
    if (existsSync(indexFile) && statSync(indexFile).isFile()) return indexFile;
  }

  const dir = path.dirname(direct);
  const base = path.basename(direct);
  if (existsSync(dir) && statSync(dir).isDirectory()) {
    const match = base.match(/^(.+?)(\.[^.]+)$/);
    if (match) {
      for (let index = 1; index < 4; index++) {
        const candidate = path.join(dir, `${match[1]} (${index})${match[2]}`);
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

async function sendHtml(response, filePath, homepage) {
  const raw = await readFile(filePath, "utf8");
  // hide-edit layer: every HTML page (desktop + /m/), non-breaking.
  // NOTE: projects-coming-soon overlay injection disabled until the overlay is
  // specified (its placeholder files only 404-noise the homepage otherwise).
  // Re-enable with: injectHideEdit(homepage ? injectOverlay(raw) : raw)
  const html = injectHardNav(injectHideEdit(raw));
  response.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-cache",
    "access-control-allow-origin": "*",
  });
  response.end(Buffer.from(html, "utf8"));
}

async function handle(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  let target = safePath(url.pathname);
  if (!target || target === "") target = "index.html";

  // Seamless redirect from legacy strida path to rstate-automation
  if (target === "work/strida" || target === "work/strida/") {
    response.writeHead(301, { "Location": "/work/rstate-automation/" });
    response.end();
    return;
  }

  // Server-side layer of the desktop/phone split: rewrite HTML routes to the
  // phone tree when the request looks like a phone — but only when the phone
  // file exists, so missing mirrors silently fall back to desktop.
  if (isHtmlRoute(target) && isMobileRequest(request.headers || {})) {
    const mobileTarget = mobileTargetFor(target);
    if (mobileTarget) {
      const mobileFile = findFile(mobileTarget);
      if (mobileFile) {
        await sendHtml(response, mobileFile, isHomepageTarget(mobileTarget));
        return;
      }
    }
  }

  const filePath = findFile(target);
  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Not found: /${target}`);
    return;
  }

  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  if (filePath.endsWith(".html")) {
    await sendHtml(response, filePath, isHomepageTarget(rel));
    return;
  }

  const bytes = await readFile(filePath);
  // HTML stays uncached (always fresh). Versioned vendor bytes (Framer chunks,
  // fonts, media) are content-hashed upstream: cache them hard. Site-owned
  // files (CSS/JS/icons/txt/xml) get a short public TTL: big repeat-view win,
  // stale at most an hour after a deploy.
  //
  // EXCEPTION: the Framer bundles we patched IN PLACE (same filename, new
  // content) must never be cached-immutable, or the browser keeps serving the
  // pre-patch bytes (old Strida template) for a year. Force revalidation.
  // Matched by basename (robust to path separators / casing).
  const PATCHED_BASENAMES = [
    "ambzybpl4wq6mncuyymodchty-1fy_s3std8sdrhojs.dcndxkii.mjs",
    "wssslb-5mdmtpdf5eghamjf57h2ryfmjpu1rc8po2xc.dqkydi_y.mjs",
    "eikopqdce.js",
  ];
  const p = filePath.toLowerCase();
  const baseLower = path.basename(filePath).toLowerCase();
  const vendor = p.includes("framerstatic.com") || p.includes("framerusercontent.com");
  const hashedAsset = /\.(woff2?|ttf|otf|mjs)$/.test(p) || vendor;
  const patched = PATCHED_BASENAMES.includes(baseLower);
  const cacheControl = patched
    ? "no-cache, must-revalidate"
    : hashedAsset
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600";
  response.writeHead(200, {
    "content-type": detectMime(filePath, bytes),
    "cache-control": cacheControl,
    "access-control-allow-origin": "*",
  });
  response.end(bytes);
}

http.createServer((request, response) => {
  handle(request, response).catch((error) => {
    console.error(error);
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Server error");
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Original Framer export: http://127.0.0.1:${port}`);
  console.log(`Serving: ${root}`);
});
