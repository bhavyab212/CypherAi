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
};

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

async function handle(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  let target = safePath(url.pathname);
  if (!target || target === "") target = "index.html";

  // Server-side layer of the desktop/phone split: rewrite HTML routes to the
  // phone tree when the request looks like a phone — but only when the phone
  // file exists, so missing mirrors silently fall back to desktop.
  if (isHtmlRoute(target) && isMobileRequest(request.headers || {})) {
    const mobileTarget = mobileTargetFor(target);
    if (mobileTarget) {
      const mobileFile = findFile(mobileTarget);
      if (mobileFile) {
        const bytes = await readFile(mobileFile);
        response.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache",
          "access-control-allow-origin": "*",
          vary: "User-Agent, Sec-CH-UA-Mobile",
        });
        response.end(bytes);
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

  const bytes = await readFile(filePath);
  response.writeHead(200, {
    "content-type": detectMime(filePath, bytes),
    "cache-control": "no-cache",
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
