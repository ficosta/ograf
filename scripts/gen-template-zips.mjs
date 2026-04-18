#!/usr/bin/env node
// Packages each template directory into a downloadable OGraf .zip
// containing only the canonical OGraf v1 package files -- not the
// tutorial-only demo.html harness. Produced files live in
// apps/dev/public/downloads/<slug>.zip.

import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, rmSync, statSync, readFileSync, writeFileSync, cpSync, mkdtempSync } from "node:fs";
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
      /* optional file */
    }
  }
  for (const dir of PACKAGE_DIRS) {
    const src = join(srcDir, dir);
    try {
      const s = statSync(src);
      if (s.isDirectory()) cpSync(src, join(pkgDir, dir), { recursive: true });
    } catch {
      /* optional dir */
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
| \`${slug}.ograf.json\` | Manifest -- what a renderer reads. |
| \`graphic.mjs\` | Web Component with the full OGraf lifecycle. |
| \`style.css\` | Stylesheet, loaded via a \`<link>\` injected by graphic.mjs. |
| \`fonts/\` | Local font files (if present), with the font's license alongside. |
| \`README.md\` | This file. |

## Deploy to a compliant OGraf renderer

Point any OGraf-compliant system at the manifest:

- **ograf-server** -- reference renderer, self-host. <https://github.com/SuperFlyTV/ograf-server>
- **SPX-GC** -- professional OGraf controller. <https://github.com/TuomoKu/SPX-GC>
- **CasparCG** -- open-source playout server. <https://github.com/CasparCG/server>

## License

MIT. Built as part of the [ograf.dev](https://ograf.dev) tutorials.
`;
}
