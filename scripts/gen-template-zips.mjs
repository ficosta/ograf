#!/usr/bin/env node
// Packages each tutorial template directory into a downloadable OGraf .zip
// Each zip contains: graphic.mjs, style.css, demo.html, and the .ograf.json
// manifest, preserving a single top-level folder named after the slug.

import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const templatesDir = join(repoRoot, "apps/dev/public/templates");
const outDir = join(repoRoot, "apps/dev/public/downloads");

mkdirSync(outDir, { recursive: true });

const entries = readdirSync(templatesDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== "previews")
  .map((e) => e.name);

const EXCLUDE = /^\.DS_Store$|^node_modules$/;

let made = 0;
for (const slug of entries) {
  const srcDir = join(templatesDir, slug);
  const manifestPath = join(srcDir, `${slug}.ograf.json`);
  try {
    statSync(manifestPath);
  } catch {
    console.warn(`skip ${slug}: no manifest (${slug}.ograf.json)`);
    continue;
  }

  const zipPath = join(outDir, `${slug}.zip`);
  rmSync(zipPath, { force: true });

  // Run `zip` from the templates directory so paths inside the archive start
  // with the slug folder (e.g. "lower-third/graphic.mjs").
  execFileSync(
    "zip",
    [
      "-rq",
      zipPath,
      slug,
      "-x",
      `${slug}/.DS_Store`,
      `${slug}/node_modules/*`,
    ],
    { cwd: templatesDir, stdio: "inherit" },
  );
  void EXCLUDE;

  const size = statSync(zipPath).size;
  console.log(`packaged ${slug}.zip (${(size / 1024).toFixed(1)} KB)`);
  made += 1;
}

console.log(`\nGenerated ${made} template zips in ${outDir}`);
