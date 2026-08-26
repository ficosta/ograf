#!/usr/bin/env node
/**
 * Prerender every route to static HTML after the client build.
 *
 * Why: ograf.dev was a pure client-rendered SPA, so every URL served the same
 * 590-byte shell — homepage title, homepage description, and a canonical
 * pointing at the homepage on all 21 routes. Two things follow from that:
 *
 *   1. Social scrapers (Slack, LinkedIn, X, WhatsApp, Discord) never run JS, so
 *      every shared link showed the homepage card whatever page was shared.
 *   2. `<link rel="canonical" href="https://ograf.dev/">` on every page tells
 *      Google the whole site is duplicates of the homepage.
 *   3. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) largely do not run JS
 *      either, so the site had no readable content for them at all.
 *
 * This renders each route with the real React tree and writes
 * dist/<route>/index.html with correct per-route metadata. The client bundle
 * still loads and hydrates; this only changes what arrives first.
 *
 * Usage: node scripts/prerender.mjs   (runs from apps/dev `build`)
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const appDir = join(repoRoot, "apps/dev");
const distDir = join(appDir, "dist");
const ssrDir = join(appDir, "dist-ssr");

const ORIGIN = "https://ograf.dev";
const SITE_NAME = "ograf.dev";
const DEFAULT_IMAGE = `${ORIGIN}/og-image.jpg`;

/** Routes whose copy lives here; tutorials are appended from tutorials.json. */
const STATIC_ROUTES = [
  { path: "/", title: "ograf.dev · The missing community for OGraf", description: "Community hub for the OGraf open broadcast graphics standard. Tutorials, ecosystem directory, specification guide, and live interactive demos." },
  { path: "/get-started", title: "Get Started · Lower Third tutorial", description: "Build a CBS-style lower third from scratch. Fifteen minutes, no build step, and a package that validates." },
  { path: "/tutorials", title: "Tutorials", description: "Learn by building real broadcast graphics. Eleven OGraf packages, each explained line by line, each one downloadable and spec-valid." },
  { path: "/ecosystem", title: "Ecosystem", description: "Every OGraf-compatible tool, editor, renderer, and service worth knowing about — open source and commercial." },
  { path: "/history", title: "History", description: "A timeline of the OGraf specification — from early HTML-graphics work to a stable v1 with a published Server API." },
  { path: "/news", title: "News & Events", description: "OGraf news, upcoming events, presentations, videos, and community signals." },
  { path: "/spec", title: "Specification Guide", description: "How OGraf works, explained plainly. Packaging, manifest, lifecycle, and the data schema that drives operator forms." },
  { path: "/tools", title: "Tools", description: "OGraf developer tools on ograf.dev — a client-side package checker with a runtime sandbox, plus a schema explorer. All browser-based, no upload." },
  { path: "/tools/schema-explorer", title: "Schema Explorer", description: "Browse the OGraf manifest schema interactively, in plain language, with every operator-input type catalogued." },
  { path: "/check", title: "OGraf Package Checker", description: "A comprehensive in-browser validator for OGraf Graphics packages. Drop a .zip and get a structured report — nothing is uploaded." },
  { path: "/about", title: "About", description: "About ograf.dev — a community-driven portal for the OGraf open broadcast graphics standard." },
];

function tutorialRoutes() {
  const file = join(appDir, "src/content/tutorials.json");
  if (!existsSync(file)) return [];
  const tutorials = JSON.parse(readFileSync(file, "utf8"));
  // `slug` in tutorials.json is already an absolute path ("/tutorials/bug"),
  // so it is used as-is. Anything already covered by STATIC_ROUTES is dropped,
  // which is how /get-started avoids being rendered twice.
  const staticPaths = new Set(STATIC_ROUTES.map((r) => r.path));
  return tutorials
    .filter((t) => typeof t.slug === "string" && t.slug.startsWith("/"))
    .filter((t) => !staticPaths.has(t.slug))
    .map((t) => ({
      path: t.slug,
      title: `${t.title} tutorial`,
      description: t.desc ?? undefined,
    }));
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Replace a tag's content in the template, or leave the template alone. */
function setTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function buildHtml(template, route, appHtml) {
  const fullTitle = route.title.includes(SITE_NAME) ? route.title : `${route.title} · ${SITE_NAME}`;
  const desc = route.description ?? STATIC_ROUTES[0].description;
  const url = `${ORIGIN}${route.path === "/" ? "/" : route.path}`;
  const t = escapeHtml(fullTitle);
  const d = escapeHtml(desc);

  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${d}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${t}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${d}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${t}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${d}" />`);

  // Structured data: what the page is, and who publishes it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": route.path === "/" ? "WebSite" : "WebPage",
    name: fullTitle,
    description: desc,
    url,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${ORIGIN}/` },
    about: {
      "@type": "SoftwareApplication",
      name: "OGraf",
      applicationCategory: "Broadcast graphics specification",
      url: "https://ograf.ebu.io/",
    },
  };
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
  );

  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

// --- build the SSR bundle -------------------------------------------------
rmSync(ssrDir, { recursive: true, force: true });
execFileSync(
  join(appDir, "node_modules/.bin/vite"),
  ["build", "--ssr", "src/entry-server.tsx", "--outDir", "dist-ssr", "--logLevel", "warn"],
  { cwd: appDir, stdio: "inherit" },
);

const { render } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);

// --- render every route ---------------------------------------------------
const template = readFileSync(join(distDir, "index.html"), "utf8");
const routes = [...STATIC_ROUTES, ...tutorialRoutes()];

let written = 0;
for (const route of routes) {
  const appHtml = await render(route.path);
  const html = buildHtml(template, route, appHtml);
  const outFile =
    route.path === "/" ? join(distDir, "index.html") : join(distDir, route.path, "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  written++;
}

rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${written} routes`);
