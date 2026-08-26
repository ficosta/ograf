import Ajv2020 from "ajv/dist/2020";
import type { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { OGRAF_SCHEMAS, OGRAF_SCHEMA_ROOT_ID } from "./schema";

export interface ValidationIssue {
  readonly severity: "error" | "warning" | "info";
  readonly message: string;
  readonly path?: string;
  readonly specRef?: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
}

/**
 * The vendored spec schemas are 2020-12 and reference each other by $id, so
 * every sibling is registered before the root is compiled — that keeps the
 * whole thing offline. Compilation is lazy so importing this module can never
 * throw at load time.
 */
let compiled: ValidateFunction | null = null;

function getValidator(): ValidateFunction {
  if (compiled) return compiled;
  const ajv = new Ajv2020({ allErrors: true, verbose: true, strict: false, validateSchema: false });
  addFormats(ajv);
  for (const [id, schema] of Object.entries(OGRAF_SCHEMAS)) {
    if (id !== OGRAF_SCHEMA_ROOT_ID) ajv.addSchema(schema as object, id);
  }
  compiled = ajv.compile(OGRAF_SCHEMAS[OGRAF_SCHEMA_ROOT_ID] as object);
  return compiled;
}

function createBestPracticeWarnings(
  manifest: Record<string, unknown>
): readonly ValidationIssue[] {
  const warnings: ValidationIssue[] = [];

  if (!manifest["description"]) {
    warnings.push({
      severity: "warning",
      message: "Consider adding a description for better discoverability",
      path: "/description",
    });
  }

  if (!manifest["thumbnails"] || (manifest["thumbnails"] as unknown[]).length === 0) {
    warnings.push({
      severity: "warning",
      message:
        "Consider adding thumbnails for visual previews in editors and galleries",
      path: "/thumbnails",
    });
  }

  if (!manifest["license"]) {
    warnings.push({
      severity: "info",
      message: "Consider specifying a license (SPDX identifier recommended)",
      path: "/license",
    });
  }

  if (!manifest["author"]) {
    warnings.push({
      severity: "info",
      message: "Consider adding author information",
      path: "/author",
    });
  }

  if (manifest["stepCount"] === undefined) {
    warnings.push({
      severity: "warning",
      message:
        "stepCount is not specified. Renderers will assume a default. Explicit is better.",
      path: "/stepCount",
      specRef:
        "https://ograf.ebu.io/#step-model",
    });
  }

  return warnings;
}

export function validate(input: string): ValidationResult {
  let manifest: Record<string, unknown>;

  try {
    manifest = JSON.parse(input) as Record<string, unknown>;
  } catch (e) {
    const error = e instanceof Error ? e.message : "Unknown parse error";
    return {
      valid: false,
      issues: [
        {
          severity: "error",
          message: `Invalid JSON: ${error}`,
        },
      ],
    };
  }

  const validateFn = getValidator();
  const schemaValid = validateFn(manifest);

  const issues: ValidationIssue[] = [];

  if (!schemaValid && validateFn.errors) {
    for (const err of validateFn.errors) {
      issues.push({
        severity: "error",
        message: err.message ?? "Schema validation error",
        path: err.instancePath || "/",
        specRef: "https://ograf.ebu.io/#graphics-definition",
      });
    }
  }

  const warnings = createBestPracticeWarnings(manifest);
  issues.push(...warnings);

  return {
    valid: issues.every((i) => i.severity !== "error"),
    issues,
  };
}
