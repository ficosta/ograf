import JSZip from "jszip";
import type { Pkg } from "./types";

const TEXT_EXTENSIONS = new Set([
  "json", "mjs", "js", "cjs", "css", "html", "htm", "md", "txt",
  "svg", "xml", "ts", "tsx", "yaml", "yml",
]);

const HIDDEN_PATTERNS = [/(^|\/)\.DS_Store$/, /(^|\/)__MACOSX\//, /(^|\/)Thumbs\.db$/i];

function isHidden(path: string): boolean {
  return HIDDEN_PATTERNS.some((r) => r.test(path));
}

function extension(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot + 1).toLowerCase();
}

/**
 * Computes the single top-level folder that wraps the package, if any.
 * Returns "" when the package is at the archive root.
 */
function detectRootFolder(paths: readonly string[]): string {
  const first = paths[0]?.split("/")[0] ?? "";
  if (!first) return "";
  return paths.every((p) => p === first || p.startsWith(`${first}/`)) ? first : "";
}

function stripRoot(path: string, root: string): string {
  if (!root) return path;
  if (path === root) return "";
  return path.startsWith(`${root}/`) ? path.slice(root.length + 1) : path;
}

/**
 * Unpacks a `.zip` File into an in-memory package representation used by
 * every rule. Text files are decoded into utf-8 strings; binary bytes are
 * preserved alongside so image/font/size checks can inspect them.
 */
export async function unpack(file: File): Promise<Pkg> {
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);

  const entries = Object.values(zip.files).filter((e) => !e.dir);
  const allPaths = entries.map((e) => e.name);
  const rootFolder = detectRootFolder(allPaths);

  const files = new Map<string, Uint8Array>();
  const texts = new Map<string, string>();
  let hasHiddenFiles = false;

  for (const entry of entries) {
    if (isHidden(entry.name)) {
      hasHiddenFiles = true;
      continue;
    }
    const relPath = stripRoot(entry.name, rootFolder);
    if (!relPath) continue;

    const bytes = new Uint8Array(await entry.async("uint8array"));
    files.set(relPath, bytes);

    if (TEXT_EXTENSIONS.has(extension(relPath)) && bytes.byteLength < 1_000_000) {
      texts.set(relPath, new TextDecoder("utf-8", { fatal: false }).decode(bytes));
    }
  }

  const manifestPath = findManifestPath(texts);
  const manifestRaw = manifestPath ? texts.get(manifestPath) ?? null : null;
  let manifest: unknown = null;
  if (manifestRaw) {
    try {
      manifest = JSON.parse(manifestRaw);
    } catch {
      manifest = null;
    }
  }

  const mainFromManifest =
    manifest && typeof manifest === "object" && manifest !== null &&
    typeof (manifest as { main?: unknown }).main === "string"
      ? (manifest as { main: string }).main
      : null;

  return {
    zipName: file.name,
    zipSize: file.size,
    rootFolder,
    files,
    texts,
    manifestPath,
    manifestRaw,
    manifest,
    mainPath: mainFromManifest,
    hasHiddenFiles,
  };
}

function findManifestPath(texts: ReadonlyMap<string, string>): string | null {
  // Prefer a file literally named "<something>.ograf.json" at the root.
  for (const path of texts.keys()) {
    if (!path.includes("/") && path.endsWith(".ograf.json")) return path;
  }
  // Fallback: any .ograf.json anywhere (first match).
  for (const path of texts.keys()) {
    if (path.endsWith(".ograf.json")) return path;
  }
  return null;
}
