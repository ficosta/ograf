#!/usr/bin/env node
/**
 * Compose a multi-size favicon.ico from an array of PNG files.
 * Uses the PNG-embedded ICO variant, which all modern browsers support.
 *
 * Usage:
 *   node scripts/make-favicon-ico.mjs <out.ico> <png...>
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , outPath, ...pngPaths] = process.argv;
if (!outPath || pngPaths.length === 0) {
  console.error("usage: make-favicon-ico.mjs <out.ico> <png...>");
  process.exit(1);
}

function readPngSize(buf) {
  // PNG signature (8) + IHDR chunk: length(4) + type(4="IHDR") + width(4) + height(4)
  if (buf.slice(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error("not a PNG");
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

const images = pngPaths.map((p) => {
  const data = readFileSync(p);
  const { width, height } = readPngSize(data);
  return { path: p, data, width, height };
});

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type = ICO
header.writeUInt16LE(images.length, 4);

const DIR_ENTRY = 16;
let offset = 6 + images.length * DIR_ENTRY;
const entries = [];
const blobs = [];
for (const img of images) {
  const e = Buffer.alloc(DIR_ENTRY);
  e.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
  e.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // color planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(img.data.length, 8);
  e.writeUInt32LE(offset, 12);
  entries.push(e);
  blobs.push(img.data);
  offset += img.data.length;
}

writeFileSync(outPath, Buffer.concat([header, ...entries, ...blobs]));
console.log(`wrote ${outPath} (${images.length} sizes: ${images.map((i) => `${i.width}x${i.height}`).join(", ")})`);
