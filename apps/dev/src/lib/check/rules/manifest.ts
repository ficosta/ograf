import type { Finding, Pkg } from "../types";
import { getSchemaValidator, normaliseErrors, LIVE_SCHEMA_URL } from "../remote-schema";

const SPEC_GRAPHICS = "https://ograf.ebu.io/#graphics-definition";
const SPEC_ACTIONS = "https://ograf.ebu.io/#custom-actions";

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

export async function checkManifest(pkg: Pkg): Promise<readonly Finding[]> {
  const findings: Finding[] = [];

  // M-01: manifest present
  if (!pkg.manifestPath || !pkg.manifestRaw) {
    findings.push({
      id: "M-01",
      category: "manifest",
      severity: "error",
      title: "Missing manifest",
      message:
        "No .ograf.json manifest found at the package root. An OGraf package must have a manifest named like <slug>.ograf.json describing the graphic.",
      specRef: SPEC_GRAPHICS,
    });
    return findings;
  }
  findings.push({
    id: "M-01",
    category: "manifest",
    severity: "pass",
    title: "Manifest present",
    message: "Found the OGraf manifest.",
    path: pkg.manifestPath,
  });

  // M-02: valid JSON
  if (pkg.manifest == null) {
    findings.push({
      id: "M-02",
      category: "manifest",
      severity: "error",
      title: "Manifest is not valid JSON",
      message: "The manifest could not be parsed as JSON. Fix the syntax error and try again.",
      path: pkg.manifestPath,
    });
    return findings;
  }
  findings.push({
    id: "M-02",
    category: "manifest",
    severity: "pass",
    title: "Manifest is valid JSON",
    message: "The manifest parses cleanly.",
    path: pkg.manifestPath,
  });

  const manifest = pkg.manifest as Record<string, unknown>;

  // M-03: schema validation against live (or bundled fallback) EBU schema
  const compiled = await getSchemaValidator();
  const valid = compiled.validate(manifest);
  if (!valid) {
    for (const err of normaliseErrors(compiled.validate.errors)) {
      findings.push({
        id: "M-03",
        category: "manifest",
        severity: "error",
        title: "Schema violation",
        message: describeSchemaError(err),
        path: `${pkg.manifestPath}${err.path}`,
        specRef: SPEC_GRAPHICS,
      });
    }
  } else {
    findings.push({
      id: "M-03",
      category: "manifest",
      severity: "pass",
      title: `Conforms to the OGraf v1 schema (${compiled.source.kind})`,
      message:
        compiled.source.kind === "live"
          ? `Validated against the live EBU schema at ${compiled.source.url}.`
          : `Validated against the bundled snapshot. ${compiled.source.note ?? ""}`.trim(),
    });
  }
  if (compiled.source.kind === "bundled") {
    findings.push({
      id: "M-03",
      category: "manifest",
      severity: "info",
      title: "Live schema not reachable",
      message:
        compiled.source.note ??
        "Live schema unreachable; the report was generated against the bundled snapshot.",
    });
  }

  // M-04: customActions entries have id + name (no `label`)
  const customActions = Array.isArray(manifest.customActions) ? (manifest.customActions as unknown[]) : [];
  const seenIds = new Set<string>();
  for (let i = 0; i < customActions.length; i++) {
    const entry = customActions[i];
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    if (typeof e.name !== "string" || e.name.length === 0) {
      findings.push({
        id: "M-04",
        category: "manifest",
        severity: "error",
        title: "customAction missing `name`",
        message:
          typeof e.label === "string"
            ? "customActions entries use `name`, not `label`. Rename the `label` field to `name`."
            : "Each customActions entry must declare a `name` string displayed to operators.",
        path: `${pkg.manifestPath}/customActions/${i}`,
        specRef: SPEC_ACTIONS,
      });
    }
    if (typeof e.id !== "string" || e.id.length === 0) {
      findings.push({
        id: "M-04",
        category: "manifest",
        severity: "error",
        title: "customAction missing `id`",
        message: "Each customActions entry must declare a unique `id` string.",
        path: `${pkg.manifestPath}/customActions/${i}`,
        specRef: SPEC_ACTIONS,
      });
    } else {
      // M-05: unique ids
      if (seenIds.has(e.id)) {
        findings.push({
          id: "M-05",
          category: "manifest",
          severity: "error",
          title: "Duplicate customAction id",
          message: `customAction id "${e.id}" appears more than once. Each id must be unique within the manifest.`,
          path: `${pkg.manifestPath}/customActions/${i}`,
          specRef: SPEC_ACTIONS,
        });
      }
      seenIds.add(e.id);
    }

    // M-06: schema recommended
    if (e.schema === undefined) {
      findings.push({
        id: "M-06",
        category: "manifest",
        severity: "warning",
        title: "customAction has no schema",
        message: `Action "${typeof e.id === "string" ? e.id : `#${i}`}" declares no parameter schema. Operators will not be able to pass structured input. Set schema: null if the action intentionally takes no parameters.`,
        path: `${pkg.manifestPath}/customActions/${i}`,
        specRef: SPEC_ACTIONS,
      });
    }
  }
  if (customActions.length > 0 && !findings.some((f) => f.id === "M-04" && f.severity === "error")) {
    findings.push({
      id: "M-04",
      category: "manifest",
      severity: "pass",
      title: "customActions use `id` + `name`",
      message: "All customAction entries carry the required id and name fields.",
    });
  }

  // M-07: optional-but-recommended fields. The EBU schema only requires
  // $schema, id, name, main, supportsRealTime, supportsNonRealTime -- everything
  // below is a best-practice hint, not a spec violation. Info-level only.
  if (typeof manifest.description !== "string" || manifest.description.length === 0) {
    findings.push({
      id: "M-07",
      category: "manifest",
      severity: "info",
      title: "Optional — no description",
      message:
        "Optional. Adding a short `description` helps controllers and catalogues present your graphic with context.",
      path: `${pkg.manifestPath}/description`,
      specRef: SPEC_GRAPHICS,
    });
  }
  if (!manifest.author || typeof manifest.author !== "object") {
    findings.push({
      id: "M-07",
      category: "manifest",
      severity: "info",
      title: "Optional — no author",
      message:
        "Optional. Adding an `author` object with at least a `name` gives downstream users a contact point.",
      path: `${pkg.manifestPath}/author`,
      specRef: SPEC_GRAPHICS,
    });
  }
  if (!Array.isArray(manifest.thumbnails) || (manifest.thumbnails as unknown[]).length === 0) {
    findings.push({
      id: "M-07",
      category: "manifest",
      severity: "info",
      title: "Optional — no thumbnails declared",
      message:
        "Optional. `thumbnails` lets a gallery show a preview without running the graphic. A 16:9 image reference inside the package is ideal.",
      path: `${pkg.manifestPath}/thumbnails`,
      specRef: SPEC_GRAPHICS,
    });
  }
  if (typeof manifest.license !== "string" || manifest.license.length === 0) {
    findings.push({
      id: "M-07",
      category: "manifest",
      severity: "info",
      title: "Optional — no license declared",
      message:
        "Optional. Declaring a `license` (SPDX identifier recommended, e.g. `MIT`) reduces ambiguity for distributors.",
      path: `${pkg.manifestPath}/license`,
    });
  }

  // M-08: main file exists
  if (typeof manifest.main === "string" && manifest.main.length > 0) {
    if (!pkg.files.has(manifest.main)) {
      findings.push({
        id: "M-08",
        category: "manifest",
        severity: "error",
        title: "`main` file not found in package",
        message: `The manifest's main entry points at "${manifest.main}" but that file is not present in the package.`,
        path: `${pkg.manifestPath}/main`,
      });
    } else {
      findings.push({
        id: "M-08",
        category: "manifest",
        severity: "pass",
        title: "`main` file present",
        message: `Found ${manifest.main} in the package.`,
      });
    }
  }

  // M-09: version is optional in the EBU schema. If declared, the spec says
  // it SHOULD be alphabetically sortable -- semver is a clean way to achieve
  // that. Missing → info, non-semver → info (both hints, not violations).
  if (typeof manifest.version === "string" && manifest.version.length > 0) {
    if (SEMVER.test(manifest.version)) {
      findings.push({
        id: "M-09",
        category: "manifest",
        severity: "pass",
        title: "Valid semver version",
        message: `Version "${manifest.version}" is a valid semver string.`,
      });
    } else {
      findings.push({
        id: "M-09",
        category: "manifest",
        severity: "info",
        title: "Version is not semver",
        message: `"${manifest.version}" is not a semver string (e.g. 1.2.3). The spec only asks for an alphabetically sortable version, but semver is the common choice.`,
        path: `${pkg.manifestPath}/version`,
      });
    }
  }

  // M-10: $schema matches the URL we validated against
  if (typeof manifest.$schema === "string") {
    if (manifest.$schema !== LIVE_SCHEMA_URL) {
      findings.push({
        id: "M-10",
        category: "manifest",
        severity: "info",
        title: "`$schema` is not the current EBU URL",
        message: `Found "${manifest.$schema}". The current canonical URL is ${LIVE_SCHEMA_URL}. Update if you want editors to offer up-to-date autocompletion.`,
        path: `${pkg.manifestPath}/$schema`,
      });
    }
  } else {
    findings.push({
      id: "M-10",
      category: "manifest",
      severity: "info",
      title: "No `$schema` declared",
      message: `Adding "$schema": "${LIVE_SCHEMA_URL}" lets JSON editors validate and autocomplete the manifest as you type.`,
      path: `${pkg.manifestPath}/$schema`,
    });
  }

  return findings;
}

function describeSchemaError(err: { path: string; message: string; keyword?: string; params?: Record<string, unknown> }): string {
  const where = err.path === "/" ? "the manifest root" : `at ${err.path}`;
  if (err.keyword === "required" && err.params && typeof err.params.missingProperty === "string") {
    return `Missing required property "${err.params.missingProperty}" ${where}.`;
  }
  if (err.keyword === "additionalProperties" && err.params && typeof err.params.additionalProperty === "string") {
    return `Property "${err.params.additionalProperty}" is not allowed ${where}. Vendor-specific properties must be prefixed with "v_".`;
  }
  return `${err.message.charAt(0).toUpperCase() + err.message.slice(1)} ${where}.`;
}
