/**
 * Cross-field manifest rules — the checks a per-field schema cannot express.
 *
 * Ajv validates each field against the EBU schema in isolation. What it cannot
 * see is whether the fields agree with each other: an actionDuration pointing
 * at a customAction that was never declared, a resolution requirement whose
 * minimum exceeds its maximum, a graphic that supports neither render mode.
 * Each of those is a manifest that parses cleanly and still cannot work.
 *
 * Severity follows the spec, not taste. Where the specification *requires*
 * something, a violation is an error. Where it only *recommends* — reverse-DNS
 * ids, the thumbnail format list — it is a warning, because flagging those as
 * errors would fail packages other validators correctly accept.
 *
 * @see https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json
 */

import type { Finding, Pkg } from "../types";

const SPEC = "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json";

/** Formats the thumbnail description names as allowed. */
const THUMB_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp"];

/** Extensions a renderer can realistically import as an ES module. */
const MODULE_EXTENSIONS = [".js", ".mjs"];

type Node = Record<string, unknown>;

function isObject(v: unknown): v is Node {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Is this path something we can look for inside the package? */
function isPackageRelative(p: string): boolean {
  return !/^([a-z][a-z0-9+.-]*:)?\/\//i.test(p) && !p.startsWith("/") && !p.startsWith("data:");
}

export function checkManifestCross(pkg: Pkg): readonly Finding[] {
  const findings: Finding[] = [];
  const m = pkg.manifest;
  if (!isObject(m)) return findings;

  const base = pkg.manifestPath ?? "manifest";
  const add = (
    id: string,
    severity: Finding["severity"],
    title: string,
    message: string,
    path?: string,
  ) => {
    findings.push({ id, category: "manifest", severity, title, message, path, specRef: SPEC });
  };

  // M-11: a graphic that supports neither render mode can never be played.
  if (m.supportsRealTime === false && m.supportsNonRealTime === false) {
    add("M-11", "error", "Graphic declares no supported render mode",
      "Both `supportsRealTime` and `supportsNonRealTime` are false, so no renderer is allowed to play this graphic. At least one must be true.",
      `${base}/supportsRealTime`);
  }

  // M-12: reverse-DNS is a recommendation in the spec, so this is advisory.
  if (typeof m.id === "string") {
    if (m.id.includes("/")) {
      add("M-12", "warning", "`id` contains a slash",
        `\`${m.id}\` has a "/" in it. Ids end up in URLs and file paths in some renderers, where a slash changes the meaning of the path. Reverse-domain notation (com.example.lower-third) avoids the problem.`,
        `${base}/id`);
    } else if (!m.id.includes(".")) {
      add("M-12", "info", "`id` is not in reverse-domain notation",
        `The spec recommends reverse-domain ids (com.your-company.${m.id}) so two vendors' graphics cannot collide in a shared library.`,
        `${base}/id`);
    }
  }

  // M-13: the spec says `main` is "the main javascript file" without pinning an
  // extension, so an unusual one is worth flagging but is not a violation.
  if (typeof m.main === "string" && !MODULE_EXTENSIONS.some((e) => m.main === undefined || (m.main as string).toLowerCase().endsWith(e))) {
    add("M-13", "warning", "`main` is not a .js or .mjs file",
      `\`${m.main}\` will be imported as an ES module by the renderer. Anything other than .js or .mjs risks being served with a MIME type browsers refuse to execute.`,
      `${base}/main`);
  }

  // M-14: the schema pins `minimum: -1`. Note that 0 is *valid* — OGraf uses it
  // for "volatile" / fire-and-forget graphics that play themselves out, like a
  // bumper (see gdd/playout-options.json). Only below -1 is out of range.
  if (typeof m.stepCount === "number") {
    if (m.stepCount < -1) {
      add("M-14", "error", "`stepCount` is below the allowed minimum",
        `\`${m.stepCount}\` is out of range. The spec allows -1 (dynamic), 0 (volatile / fire-and-forget) and any positive number of steps.`,
        `${base}/stepCount`);
    } else if (!Number.isInteger(m.stepCount)) {
      add("M-14", "warning", "`stepCount` is not a whole number",
        `\`${m.stepCount}\` is not a whole number of steps. Renderers step by integers.`,
        `${base}/stepCount`);
    }
  }

  // M-15: author is optional, but the schema requires `name` once it is present.
  if (isObject(m.author) && typeof m.author.name !== "string") {
    add("M-15", "error", "`author` has no `name`",
      "The spec requires `author.name` whenever an author object is declared. Drop the object entirely if you do not want to name an author.",
      `${base}/author/name`);
  }

  // M-16: actionDurations must agree with customActions, and not double-declare.
  const declaredActionIds = new Set<string>(
    Array.isArray(m.customActions)
      ? m.customActions.filter(isObject).map((a) => a.id).filter((id): id is string => typeof id === "string")
      : [],
  );
  if (Array.isArray(m.actionDurations)) {
    const seen = new Set<string>();
    m.actionDurations.forEach((entry, i) => {
      if (!isObject(entry)) return;
      const type = entry.type;
      if (typeof type !== "string") return;
      const key = type === "customAction" ? `customAction:${String(entry.customActionId)}` : type;
      if (seen.has(key)) {
        add("M-16", "error", `Duplicate actionDuration for \`${key}\``,
          "Two entries declare a duration for the same action. A renderer has no way to choose between them.",
          `${base}/actionDurations/${i}`);
      }
      seen.add(key);

      if (type === "customAction") {
        const refId = entry.customActionId;
        if (typeof refId === "string" && !declaredActionIds.has(refId)) {
          add("M-16", "error", `actionDuration references unknown customAction \`${refId}\``,
            declaredActionIds.size > 0
              ? `No customAction with that id is declared. Declared ids: ${[...declaredActionIds].map((s) => `\`${s}\``).join(", ")}.`
              : "The manifest declares no customActions at all, so this duration can never apply.",
            `${base}/actionDurations/${i}/customActionId`);
        }
      }
    });
  }

  // M-17: a requirement whose minimum exceeds its maximum can never be met.
  if (Array.isArray(m.renderRequirements)) {
    m.renderRequirements.forEach((req, i) => {
      if (!isObject(req)) return;
      const ranges: [string, unknown][] = [
        ["frameRate", req.frameRate],
        ...(isObject(req.resolution)
          ? ([["resolution/width", req.resolution.width], ["resolution/height", req.resolution.height]] as [string, unknown][])
          : []),
      ];
      for (const [label, constraint] of ranges) {
        if (!isObject(constraint)) continue;
        const { min, max } = constraint;
        if (typeof min === "number" && typeof max === "number" && min > max) {
          add("M-17", "error", `Unsatisfiable requirement on \`${label}\``,
            `min ${min} is greater than max ${max}, so no renderer can ever satisfy this requirement and every one of them should refuse the graphic.`,
            `${base}/renderRequirements/${i}/${label}`);
        }
      }
    });
  }

  // M-18: thumbnails must exist, and the spec names the formats it expects.
  if (Array.isArray(m.thumbnails)) {
    m.thumbnails.forEach((t, i) => {
      if (!isObject(t)) return;
      const file = t.file;
      if (typeof file !== "string") return;
      const ext = file.split(".").pop()?.toLowerCase() ?? "";
      if (!THUMB_EXTENSIONS.includes(ext)) {
        add("M-18", "warning", `Thumbnail is not a PNG, JPG, GIF or webp`,
          `\`${file}\` uses \`.${ext}\`. The spec names PNG, JPG, GIF and webp as the allowed formats; other formats may simply not render in a graphics browser.`,
          `${base}/thumbnails/${i}/file`);
      }
      if (isPackageRelative(file)) {
        const normalised = file.replace(/^\.\//, "");
        if (!pkg.files.has(normalised)) {
          add("M-18", "error", "Thumbnail file is missing from the package",
            `The manifest points at \`${file}\`, but no such file is inside the package. Every library UI that shows this graphic will show a broken image.`,
            `${base}/thumbnails/${i}/file`);
        }
      }
    });
  }

  // M-19: the manifest must be discoverable where a renderer looks for it.
  if (pkg.manifestPath) {
    if (!pkg.manifestPath.endsWith(".ograf.json")) {
      add("M-19", "warning", "Manifest filename does not end in `.ograf.json`",
        `Renderers locate the manifest by that suffix. \`${pkg.manifestPath}\` may not be found automatically.`,
        pkg.manifestPath);
    } else if (pkg.manifestPath.includes("/")) {
      add("M-19", "warning", "Manifest is not at the package root",
        `\`${pkg.manifestPath}\` sits in a subfolder. Most renderers look for the manifest beside the package's top-level folder.`,
        pkg.manifestPath);
    }
  }

  return findings;
}
