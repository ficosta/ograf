#!/usr/bin/env node
/**
 * Generate apps/dev/public/sitemap.xml from the list of known routes.
 *
 * Routes are read from two sources:
 *   1. A static list of top-level pages (home, about, spec, etc.)
 *   2. The slugs in apps/dev/src/content/tutorials.json
 *
 * `lastmod` is derived from git: for each route, the most recent commit date
 * across the files that actually produce it. It used to be `new Date()` for
 * every URL, which told Google all 21 pages changed on every deploy — a signal
 * that is not just useless but actively discarded once a crawler notices it is
 * always "now". A file with uncommitted changes counts as today, since the
 * build about to run is what will ship it.
 *
 * Run manually (`node scripts/gen-sitemap.mjs`) or as part of the build.
 */

import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const tutorialsPath = resolve(repoRoot, "apps/dev/src/content/tutorials.json");
const sitemapPath = resolve(repoRoot, "apps/dev/public/sitemap.xml");

const SITE_ORIGIN = "https://ograf.dev";

/** Every page ships in each language; English at the root, others prefixed. */
const LOCALES = ["en", "pt", "es"];
const LOCALE_TAGS = { en: "en", pt: "pt-BR", es: "es-ES" };
const localizePath = (path, locale) =>
  locale === "en" ? path : path === "/" ? `/${locale}` : `/${locale}${path}`;

const TODAY = new Date().toISOString().slice(0, 10);

const SRC = "apps/dev/src";
const CONTENT = `${SRC}/content`;

/**
 * A translated page also changes when its translation changes, which lives
 * outside the English page's own files. Those paths are added to the pt/es
 * entries only, so editing a translation does not re-date the English pages.
 */
const TRANSLATION_SOURCES = [`${SRC}/i18n/copy`, `${SRC}/i18n/messages`, `${SRC}/i18n/meta.json`, `${CONTENT}/i18n`];

/** Shared chrome. Changing the navbar does not make every page "new". */
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly", sources: [`${SRC}/pages/Home.tsx`] },
  { path: "/tutorials", priority: "0.9", changefreq: "weekly", sources: [`${SRC}/pages/Tutorials.tsx`, `${CONTENT}/tutorials.json`] },
  { path: "/ecosystem", priority: "0.9", changefreq: "weekly", sources: [`${SRC}/pages/Ecosystem.tsx`, `${CONTENT}/ecosystem.json`] },
  { path: "/spec", priority: "0.9", changefreq: "monthly", sources: [`${SRC}/pages/Spec.tsx`, `${CONTENT}/specSummaries.json`, `${CONTENT}/specThreads.json`, `${CONTENT}/schema-language.ts`] },
  { path: "/history", priority: "0.6", changefreq: "monthly", sources: [`${SRC}/pages/History.tsx`, `${CONTENT}/specHistory.ts`] },
  { path: "/news", priority: "0.7", changefreq: "weekly", sources: [`${SRC}/pages/News.tsx`, `${CONTENT}/news.ts`, `${CONTENT}/news-items.json`, `${CONTENT}/events.json`, `${CONTENT}/presentations.json`, `${CONTENT}/videos.json`, `${CONTENT}/resources.json`] },
  { path: "/tools", priority: "0.8", changefreq: "monthly", sources: [`${SRC}/pages/Tools.tsx`] },
  { path: "/tools/schema-explorer", priority: "0.7", changefreq: "monthly", sources: [`${SRC}/pages/SchemaExplorer.tsx`, `${SRC}/lib/schema`] },
  { path: "/check", priority: "0.8", changefreq: "monthly", sources: [`${SRC}/pages/Check.tsx`, `${SRC}/lib/check`, `${SRC}/components/check`, `${CONTENT}/check-rules.json`] },
  { path: "/check/rules", priority: "0.6", changefreq: "monthly", sources: [`${SRC}/pages/CheckRules.tsx`, `${CONTENT}/check-rules.json`] },
  { path: "/about", priority: "0.5", changefreq: "yearly", sources: [`${SRC}/pages/About.tsx`] },
];

/** "/tutorials/breaking-news" → "TutorialBreakingNews" */
function pageComponentFor(slug) {
  const name = slug.split("/").pop() ?? "";
  const pascal = name.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return slug === "/get-started" ? "GetStarted" : `Tutorial${pascal}`;
}

let gitAvailable = true;

/** Most recent commit date across `paths`, or null when git cannot say. */
function lastCommit(paths) {
  if (!gitAvailable || paths.length === 0) return null;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out ? out.slice(0, 10) : null;
  } catch {
    gitAvailable = false;
    return null;
  }
}

/** Paths with uncommitted changes ship in this build, so they count as today. */
function dirtyPaths() {
  try {
    const out = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out
      .split("\n")
      .map((l) => l.slice(3).trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const DIRTY = dirtyPaths();
const isDirty = (p) => DIRTY.some((d) => d === p || d.startsWith(`${p}/`));

function lastmodFor(sources) {
  if (sources.some(isDirty)) return TODAY;
  return lastCommit(sources) ?? TODAY;
}

/** Both are ISO dates, so string comparison is date comparison. */
function maxDate(a, b) {
  return a > b ? a : b;
}

async function main() {
  const tutorials = JSON.parse(await readFile(tutorialsPath, "utf8"));

  const urls = [
    ...STATIC_ROUTES.map((r) => ({
      path: r.path,
      lastmod: lastmodFor(r.sources),
      priority: r.priority,
      changefreq: r.changefreq,
    })),
    ...tutorials.map((t) => {
      const templateDir = `apps/dev/public/templates/${t.slug.split("/").pop()}`;
      const sources = [`${SRC}/pages/${pageComponentFor(t.slug)}.tsx`, templateDir, `${CONTENT}/tutorials.json`];
      return {
        path: t.slug,
        lastmod: lastmodFor(sources),
        priority: "0.8",
        changefreq: "monthly",
      };
    }),
  ];

  // One <url> per language, each listing all its alternates, as Google's
  // hreflang-in-sitemap format requires. Translations live in src/i18n and
  // are edited alongside the page, so they share its lastmod.
  const alternates = (path) =>
    [
      ...LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_TAGS[l]}" href="${SITE_ORIGIN}${localizePath(path, l)}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${path}"/>`,
    ].join("\n");

  const translatedAt = lastmodFor(TRANSLATION_SOURCES);
  const entries = LOCALES.flatMap((locale) =>
    urls.map((u) => ({
      ...u,
      locale,
      lastmod: locale === "en" ? u.lastmod : maxDate(u.lastmod, translatedAt),
    })),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (u) => `  <url>
    <loc>${SITE_ORIGIN}${localizePath(u.path, u.locale)}</loc>
${alternates(u.path)}
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  await writeFile(sitemapPath, xml, "utf8");

  const spread = new Set(urls.map((u) => u.lastmod));
  console.log(
    `Wrote ${entries.length} URLs to ${sitemapPath}` +
      (gitAvailable
        ? ` · ${spread.size} distinct lastmod date${spread.size === 1 ? "" : "s"}`
        : " · git unavailable, dated today"),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
