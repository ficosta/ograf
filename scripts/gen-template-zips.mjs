#!/usr/bin/env node
// Packages each tutorial template directory into a downloadable OGraf .zip.
// The zip is a real OGraf Graphics Definition v1 package -- nothing more.
// A real OGraf player (ograf-devtool, ograf-server, SPX-GC, CasparCG) reads
// the manifest and drives the lifecycle; we don't ship a bespoke preview.
//
// Each archive contains:
//   <slug>/
//     <slug>.ograf.json   the manifest
//     graphic.mjs         the Web Component
//     style.css           component styles
//     README.md           usage notes + pointers to real players
//
// Excluded: demo.html (tutorial-page harness, not part of the package),
// preview.html (bespoke runtime that bypasses the manifest and hid real
// bugs such as the unguarded customElements.define crash), index.html
// (tutorial-only), .DS_Store.

import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, rmSync, statSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const templatesDir = join(repoRoot, "apps/dev/public/templates");
const outDir = join(repoRoot, "apps/dev/public/downloads");

mkdirSync(outDir, { recursive: true });

const PACKAGE_FILES = ["graphic.mjs", "style.css"];
const PACKAGE_DIRS = ["fonts", "assets"];

const entries = readdirSync(templatesDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== "previews")
  .map((e) => e.name);

let made = 0;
for (const slug of entries) {
  const srcDir = join(templatesDir, slug);
  const manifestName = `${slug}.ograf.json`;
  const manifestPath = join(srcDir, manifestName);

  try {
    statSync(manifestPath);
  } catch {
    console.warn(`skip ${slug}: no manifest (${manifestName})`);
    continue;
  }

  // Stage the package in a temp dir so the zip contains only the canonical
  // OGraf files -- not the tutorial harness (demo.html) or other extras.
  const staging = mkdtempSync(join(tmpdir(), `ograf-${slug}-`));
  const pkgDir = join(staging, slug);
  mkdirSync(pkgDir, { recursive: true });

  cpSync(manifestPath, join(pkgDir, manifestName));
  for (const file of PACKAGE_FILES) {
    const src = join(srcDir, file);
    try {
      statSync(src);
      cpSync(src, join(pkgDir, file));
    } catch {
      // File absent; skip silently (some templates may not need every file).
    }
  }
  for (const dir of PACKAGE_DIRS) {
    const src = join(srcDir, dir);
    try {
      const s = statSync(src);
      if (s.isDirectory()) cpSync(src, join(pkgDir, dir), { recursive: true });
    } catch {
      // Directory absent; skip.
    }
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  writeFileSync(join(pkgDir, "README.md"), renderReadme(slug, manifest));

  const zipPath = join(outDir, `${slug}.zip`);
  rmSync(zipPath, { force: true });
  execFileSync("zip", ["-rq", zipPath, slug], { cwd: staging, stdio: "inherit" });
  rmSync(staging, { recursive: true, force: true });

  const size = statSync(zipPath).size;
  console.log(`packaged ${slug}.zip (${(size / 1024).toFixed(1)} KB)`);
  made += 1;
}

console.log(`\nGenerated ${made} template zips in ${outDir}`);

function renderReadme(slug, manifest) {
  const name = manifest.name ?? slug;
  const description = manifest.description ?? "An OGraf template.";
  const id = manifest.id ?? `dev.ograf.tutorial.${slug}`;
  const version = manifest.version ?? "1.0.0";
  return `# ${name}

${description}

- **Package id:** \`${id}\`
- **Version:** ${version}
- **License:** MIT

## What's inside

| File | Purpose |
| --- | --- |
| \`${slug}.ograf.json\` | Manifest -- what a renderer reads. Declares id, schema, lifecycle flags. |
| \`graphic.mjs\` | Web Component implementing \`load\`, \`playAction\`, \`updateAction\`, \`stopAction\`, \`dispose\`. |
| \`style.css\` | Styles and keyframes. |
| \`README.md\` | This file. |

That's a complete **OGraf Graphics Definition v1** package. A compliant
player reads the manifest and drives the lifecycle itself -- there is
no bespoke preview page in this archive, on purpose. A manifest-aware
player catches real bugs that a single-load preview would miss.

## Try this package

The fastest way to see it run is the SuperFly devtool:

1. Open **[ograf-devtool.superfly.tv](https://ograf-devtool.superfly.tv)**.
2. Point it at this unzipped folder.
3. The devtool reads \`${slug}.ograf.json\`, validates it, runs
   the lifecycle, and exposes RealTime and Non-RealTime controls so you
   can call \`playAction\`, \`updateAction\`, \`stopAction\`, and any
   declared \`customActions\`.

The devtool is MIT-licensed and open source:
<https://github.com/SuperFlyTV/ograf-devtool>.

## Deploy to a real renderer

This package is renderer-agnostic. Point any OGraf-compliant system at the
manifest:

- **ograf-server** -- reference renderer with upload and control APIs, self-host.
  <https://github.com/SuperFlyTV/ograf-server>
- **SPX-GC** -- professional browser-based graphics controller with OGraf support.
  <https://github.com/TuomoKu/SPX-GC>
- **CasparCG** -- open-source playout server; renders OGraf via the HTML producer.
  <https://github.com/CasparCG/server>

The renderer will read \`${slug}.ograf.json\`, present the schema
fields to the operator, and call \`graphic.mjs\` through the OGraf
lifecycle.

## License

MIT. Use it, modify it, ship it on air. Attribution appreciated but
not required.

---

Built as part of the [ograf.dev](https://ograf.dev) tutorials.
`;
}
