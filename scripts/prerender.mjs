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
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const appDir = join(repoRoot, "apps/dev");
const distDir = join(appDir, "dist");
const ssrDir = join(appDir, "dist-ssr");

const ORIGIN = "https://ograf.dev";
const SITE_NAME = "ograf.dev";

/**
 * Titles and descriptions per language live in src/i18n/meta.json, which the
 * client reads too — one source, so prerendered HTML and hydrated tags agree.
 * Its keys are the route list: every path in the English table is rendered in
 * every language.
 */
const META = JSON.parse(readFileSync(join(appDir, "src/i18n/meta.json"), "utf8"));
const LOCALES = ["en", "pt", "es"];
const DEFAULT_LOCALE = "en";
const LOCALE_TAGS = { en: "en", pt: "pt-BR", es: "es-ES" };
const OG_LOCALES = { en: "en_US", pt: "pt_BR", es: "es_ES" };

function localizePath(path, locale) {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function routes() {
  const paths = Object.keys(META[DEFAULT_LOCALE]).filter((p) => p !== "*");
  return LOCALES.flatMap((locale) =>
    paths.map((path) => {
      const meta = META[locale][path];
      if (!meta) throw new Error(`src/i18n/meta.json: "${locale}" has no entry for ${path}`);
      return { path: localizePath(path, locale), bare: path, locale, ...meta };
    }),
  );
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
  const desc = route.description;
  const url = `${ORIGIN}${route.path}`;
  const t = escapeHtml(fullTitle);
  const d = escapeHtml(desc);

  let html = template;
  html = setTag(html, /<html lang="[^"]*"/, `<html lang="${LOCALE_TAGS[route.locale]}"`);
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${d}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${t}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${d}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${t}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${d}" />`);

  // Canonical is the page itself in its own language; hreflang points at the
  // other two, and x-default at English. Without these Google treats the
  // translations as duplicates of the English page.
  const alternates = [
    ...LOCALES.map(
      (l) => `<link rel="alternate" hreflang="${LOCALE_TAGS[l]}" href="${ORIGIN}${localizePath(route.bare, l)}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${route.bare}" />`,
    `<meta property="og:locale" content="${OG_LOCALES[route.locale]}" />`,
  ].join("\n    ");
  html = setTag(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />\n    ${alternates}`,
  );

  // Structured data: what the page is, and who publishes it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": route.bare === "/" ? "WebSite" : "WebPage",
    name: fullTitle,
    description: desc,
    url,
    inLanguage: LOCALE_TAGS[route.locale],
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

let written = 0;
for (const route of routes()) {
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
