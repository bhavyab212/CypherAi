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

function detectMime(filePath, bytes) {
  if (bytes.length > 12 && bytes.subarray(4, 12).toString("ascii") === "ftypavif") return "image/avif";
  return mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function findFile(relative) {
  if (!relative) return null;
  const direct = path.join(root, relative);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;

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
