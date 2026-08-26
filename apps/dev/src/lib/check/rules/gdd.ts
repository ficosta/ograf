/**
 * GDD (Graphics Data Definition) validation.
 *
 * `manifest.schema` and each `customActions[].schema` describe the data a
 * graphic accepts. Controllers generate their operator forms from it, so a
 * malformed GDD does not break the graphic — it breaks every UI built around
 * it, in every vendor's product, and usually only once someone is on air.
 *
 * The Ajv pass already checks the manifest against the EBU schema set, but
 * JSON Schema's `if/then` composition reports failures as a wall of anyOf
 * branches that say nothing useful. These rules walk the tree ourselves and
 * name the actual problem and its path.
 *
 * Rules encoded here come from the vendored spec, not from guesswork:
 *   gdd/object.json      — `type` required, allowed type values
 *   gdd/basic-types.json — default matches type; array needs items;
 *                          object needs properties
 *   gdd/gdd-types.json   — per-gddType constraints
 *
 * @see https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json
 */

import type { Finding, Pkg } from "../types";

const SPEC_GDD = "https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json";

const VALID_TYPES = ["boolean", "string", "number", "integer", "array", "object"] as const;
type GddBaseType = (typeof VALID_TYPES)[number];

/** Per-gddType constraints, transcribed from gdd/gdd-types.json. */
const GDD_TYPES: Readonly<
  Record<
    string,
    {
      /** The base `type` this gddType demands. */
      readonly type: GddBaseType | readonly GddBaseType[];
      /** Keys that must be present on the node itself. */
      readonly requires?: readonly string[];
      /** Keys that must be present inside gddOptions. */
      readonly optionRequires?: readonly string[];
      /** Exact value `pattern` must carry, where the spec pins one. */
      readonly pattern?: string;
    }
  >
> = {
  "single-line": { type: "string" },
  "multi-line": { type: "string" },
  "file-path": { type: "string" },
  "file-path/image-path": { type: "string" },
  select: { type: ["string", "number", "integer"], requires: ["enum", "gddOptions"], optionRequires: ["labels"] },
  "select-multiple": { type: "array", requires: ["items", "gddOptions"], optionRequires: ["labels"] },
  "color-rrggbb": { type: "string", requires: ["pattern"], pattern: "^#[0-9a-f]{6}$" },
  "color-rrggbbaa": { type: "string", requires: ["pattern"], pattern: "^#[0-9a-f]{8}$" },
  percentage: { type: "number" },
  "duration-ms": { type: "integer" },
};

const MAX_DEPTH = 100;

type Node = Record<string, unknown>;

function isObject(v: unknown): v is Node {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function typeOfValue(v: unknown): string {
  if (Array.isArray(v)) return "array";
  if (v === null) return "null";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}

/** Does `value` satisfy the declared base `type`? integer also satisfies number. */
function valueMatchesType(value: unknown, type: string): boolean {
  const actual = typeOfValue(value);
  if (type === "number") return actual === "number" || actual === "integer";
  return actual === type;
}

interface Ctx {
  readonly findings: Finding[];
  readonly manifestPath: string;
  readonly seen: WeakSet<object>;
  /** Package contents, so file-path defaults can be resolved. */
  readonly files: ReadonlySet<string>;
  truncated: boolean;
}

/** Can this default be looked for inside the package? URLs and absolutes cannot. */
function isPackageRelative(p: string): boolean {
  return !/^([a-z][a-z0-9+.-]*:)?\/\//i.test(p) && !p.startsWith("/") && !p.startsWith("data:");
}

function push(
  ctx: Ctx,
  id: string,
  severity: "error" | "warning",
  title: string,
  message: string,
  path: string,
): void {
  ctx.findings.push({ id, category: "gdd", severity, title, message, path, specRef: SPEC_GDD });
}

function walk(node: unknown, path: string, ctx: Ctx, depth: number): void {
  if (depth > MAX_DEPTH) {
    ctx.truncated = true;
    return;
  }
  if (!isObject(node)) {
    push(ctx, "G-01", "error", "GDD node is not an object",
      `Every entry in a GDD schema must be an object describing one field. Found ${typeOfValue(node)}.`, path);
    return;
  }
  // A $ref cycle would otherwise recurse forever.
  if (ctx.seen.has(node)) {
    ctx.truncated = true;
    return;
  }
  ctx.seen.add(node);

  // G-02: `type` is required and must be one of the six allowed values.
  const type = node.type;
  if (type === undefined) {
    push(ctx, "G-02", "error", "GDD field has no `type`",
      "Every GDD field must declare a `type` — one of boolean, string, number, integer, array, object.", path);
    return;
  }
  if (typeof type !== "string" || !(VALID_TYPES as readonly string[]).includes(type)) {
    push(ctx, "G-02", "error", "GDD field has an invalid `type`",
      `\`${String(type)}\` is not a GDD type. Use one of: ${VALID_TYPES.join(", ")}.`, path);
    return;
  }

  // G-03: the gddType, where present, constrains the base type and demands keys.
  const gddType = node.gddType;
  if (gddType !== undefined) {
    if (typeof gddType !== "string") {
      push(ctx, "G-03", "error", "`gddType` is not a string",
        "`gddType` names a GDD presentation type and must be a string.", `${path}/gddType`);
    } else {
      const spec = GDD_TYPES[gddType];
      if (!spec) {
        push(ctx, "G-03", "warning", `Unknown gddType \`${gddType}\``,
          `The spec defines: ${Object.keys(GDD_TYPES).join(", ")}. A controller that does not recognise \`${gddType}\` will fall back to a plain \`${type}\` input.`,
          `${path}/gddType`);
      } else {
        const allowed = Array.isArray(spec.type) ? spec.type : [spec.type];
        if (!allowed.includes(type as GddBaseType)) {
          push(ctx, "G-04", "error", `gddType \`${gddType}\` needs type ${allowed.join(" or ")}`,
            `The field declares \`type: "${type}"\`, but \`gddType: "${gddType}"\` is only defined for ${allowed.map((t) => `\`${t}\``).join(" or ")}.`,
            `${path}/type`);
        }
        for (const key of spec.requires ?? []) {
          if (node[key] === undefined) {
            push(ctx, "G-05", "error", `gddType \`${gddType}\` requires \`${key}\``,
              `\`${gddType}\` fields must declare \`${key}\`; without it a controller cannot build the input.`,
              `${path}/${key}`);
          }
        }
        const opts = node.gddOptions;
        for (const key of spec.optionRequires ?? []) {
          if (!isObject(opts) || opts[key] === undefined) {
            push(ctx, "G-06", "error", `gddType \`${gddType}\` requires \`gddOptions.${key}\``,
              `\`${gddType}\` needs \`gddOptions.${key}\` — that is what an operator actually reads in the dropdown.`,
              `${path}/gddOptions/${key}`);
          }
        }
        if (spec.pattern && node.pattern !== spec.pattern) {
          push(ctx, "G-07", "error", `gddType \`${gddType}\` pins a \`pattern\``,
            `The spec fixes \`pattern\` to \`${spec.pattern}\` for \`${gddType}\`${node.pattern === undefined ? ", but none is declared" : `, found \`${String(node.pattern)}\``}.`,
            `${path}/pattern`);
        }
        // G-08: select labels should cover every enum value.
        if ((gddType === "select" || gddType === "select-multiple") && isObject(opts)) {
          const values = gddType === "select"
            ? node.enum
            : isObject(node.items) ? node.items.enum : undefined;
          const labels = opts.labels;
          if (Array.isArray(values) && isObject(labels)) {
            const missing = values.filter((v) => labels[String(v)] === undefined);
            if (missing.length > 0) {
              push(ctx, "G-08", "warning", "Not every option has a label",
                `\`gddOptions.labels\` has no entry for ${missing.map((v) => `\`${String(v)}\``).join(", ")}. Operators will see the raw value instead of a readable name.`,
                `${path}/gddOptions/labels`);
            }
          }
        }
      }
    }
  }

  // G-09: array needs items, object needs properties (gdd/basic-types.json).
  if (type === "array") {
    if (node.items === undefined) {
      push(ctx, "G-09", "error", "Array field has no `items`",
        "A GDD array must declare `items` describing what one element looks like.", `${path}/items`);
    } else {
      walk(node.items, `${path}/items`, ctx, depth + 1);
    }
  }
  if (type === "object") {
    if (node.properties === undefined) {
      push(ctx, "G-09", "error", "Object field has no `properties`",
        "A GDD object must declare `properties`. An object with no properties gives an operator nothing to fill in.", `${path}/properties`);
    } else if (!isObject(node.properties)) {
      push(ctx, "G-09", "error", "`properties` is not an object",
        "`properties` must map field names to GDD field definitions.", `${path}/properties`);
    } else {
      for (const [key, child] of Object.entries(node.properties)) {
        walk(child, `${path}/properties/${key}`, ctx, depth + 1);
      }
    }
  }

  // G-10: a default must be an instance of the field it defaults.
  if (node.default !== undefined && !valueMatchesType(node.default, type)) {
    push(ctx, "G-10", "error", "`default` does not match the field type",
      `The field is \`${type}\` but its default is ${typeOfValue(node.default)}. Controllers pre-fill forms from defaults, so this breaks the form before an operator touches it.`,
      `${path}/default`);
  }
  // G-15: a file-path default should point at something the package ships.
  // Warning rather than error: the spec allows absolute paths and URLs, and a
  // renderer may resolve the value against its own media store.
  if (
    typeof gddType === "string" &&
    (gddType === "file-path" || gddType === "file-path/image-path") &&
    typeof node.default === "string" &&
    node.default.length > 0 &&
    isPackageRelative(node.default)
  ) {
    const normalised = node.default.replace(/^\.\//, "");
    if (!ctx.files.has(normalised)) {
      push(ctx, "G-15", "warning", "file-path default is not in the package",
        `The field defaults to \`${node.default}\`, which is not among the package's files. Unless the renderer resolves it from its own media store, the graphic opens with a broken reference.`,
        `${path}/default`);
    }
  }

  // G-11: a default must also satisfy the field's own enum / bounds.
  if (node.default !== undefined) {
    if (Array.isArray(node.enum) && !node.enum.some((v) => v === node.default)) {
      push(ctx, "G-11", "error", "`default` is not one of the allowed values",
        `The default \`${String(node.default)}\` does not appear in \`enum\`.`, `${path}/default`);
    }
    if (typeof node.default === "number") {
      if (typeof node.minimum === "number" && node.default < node.minimum) {
        push(ctx, "G-11", "error", "`default` is below `minimum`",
          `Default ${node.default} is less than the declared minimum ${node.minimum}.`, `${path}/default`);
      }
      if (typeof node.maximum === "number" && node.default > node.maximum) {
        push(ctx, "G-11", "error", "`default` is above `maximum`",
          `Default ${node.default} is greater than the declared maximum ${node.maximum}.`, `${path}/default`);
      }
    }
    if (typeof node.default === "string" && typeof node.pattern === "string") {
      let re: RegExp | null = null;
      try {
        re = new RegExp(node.pattern);
      } catch {
        push(ctx, "G-12", "warning", "`pattern` is not a valid regular expression",
          `\`${node.pattern}\` could not be compiled, so no controller can validate this field.`, `${path}/pattern`);
      }
      if (re && !re.test(node.default)) {
        push(ctx, "G-11", "error", "`default` does not match `pattern`",
          `Default \`${node.default}\` fails the field's own pattern \`${node.pattern}\`.`, `${path}/default`);
      }
    }
  }
}

/** Validate one GDD root (manifest.schema or a customAction schema). */
function checkRoot(root: unknown, label: string, path: string, findings: Finding[], files: ReadonlySet<string>): void {
  const ctx: Ctx = { findings, manifestPath: path, seen: new WeakSet(), files, truncated: false };

  if (!isObject(root)) {
    findings.push({
      id: "G-01",
      category: "gdd",
      severity: "error",
      title: `${label} schema is not an object`,
      message: `A GDD schema must be an object with \`type: "object"\` and \`properties\`. Found ${typeOfValue(root)}.`,
      path,
      specRef: SPEC_GDD,
    });
    return;
  }
  if (root.type !== "object") {
    findings.push({
      id: "G-13",
      category: "gdd",
      severity: "error",
      title: `${label} schema root must be \`type: "object"\``,
      message: `The root of a GDD schema describes the data object a graphic receives, so it is always \`type: "object"\`. Found \`${String(root.type)}\`.`,
      path: `${path}/type`,
      specRef: SPEC_GDD,
    });
  }
  walk(root, path, ctx, 0);

  if (ctx.truncated) {
    findings.push({
      id: "G-14",
      category: "gdd",
      severity: "warning",
      title: "GDD schema is cyclic or extremely deep",
      message: "Validation stopped early. A schema that references itself will hang or crash a controller building a form from it.",
      path,
      specRef: SPEC_GDD,
    });
  }
}

export function checkGdd(pkg: Pkg): readonly Finding[] {
  const findings: Finding[] = [];
  const manifest = pkg.manifest;
  if (!isObject(manifest)) return findings;

  const base = pkg.manifestPath ?? "manifest";
  const files = new Set(pkg.files.keys());

  if (manifest.schema !== undefined) {
    checkRoot(manifest.schema, "Graphic data", `${base}/schema`, findings, files);
  }

  const actions = manifest.customActions;
  if (Array.isArray(actions)) {
    actions.forEach((action, i) => {
      if (!isObject(action)) return;
      // `schema: null` is how the spec says "this action takes no parameters".
      if (action.schema === undefined || action.schema === null) return;
      const id = typeof action.id === "string" ? action.id : `#${i}`;
      checkRoot(action.schema, `customAction "${id}"`, `${base}/customActions/${i}/schema`, findings, files);
    });
  }

  if (findings.length === 0 && manifest.schema !== undefined) {
    findings.push({
      id: "G-00",
      category: "gdd",
      severity: "pass",
      title: "GDD schema is well-formed",
      message: "Field types, gddType constraints and defaults all check out — a controller can build a form from this.",
      path: `${base}/schema`,
    });
  }

  return findings;
}
