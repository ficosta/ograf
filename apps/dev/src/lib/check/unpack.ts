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
  const raw: RawEntry[] = [];
  for (const entry of entries) {
    raw.push({ path: entry.name, bytes: () => entry.async("uint8array").then((b) => new Uint8Array(b)) });
  }
  return buildPkg(raw, file.name, file.size);
}

/**
 * Build a package from a folder the user picked, rather than a zip.
 *
 * StreamShapers' validator can only do this in Chromium, because it uses the
 * File System Access API. `webkitdirectory` is older, uglier and works
 * everywhere, which matters more for a tool whose whole point is that anyone
 * can check a package.
 */
export async function unpackFiles(fileList: readonly File[]): Promise<Pkg> {
  const raw: RawEntry[] = fileList.map((f) => ({
    // webkitRelativePath is "<picked folder>/a/b.css"; plain drops have none.
    path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
    bytes: async () => new Uint8Array(await f.arrayBuffer()),
  }));
  const total = fileList.reduce((n, f) => n + f.size, 0);
  const name = raw[0]?.path.split("/")[0] ?? "folder";
  return buildPkg(raw, name, total);
}

interface RawEntry {
  readonly path: string;
  readonly bytes: () => Promise<Uint8Array>;
}

/** Shared by both entry points, so a folder and a zip are checked identically. */
async function buildPkg(entries: readonly RawEntry[], sourceName: string, sourceSize: number): Promise<Pkg> {
  const rootFolder = detectRootFolder(entries.map((e) => e.path));

  const files = new Map<string, Uint8Array>();
  const texts = new Map<string, string>();
  let hasHiddenFiles = false;

  for (const entry of entries) {
    if (isHidden(entry.path)) {
      hasHiddenFiles = true;
      continue;
    }
    const relPath = stripRoot(entry.path, rootFolder);
    if (!relPath) continue;

    const bytes = await entry.bytes();
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
    zipName: sourceName,
    zipSize: sourceSize,
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
  // Last resort: a JSON file that looks like an OGraf manifest but is named
  // wrongly. Reporting "rename this to <name>.ograf.json" is far more use to
  // the author than "no manifest found", which is what they used to get.
  for (const [path, text] of texts) {
    if (!path.endsWith(".json")) continue;
    if (looksLikeManifest(text)) return path;
  }
  return null;
}

/** Cheap structural sniff — enough to tell a manifest from any other JSON. */
function looksLikeManifest(text: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return false;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return false;
  const o = parsed as Record<string, unknown>;
  const schemaLooksOgraf = typeof o.$schema === "string" && o.$schema.includes("ograf");
  const hasCoreFields =
    typeof o.id === "string" && typeof o.name === "string" && typeof o.main === "string";
  return schemaLooksOgraf || hasCoreFields;
}
