#!/usr/bin/env node
// Packages each tutorial template directory into a downloadable OGraf .zip.
// The zip is a complete OGraf package that a compliant renderer can load.
//
// Each archive contains:
//   <slug>/
//     <slug>.ograf.json   the manifest
//     graphic.mjs         the Web Component
//     style.css           component styles
//     preview.html        standalone preview (open in a browser to try it)
//     README.md           usage notes
//
// Excluded: demo.html (tutorial-page harness, not part of the package),
// index.html (tutorial-only), .DS_Store.

import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, rmSync, statSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const templatesDir = join(repoRoot, "apps/dev/public/templates");
const outDir = join(repoRoot, "apps/dev/public/downloads");

mkdirSync(outDir, { recursive: true });

const PACKAGE_FILES = ["graphic.mjs", "style.css", "preview.html"];

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

## What's inside

| File | Purpose |
| --- | --- |
| \`${slug}.ograf.json\` | Manifest -- what a renderer reads. Declares id, schema, lifecycle flags. |
| \`graphic.mjs\` | Web Component implementing \`load\`, \`playAction\`, \`updateAction\`, \`stopAction\`, \`dispose\`. |
| \`style.css\` | Styles and keyframes. |
| \`preview.html\` | Standalone preview. Open it in a browser to see the graphic play with default data. |

## Run locally (no renderer needed)

Open \`preview.html\` in a browser. The page imports \`graphic.mjs\`, seeds it
with default data, and plays the graphic immediately. Useful for quick
iteration or showing the graphic to a non-technical stakeholder.

> Some browsers block ES module imports from \`file://\` URLs. If
> \`preview.html\` shows a blank page, serve the folder instead:
>
> \`\`\`bash
> npx http-server . -p 8080
> # then open http://localhost:8080/preview.html
> \`\`\`

## Load into an OGraf-compatible renderer

This package is an OGraf Graphics Definition v1 archive. To run it on
an OGraf-compatible renderer:

1. Zip this folder (or keep it zipped).
2. Point your renderer at the manifest. The exact steps depend on the
   renderer -- see:
   - SPX-GC: https://github.com/TuomoKu/SPX-GC
   - ograf-server: https://github.com/SuperFlyTV/ograf-server
   - CasparCG HTML producer: https://github.com/CasparCG

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
