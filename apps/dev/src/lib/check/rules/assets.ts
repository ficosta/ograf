import type { Finding, Pkg } from "../types";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "avif", "gif"]);
const FONT_EXTENSIONS = new Set(["woff2", "woff", "ttf", "otf"]);

function ext(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot + 1).toLowerCase();
}

/** PNG size extractor — reads width (bytes 16-19) + height (bytes 20-23). */
function readPngSize(bytes: Uint8Array): { w: number; h: number } | null {
  if (bytes.byteLength < 24) return null;
  // PNG signature
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (bytes[i] !== sig[i]) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { w: view.getUint32(16), h: view.getUint32(20) };
}

/** JPEG size extractor — walks SOF0/SOF2 markers. */
function readJpegSize(bytes: Uint8Array): { w: number; h: number } | null {
  if (bytes.byteLength < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset < bytes.byteLength) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker >= 0xc0 && marker <= 0xc3) {
      if (offset + 7 > bytes.byteLength) return null;
      const h = (bytes[offset + 3] << 8) | bytes[offset + 4];
      const w = (bytes[offset + 5] << 8) | bytes[offset + 6];
      return { w, h };
    }
    const segLen = (bytes[offset] << 8) | bytes[offset + 1];
    if (segLen < 2) return null;
    offset += segLen;
  }
  return null;
}

/** WebP size extractor — VP8L / VP8X common formats. */
function readWebpSize(bytes: Uint8Array): { w: number; h: number } | null {
  if (bytes.byteLength < 30) return null;
  const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  if (header !== "RIFF") return null;
  const fourcc = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (fourcc === "VP8 ") {
    if (bytes.byteLength < 30) return null;
    const w = view.getUint16(26, true) & 0x3fff;
    const h = view.getUint16(28, true) & 0x3fff;
    return { w, h };
  }
  if (fourcc === "VP8L") {
    if (bytes.byteLength < 25) return null;
    const b0 = bytes[21], b1 = bytes[22], b2 = bytes[23], b3 = bytes[24];
    const w = 1 + (((b1 & 0x3f) << 8) | b0);
    const h = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    return { w, h };
  }
  if (fourcc === "VP8X") {
    if (bytes.byteLength < 30) return null;
    const w = 1 + ((bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) & 0xffffff);
    const h = 1 + ((bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) & 0xffffff);
    return { w, h };
  }
  return null;
}

function readImageSize(path: string, bytes: Uint8Array): { w: number; h: number } | null {
  const e = ext(path);
  if (e === "png") return readPngSize(bytes);
  if (e === "jpg" || e === "jpeg") return readJpegSize(bytes);
  if (e === "webp") return readWebpSize(bytes);
  return null;
}

function aspectClose(w: number, h: number, target: number, tolerance: number): boolean {
  const actual = w / h;
  return Math.abs(actual - target) / target <= tolerance;
}

export function checkAssets(pkg: Pkg): readonly Finding[] {
  const findings: Finding[] = [];

  // A-01 / A-02 / A-04: preview image checks
  const previewPath = Array.from(pkg.files.keys()).find((p) =>
    /^(preview|thumbnail)\.(png|jpe?g|webp)$/i.test(p)
  );
  if (previewPath) {
    const bytes = pkg.files.get(previewPath);
    if (bytes) {
      const size = readImageSize(previewPath, bytes);
      if (size && !aspectClose(size.w, size.h, 16 / 9, 0.05)) {
        findings.push({
          id: "A-01",
          category: "assets",
          severity: "warning",
          title: "Preview image is not 16:9",
          message: `${previewPath} is ${size.w}×${size.h}. Broadcast graphics are almost always 16:9; consider exporting a 1920×1080 or 1280×720 preview so galleries don't letterbox it.`,
          path: previewPath,
        });
      } else if (size) {
        findings.push({
          id: "A-01",
          category: "assets",
          severity: "pass",
          title: "Preview image is 16:9",
          message: `${size.w}×${size.h}.`,
          path: previewPath,
        });
      }

      if (bytes.byteLength > 500_000) {
        findings.push({
          id: "A-02",
          category: "assets",
          severity: "info",
          title: "Preview image larger than 500 KB",
          message: `${previewPath} is ${(bytes.byteLength / 1000).toFixed(0)} KB. Galleries often lazy-load these — compressing will speed up load time.`,
          path: previewPath,
        });
      }

      if (previewPath.toLowerCase().endsWith(".png") && bytes.byteLength > 100_000) {
        findings.push({
          id: "A-04",
          category: "assets",
          severity: "info",
          title: "Consider WebP for the preview",
          message: `WebP is typically 60-80 % smaller than PNG for photographic content. Swap ${previewPath} for a ${previewPath.replace(/\.png$/i, ".webp")} to shrink the package.`,
          path: previewPath,
        });
      }
    }
  }

  // A-03: fonts without licence
  const fontPaths = Array.from(pkg.files.keys()).filter(
    (p) => p.startsWith("fonts/") && FONT_EXTENSIONS.has(ext(p))
  );
  if (fontPaths.length > 0) {
    const licenceNear = Array.from(pkg.files.keys()).some(
      (p) => p.startsWith("fonts/") && /license/i.test(p)
    );
    if (!licenceNear) {
      findings.push({
        id: "A-03",
        category: "assets",
        severity: "warning",
        title: "Shipped font has no licence file",
        message: `The package ships ${fontPaths.length} font file${fontPaths.length === 1 ? "" : "s"} under fonts/ with no accompanying licence. Most open-source fonts (SIL OFL, Apache) require the licence to travel with the font.`,
      });
    } else {
      findings.push({
        id: "A-03",
        category: "assets",
        severity: "pass",
        title: "Font files are accompanied by a licence",
        message: `Detected fonts/ with a licence file — ${fontPaths.length} font${fontPaths.length === 1 ? "" : "s"} shipped.`,
      });
    }
  }

  // A-05: unrecognised binary extensions
  const knownBinary = new Set([...IMAGE_EXTENSIONS, ...FONT_EXTENSIONS, "mp4", "webm", "wav", "mp3", "svg", "gltf", "glb"]);
  const knownText = new Set(["json", "mjs", "js", "cjs", "css", "html", "htm", "md", "txt", "xml", "yaml", "yml"]);
  for (const [path] of pkg.files) {
    const e = ext(path);
    if (!e) continue;
    if (knownBinary.has(e) || knownText.has(e)) continue;
    findings.push({
      id: "A-05",
      category: "assets",
      severity: "info",
      title: `Unrecognised file extension: .${e}`,
      message: `\`${path}\` has a file extension that is not typical for broadcast graphic packages. Double-check it is actually needed.`,
      path,
    });
  }

  return findings;
}
