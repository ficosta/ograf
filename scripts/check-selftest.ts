/**
 * Self-test for the OGraf Package Checker.
 *
 * Running the checker over our own (valid) templates only ever proves it does
 * not produce false positives. A checker that returned "all clear" for every
 * input would pass that test. This suite proves the other half: for each rule,
 * a package that violates it must make that rule fire.
 *
 * Every case is built from one known-good baseline package, mutated in exactly
 * one way, so a firing rule can only be caused by that mutation.
 *
 * Run: node scripts/check-selftest.mjs   (bundle this file with esbuild first,
 * or use scripts/run-check-selftest.sh)
 */

import JSZip from "jszip";
import { runChecks } from "../apps/dev/src/lib/check/index";
import { PLAY_TO_END_LABEL, buildRuntimeFindings } from "../apps/dev/src/lib/check/runtime/rules";
import type { RuntimeSession } from "../apps/dev/src/lib/check/runtime/types";
import type { Finding } from "../apps/dev/src/lib/check/types";

type Files = Record<string, string>;

const GOOD_MANIFEST = {
  $schema: "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",
  id: "dev.ograf.selftest",
  version: "1.0.0",
  name: "Self Test",
  description: "A deliberately well-formed package used as the self-test baseline.",
  author: { name: "ograf.dev", url: "https://ograf.dev" },
  main: "graphic.mjs",
  stepCount: 1,
  supportsRealTime: true,
  supportsNonRealTime: false,
  thumbnails: [{ file: "preview.png" }],
  customActions: [{ id: "flash", name: "Flash", description: "Flash once.", schema: null }],
  schema: {
    type: "object",
    properties: {
      headline: { type: "string", title: "Headline", gddType: "single-line", default: "Hello" },
    },
  },
};

const GOOD_MODULE = `const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = \`
  <link rel="stylesheet" href="\${STYLE_URL}">
  <div class="selftest-root"><div class="selftest"><span class="headline"></span></div></div>
\`;

export default class SelfTestGraphic extends HTMLElement {
  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.selftest');
    this._initialized = true;
  }
  async load({ data } = {}) { this._initDom(); return { statusCode: 200 }; }
  async playAction() { this._initDom(); this._root.classList.add('visible'); return { statusCode: 200, currentStep: 0 }; }
  async updateAction({ data } = {}) { this._initDom(); return { statusCode: 200 }; }
  async stopAction() { this._initDom(); return { statusCode: 200 }; }
  async customAction({ id } = {}) { return id === 'flash' ? { statusCode: 200 } : { statusCode: 404, statusMessage: 'Unknown custom action' }; }
  async dispose() { this.innerHTML = ''; return { statusCode: 200 }; }
}
`;

const GOOD_CSS = `@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  src: url('./fonts/Inter-Variable.woff2') format('woff2-variations');
}

.selftest-root { position: absolute; inset: 0; overflow: hidden; }
.selftest { position: absolute; bottom: 40px; left: 40px; font-family: 'Inter', system-ui, sans-serif; opacity: 0; }
.selftest.visible { opacity: 1; }
`;

/** 1x1 PNG, 16:9 is asserted by A-01 so give it a real 16:9 header instead. */
function png16x9(): string {
  // 160x90 PNG header + minimal IDAT. Built byte-wise, returned as latin1.
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const ihdrLen = [0, 0, 0, 13];
  const ihdr = [0x49, 0x48, 0x44, 0x52];
  const w = [0, 0, 0, 160];
  const h = [0, 0, 0, 90];
  const rest = [8, 6, 0, 0, 0, 0, 0, 0, 0];
  return String.fromCharCode(...sig, ...ihdrLen, ...ihdr, ...w, ...h, ...rest);
}

/** A square PNG header — A-01 must reject it as not 16:9. */
function pngSquare(): string {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const ihdr = [0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52];
  const w = [0, 0, 0, 100];
  const h = [0, 0, 0, 100];
  const rest = [8, 6, 0, 0, 0, 0, 0, 0, 0];
  return String.fromCharCode(...sig, ...ihdr, ...w, ...h, ...rest);
}

function baseline(): Files {
  return {
    "selftest.ograf.json": JSON.stringify(GOOD_MANIFEST, null, 2),
    "graphic.mjs": GOOD_MODULE,
    "style.css": GOOD_CSS,
    "README.md": "# Self test\n",
    "LICENSE": "MIT\n",
    "preview.png": png16x9(),
    "fonts/Inter-Variable.woff2": "not-a-real-font",
    "fonts/LICENSE.txt": "OFL\n",
  };
}

async function toFile(files: Files, name = "selftest.zip", rootFolder: string | null = "selftest"): Promise<File> {
  const zip = new JSZip();
  const root = rootFolder ? zip.folder(rootFolder)! : zip;
  for (const [p, content] of Object.entries(files)) {
    root.file(p, content, p.endsWith(".png") || p.endsWith(".woff2") ? { binary: true } : undefined);
  }
  const buf = await zip.generateAsync({ type: "uint8array" });
  return new File([buf], name, { type: "application/zip" });
}

async function idsFor(files: Files, rootFolder: string | null = "selftest"): Promise<Set<string>> {
  const { report } = await runChecks(await toFile(files, "selftest.zip", rootFolder));
  return new Set(
    report.findings
      .filter((f: Finding) => f.severity === "error" || f.severity === "warning")
      .map((f: Finding) => f.id),
  );
}

/** Apply a mutation to the parsed manifest and write it back. */
function mutate(f: Files, fn: (m: Record<string, unknown>) => void): void {
  const m = JSON.parse(f["selftest.ograf.json"]);
  fn(m);
  f["selftest.ograf.json"] = JSON.stringify(m);
}

/** Replace manifest.schema's properties with one hand-crafted field map. */
function setSchema(f: Files, properties: Record<string, unknown>): void {
  const m = JSON.parse(f["selftest.ograf.json"]);
  m.schema = { type: "object", properties };
  f["selftest.ograf.json"] = JSON.stringify(m);
}

/** Each case mutates the baseline in one way and names the rule that must fire. */
const CASES: [
  rule: string,
  what: string,
  mutate: (f: Files) => void,
  opts?: { alsoFiles?: (f: Files) => void },
][] = [
  ["M-01", "no manifest at all", (f) => { delete f["selftest.ograf.json"]; }],
  ["M-02", "manifest is not valid JSON", (f) => { f["selftest.ograf.json"] = "{ nope"; }],
  ["M-03", "manifest missing required supportsRealTime", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]); delete m.supportsRealTime;
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["M-04", "customAction uses title instead of name", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]);
    m.customActions = [{ id: "flash", title: "Flash", schema: null }];
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["M-05", "duplicate customAction ids", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]);
    m.customActions = [{ id: "flash", name: "A", schema: null }, { id: "flash", name: "B", schema: null }];
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["M-06", "customAction without a schema field", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]);
    m.customActions = [{ id: "flash", name: "Flash" }];
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["M-08", "main points at a file that is not in the package", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]); m.main = "missing.mjs";
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["C-01", "no default export of an HTMLElement class", (f) => {
    f["graphic.mjs"] = "export const notAClass = 1;\n";
  }],
  ["C-02", "lifecycle method missing entirely", (f) => {
    f["graphic.mjs"] = GOOD_MODULE.replace(/async dispose\(\)[^\n]*\n/, "");
  }],
  ["C-03", "module self-registers with customElements.define", (f) => {
    f["graphic.mjs"] = GOOD_MODULE + "\ncustomElements.define('self-test', SelfTestGraphic);\n";
  }],
  ["C-10", "customAction reads `action` instead of the spec's `id`", (f) => {
    f["graphic.mjs"] = GOOD_MODULE.replace("customAction({ id } = {}) { return id ===", "customAction({ action } = {}) { return action ===");
  }],
  ["C-05", "top-level document access", (f) => {
    f["graphic.mjs"] = "document.title = 'x';\n" + GOOD_MODULE;
  }],
  ["C-07", "bare-module import", (f) => {
    f["graphic.mjs"] = "import gsap from 'gsap';\n" + GOOD_MODULE;
  }],
  ["X-01", "position: fixed in the stylesheet", (f) => {
    f["style.css"] = GOOD_CSS.replace(".selftest { position: absolute;", ".selftest { position: fixed;");
  }],
  ["X-02", "remote @import", (f) => {
    f["style.css"] = "@import url('https://fonts.googleapis.com/css2?family=Inter');\n" + GOOD_CSS;
  }],
  ["X-03", "remote @font-face src", (f) => {
    f["style.css"] = GOOD_CSS.replace("url('./fonts/Inter-Variable.woff2')", "url('https://cdn.example.com/i.woff2')");
  }],
  ["X-04", "body selector", (f) => {
    f["style.css"] = GOOD_CSS + "\nbody { background: black; }\n";
  }],
  ["X-05", "font-family with no generic fallback", (f) => {
    f["style.css"] = GOOD_CSS.replace("font-family: 'Inter', system-ui, sans-serif;", "font-family: 'Inter';");
  }],
  ["A-01", "preview image is not 16:9", (f) => { f["preview.png"] = pngSquare(); }],
  ["A-03", "shipped font with no licence file", (f) => { delete f["fonts/LICENSE.txt"]; }],
  ["S-03", "module references an asset the package does not contain", (f) => {
    f["graphic.mjs"] = GOOD_MODULE.replace("./style.css", "./missing.css");
  }],
  ["S-04", "no README", (f) => { delete f["README.md"]; }],
  ["S-10", "two manifests in one package", (f) => {
    f["second.ograf.json"] = f["selftest.ograf.json"];
  }],

  ["C-09", "declares non-real-time support without the methods for it", (f) => mutate(f, (m) => {
    m.supportsNonRealTime = true;
  })],

  // --- cross-field manifest ---
  ["M-11", "supports neither render mode", (f) => mutate(f, (m) => {
    m.supportsRealTime = false; m.supportsNonRealTime = false;
  })],
  ["M-12", "id contains a slash", (f) => mutate(f, (m) => { m.id = "dev/selftest"; })],
  ["M-13", "main is not a .js or .mjs file", (f) => mutate(f, (m) => {
    m.main = "graphic.txt";
  }), { alsoFiles: (f) => { f["graphic.txt"] = f["graphic.mjs"]; delete f["graphic.mjs"]; } }],
  ["M-14", "stepCount below the allowed minimum", (f) => mutate(f, (m) => { m.stepCount = -5; })],
  ["M-15", "author object without a name", (f) => mutate(f, (m) => {
    m.author = { url: "https://ograf.dev" };
  })],
  ["M-16", "actionDuration points at an undeclared customAction", (f) => mutate(f, (m) => {
    m.actionDurations = [{ type: "customAction", customActionId: "nope", duration: 500 }];
  })],
  ["M-16", "two durations for the same action", (f) => mutate(f, (m) => {
    m.actionDurations = [{ type: "playAction", duration: 500 }, { type: "playAction", duration: 900 }];
  })],
  ["M-17", "resolution requirement with min above max", (f) => mutate(f, (m) => {
    m.renderRequirements = [{ resolution: { width: { min: 1920, max: 1280 } } }];
  })],
  ["M-18", "thumbnail file missing from the package", (f) => mutate(f, (m) => {
    m.thumbnails = [{ file: "nope.png" }];
  })],
  ["M-18", "thumbnail in a format the spec does not name", (f) => mutate(f, (m) => {
    m.thumbnails = [{ file: "preview.bmp" }];
  }), { alsoFiles: (f) => { f["preview.bmp"] = f["preview.png"]; } }],
  ["M-19", "manifest filename does not end in .ograf.json", (f) => {
    f["manifest.json"] = f["selftest.ograf.json"];
    delete f["selftest.ograf.json"];
  }],

  // --- GDD (Graphics Data Definition) ---
  ["G-15", "file-path default that the package does not ship", (f) =>
    setSchema(f, { logo: { type: "string", gddType: "file-path/image-path", default: "./assets/logo.png" } })],
  ["G-02", "field with no type", (f) => setSchema(f, { headline: { title: "H" } })],
  ["G-02", "field with a type outside the six allowed", (f) => setSchema(f, { headline: { type: "text" } })],
  ["G-04", "gddType single-line on a number field", (f) =>
    setSchema(f, { n: { type: "number", gddType: "single-line" } })],
  ["G-05", "select without an enum", (f) =>
    setSchema(f, { pick: { type: "string", gddType: "select", gddOptions: { labels: {} } } })],
  ["G-06", "select without gddOptions.labels", (f) =>
    setSchema(f, { pick: { type: "string", gddType: "select", enum: ["a"], gddOptions: {} } })],
  ["G-07", "color-rrggbb without the pattern the spec pins", (f) =>
    setSchema(f, { c: { type: "string", gddType: "color-rrggbb" } })],
  ["G-08", "select enum value with no label", (f) =>
    setSchema(f, { pick: { type: "string", gddType: "select", enum: ["a", "b"], gddOptions: { labels: { a: "A" } } } })],
  ["G-09", "array field without items", (f) => setSchema(f, { rows: { type: "array" } })],
  ["G-09", "object field without properties", (f) => setSchema(f, { grp: { type: "object" } })],
  ["G-10", "default of the wrong type", (f) =>
    setSchema(f, { n: { type: "integer", default: "twelve" } })],
  ["G-11", "default outside the declared enum", (f) =>
    setSchema(f, { pick: { type: "string", enum: ["a", "b"], default: "c" } })],
  ["G-11", "default above maximum", (f) =>
    setSchema(f, { n: { type: "number", maximum: 10, default: 99 } })],
  ["G-11", "default that fails the field pattern", (f) =>
    setSchema(f, { c: { type: "string", gddType: "color-rrggbb", pattern: "^#[0-9a-f]{6}$", default: "red" } })],
  ["G-13", "schema root that is not type object", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]);
    m.schema = { type: "string" };
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["G-02", "customAction schema with a broken field", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]);
    m.customActions = [{ id: "flash", name: "Flash",
      schema: { type: "object", properties: { speed: { title: "Speed" } } } }];
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["G-14", "schema nested far beyond any real form", (f) => {
    const m = JSON.parse(f["selftest.ograf.json"]);
    let deep: Record<string, unknown> = { type: "string" };
    for (let i = 0; i < 150; i++) deep = { type: "object", properties: { next: deep } };
    m.schema = { type: "object", properties: { deep } };
    f["selftest.ograf.json"] = JSON.stringify(m);
  }],
  ["C-08", "relative asset URL hard-coded inside innerHTML", (f) => {
    f["graphic.mjs"] = GOOD_MODULE.replace('href="${STYLE_URL}"', 'href="./style.css"');
  }],
];

/**
 * Valid variations the checker once flagged. Each mirrors something the EBU's
 * own example packages do, so a warning here would fail the reference graphics.
 */
const MUST_NOT_FIRE: [rule: string, what: string, mutate: (f: Files) => void, rootFolder?: null][] = [
  ["C-04", "lifecycle method without `async` that still returns a Promise", (f) => {
    f["graphic.mjs"] = GOOD_MODULE.replace(
      "async playAction() { this._initDom(); this._root.classList.add('visible'); return { statusCode: 200, currentStep: 0 }; }",
      "playAction() { this._initDom(); this._root.classList.add('visible'); return Promise.resolve({ statusCode: 200, currentStep: 0 }); }",
    );
  }],
  ["S-01", "files at the zip root, as the official example zips ship", () => {}, null],
];

/** Rules that must NOT fire on the baseline — guards against false positives. */
const MUST_BE_CLEAN = true;

/**
 * The runtime rules are a pure function of a session, so they can be tested here
 * even though capturing a real session needs a browser. These were the last
 * rules with no coverage at all.
 */
const OK = { statusCode: 200 };

function session(over: Partial<RuntimeSession> = {}): RuntimeSession {
  return {
    calls: [],
    consoleLines: [],
    errors: [],
    status: "done",
    tag: "test-graphic",
    ...over,
  };
}

const call = (action: string, over: Record<string, unknown> = {}) =>
  ({ action, label: `${action}()`, startedAt: 0, durationMs: 5, result: OK, ...over }) as never;

const ONE_STEP = { stepCount: 1, supportsNonRealTime: false, customActions: [{ id: "flash" }] };

const HEALTHY = session({
  calls: [
    call("load"),
    call("playAction", { label: "playAction({})", result: { statusCode: 200, currentStep: 0 } }),
    call("updateAction"),
    call("stopAction"),
    call("playAction", { label: "playAction({})", result: { statusCode: 200, currentStep: 0 } }),
    call("playAction", { label: PLAY_TO_END_LABEL, result: { statusCode: 200 } }),
    call("customAction", { payloadPreview: '{"id":"__ograf_unknown__"}', result: { statusCode: 404, statusMessage: "Unknown" } }),
    call("customAction", { payloadPreview: '{"id":"flash"}' }),
    call("dispose"),
  ],
});

const withCall = (index: number, replacement: unknown) =>
  session({ calls: HEALTHY.calls.map((c, i) => (i === index ? replacement : c)) as never });

/** Sessions that are spec-compliant and must stay clean. */
const RUNTIME_CLEAN: [what: string, s: RuntimeSession, manifest: unknown][] = [
  ["healthy one-step session", HEALTHY, ONE_STEP],
  // "If the returned Promise resolves to undefined, it MUST be treated as a { statusCode: 200 }."
  ["load/update/stop/custom/dispose resolving to undefined", session({
    calls: HEALTHY.calls.map((c) => {
      const action = (c as { action: string }).action;
      const unknown = ((c as { payloadPreview?: string }).payloadPreview ?? "").includes("__ograf_unknown__");
      return action === "playAction" || unknown ? c : { ...(c as object), result: undefined };
    }) as never,
  }), ONE_STEP],
  // stepCount 0: "the currentStep field in the response MUST be undefined".
  // The spec leaves unknown ids to the renderer; the EBU's l3rd-name resolves undefined.
  ["unknown customAction resolving to success", withCall(6, call("customAction", { payloadPreview: '{"id":"__ograf_unknown__"}' })), ONE_STEP],
  ["stepCount 0 graphic returning currentStep undefined", session({
    calls: [call("load"), call("playAction", { label: "playAction({})", result: { statusCode: 200 } }), call("stopAction"), call("dispose")],
  }), { stepCount: 0, supportsNonRealTime: false }],
];

const RUNTIME_CASES: [rule: string, what: string, s: RuntimeSession, manifest?: unknown][] = [
  ["R-03", "one-step graphic's first play returns no currentStep", withCall(1, call("playAction", { label: "playAction({})", result: { statusCode: 200 } }))],
  ["R-03", "stepCount 0 graphic returns a numeric currentStep", session({
    calls: [call("load"), call("playAction", { label: "playAction({})", result: { statusCode: 200, currentStep: 0 } }), call("dispose")],
  }), { stepCount: 0, supportsNonRealTime: false }],
  ["R-12", "declared customAction answers 404 (reads the wrong field)", withCall(7, call("customAction", { payloadPreview: '{"id":"flash"}', result: { statusCode: 404 } }))],
  ["R-15", "play past the last step keeps the graphic at step 0", withCall(5, call("playAction", { label: PLAY_TO_END_LABEL, result: { statusCode: 200, currentStep: 0 } }))],
  ["R-01", "module never imported", session({ status: "failed", failureReason: "SyntaxError" })],
  ["R-08", "uncaught window error during the run", session({
    ...HEALTHY,
    errors: [{ message: "boom", source: "window" }] as never,
  })],
  ["R-09", "unhandled promise rejection during the run", session({
    ...HEALTHY,
    errors: [{ message: "nope", source: "promise" }] as never,
  })],
  ["R-11", "a lifecycle call blowing its time budget", session({
    calls: [call("load", { durationMs: 9_000 }), ...HEALTHY.calls.slice(1)],
  })],
];

function runRuntimeCases(): number {
  console.log("\nruntime rules (pure function over a synthetic session)");
  let failures = 0;
  for (const [what, sess, manifest] of RUNTIME_CLEAN) {
    const cleanIds = new Set(
      buildRuntimeFindings(sess, manifest)
        .filter((f) => f.severity === "error" || f.severity === "warning")
        .map((f) => f.id),
    );
    if (cleanIds.size > 0) failures++;
    console.log(cleanIds.size > 0 ? `  FAIL ${what} fired: ${[...cleanIds].join(", ")}` : `  ok   ${what} is clean`);
  }
  for (const [rule, what, sess, manifest = ONE_STEP] of RUNTIME_CASES) {
    const fired = new Set(
      buildRuntimeFindings(sess, manifest)
        .filter((f) => f.severity === "error" || f.severity === "warning")
        .map((f) => f.id),
    );
    const ok = fired.has(rule);
    if (!ok) failures++;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${rule.padEnd(5)} ${what}` +
        (ok ? "" : `   got: ${[...fired].join(", ") || "nothing"}`),
    );
  }
  return failures;
}

async function main() {
  const clean = await idsFor(baseline());
  let failures = 0;

  console.log("baseline (a valid package must produce no error/warning)");
  if (MUST_BE_CLEAN && clean.size > 0) {
    failures++;
    console.log(`  FAIL — baseline fired: ${[...clean].sort().join(", ")}`);
  } else {
    console.log("  ok — clean");
  }

  console.log("\nnegative cases (each mutation must make its rule fire)");
  for (const [rule, what, mutateCase, opts] of CASES) {
    const files = baseline();
    opts?.alsoFiles?.(files);
    mutateCase(files);
    let fired: Set<string>;
    try {
      fired = await idsFor(files);
    } catch (e) {
      fired = new Set([`THREW:${(e as Error).message}`]);
    }
    const ok = fired.has(rule);
    if (!ok) failures++;
    const extra = [...fired].filter((r) => r !== rule && !clean.has(r));
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${rule.padEnd(5)} ${what}` +
      (ok && extra.length ? `   (also: ${extra.sort().join(", ")})` : "") +
      (ok ? "" : `   got: ${[...fired].sort().join(", ") || "nothing"}`),
    );
  }

  console.log("\nvalid variations (each must NOT make its rule fire)");
  for (const [rule, what, mutateCase, rootFolder] of MUST_NOT_FIRE) {
    const files = baseline();
    mutateCase(files);
    const fired = await idsFor(files, rootFolder === null ? null : "selftest");
    const ok = !fired.has(rule);
    if (!ok) failures++;
    console.log(`  ${ok ? "ok  " : "FAIL"} ${rule.padEnd(5)} ${what}`);
  }

  failures += runRuntimeCases();

  const total = CASES.length + 1 + MUST_NOT_FIRE.length + RUNTIME_CLEAN.length + RUNTIME_CASES.length;
  console.log(`\n${total - failures}/${total} passed`);
  if (failures > 0) process.exitCode = 1;
}

await main();
