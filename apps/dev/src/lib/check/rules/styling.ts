import type { Finding, Pkg } from "../types";

const STYLE_EXTENSIONS = ["css"];

export function checkStyling(pkg: Pkg): readonly Finding[] {
  const findings: Finding[] = [];

  const styleEntries: [string, string][] = [];
  for (const [path, text] of pkg.texts) {
    if (STYLE_EXTENSIONS.some((e) => path.endsWith(`.${e}`))) {
      styleEntries.push([path, text]);
    }
  }

  // Also scan <style> blocks embedded inside the main module, if any.
  if (pkg.mainPath && pkg.texts.has(pkg.mainPath)) {
    const source = pkg.texts.get(pkg.mainPath) ?? "";
    const embedded = Array.from(source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g));
    for (let i = 0; i < embedded.length; i++) {
      styleEntries.push([`${pkg.mainPath} (inline <style> #${i + 1})`, embedded[i][1]]);
    }
  }

  if (styleEntries.length === 0) {
    findings.push({
      id: "X-00",
      category: "styling",
      severity: "info",
      title: "No stylesheet found",
      message:
        "The package does not ship a style.css or inline <style> block. If your graphic uses element.style.* assignments in JavaScript instead, that's fine; if not, you probably want to add a stylesheet.",
    });
    return findings;
  }

  for (const [path, css] of styleEntries) {
    // X-01: position: fixed
    if (/\bposition\s*:\s*fixed\b/i.test(css)) {
      findings.push({
        id: "X-01",
        category: "styling",
        severity: "warning",
        title: "`position: fixed` used",
        message:
          "Inside a renderer iframe or shadow root, `position: fixed` can escape to the browser viewport rather than the graphic's render area. Use `position: absolute` anchored to a parent that fills the area.",
        path,
        specRef: "/spec#lifecycle",
      });
    }

    // X-02: remote @import
    const remoteImport = /@import\s+url\(\s*['"]?(https?:)?\/\//i.exec(css);
    if (remoteImport) {
      findings.push({
        id: "X-02",
        category: "styling",
        severity: "warning",
        title: "Remote @import in CSS",
        message:
          "Playout boxes often block outbound requests (CSP, air-gapped networks). Host the stylesheet inside the package instead of `@import`-ing from a remote URL.",
        path,
      });
    }

    // X-03: remote @font-face
    const remoteFont = /@font-face\s*\{[^}]*src\s*:\s*url\(\s*['"]?https?:/i.exec(css);
    if (remoteFont) {
      findings.push({
        id: "X-03",
        category: "styling",
        severity: "warning",
        title: "Remote font loaded in @font-face",
        message:
          "Bundle the font files inside the package (e.g. `fonts/Inter-Regular.woff2`) and reference them with a relative URL — that works offline and avoids CDN lookups on-air.",
        path,
      });
    }

    // X-04: body { ... } rules
    if (/\bbody\s*\{/i.test(css)) {
      findings.push({
        id: "X-04",
        category: "styling",
        severity: "warning",
        title: "`body` selector in stylesheet",
        message:
          "A renderer may mount your graphic inside a shadow root or a positioned container — there is no guarantee the graphic owns the body. Scope rules to the graphic's own root instead.",
        path,
      });
    }

    // X-05: font-family fallback
    const fontFamilies = Array.from(css.matchAll(/font-family\s*:\s*([^;]+);/gi)).map((m) => m[1].trim());
    for (const decl of fontFamilies) {
      if (!/(sans-serif|serif|monospace|system-ui|ui-sans-serif|ui-serif|ui-monospace)\s*;?\s*$/i.test(decl + ";")) {
        findings.push({
          id: "X-05",
          category: "styling",
          severity: "warning",
          title: "font-family without a generic fallback",
          message: `\`font-family: ${decl}\` has no generic family (sans-serif, serif, monospace). If the custom font fails to load the browser falls back to its default, which may not look right.`,
          path,
        });
        break; // one finding per stylesheet is enough
      }
    }

    // X-06: !important
    if (/!\s*important/.test(css)) {
      findings.push({
        id: "X-06",
        category: "styling",
        severity: "info",
        title: "`!important` used in stylesheet",
        message:
          "An OGraf graphic runs in its own scoped environment — `!important` is usually a sign of fighting with global styles that don't exist here. Consider removing.",
        path,
      });
    }

    // X-07: no explicit positioning at all
    if (!/position\s*:\s*(absolute|relative|fixed)/i.test(css)) {
      findings.push({
        id: "X-07",
        category: "styling",
        severity: "info",
        title: "No positioned elements",
        message:
          "The stylesheet declares no `position` on any element. Most broadcast graphics want `position: absolute` on their root so they anchor predictably inside the renderer's container.",
        path,
      });
    }

    // X-08: @font-face portability (Shadow DOM quirk)
    // Declaring @font-face inside a stylesheet that gets injected into a
    // Shadow DOM is browser-inconsistent. A graphic that looks fine in an
    // iframe can fail to load the font inside Shadow DOM.
    if (/@font-face\s*\{/i.test(css)) {
      findings.push({
        id: "X-08",
        category: "styling",
        severity: "info",
        title: "@font-face portability across mount models",
        message:
          "`@font-face` works reliably in an iframe-mounted graphic but is known to be cross-browser flaky inside Shadow DOM (Chrome/Firefox/Safari implement scoping differently). If portability matters, load the font via a `<link rel=\"stylesheet\">` to a separate CSS file, or inject the `@font-face` rule into `document.head` from your module so it lives in global scope.",
        path,
      });
    }

    // X-09: relative @import — resolves differently depending on the mount
    if (/@import\s+(?:url\(\s*)?['"]\.\//i.test(css)) {
      findings.push({
        id: "X-09",
        category: "styling",
        severity: "info",
        title: "Relative @import in CSS",
        message:
          "A relative `@import` resolves against the importing stylesheet's URL. That works if the stylesheet was loaded via `<link>` but not if its contents were inlined into a Shadow DOM. Safer to inline all rules in a single stylesheet or use absolute URLs.",
        path,
      });
    }
  }

  return findings;
}
