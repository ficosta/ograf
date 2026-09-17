#!/usr/bin/env node
/**
 * Guard for translated content.
 *
 * Every apps/dev/src/content/i18n/<locale>/<name>.json is a translation of
 * apps/dev/src/content/<name>.json. TypeScript only proves the two have
 * compatible types; it cannot see that a translator changed a URL, dropped a
 * list item, or "translated" an id. This script walks both trees in lockstep:
 *
 *   - objects must have the same keys, arrays the same length
 *   - numbers, booleans and null must be identical
 *   - strings under identifier-like keys (NEVER_TRANSLATE) must be identical
 *   - every English file with a translation directory must be translated in
 *     every locale, so a new content file cannot ship half-localised
 *
 * Other strings may differ — that is the translation. Exits non-zero on any
 * mismatch, so it runs in `prebuild`.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const contentDir = join(repoRoot, "apps/dev/src/content");
const LOCALES = ["pt", "es"];

const NEVER_TRANSLATE = new Set([
  "id", "ids", "slug", "url", "href", "src", "logo", "preview", "file", "key", "type", "icon",
  "status", "date", "startDate", "endDate", "closedAt", "createdAt", "publishedAt", "year",
  "category", "kind", "youtubeId", "videoId", "number", "color", "stars", "source", "retrieved",
  "issue", "pr", "repo", "author", "handle", "lang", "language", "format", "gddType", "localUrl", "externalUrl",
]);

const errors = [];

function compare(en, tr, path, key) {
  if (Array.isArray(en)) {
    if (!Array.isArray(tr)) return errors.push(`${path}: expected an array`);
    if (en.length !== tr.length) return errors.push(`${path}: ${en.length} items in English, ${tr.length} translated`);
    en.forEach((item, i) => compare(item, tr[i], `${path}[${i}]`, key));
    return;
  }
  if (en !== null && typeof en === "object") {
    if (tr === null || typeof tr !== "object" || Array.isArray(tr)) return errors.push(`${path}: expected an object`);
    const a = Object.keys(en).sort().join(",");
    const b = Object.keys(tr).sort().join(",");
    if (a !== b) return errors.push(`${path}: keys differ\n    en: ${a}\n    tr: ${b}`);
    for (const k of Object.keys(en)) compare(en[k], tr[k], `${path}.${k}`, k);
    return;
  }
  if (typeof en === "string") {
    if (typeof tr !== "string") return errors.push(`${path}: expected a string`);
    if (NEVER_TRANSLATE.has(key) && en !== tr) errors.push(`${path}: "${key}" must not be translated ("${en}" → "${tr}")`);
    return;
  }
  if (en !== tr) errors.push(`${path}: ${JSON.stringify(en)} must stay ${JSON.stringify(en)}, got ${JSON.stringify(tr)}`);
}

const translated = new Set(
  LOCALES.flatMap((l) => {
    const dir = join(contentDir, "i18n", l);
    return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
  }),
);

let checked = 0;
for (const file of [...translated].sort()) {
  const en = JSON.parse(readFileSync(join(contentDir, file), "utf8"));
  for (const locale of LOCALES) {
    const trPath = join(contentDir, "i18n", locale, file);
    if (!existsSync(trPath)) {
      errors.push(`content/i18n/${locale}/${file}: missing (translated in another locale)`);
      continue;
    }
    compare(en, JSON.parse(readFileSync(trPath, "utf8")), `${locale}/${file}`, "");
    checked++;
  }
}

if (errors.length) {
  console.error(`i18n content check failed (${errors.length}):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`i18n content: ${checked} translated files match their English structure`);
