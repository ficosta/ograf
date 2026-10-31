/**
 * Shared types for the Template Generator.
 *
 * The generator takes one of the hand-made tutorial templates under
 * /templates/<slug>/ as a base and applies a small, declarative set of edits
 * (see presets.ts) to produce a new, spec-valid OGraf package. Everything in
 * here is plain data so the same code runs in the page and in the node
 * self-test.
 */

export const PRESET_SLUGS = [
  "lower-third",
  "bug",
  "ticker",
  "quote",
  "score-bug",
  "countdown",
  "breaking-news",
  "election-bars",
  "sport-lineup",
  "social-card",
  "weather",
] as const;

export type PresetSlug = (typeof PRESET_SLUGS)[number];

export const COLOR_KNOB_IDS = [
  "accent",
  "ink",
  "surface",
  "live",
  "alert",
  "urgent",
  "backdrop",
  "overlay",
] as const;

export type ColorKnobId = (typeof COLOR_KNOB_IDS)[number];

export const OFFSET_KNOB_IDS = ["offsetX", "offsetY"] as const;
export type OffsetKnobId = (typeof OFFSET_KNOB_IDS)[number];

export const FONT_CHOICE_IDS = ["inter", "instrument-serif", "system"] as const;
export type FontChoiceId = (typeof FONT_CHOICE_IDS)[number];

/** One colour the user can change, and every place in the base CSS it lives. */
export interface ColorKnob {
  readonly id: ColorKnobId;
  /** The colour as the base template ships it, "#rrggbb". */
  readonly default: string;
  /** Exact hex literals in the base CSS that become `var(--og-<id>)`. */
  readonly literals: readonly string[];
  /** "rgba(255, 255, 255," prefixes that become "rgba(var(--og-<id>-rgb),". */
  readonly rgbaPrefixes?: readonly string[];
  /**
   * Shades the base CSS derives from this colour (gradient ends, hover tints).
   * They keep their original value while the knob is untouched and are
   * recomputed from the new colour once it changes.
   */
  readonly shades?: { readonly dark?: string; readonly light?: string };
  /** Whole declarations to swap, for keywords like `background: white;`. */
  readonly declarations?: readonly { readonly from: string; readonly to: string }[];
}

/** A pixel offset of the graphic from a screen edge. */
export interface OffsetKnob {
  readonly id: OffsetKnobId;
  /** The rule the declaration lives in, e.g. ".l3rd". */
  readonly selector: string;
  /** Properties set to the same value, e.g. ["left", "right"]. */
  readonly props: readonly string[];
  readonly default: number;
}

export interface PresetFontFile {
  /** Path inside the package, e.g. "fonts/Inter-Variable.woff2". */
  readonly path: string;
  /** Where to fetch it from on ograf.dev. */
  readonly src: string;
}

export interface PresetDef {
  readonly slug: PresetSlug;
  /** The tutorial route whose localized title and description describe it. */
  readonly tutorialSlug: string;
  /** Selector the theme tokens are declared on; the graphic's outermost element. */
  readonly rootSelector: string;
  readonly colors: readonly ColorKnob[];
  readonly offsets: readonly OffsetKnob[];
  /** Fonts the preset needs regardless of the chosen body font (display faces). */
  readonly requiredFonts: readonly PresetFontFile[];
  /** Which knob to show first in the UI and use for the gallery swatch. */
  readonly primaryColor: ColorKnobId;
}

export interface FontChoice {
  readonly id: FontChoiceId;
  /** CSS family name, or null for the renderer's system UI font. */
  readonly family: string | null;
  readonly files: readonly PresetFontFile[];
  /** The @font-face block(s) that make `family` resolve offline. */
  readonly faceCss: string;
}

/** Everything the user can change. Immutable; the page replaces it wholesale. */
export interface GeneratorConfig {
  readonly preset: PresetSlug;
  readonly name: string;
  readonly id: string;
  readonly description: string;
  readonly version: string;
  readonly authorName: string;
  readonly authorUrl: string;
  readonly colors: Readonly<Partial<Record<ColorKnobId, string>>>;
  readonly font: FontChoiceId;
  readonly offsets: Readonly<Partial<Record<OffsetKnobId, number>>>;
  /** Default operator data, written back into the manifest schema. */
  readonly data: Readonly<Record<string, unknown>>;
}

export type ManifestJson = Readonly<Record<string, unknown>>;

/** The base template's files, fetched once per preset. */
export interface PresetSources {
  readonly slug: PresetSlug;
  readonly manifest: ManifestJson;
  readonly module: string;
  readonly css: string;
  readonly thumbnail: Uint8Array;
  readonly license: string;
  /** Required display fonts (path → bytes). */
  readonly fonts: ReadonlyMap<string, Uint8Array>;
}

export interface GeneratedFile {
  readonly path: string;
  readonly bytes: Uint8Array;
  /** Present for text files so the UI can show them without decoding. */
  readonly text?: string;
}

export interface GeneratedPackage {
  /** Folder name inside the zip and the zip's own name. */
  readonly slug: string;
  readonly manifestPath: string;
  readonly manifest: ManifestJson;
  readonly files: readonly GeneratedFile[];
}

export type FieldId =
  | "name"
  | "id"
  | "version"
  | "description"
  | "authorName"
  | "authorUrl"
  | `color.${ColorKnobId}`
  | `offset.${OffsetKnobId}`;

export type IssueCode =
  | "nameRequired"
  | "nameTooLong"
  | "idRequired"
  | "idSlash"
  | "idWhitespace"
  | "idNotReverseDns"
  | "versionRequired"
  | "versionNotSemver"
  | "authorUrlInvalid"
  | "authorNameRequiredWithUrl"
  | "colorInvalid"
  | "offsetRange";

export interface FieldIssue {
  readonly field: FieldId;
  readonly severity: "error" | "warning";
  readonly code: IssueCode;
}
