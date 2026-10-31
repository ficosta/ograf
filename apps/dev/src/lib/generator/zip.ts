import JSZip from "jszip";
import type { GeneratedPackage } from "./types";

/**
 * The download: one top-level folder named after the package, exactly the
 * layout scripts/gen-template-zips.mjs produces for the tutorial downloads.
 */
export async function packageToZipBytes(pkg: GeneratedPackage): Promise<Uint8Array<ArrayBuffer>> {
  const zip = new JSZip();
  const root = zip.folder(pkg.slug);
  if (!root) throw new Error("could not create the zip root folder");
  for (const file of pkg.files) root.file(file.path, file.bytes, { binary: true });
  const out = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } });
  return new Uint8Array(out);
}

export function zipFileName(pkg: GeneratedPackage): string {
  return `${pkg.slug}.zip`;
}

/** As a File, which is what the Package Checker's runChecks() accepts. */
export async function packageToZipFile(pkg: GeneratedPackage): Promise<File> {
  const bytes = await packageToZipBytes(pkg);
  return new File([bytes], zipFileName(pkg), { type: "application/zip" });
}
