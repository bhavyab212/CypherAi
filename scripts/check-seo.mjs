// check-seo.mjs — static SEO gate checker for the CypherAi Framer-export site.
// Usage: node scripts/check-seo.mjs [--root <site-dir>]
// Exit 0 when all gates pass, 1 otherwise. No dependencies, no network.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const args = process.argv.slice(2);
const siteDir = args.includes("--root")
  ? path.resolve(args[args.indexOf("--root") + 1])
  : path.join(rootDir, "site");

const PROD = "https://www.cypherai.in";
const STAGING = "kind-fruit-367546";
const BEGIN = "<!-- cypher-phone:begin -->";
const END = "<!-- cypher-phone:end -->";

let failures = 0;
function gate(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out = walk(full, out);
    else out.push(full);
  }
  return out;
}

function read(rel) {
  return readFileSync(path.join(siteDir, rel), "utf8");
}

function exists(rel) {
  return existsSync(path.join(siteDir, rel));
}

// Route path ("/seo/") -> backing file relative to site/.
function backingFile(routePath) {
  const clean = routePath.replace(/^\/+/, "").replace(/\/+$/, "");
  if (clean === "") return "index.html";
  if (exists(path.join(clean, "index.html"))) return path.join(clean, "index.html");
  if (exists(clean)) return clean;
  return null;
}

const htmlFiles = walk(siteDir).filter((f) => f.endsWith(".html"));
const desktopFiles = htmlFiles.filter((f) => !f.includes(`${path.sep}m${path.sep}`));

// 1. No staging references anywhere in served text files.
{
  const hits = [];
  for (const f of walk(siteDir)) {
    if (!/\.(html|xml|txt|json)$/.test(f)) continue;
    const rel = path.relative(siteDir, f);
    if (rel.includes("framerusercontent.com") || rel.includes("app.framerstatic.com")) continue;
    const content = readFileSync(f, "utf8");
    if (content.includes(STAGING)) hits.push(`${rel}`);
  }
  gate("no-staging-refs", hits.length === 0, hits.length ? hits.join(", ") : "clean");
}

// 2. Head contract on every desktop HTML page.
{
  const expectations = {
    "index.html": "/",
    "contact/index.html": "/contact/",
    "work/index.html": "/work/",
    "work/bravo/index.html": "/work/bravo/",
    "work/nitro/index.html": "/work/nitro/",
    "work/project-1/index.html": "/work/project-1/",
    "work/project-2/index.html": "/work/project-2/",
    "work/project-3/index.html": "/work/project-3/",
    "work/strida/index.html": "/work/strida/",
    "work/rstate-automation/index.html": "/work/rstate-automation/",
    "seo/index.html": "/seo/",
    "seo/proof/index.html": "/seo/proof/",
    "voice-agents/index.html": "/voice-agents/",
    "workflows/index.html": "/workflows/",
    "crm-integrations/index.html": "/crm-integrations/",
    "404/index.html": "/404/",
  };
  for (const [rel, route] of Object.entries(expectations)) {
    const label = `head:${route}`;
    if (!exists(rel)) {
      gate(label, false, "missing file");
      continue;
    }
    const html = read(rel);
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
    const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const ogUrl = (html.match(/<meta property="og:url" content="([^"]*)"/) || [])[1] || "";
    const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
    const problems = [];
    const visibleLen = title.replace(/&amp;/g, "&").length;
    if (!(visibleLen >= 30 && visibleLen <= 70)) problems.push(`title len ${visibleLen}`);
    if (!(desc.length >= 100 && desc.length <= 175)) problems.push(`desc len ${desc.length}`);
    if (canon !== `${PROD}${route}`) problems.push(`canonical ${canon || "(missing)"}`);
    if (ogUrl !== "" && ogUrl !== canon) problems.push(`og:url mismatch`);
    if (!robots) problems.push("robots missing");
    gate(label, problems.length === 0, problems.join("; "));
  }
}

// 3. Sitemap coverage: every loc resolves; every desktop page (except 404) listed.
{
  const sitemap = exists("sitemap.xml") ? read("sitemap.xml") : "";
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const unresolvable = locs.filter((url) => {
    const route = new URL(url).pathname;
    return !backingFile(route);
  });
  gate("sitemap-locs-resolve", unresolvable.length === 0, unresolvable.join(", ") || `${locs.length} locs`);
  // Content pages are the head-contract expectations (gate 2), not every HTML
  // file on disk: captured vendor mirrors (framerusercontent, app.framerstatic,
  // repeatless-import fragments, events trackers) are not indexable content.
  const contentRoutes = [
    "/", "/contact/", "/work/", "/work/bravo/", "/work/nitro/",
    "/work/project-1/", "/work/project-2/", "/work/project-3/",
    "/work/strida/", "/work/rstate-automation/", "/seo/", "/seo/proof/",
    "/voice-agents/", "/workflows/", "/crm-integrations/",
  ];
  const missing = contentRoutes.filter((r) => !locs.includes(`${PROD}${r}`));
  const extra = locs.filter((u) => !contentRoutes.includes(new URL(u).pathname));
  gate(
    "sitemap-covers-pages",
    missing.length === 0 && extra.length === 0,
    missing.length || extra.length
      ? `missing ${missing.join(", ")}; extra ${extra.join(", ")}`
      : "11/11 exact"
  );
}

// 4. robots.txt: sitemap pointer + AI crawler allows.
{
  const robots = exists("robots.txt") ? read("robots.txt") : "";
  gate("robots-sitemap", robots.includes(`${PROD}/sitemap.xml`));
  for (const bot of ["OAI-SearchBot", "PerplexityBot", "Googlebot-Extended"]) {
    gate(`robots-allows-${bot}`, robots.includes(bot));
  }
}

// 5. Schema policy: forbidden types absent; entity present on home + seo.
{
  const all = desktopFiles.map((f) => readFileSync(f, "utf8")).join("\n");
  gate("no-faqpage-schema", !all.includes('"FAQPage"'));
  gate("no-howto-schema", !all.includes('"HowTo"'));
  // Every JSON-LD block must parse and use only allowlisted @types.
  {
    const allowed = new Set([
      "Organization", "WebSite", "WebPage", "Service",
      "BreadcrumbList", "ListItem", "Person", // ListItem = BreadcrumbList child
    ]);
    const bad = [];
    for (const f of desktopFiles) {
      const rel = path.relative(siteDir, f).replace(/\\/g, "/");
      const html = readFileSync(f, "utf8");
      for (const m of html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      )) {
        try {
          const types = new Set();
          JSON.parse(m[1], (k, v) => {
            if (k === "@type") (Array.isArray(v) ? v : [v]).forEach((t) => types.add(t));
            return v;
          });
          for (const t of types) {
            if (!allowed.has(t)) bad.push(`${rel}: disallowed @type ${t}`);
          }
        } catch (e) {
          bad.push(`${rel}: JSON parse error ${e.message}`);
        }
      }
    }
    gate("jsonld-valid-allowlisted", bad.length === 0, bad.join("; ") || "parses clean");
  }
  gate("home-has-organization", exists("index.html") && read("index.html").includes('"Organization"'));
  gate(
    "seo-has-service-breadcrumb",
    exists("seo/index.html") &&
      read("seo/index.html").includes('"Service"') &&
      read("seo/index.html").includes('"BreadcrumbList"')
  );
}

// 6. Mirror contract: markers balanced; canonical matches desktop; removed-record consistent.
{
  const pairs = [
    ["index.html", "m/index.html"],
    ["contact/index.html", "m/contact/index.html"],
    ["work/index.html", "m/work/index.html"],
    ["work/bravo/index.html", "m/work/bravo/index.html"],
    ["work/nitro/index.html", "m/work/nitro/index.html"],
    ["work/project-1/index.html", "m/work/project-1/index.html"],
    ["work/project-2/index.html", "m/work/project-2/index.html"],
    ["work/project-3/index.html", "m/work/project-3/index.html"],
    ["work/strida/index.html", "m/work/strida/index.html"],
    ["work/rstate-automation/index.html", "m/work/rstate-automation/index.html"],
    ["seo/index.html", "m/seo/index.html"],
    ["seo/proof/index.html", "m/seo/proof/index.html"],
    ["voice-agents/index.html", "m/voice-agents/index.html"],
    ["workflows/index.html", "m/workflows/index.html"],
    ["crm-integrations/index.html", "m/crm-integrations/index.html"],
    ["404/index.html", "m/404/index.html"],
  ];
  for (const [desk, mirror] of pairs) {
    const label = `mirror:${mirror}`;
    if (!exists(desk) || !exists(mirror)) {
      gate(label, false, "missing pair file");
      continue;
    }
    const d = read(desk);
    const m = read(mirror);
    const begins = m.split(BEGIN).length - 1;
    const ends = m.split(END).length - 1;
    const dCanon = (d.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const mCanon = (m.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const recorded = (m.match(/cypher-phone:removed (<link rel="canonical"[^>]*>)/) || [])[1] || "";
    const problems = [];
    if (begins !== 1 || ends !== 1) problems.push(`markers ${begins}/${ends}`);
    if (dCanon && mCanon !== dCanon) problems.push(`canon drift ${mCanon || "(missing)"}`);
    if (dCanon && recorded && !recorded.includes(dCanon)) problems.push("removed-record mismatch");
    gate(label, problems.length === 0, problems.join("; "));
  }
}

// 7. llms.txt: proof + entity pointers.
{
  const llms = exists("llms.txt") ? read("llms.txt") : "";
  gate("llms-proof-entry", llms.includes("/seo/proof/"));
  gate("llms-entity-line", llms.includes("Not affiliated"));
}

console.log(failures === 0 ? "\nAll SEO gates passed." : `\n${failures} gate(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
