import { presetDef } from "./presets";
import type { ColorKnobId, GeneratorConfig, ManifestJson, OffsetKnobId, PresetSlug } from "./types";

/** Walk `manifest.schema.properties` and collect every `default`. */
export function extractDefaultData(manifest: ManifestJson): Record<string, unknown> {
  const schema = manifest.schema;
  if (!schema || typeof schema !== "object") return {};
  const props = (schema as { properties?: unknown }).properties;
  if (!props || typeof props !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(props as Record<string, unknown>)) {
    if (def && typeof def === "object" && "default" in def) {
      out[key] = (def as { default: unknown }).default;
    }
  }
  return out;
}

/** The customActions a preset declares, for the preview's buttons. */
export function extractCustomActions(manifest: ManifestJson): readonly { readonly id: string; readonly name: string }[] {
  const arr = manifest.customActions;
  if (!Array.isArray(arr)) return [];
  return arr.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const { id, name } = entry as { id?: unknown; name?: unknown };
    if (typeof id !== "string" || !id) return [];
    return [{ id, name: typeof name === "string" ? name : id }];
  });
}

export function extractStepCount(manifest: ManifestJson): number {
  return typeof manifest.stepCount === "number" ? manifest.stepCount : 1;
}

/**
 * "CBS-Style Lower Third" → "cbs-style-lower-third". Diacritics are folded so
 * a Portuguese or Spanish name still yields an ASCII folder name.
 */
export function kebab(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "https://www.acme.tv/graphics" → "tv.acme"; anything unparsable → null. */
export function reverseDomain(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const parts = host.split(".").filter(Boolean);
    if (parts.length < 2) return null;
    return parts.reverse().join(".");
  } catch {
    return null;
  }
}

/** The reverse-DNS id the form suggests until the user edits it by hand. */
export function deriveId(name: string, authorUrl: string, preset: PresetSlug): string {
  const prefix = reverseDomain(authorUrl) ?? "com.example";
  return `${prefix}.${kebab(name) || preset}`;
}

/** The base template's description without the sentence that says it is a tutorial. */
function stripTutorialSentence(description: unknown): string {
  if (typeof description !== "string") return "";
  return description
    .split(/(?<=\.)\s+/)
    .filter((sentence) => !/ograf\.dev/i.test(sentence))
    .join(" ")
    .trim();
}

/** A fresh configuration for a preset, seeded from its base manifest. */
export function defaultConfig(preset: PresetSlug, manifest: ManifestJson): GeneratorConfig {
  const def = presetDef(preset);
  const name = typeof manifest.name === "string" ? manifest.name : preset;
  const colors: Partial<Record<ColorKnobId, string>> = {};
  for (const knob of def.colors) colors[knob.id] = knob.default;
  const offsets: Partial<Record<OffsetKnobId, number>> = {};
  for (const knob of def.offsets) offsets[knob.id] = knob.default;
  return {
    preset,
    name,
    id: deriveId(name, "", preset),
    description: stripTutorialSentence(manifest.description),
    version: "1.0.0",
    authorName: "",
    authorUrl: "",
    colors,
    font: "inter",
    offsets,
    data: extractDefaultData(manifest),
  };
}
