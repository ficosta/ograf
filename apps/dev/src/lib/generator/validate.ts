import { isHexColor } from "./color";
import { presetDef } from "./presets";
import type { FieldIssue, GeneratorConfig } from "./types";

/**
 * Form-level validation. The point is that the form cannot produce a manifest
 * the EBU schema or the Package Checker would reject: whatever passes here
 * passes there. Warnings are recommendations (reverse-DNS ids); errors block
 * the download.
 */

/** Same pattern the Package Checker's M-09 applies. */
export const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/** Reverse domain name notation, as the spec recommends: at least two dot-separated labels. */
const REVERSE_DNS = /^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/;

export const OFFSET_MIN = 0;
export const OFFSET_MAX = 600;
export const NAME_MAX = 120;

export function validateConfig(config: GeneratorConfig): readonly FieldIssue[] {
  const issues: FieldIssue[] = [];
  const def = presetDef(config.preset);

  const name = config.name.trim();
  if (!name) issues.push({ field: "name", severity: "error", code: "nameRequired" });
  else if (name.length > NAME_MAX) issues.push({ field: "name", severity: "error", code: "nameTooLong" });

  const id = config.id.trim();
  if (!id) issues.push({ field: "id", severity: "error", code: "idRequired" });
  else if (id.includes("/")) issues.push({ field: "id", severity: "error", code: "idSlash" });
  else if (/\s/.test(id)) issues.push({ field: "id", severity: "error", code: "idWhitespace" });
  else if (!REVERSE_DNS.test(id)) issues.push({ field: "id", severity: "warning", code: "idNotReverseDns" });

  const version = config.version.trim();
  if (!version) issues.push({ field: "version", severity: "error", code: "versionRequired" });
  else if (!SEMVER.test(version)) issues.push({ field: "version", severity: "error", code: "versionNotSemver" });

  const authorUrl = config.authorUrl.trim();
  if (authorUrl) {
    if (!isHttpUrl(authorUrl)) issues.push({ field: "authorUrl", severity: "error", code: "authorUrlInvalid" });
    if (!config.authorName.trim()) {
      issues.push({ field: "authorName", severity: "error", code: "authorNameRequiredWithUrl" });
    }
  }

  for (const knob of def.colors) {
    const value = config.colors[knob.id];
    if (typeof value !== "string" || !isHexColor(value)) {
      issues.push({ field: `color.${knob.id}`, severity: "error", code: "colorInvalid" });
    }
  }

  for (const knob of def.offsets) {
    const value = config.offsets[knob.id];
    if (typeof value !== "number" || !Number.isInteger(value) || value < OFFSET_MIN || value > OFFSET_MAX) {
      issues.push({ field: `offset.${knob.id}`, severity: "error", code: "offsetRange" });
    }
  }

  return issues;
}

export function hasErrors(issues: readonly FieldIssue[]): boolean {
  return issues.some((i) => i.severity === "error");
}

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
