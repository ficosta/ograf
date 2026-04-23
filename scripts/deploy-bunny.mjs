#!/usr/bin/env node
/**
 * Deploy apps/dev/dist/ to a Bunny Storage Zone, then purge the linked
 * pull zone's cache.
 *
 * The storage zone, pull zone, hostnames, TLS, and SPA 404 fallback must
 * already be configured by hand in the Bunny dashboard — see the
 * "Manual Bunny setup" checklist in scripts/deploy-bunny.README.md.
 *
 * This script only uploads files and purges cache. Idempotent.
 *
 * Env vars (all required):
 *   BUNNY_STORAGE_ZONE          — storage zone name (e.g. "ograf-dev-site")
 *   BUNNY_STORAGE_PASSWORD      — storage zone password (Dashboard → Storage → FTP & API Access)
 *   BUNNY_STORAGE_ENDPOINT      — storage host for the zone's region
 *                                 (e.g. "storage.bunnycdn.com" for DE)
 *   BUNNY_PULL_ZONE_ID          — numeric pull zone id (Dashboard → Pull Zone → API)
 *   BUNNY_API_KEY               — account API key (for cache purge)
 *
 * Usage:
 *   source .env.bunny.local && node scripts/deploy-bunny.mjs
 */

import { readdirSync, readFileSync } from "node:fs";
import { extname, join, posix, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Critical: Bunny Storage doesn't set Content-Type from extension on its own,
// so if we send application/octet-stream the CDN serves .mjs / .json / .css
// with the wrong MIME and browsers refuse to execute them (especially ES
// modules under strict MIME type checking).
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ograf": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".zip": "application/zip",
  ".pdf": "application/pdf",
  ".wasm": "application/wasm",
};

function contentTypeFor(path) {
  return MIME[extname(path).toLowerCase()] ?? "application/octet-stream";
}

const {
  BUNNY_STORAGE_ZONE,
  BUNNY_STORAGE_PASSWORD,
  BUNNY_STORAGE_ENDPOINT,
  BUNNY_PULL_ZONE_ID,
  BUNNY_API_KEY,
} = process.env;

const missing = [
  ["BUNNY_STORAGE_ZONE", BUNNY_STORAGE_ZONE],
  ["BUNNY_STORAGE_PASSWORD", BUNNY_STORAGE_PASSWORD],
  ["BUNNY_STORAGE_ENDPOINT", BUNNY_STORAGE_ENDPOINT],
  ["BUNNY_PULL_ZONE_ID", BUNNY_PULL_ZONE_ID],
  ["BUNNY_API_KEY", BUNNY_API_KEY],
].filter(([, v]) => !v).map(([k]) => k);

if (missing.length) {
  console.error(`Missing env vars: ${missing.join(", ")}`);
  console.error(`See scripts/deploy-bunny.README.md`);
  process.exit(1);
}

const DIST_DIR = fileURLToPath(new URL("../apps/dev/dist/", import.meta.url));
const CONCURRENCY = 8;

function walk(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else if (entry.isFile()) {
      const rel = full.slice(base.length).split(sep).join(posix.sep).replace(/^\/+/, "");
      out.push({ full, rel });
    }
  }
  return out;
}

async function storagePut(rel, buf) {
  const url = `https://${BUNNY_STORAGE_ENDPOINT}/${BUNNY_STORAGE_ZONE}/${rel}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_STORAGE_PASSWORD,
      "Content-Type": contentTypeFor(rel),
    },
    body: buf,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PUT /${rel} → ${res.status} ${res.statusText} ${body.slice(0, 200)}`);
  }
}

async function purgeCache() {
  const url = `https://api.bunny.net/pullzone/${BUNNY_PULL_ZONE_ID}/purgeCache`;
  const res = await fetch(url, {
    method: "POST",
    headers: { AccessKey: BUNNY_API_KEY, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`purgeCache → ${res.status} ${res.statusText} ${body.slice(0, 200)}`);
  }
}

async function main() {
  const files = walk(DIST_DIR);
  console.log(`Uploading ${files.length} files from apps/dev/dist/ to "${BUNNY_STORAGE_ZONE}"…`);

  let done = 0;
  const queue = [...files];
  async function worker() {
    while (queue.length) {
      const f = queue.shift();
      if (!f) return;
      const buf = readFileSync(f.full);
      await storagePut(f.rel, buf);
      done++;
      if (done % 20 === 0 || done === files.length) {
        process.stdout.write(`  ${done}/${files.length}\r`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\nUploaded ${files.length} files.`);

  console.log(`Purging pull zone ${BUNNY_PULL_ZONE_ID} cache…`);
  await purgeCache();
  console.log(`Done.`);
}

main().catch((e) => {
  console.error(`\nFAILED: ${e.message}`);
  process.exit(1);
});
