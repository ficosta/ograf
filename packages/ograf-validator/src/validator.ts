import Ajv from "ajv";
import addFormats from "ajv-formats";
import { OGRAF_MANIFEST_SCHEMA } from "./schema";

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

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

const validateSchema = ajv.compile(OGRAF_MANIFEST_SCHEMA);

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

  const schemaValid = validateSchema(manifest);

  const issues: ValidationIssue[] = [];

  if (!schemaValid && validateSchema.errors) {
    for (const err of validateSchema.errors) {
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
