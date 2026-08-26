#!/usr/bin/env node
/**
 * Runner for the Package Checker self-test.
 *
 * The suite itself is TypeScript that imports the checker straight out of
 * apps/dev/src, so it is bundled with the esbuild that already ships with
 * Vite rather than pulling in a test framework.
 *
 * Usage:  pnpm check:selftest        (from the repo root)
 * Exits non-zero if any case fails, so it is CI-safe.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

/** pnpm stores real packages under node_modules/.pnpm/<name>@<version>/… */
function pnpmDir(pkg) {
  const store = join(repoRoot, "node_modules/.pnpm");
  if (!existsSync(store)) return null;
  const hit = readdirSync(store).find((d) => d.startsWith(`${pkg}@`));
  return hit ? join(store, hit, "node_modules", pkg) : null;
}

const esbuild = pnpmDir("esbuild") && join(pnpmDir("esbuild"), "bin/esbuild");
const jszip = pnpmDir("jszip");

if (!esbuild || !existsSync(esbuild)) {
  console.error("esbuild not found — run `pnpm install` first.");
  process.exit(1);
}
if (!jszip) {
  console.error("jszip not found — run `pnpm install` first.");
  process.exit(1);
}

const out = join(mkdtempSync(join(tmpdir(), "ograf-selftest-")), "selftest.mjs");

execFileSync(
  esbuild,
  [
    join(repoRoot, "scripts/check-selftest.ts"),
    "--bundle",
    "--platform=node",
    "--format=esm",
    `--alias:jszip=${jszip}`,
    `--outfile=${out}`,
    "--log-level=error",
  ],
  { stdio: "inherit", cwd: join(repoRoot, "apps/dev") },
);

execFileSync(process.execPath, [out], { stdio: "inherit", cwd: repoRoot });
