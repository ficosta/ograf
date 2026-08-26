#!/usr/bin/env node
/**
 * Refresh the vendored EBU OGraf JSON Schemas used as the checker's offline
 * fallback (packages/ograf-validator/src/schema.ts).
 *
 * The /check tool validates against the live schema at ograf.ebu.io when it can
 * reach it, and against this snapshot when it can't. The snapshot therefore has
 * to be the real spec, not an approximation — an offline user gets no signal
 * that they're being told something wrong.
 *
 * Usage:
 *   node scripts/refresh-ograf-schemas.mjs            # pin to current main
 *   node scripts/refresh-ograf-schemas.mjs <commit>   # pin to a specific commit
 *
 * Prints the old and new commit so the diff is easy to explain in a PR.
 */

import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../packages/ograf-validator/src/schema.ts", import.meta.url));
const REPO = "ebu/ograf";
const DIR = "v1/specification/json-schemas";
const ROOT_ID = `https://ograf.ebu.io/${DIR}/graphics/schema.json`;

async function json(url) {
  const res = await fetch(url, { headers: { "User-Agent": "ograf.dev-schema-refresh" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json();
}

const pinned = process.argv[2];
const commit = pinned ?? (await json(`https://api.github.com/repos/${REPO}/commits/main`)).sha;

const tree = await json(`https://api.github.com/repos/${REPO}/git/trees/${commit}?recursive=1`);
const paths = tree.tree
  .map((e) => e.path)
  .filter((p) => p.startsWith(`${DIR}/`) && p.endsWith(".json"))
  .sort();

if (paths.length === 0) throw new Error(`No schemas found under ${DIR} at ${commit}`);

const schemas = {};
for (const p of paths) {
  const doc = await json(`https://raw.githubusercontent.com/${REPO}/${commit}/${p}`);
  schemas[doc.$id ?? `https://ograf.ebu.io/${p}`] = doc;
  console.log(`  ${p}`);
}

if (!schemas[ROOT_ID]) throw new Error(`Root schema ${ROOT_ID} missing from the fetched set`);

let previous = "(none)";
try {
  previous = /PINNED_COMMIT = "([0-9a-f]+)"/.exec(readFileSync(OUT, "utf8"))?.[1] ?? "(none)";
} catch {
  /* first run */
}

writeFileSync(
  OUT,
  `/**
 * Vendored EBU OGraf v1 JSON Schemas — offline snapshot.
 *
 * Pinned to ebu/ograf commit ${commit}.
 * Fetched from https://github.com/${REPO}/tree/${commit}/${DIR}
 *
 * The checker normally validates against the live schema (see remote-schema.ts).
 * This snapshot is the fallback for offline / blocked / slow-network use, so it
 * must be the real spec — a hand-written approximation gives wrong answers to
 * exactly the users who cannot reach the network to find out.
 *
 * To refresh: run scripts/refresh-ograf-schemas.mjs and commit the result.
 */

export const PINNED_COMMIT = "${commit}";

export const OGRAF_SCHEMA_ROOT_ID = "${ROOT_ID}";

/** Every schema in the set, keyed by $id, ready to hand to ajv.addSchema(). */
export const OGRAF_SCHEMAS: Readonly<Record<string, object>> = ${JSON.stringify(schemas, null, 2)} as const;

/** The graphics manifest schema itself. */
export const OGRAF_MANIFEST_SCHEMA = OGRAF_SCHEMAS[OGRAF_SCHEMA_ROOT_ID];
`,
);

console.log(`\n${paths.length} schemas vendored.`);
console.log(`pinned commit: ${previous} -> ${commit}`);
