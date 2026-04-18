import type { Finding, Pkg } from "../types";

const LIFECYCLE_METHODS = ["load", "playAction", "updateAction", "stopAction", "customAction", "dispose"] as const;

function lineOf(source: string, needle: RegExp): number | null {
  const m = needle.exec(source);
  if (!m) return null;
  return source.slice(0, m.index).split("\n").length;
}

export function checkModule(pkg: Pkg): readonly Finding[] {
  const findings: Finding[] = [];

  const mainPath = pkg.mainPath;
  if (!mainPath || !pkg.texts.has(mainPath)) {
    // M-08 / S-02 will already have surfaced this; skip here.
    return findings;
  }
  const source = pkg.texts.get(mainPath) ?? "";

  // C-01: default export class extending HTMLElement
  const hasClassDefault = /export\s+default\s+class\s+\w+\s+extends\s+HTMLElement/.test(source);
  const hasNamedClass = /class\s+\w+\s+extends\s+HTMLElement/.test(source);
  const hasDefaultAtEnd = /export\s+default\s+\w+\s*;?\s*$/m.test(source);
  if (hasClassDefault || (hasNamedClass && hasDefaultAtEnd)) {
    findings.push({
      id: "C-01",
      category: "module",
      severity: "pass",
      title: "Default export is a class extending HTMLElement",
      message: "Found the required default export.",
      path: mainPath,
    });
  } else {
    findings.push({
      id: "C-01",
      category: "module",
      severity: "error",
      title: "No default export of an HTMLElement class",
      message:
        "An OGraf graphic module must default-export a class extending HTMLElement. Example: `export default class MyGraphic extends HTMLElement { ... }`.",
      path: mainPath,
      specRef: "https://ograf.ebu.io/#graphic-module",
    });
  }

  // C-02: six lifecycle methods
  const missing: string[] = [];
  for (const method of LIFECYCLE_METHODS) {
    const methodRegex = new RegExp(`\\b${method}\\s*\\(`);
    if (!methodRegex.test(source)) missing.push(method);
  }
  if (missing.length === 0) {
    findings.push({
      id: "C-02",
      category: "module",
      severity: "pass",
      title: "All six lifecycle methods present",
      message: "load, playAction, updateAction, stopAction, customAction, dispose — all accounted for.",
      path: mainPath,
    });
  } else {
    findings.push({
      id: "C-02",
      category: "module",
      severity: "error",
      title: `Missing lifecycle method${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`,
      message:
        "Real OGraf players call every lifecycle method as part of their spec-compliance check. Declare each as `async` on the class; return `{ statusCode: 200 }` (or `{ statusCode: 404 }` for no-op customAction).",
      path: mainPath,
      specRef: "https://ograf.ebu.io/#lifecycle",
    });
  }

  // C-03: no module-level customElements.define
  const defineMatch = /(^|\n)[\t ]*(?:if\s*\([^)]*customElements\.get[^)]*\)\s*[{]?\s*)?customElements\.define\s*\(/.exec(source);
  if (defineMatch) {
    findings.push({
      id: "C-03",
      category: "module",
      severity: "error",
      title: "Module self-registers with customElements.define",
      message:
        "Real OGraf renderers pick the tag themselves and register your default-exported class. A module-level `customElements.define(...)` claims the class first and makes the renderer's register throw with \"this constructor has already been used\". Remove the call.",
      path: `${mainPath}:${lineOf(source, /customElements\.define\s*\(/) ?? 0}`,
      specRef: "/spec#lifecycle",
    });
  } else {
    findings.push({
      id: "C-03",
      category: "module",
      severity: "pass",
      title: "Module does not self-register",
      message: "No module-level customElements.define() call. The renderer picks the tag.",
      path: mainPath,
    });
  }

  // C-04: lifecycle methods are async
  const nonAsync: string[] = [];
  for (const method of LIFECYCLE_METHODS) {
    const decl = new RegExp(`(?:^|[\\s{;])(async\\s+)?${method}\\s*\\(`);
    const m = decl.exec(source);
    if (m && !m[1]) nonAsync.push(method);
  }
  if (nonAsync.length > 0) {
    findings.push({
      id: "C-04",
      category: "module",
      severity: "warning",
      title: `Non-async lifecycle method${nonAsync.length > 1 ? "s" : ""}: ${nonAsync.join(", ")}`,
      message:
        "Every OGraf lifecycle method is expected to return a Promise. Declare them `async` so the renderer can `await` them without surprises.",
      path: mainPath,
    });
  }

  // C-05: no top-level document./window. access
  // Scan the portion of the source before the first class declaration.
  const classStart = source.search(/class\s+\w+\s+extends\s+HTMLElement/);
  const head = classStart >= 0 ? source.slice(0, classStart) : source;
  if (/(^|\s)(document\.|window\.)/.test(head)) {
    findings.push({
      id: "C-05",
      category: "module",
      severity: "warning",
      title: "Top-level access to document/window",
      message:
        "The module runs as soon as it is imported — possibly before the renderer has attached the element. Move `document.*` / `window.*` access inside lifecycle methods (typically load()).",
      path: mainPath,
    });
  }

  // C-06: asset URLs computed from import.meta.url
  if (/(?:\.css|\.woff2?|\.ttf|\.otf|\.png|\.jpe?g|\.webp|\.svg)['"`]/.test(source)) {
    if (/new\s+URL\s*\(['"][^'"]+['"]\s*,\s*import\.meta\.url\s*\)/.test(source)) {
      findings.push({
        id: "C-06",
        category: "module",
        severity: "pass",
        title: "Asset URLs computed from import.meta.url",
        message: "Asset URLs resolve to an absolute path regardless of where the package is served.",
        path: mainPath,
      });
    } else {
      findings.push({
        id: "C-06",
        category: "module",
        severity: "info",
        title: "Consider `new URL(..., import.meta.url)` for assets",
        message:
          "When the module references a stylesheet or font file, compute the absolute URL from import.meta.url. Relative paths inside an injected <style> tag resolve against the document, not your module.",
        path: mainPath,
      });
    }
  }

  // C-07: external imports
  const imports = Array.from(source.matchAll(/import\s+(?:[^'"`]+?\s+from\s+)?['"]([^'"]+)['"]/g)).map((m) => m[1]);
  const external = imports.filter((p) => !p.startsWith(".") && !p.startsWith("/"));
  if (external.length > 0) {
    findings.push({
      id: "C-07",
      category: "module",
      severity: "warning",
      title: "External / bare-module imports",
      message:
        `The module imports ${external.map((i) => `\`${i}\``).join(", ")}. An OGraf package is expected to be self-contained; bare-module imports only work if the renderer happens to provide those globals.`,
      path: mainPath,
    });
  }

  return findings;
}
