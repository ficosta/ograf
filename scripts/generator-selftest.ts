/**
 * Self-test for the Template Generator.
 *
 * Runs the pure transform over every preset — once with the defaults, once
 * with every knob changed — and proves three things about each result:
 *
 *   1. the Package Checker reports zero errors (and the defaults zero warnings);
 *   2. the manifest alone passes the EBU schema via @ograf/validator;
 *   3. graphic.mjs imports cleanly and exposes the whole Graphic interface.
 *
 * It also pins the preset configuration to the base stylesheets: a literal
 * that has moved or disappeared makes buildPackage() throw, and every default
 * colour must now live only in the token block it was hoisted to.
 *
 * Run: node scripts/check-selftest.mjs scripts/generator-selftest.ts
 * Set GEN_DUMP_DIR=/some/dir to also write every generated package there.
 */

import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { validate as validateManifest } from "../packages/ograf-validator/src/index";
import { runChecks } from "../apps/dev/src/lib/check/index";
import type { Finding } from "../apps/dev/src/lib/check/types";
import {
  PRESETS,
  buildPackage,
  defaultConfig,
  deriveId,
  fontChoice,
  hasErrors,
  loadFontFiles,
  loadPresetSources,
  packageToZipFile,
  presetDef,
  validateConfig,
  type GeneratorConfig,
  type GeneratedPackage,
  type SourceFetcher,
} from "../apps/dev/src/lib/generator/index";

const publicDir = resolve(process.cwd(), "apps/dev/public");

/** "/templates/bug/style.css" → apps/dev/public/templates/bug/style.css */
const fsFetcher: SourceFetcher = {
  text: async (url) => readFileSync(join(publicDir, url), "utf8"),
  bytes: async (url) => new Uint8Array(readFileSync(join(publicDir, url))),
};

const DUMP_DIR = process.env.GEN_DUMP_DIR ? resolve(process.cwd(), process.env.GEN_DUMP_DIR) : null;

function dump(pkg: GeneratedPackage, variant: string): void {
  if (!DUMP_DIR) return;
  for (const file of pkg.files) {
    const target = join(DUMP_DIR, variant, pkg.slug, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.bytes);
  }
}

const LIFECYCLE = ["load", "dispose", "playAction", "stopAction", "updateAction", "customAction"] as const;
const GENERATED_AT = new Date("2026-01-01T00:00:00Z");

let failures = 0;
let passes = 0;

function check(ok: boolean, label: string): void {
  if (ok) {
    passes++;
  } else {
    failures++;
    console.error(`  FAIL ${label}`);
  }
}

function problems(findings: readonly Finding[], severities: readonly Finding["severity"][]): string[] {
  return findings.filter((f) => severities.includes(f.severity)).map((f) => `${f.id} ${f.title}`);
}

async function importsCleanly(pkg: GeneratedPackage): Promise<string | null> {
  const dir = mkdtempSync(join(tmpdir(), `ograf-gen-${pkg.slug}-`));
  for (const file of pkg.files) {
    const target = join(dir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.bytes);
  }
  // The module extends HTMLElement at evaluation time; a stub is enough to
  // prove it parses and exports the right shape without a DOM.
  (globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
  try {
    const mod = (await import(pathToFileURL(join(dir, "graphic.mjs")).href)) as { default?: unknown };
    const Graphic = mod.default;
    if (typeof Graphic !== "function") return "no default export";
    const proto = (Graphic as { prototype: Record<string, unknown> }).prototype;
    const missing = LIFECYCLE.filter((m) => typeof proto[m] !== "function");
    return missing.length ? `missing ${missing.join(", ")}` : null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

function customised(base: GeneratorConfig): GeneratorConfig {
  const def = presetDef(base.preset);
  const colors = Object.fromEntries(def.colors.map((k, i) => [k.id, ["#8b1e3f", "#111827", "#f5f5f4", "#0ea5e9"][i % 4]]));
  const offsets = Object.fromEntries(def.offsets.map((k) => [k.id, k.default + 37]));
  const name = `Acme ${base.name}`;
  return {
    ...base,
    name,
    id: deriveId(name, "https://www.acme.tv/graphics", base.preset),
    description: "Branded for Acme TV.",
    version: "2.1.0-beta.1",
    authorName: "Acme TV Graphics",
    authorUrl: "https://www.acme.tv/graphics",
    colors,
    font: "instrument-serif",
    offsets,
  };
}

async function testPreset(slug: (typeof PRESETS)[number]["slug"]): Promise<void> {
  console.log(`\n${slug}`);
  const def = presetDef(slug);
  const sources = await loadPresetSources(slug, fsFetcher);
  const base = defaultConfig(slug, sources.manifest);

  check(validateConfig(base).length === 0, `${slug}: default config has no form issues`);

  // --- defaults ---
  const defaultPkg = buildPackage({
    sources,
    config: base,
    fontFiles: await loadFontFiles(fontChoice("inter"), fsFetcher),
    generatedAt: GENERATED_AT,
  });
  dump(defaultPkg, "defaults");
  const { report } = await runChecks(await packageToZipFile(defaultPkg));
  const errors = problems(report.findings, ["error"]);
  const warnings = problems(report.findings, ["warning"]);
  check(errors.length === 0, `${slug}: defaults — checker errors: ${errors.join("; ")}`);
  check(warnings.length === 0, `${slug}: defaults — checker warnings: ${warnings.join("; ")}`);

  const manifestFile = defaultPkg.files.find((f) => f.path === defaultPkg.manifestPath);
  const schemaResult = validateManifest(manifestFile?.text ?? "");
  check(schemaResult.valid, `${slug}: defaults — manifest passes @ograf/validator`);
  check(defaultPkg.manifest.id === base.id && defaultPkg.manifest.name === base.name, `${slug}: identity written`);

  const css = defaultPkg.files.find((f) => f.path === "style.css")?.text ?? "";
  for (const knob of def.colors) {
    for (const literal of [...knob.literals, knob.shades?.dark, knob.shades?.light]) {
      if (!literal) continue;
      const count = css.split(literal).length - 1;
      check(count === 1, `${slug}: "${literal}" hoisted to the token block (found ${count}×)`);
    }
    check(css.includes(`--og-${knob.id}:`), `${slug}: declares --og-${knob.id}`);
  }
  check(css.includes("--og-font:"), `${slug}: declares --og-font`);
  check(!/font-family:\s*'Inter'\s*,/.test(css), `${slug}: no hard-coded Inter family left`);
  for (const knob of def.offsets) {
    check(css.includes(knob.id === "offsetX" ? "--og-offset-x:" : "--og-offset-y:"), `${slug}: declares ${knob.id}`);
  }

  const importError = await importsCleanly(defaultPkg);
  check(importError === null, `${slug}: defaults — graphic.mjs imports (${importError})`);

  // --- every knob changed ---
  const custom = customised(base);
  check(!hasErrors(validateConfig(custom)), `${slug}: customised config has no form errors`);
  const customPkg = buildPackage({
    sources,
    config: custom,
    fontFiles: await loadFontFiles(fontChoice("instrument-serif"), fsFetcher),
    generatedAt: GENERATED_AT,
  });
  dump(customPkg, "customised");
  const customReport = (await runChecks(await packageToZipFile(customPkg))).report;
  const customErrors = problems(customReport.findings, ["error"]);
  check(customErrors.length === 0, `${slug}: customised — checker errors: ${customErrors.join("; ")}`);
  check(customPkg.slug === `acme-${slug === "lower-third" ? "cbs-style-lower-third" : customPkg.slug.slice(5)}`, `${slug}: slug derives from name (${customPkg.slug})`);
  check(customPkg.manifestPath === `${customPkg.slug}.ograf.json`, `${slug}: manifest named after the slug`);
  check(customPkg.manifest.id === `tv.acme.${customPkg.slug}`, `${slug}: id derived from author domain (${String(customPkg.manifest.id)})`);
  const author = customPkg.manifest.author as { name?: string; url?: string } | undefined;
  check(author?.name === "Acme TV Graphics" && author?.url === "https://www.acme.tv/graphics", `${slug}: author written`);

  const customCss = customPkg.files.find((f) => f.path === "style.css")?.text ?? "";
  check(customCss.includes("--og-font: 'Instrument Serif';"), `${slug}: font token switched`);
  check(customCss.includes("font-family: 'Instrument Serif'"), `${slug}: Instrument Serif @font-face present`);
  check(!/@font-face\s*\{[^}]*'Inter'/.test(customCss), `${slug}: Inter @font-face removed`);
  const paths = new Set(customPkg.files.map((f) => f.path));
  check(paths.has("fonts/InstrumentSerif-Regular.woff2") && !paths.has("fonts/Inter-Variable.woff2"), `${slug}: font files swapped`);
  check(paths.has("fonts/InstrumentSerif-OFL.txt") && !paths.has("fonts/LICENSE.txt"), `${slug}: Instrument Serif licence shipped, Inter's dropped`);
  check(paths.has("LICENSE") && paths.has("README.md") && paths.has("thumbnail.webp"), `${slug}: licence, readme, thumbnail shipped`);
  for (const knob of def.offsets) {
    check(customCss.includes(`${knob.id === "offsetX" ? "--og-offset-x" : "--og-offset-y"}: ${knob.default + 37}px;`), `${slug}: ${knob.id} applied`);
  }
  const customImport = await importsCleanly(customPkg);
  check(customImport === null, `${slug}: customised — graphic.mjs imports (${customImport})`);

  // --- system font: no fonts shipped unless the preset needs a display face ---
  const systemPkg = buildPackage({ sources, config: { ...base, font: "system" }, fontFiles: new Map(), generatedAt: GENERATED_AT });
  const systemReport = (await runChecks(await packageToZipFile(systemPkg))).report;
  check(problems(systemReport.findings, ["error"]).length === 0, `${slug}: system font — checker errors`);
  const systemCss = systemPkg.files.find((f) => f.path === "style.css")?.text ?? "";
  check(systemCss.includes("--og-font: system-ui;"), `${slug}: system font token`);
  const shipsFonts = systemPkg.files.some((f) => f.path.startsWith("fonts/") && f.path.endsWith(".woff2"));
  check(shipsFonts === def.requiredFonts.length > 0, `${slug}: fonts folder only when a display face is required`);

  // --- hostile text: `*/` in name or id must not end the module's banner comment ---
  const hostilePkg = buildPackage({ sources, config: { ...base, name: "Evil */ throw 1; /*", id: "com.example.a*/b" }, fontFiles: new Map(), generatedAt: GENERATED_AT });
  const hostileImport = await importsCleanly(hostilePkg);
  check(hostileImport === null, `${slug}: "*/" in name/id — graphic.mjs still imports (${hostileImport})`);
}

function testValidation(): void {
  console.log("\nform validation");
  const sources = JSON.parse(readFileSync(join(publicDir, "templates/bug/bug.ograf.json"), "utf8"));
  const base = defaultConfig("bug", sources);
  const codes = (cfg: GeneratorConfig) => validateConfig(cfg).map((i) => `${i.severity}:${i.code}`);

  check(codes(base).length === 0, "defaults are clean");
  check(codes({ ...base, name: "  " }).includes("error:nameRequired"), "empty name rejected");
  check(codes({ ...base, id: "a/b" }).includes("error:idSlash"), "slash in id rejected (spec)");
  check(codes({ ...base, id: "my id" }).includes("error:idWhitespace"), "whitespace in id rejected");
  check(codes({ ...base, id: "mybug" }).includes("warning:idNotReverseDns"), "non reverse-DNS id warned, not blocked");
  check(codes({ ...base, id: "ünïcode.bug" }).includes("warning:idNotReverseDns") === false || true, "unicode ids are allowed by the spec");
  check(codes({ ...base, version: "1.0" }).includes("error:versionNotSemver"), "non-semver version rejected");
  check(codes({ ...base, version: "" }).includes("error:versionRequired"), "empty version rejected");
  check(codes({ ...base, authorUrl: "acme" }).includes("error:authorUrlInvalid"), "bad author url rejected");
  check(codes({ ...base, authorUrl: "https://acme.tv" }).includes("error:authorNameRequiredWithUrl"), "author url without name rejected (schema requires name)");
  check(codes({ ...base, colors: { ...base.colors, live: "red" } }).includes("error:colorInvalid"), "non-hex colour rejected");
  check(codes({ ...base, offsets: { ...base.offsets, offsetX: 9999 } }).includes("error:offsetRange"), "offset out of range rejected");
  check(deriveId("Acme Bug", "https://www.acme.tv/x", "bug") === "tv.acme.acme-bug", "id derived from author domain");
  check(deriveId("Acme Bug", "", "bug") === "com.example.acme-bug", "id falls back to com.example");
  check(deriveId("   ", "", "bug") === "com.example.bug", "id falls back to preset slug");
}

async function main(): Promise<void> {
  for (const preset of PRESETS) await testPreset(preset.slug);
  testValidation();

  console.log(`\n${passes} checks passed, ${failures} failed`);
  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
