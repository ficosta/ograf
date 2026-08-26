/**
 * Encode a report into a URL fragment, and read one back.
 *
 * The point is to let someone hand a colleague the exact report they are
 * looking at — "here, this is what the checker says about your package" —
 * without either of them uploading anything. Neither our tool nor
 * StreamShapers' can do that today.
 *
 * The report lives in the fragment (`/check#r=…`), which browsers never send
 * to a server. Combined with the site being static, that means a shared report
 * is readable by whoever holds the link and by nobody else — no storage, no
 * account, nothing to leak later.
 *
 * The payload is deflated with the platform's own CompressionStream and
 * base64url-encoded. Findings compress extremely well (repeated ids, repeated
 * category names, long shared message prefixes), so a typical report lands far
 * under the practical URL ceiling.
 */

import type { Report } from "./types";

/** Practical ceiling. Browsers and chat clients start mangling links past this. */
export const MAX_SHARE_BYTES = 8_000;

const PREFIX = "r=";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const blob = new Blob([bytes as BlobPart]);
  const piped = blob.stream().pipeThrough(stream as ReadableWritablePair<Uint8Array, Uint8Array>);
  const buf = await new Response(piped).arrayBuffer();
  return new Uint8Array(buf);
}

/** True when the browser can do this at all. Safari gained it in 16.4. */
export function canShare(): boolean {
  return typeof CompressionStream !== "undefined" && typeof DecompressionStream !== "undefined";
}

/**
 * Returns the fragment for a report, or null when the result would be too long
 * to survive being pasted somewhere. The caller falls back to the .md download.
 */
export async function encodeReport(report: Report): Promise<string | null> {
  if (!canShare()) return null;
  const json = new TextEncoder().encode(JSON.stringify(report));
  const deflated = await pipe(json, new CompressionStream("deflate-raw"));
  const encoded = PREFIX + toBase64Url(deflated);
  return encoded.length > MAX_SHARE_BYTES ? null : encoded;
}

/** Read a report back out of `location.hash`. Returns null when there isn't one. */
export async function decodeReport(hash: string): Promise<Report | null> {
  const raw = hash.replace(/^#/, "");
  if (!raw.startsWith(PREFIX) || !canShare()) return null;
  try {
    const deflated = fromBase64Url(raw.slice(PREFIX.length));
    const json = await pipe(deflated, new DecompressionStream("deflate-raw"));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(json));
    // A hand-edited fragment must not crash the page.
    if (!parsed || typeof parsed !== "object") return null;
    const r = parsed as Partial<Report>;
    if (!Array.isArray(r.findings) || typeof r.summary !== "object") return null;
    return r as Report;
  } catch {
    return null;
  }
}
