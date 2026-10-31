import { presetDef } from "./presets";
import type { FontChoice, ManifestJson, PresetSlug, PresetSources } from "./types";

/**
 * Loading the base template files. The fetcher is injected so the page uses
 * `fetch` against /templates/… and the node self-test reads the same files
 * from apps/dev/public with `fs`.
 */
export interface SourceFetcher {
  readonly text: (url: string) => Promise<string>;
  readonly bytes: (url: string) => Promise<Uint8Array>;
}

export const browserFetcher: SourceFetcher = {
  async text(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.text();
  },
  async bytes(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return new Uint8Array(await res.arrayBuffer());
  },
};

export const TEMPLATES_LICENSE_URL = "/templates/LICENSE";

export async function loadPresetSources(slug: PresetSlug, fetcher: SourceFetcher = browserFetcher): Promise<PresetSources> {
  const def = presetDef(slug);
  const base = `/templates/${slug}`;
  const [manifestText, module, css, thumbnail, license, ...fontBytes] = await Promise.all([
    fetcher.text(`${base}/${slug}.ograf.json`),
    fetcher.text(`${base}/graphic.mjs`),
    fetcher.text(`${base}/style.css`),
    fetcher.bytes(`${base}/thumbnail.webp`),
    fetcher.text(TEMPLATES_LICENSE_URL),
    ...def.requiredFonts.map((f) => fetcher.bytes(f.src)),
  ]);
  const manifest = JSON.parse(manifestText) as ManifestJson;
  const fonts = new Map<string, Uint8Array>();
  def.requiredFonts.forEach((f, i) => {
    const bytes = fontBytes[i];
    if (bytes) fonts.set(f.path, bytes);
  });
  return { slug, manifest, module, css, thumbnail, license, fonts };
}

export async function loadFontFiles(
  choice: FontChoice,
  fetcher: SourceFetcher = browserFetcher,
): Promise<ReadonlyMap<string, Uint8Array>> {
  const entries = await Promise.all(choice.files.map(async (f) => [f.path, await fetcher.bytes(f.src)] as const));
  return new Map(entries);
}
