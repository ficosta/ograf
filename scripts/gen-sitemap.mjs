#!/usr/bin/env node
/**
 * Generate apps/dev/public/sitemap.xml from the list of known routes.
 *
 * Routes are read from two sources:
 *   1. A static list of top-level pages (home, about, spec, etc.)
 *   2. The slugs in apps/dev/src/content/tutorials.json
 *
 * Run manually (`node scripts/gen-sitemap.mjs`) or as part of the build pipeline.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");
const tutorialsPath = resolve(repoRoot, "apps/dev/src/content/tutorials.json");
const sitemapPath = resolve(repoRoot, "apps/dev/public/sitemap.xml");

const SITE_ORIGIN = "https://ograf.dev";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/tutorials", priority: "0.9", changefreq: "weekly" },
  { path: "/ecosystem", priority: "0.9", changefreq: "weekly" },
  { path: "/spec", priority: "0.9", changefreq: "monthly" },
  { path: "/history", priority: "0.6", changefreq: "monthly" },
  { path: "/news", priority: "0.7", changefreq: "weekly" },
  { path: "/about", priority: "0.5", changefreq: "yearly" },
];

async function main() {
  const tutorials = JSON.parse(await readFile(tutorialsPath, "utf8"));
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    ...STATIC_ROUTES.map((r) => ({ loc: SITE_ORIGIN + r.path, lastmod: today, priority: r.priority, changefreq: r.changefreq })),
    ...tutorials.map((t) => ({ loc: SITE_ORIGIN + t.slug, lastmod: today, priority: "0.8", changefreq: "monthly" })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  await writeFile(sitemapPath, xml, "utf8");
  console.log(`Wrote ${urls.length} URLs to ${sitemapPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
