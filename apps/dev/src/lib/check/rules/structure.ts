import type { Finding, Pkg } from "../types";

const PREVIEW_CANDIDATES = [
  "preview.png", "preview.webp", "preview.jpg", "preview.jpeg",
  "thumbnail.png", "thumbnail.webp", "thumbnail.jpg", "thumbnail.jpeg",
];

const LICENSE_CANDIDATES = ["LICENSE", "LICENSE.txt", "LICENSE.md", "license", "license.txt", "license.md"];
const README_CANDIDATES = ["README.md", "README", "readme.md"];
const FONT_EXTENSIONS = new Set(["woff2", "woff", "ttf", "otf"]);

function ext(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot + 1).toLowerCase();
}

function hasAny(files: ReadonlyMap<string, Uint8Array>, candidates: readonly string[]): string | null {
  for (const c of candidates) {
    if (files.has(c)) return c;
  }
  return null;
}

export function checkStructure(pkg: Pkg): readonly Finding[] {
  const findings: Finding[] = [];

  // S-01: single top-level folder
  if (!pkg.rootFolder) {
    findings.push({
      id: "S-01",
      category: "structure",
      severity: "warning",
      title: "No single top-level folder",
      message:
        "The zip extracts its files directly to the current directory. Wrapping them in a folder named after your package (e.g. `bug/`) is friendlier for operators who unzip it.",
    });
  } else {
    findings.push({
      id: "S-01",
      category: "structure",
      severity: "pass",
      title: "Wrapped in a top-level folder",
      message: `All files sit inside \`${pkg.rootFolder}/\`.`,
    });
  }

  // S-02: main module present (also covered by M-08; kept for structure-level visibility)
  const mainPath = pkg.mainPath;
  if (!mainPath) {
    findings.push({
      id: "S-02",
      category: "structure",
      severity: "warning",
      title: "Main module not declared",
      message: "The manifest does not declare a `main` entry, so we cannot locate the graphic module.",
    });
  } else if (!pkg.files.has(mainPath)) {
    findings.push({
      id: "S-02",
      category: "structure",
      severity: "error",
      title: "Main module file missing",
      message: `The manifest's \`main\` points at "${mainPath}" but the file is not inside the package.`,
    });
  } else {
    findings.push({
      id: "S-02",
      category: "structure",
      severity: "pass",
      title: "Main module present",
      message: `Found ${mainPath}.`,
    });
  }

  // S-03: if graphic.mjs links to a stylesheet via relative path, the file should exist
  if (mainPath && pkg.texts.has(mainPath)) {
    const moduleText = pkg.texts.get(mainPath) ?? "";
    const relLinks = Array.from(moduleText.matchAll(/(?:href|from|url)\(?['"`]\s*\.\/([^'"`)]+)/g))
      .map((m) => m[1])
      .filter((p) => /\.(css|woff2?|ttf|otf|png|jpe?g|webp|svg|mp4|webm)$/i.test(p));
    const missing = Array.from(new Set(relLinks)).filter((p) => !pkg.files.has(p));
    if (missing.length > 0) {
      findings.push({
        id: "S-03",
        category: "structure",
        severity: "warning",
        title: "Referenced asset not in package",
        message: `graphic.mjs references \`./${missing.join(", ./")}\` but ${missing.length === 1 ? "it is" : "they are"} not inside the package.`,
        path: mainPath,
      });
    }
  }

  // S-04: README
  const readme = hasAny(pkg.files, README_CANDIDATES);
  if (readme) {
    findings.push({
      id: "S-04",
      category: "structure",
      severity: "pass",
      title: "README present",
      message: `Found ${readme}.`,
    });
  } else {
    findings.push({
      id: "S-04",
      category: "structure",
      severity: "warning",
      title: "No README.md",
      message: "Ship a short README so anyone who unzips the package can read how to use it without a tutorial page.",
    });
  }

  // S-05: LICENSE at root
  const license = hasAny(pkg.files, LICENSE_CANDIDATES);
  if (!license) {
    findings.push({
      id: "S-05",
      category: "structure",
      severity: "info",
      title: "No LICENSE file at root",
      message: "Declaring a package-level licence reduces ambiguity for downstream users. Even a one-line `LICENSE` with `MIT` is better than nothing.",
    });
  }

  // S-06: thumbnail/preview image (optional — purely a nice-to-have)
  const preview = hasAny(pkg.files, PREVIEW_CANDIDATES);
  if (!preview) {
    findings.push({
      id: "S-06",
      category: "structure",
      severity: "info",
      title: "Optional — no preview image",
      message:
        "Optional. Shipping a `preview.png` or `preview.webp` (16:9) alongside the manifest lets galleries show a static preview without running the graphic.",
    });
  } else {
    findings.push({
      id: "S-06",
      category: "structure",
      severity: "pass",
      title: "Preview image present",
      message: `Found ${preview}.`,
    });
  }

  // S-07: fonts dir has a LICENSE
  const fontPaths = Array.from(pkg.files.keys()).filter(
    (p) => p.startsWith("fonts/") && FONT_EXTENSIONS.has(ext(p))
  );
  if (fontPaths.length > 0) {
    const licenseInFonts = Array.from(pkg.files.keys()).some(
      (p) => p.startsWith("fonts/") && /license/i.test(p)
    );
    if (!licenseInFonts) {
      findings.push({
        id: "S-07",
        category: "structure",
        severity: "warning",
        title: "Fonts shipped without a licence file",
        message:
          "Most open-source fonts (OFL, Apache, etc.) require the license text to travel with the font files. Add `fonts/LICENSE.txt`.",
      });
    } else {
      findings.push({
        id: "S-07",
        category: "structure",
        severity: "pass",
        title: "Font licence present",
        message: `Found a license file inside fonts/.`,
      });
    }
  }

  // S-08: hidden/garbage OS files
  if (pkg.hasHiddenFiles) {
    findings.push({
      id: "S-08",
      category: "structure",
      severity: "info",
      title: "OS-generated files inside the zip",
      message: "The package contains `.DS_Store`, `__MACOSX/`, or similar. They're harmless but bloat the archive — add them to your .gitignore and re-zip.",
    });
  }

  // S-09: large files
  const LARGE = 1_000_000;
  for (const [path, bytes] of pkg.files) {
    if (bytes.byteLength > LARGE) {
      findings.push({
        id: "S-09",
        category: "structure",
        severity: "info",
        title: `Large file: ${path}`,
        message: `${(bytes.byteLength / 1_000_000).toFixed(2)} MB. Consider compressing or ranges ticketing for very large assets.`,
        path,
      });
    }
  }

  return findings;
}
