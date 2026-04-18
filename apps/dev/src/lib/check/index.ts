import { unpack } from "./unpack";
import { getSchemaValidator } from "./remote-schema";
import { checkManifest } from "./rules/manifest";
import { checkStructure } from "./rules/structure";
import { checkModule } from "./rules/module";
import { checkStyling } from "./rules/styling";
import { checkAssets } from "./rules/assets";
import type { Finding, Pkg, Report, SchemaSource } from "./types";

export type { Finding, Pkg, Report, SchemaSource, Severity, Category } from "./types";
export { CATEGORY_LABEL, CATEGORY_ORDER } from "./types";
export { unpack } from "./unpack";
export { toMarkdown } from "./report";

export async function runChecks(file: File): Promise<Report> {
  const started = performance.now();

  const pkg = await unpack(file);

  const manifestFindings = await checkManifest(pkg);
  const structureFindings = checkStructure(pkg);
  const moduleFindings = checkModule(pkg);
  const stylingFindings = checkStyling(pkg);
  const assetFindings = checkAssets(pkg);

  const findings: Finding[] = [
    ...manifestFindings,
    ...structureFindings,
    ...moduleFindings,
    ...stylingFindings,
    ...assetFindings,
  ];

  const schema = await getSchemaValidator();

  return buildReport(pkg, findings, schema.source, performance.now() - started);
}

function buildReport(
  pkg: Pkg,
  findings: readonly Finding[],
  schemaSource: SchemaSource,
  durationMs: number
): Report {
  const summary = {
    errors: findings.filter((f) => f.severity === "error").length,
    warnings: findings.filter((f) => f.severity === "warning").length,
    infos: findings.filter((f) => f.severity === "info").length,
    passes: findings.filter((f) => f.severity === "pass").length,
  };
  return {
    pkgName: pkg.zipName,
    pkgSize: pkg.zipSize,
    findings,
    durationMs,
    schemaSource,
    summary,
  };
}
