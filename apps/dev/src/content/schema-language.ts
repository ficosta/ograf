/**
 * Designer-friendly translation layer for the OGraf manifest schema.
 *
 * The Schema Explorer page reads the live EBU schema (or the bundled snapshot)
 * but renders it through this dictionary so designers see plain language
 * instead of JSON-Schema jargon (`$ref`, `oneOf`, `additionalProperties`...).
 *
 * GDD types are the canonical list from
 *   https://ograf.ebu.io/v1/specification/json-schemas/gdd/gdd-types.json
 * (single-line, multi-line, file-path, file-path/image-path, select,
 *  color-rrggbb, color-rrggbbaa, percentage, duration-ms).
 *
 * This file holds the language-neutral structure: keys, clusters, icons,
 * mocks and the JSON examples (code stays English). The prose — names,
 * descriptions, example labels — lives per locale in
 * `i18n/copy/schema-language/{en,pt,es}.ts`, typed by `SchemaLanguageText`,
 * so a missing field, type or example label is a type error.
 *
 * Add a new entry here when EBU adds a new field or gddType, then its text in
 * all three locale files.
 */

export interface ExampleJson {
  readonly label: string;
  readonly code: string;
}

export type FieldCluster =
  | "identity"
  | "behaviour"
  | "operator-data"
  | "custom-buttons"
  | "render-needs";

export interface FieldGuide {
  /** Schema property key — e.g. "id", "stepCount". Used as anchor id. */
  readonly key: string;
  /** Designer-facing label — e.g. "Unique ID", "Pages or stages". */
  readonly friendlyName: string;
  readonly cluster: FieldCluster;
  /** One-or-two-sentence plain-language description. */
  readonly description: string;
  /** Short example value rendered as a faint hint above the examples block. */
  readonly exampleValue?: string;
  /** Two or three labelled JSON snippets the designer can compare. */
  readonly examples?: readonly ExampleJson[];
}

export interface ClusterGuide {
  readonly id: FieldCluster;
  readonly title: string;
  readonly subtitle: string;
  /** Lucide icon name resolved by the page (kept as a string here so this
   * file has no React dependency). */
  readonly icon:
    | "Tag"
    | "Activity"
    | "ClipboardList"
    | "MousePointerClick"
    | "Tv";
  readonly tone: "blue" | "violet" | "emerald" | "amber" | "rose";
}

export type GddMockKind =
  | "single-line"
  | "multi-line"
  | "file-path"
  | "image-path"
  | "select"
  | "color-rrggbb"
  | "color-rrggbbaa"
  | "percentage"
  | "duration-ms";

export interface GddTypeGuide {
  /** Canonical gddType value. Slashes ('/') are slugified to '-' for anchors. */
  readonly gddType: string;
  readonly friendlyName: string;
  readonly description: string;
  readonly mock: GddMockKind;
  readonly icon:
    | "Type"
    | "AlignLeft"
    | "Pipette"
    | "Image"
    | "List"
    | "FolderOpen"
    | "Percent"
    | "Timer";
  readonly examples: readonly ExampleJson[];
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Structure
 * ──────────────────────────────────────────────────────────────────────────── */

const CLUSTER_DATA = [
  { id: "identity", icon: "Tag", tone: "blue" },
  { id: "behaviour", icon: "Activity", tone: "violet" },
  { id: "operator-data", icon: "ClipboardList", tone: "emerald" },
  { id: "custom-buttons", icon: "MousePointerClick", tone: "amber" },
  { id: "render-needs", icon: "Tv", tone: "rose" },
] as const satisfies readonly Omit<ClusterGuide, "title" | "subtitle">[];

interface FieldData {
  readonly key: string;
  readonly cluster: FieldCluster;
  /** Literal manifest value — not translated. Locale text may override it. */
  readonly exampleValue?: string;
  /** JSON snippets; each needs a label in every locale. */
  readonly codes: readonly string[];
}

const FIELD_DATA = [
  // ── Identity ────────────────────────────────────────────────────────────
  {
    key: "$schema",
    cluster: "identity",
    exampleValue: "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",
    codes: [
      `"$schema": "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json"`,
    ],
  },
  {
    key: "id",
    cluster: "identity",
    exampleValue: "com.yourstation.lower-third",
    codes: [
      `"id": "com.yourstation.lower-third"`,
      `"id": "ograf-news-package/ticker"`,
      `"id": "graphics-2026-04-001"`,
    ],
  },
  {
    key: "name",
    cluster: "identity",
    exampleValue: "News Lower Third",
    codes: [
      `"name": "News Lower Third"`,
      `"name": "Lower Third — Sports"`,
      `"name": "Election Bars (Live)"`,
    ],
  },
  {
    key: "version",
    cluster: "identity",
    exampleValue: "1.0.0",
    codes: [`"version": "1.2.0"`, `"version": "2.0.0-beta.3"`, `"version": "2026.04.18"`],
  },
  {
    key: "description",
    cluster: "identity",
    exampleValue: "Two-line name + title overlay with logo",
    codes: [
      `"description": "Two-line name + title overlay with optional logo"`,
      `"description": "Match scoreboard with a goal celebration animation"`,
      `"description": "Quote card optimised for studio interview segments"`,
    ],
  },
  {
    key: "main",
    cluster: "identity",
    exampleValue: "graphic.mjs",
    codes: [`"main": "graphic.mjs"`, `"main": "index.html"`, `"main": "src/graphic.mjs"`],
  },
  {
    key: "author",
    cluster: "identity",
    codes: [
      `"author": {
  "name": "Jane Smith",
  "email": "jane@yourstation.example",
  "url": "https://yourstation.example"
}`,
      `"author": {
  "name": "Your Station — Graphics Department",
  "url": "https://yourstation.example/graphics"
}`,
      `"author": { "name": "OGraf community" }`,
    ],
  },
  {
    key: "thumbnails",
    cluster: "identity",
    codes: [
      `"thumbnails": [
  {
    "file": "thumb.png",
    "resolution": { "width": 1920, "height": 1080 }
  }
]`,
      `"thumbnails": [
  { "file": "thumb-1920.png", "resolution": { "width": 1920, "height": 1080 } },
  { "file": "thumb-960.png",  "resolution": { "width": 960,  "height": 540  } },
  { "file": "thumb-320.png",  "resolution": { "width": 320,  "height": 180  } }
]`,
      `"thumbnails": [
  { "file": "thumb-16x9.png", "resolution": { "width": 1920, "height": 1080 } },
  { "file": "thumb-9x16.png", "resolution": { "width": 1080, "height": 1920 } },
  { "file": "thumb-1x1.png",  "resolution": { "width": 600,  "height": 600  } }
]`,
    ],
  },

  // ── Behaviour ───────────────────────────────────────────────────────────
  {
    key: "stepCount",
    cluster: "behaviour",
    codes: [`"stepCount": 1`, `"stepCount": 0`, `"stepCount": 3`, `"stepCount": -1`],
  },
  {
    key: "supportsRealTime",
    cluster: "behaviour",
    exampleValue: "true",
    codes: [
      `"supportsRealTime": true,
"supportsNonRealTime": false`,
      `"supportsRealTime": true,
"supportsNonRealTime": true`,
    ],
  },
  {
    key: "supportsNonRealTime",
    cluster: "behaviour",
    exampleValue: "false",
    codes: [`"supportsNonRealTime": false`, `"supportsNonRealTime": true`],
  },

  // ── Operator data ───────────────────────────────────────────────────────
  {
    key: "schema",
    cluster: "operator-data",
    codes: [
      `"schema": {
  "type": "object",
  "properties": {
    "name":  { "type": "string", "title": "Name",  "gddType": "single-line" },
    "title": { "type": "string", "title": "Title", "gddType": "single-line" }
  },
  "required": ["name"]
}`,
      `"schema": {
  "type": "object",
  "properties": {
    "team":  { "type": "string", "title": "Team",  "gddType": "single-line" },
    "colour": {
      "type": "string", "title": "Brand colour",
      "gddType": "color-rrggbb", "pattern": "^#[0-9a-f]{6}$"
    },
    "position": {
      "type": "string", "title": "Position",
      "gddType": "select",
      "enum": ["bottom-left", "bottom-right"],
      "gddOptions": { "labels": { "bottom-left": "Bottom left", "bottom-right": "Bottom right" } }
    }
  }
}`,
      `"schema": {
  "type": "object",
  "properties": {
    "logo": { "type": "string", "title": "Logo", "gddType": "file-path/image-path" },
    "headlines": {
      "type": "array", "title": "Headlines",
      "items": { "type": "string", "gddType": "single-line" }
    }
  }
}`,
    ],
  },

  // ── Custom buttons ──────────────────────────────────────────────────────
  {
    key: "customActions",
    cluster: "custom-buttons",
    codes: [
      `"customActions": [
  {
    "id":          "goal",
    "name":        "Goal scored",
    "description": "Flash celebration animation",
    "schema":      null
  }
]`,
      `"customActions": [
  {
    "id": "swapColour",
    "name": "Swap colour",
    "schema": {
      "type": "object",
      "properties": {
        "tone": {
          "type": "string", "gddType": "select",
          "enum": ["red", "blue"],
          "gddOptions": { "labels": { "red": "Red", "blue": "Blue" } }
        }
      },
      "required": ["tone"]
    }
  }
]`,
      `"customActions": [
  { "id": "goal",    "name": "Goal scored" },
  { "id": "penalty", "name": "Penalty"     },
  { "id": "timeout", "name": "Timeout"     }
]`,
    ],
  },

  // ── Render needs ────────────────────────────────────────────────────────
  {
    key: "renderRequirements",
    cluster: "render-needs",
    codes: [
      `"renderRequirements": [
  {
    "resolution": {
      "width":  { "min": 1280 },
      "height": { "min": 720 }
    },
    "frameRate": { "min": 60 }
  }
]`,
      `"renderRequirements": [
  {
    "accessToPublicInternet": { "exact": true }
  }
]`,
      `"renderRequirements": [
  {
    "engine": [
      { "type": "CEF",   "version": { "min": "139" } },
      { "type": "Gecko", "version": { "min": "120.0" } }
    ]
  }
]`,
      `"renderRequirements": [
  {
    "resolution": {
      "width":  { "min": 3840 },
      "height": { "min": 2160 }
    },
    "frameRate": { "min": 30, "ideal": 60 }
  }
]`,
    ],
  },
] as const satisfies readonly FieldData[];

/* GDD types — canonical list from gdd-types.json (EBU). Every type ships
 * with a visual mock of the operator-facing input. */

interface GddData {
  readonly gddType: string;
  readonly mock: GddMockKind;
  readonly icon: GddTypeGuide["icon"];
  readonly codes: readonly string[];
}

const GDD_DATA = [
  {
    gddType: "single-line",
    mock: "single-line",
    icon: "Type",
    codes: [
      `{
  "type": "string",
  "title": "Name",
  "gddType": "single-line"
}`,
      `{
  "type": "string",
  "title": "Title",
  "gddType": "single-line",
  "default": "Senior Reporter"
}`,
      `{
  "type": "string",
  "title": "Hashtag",
  "gddType": "single-line",
  "minLength": 1
}`,
    ],
  },
  {
    gddType: "multi-line",
    mock: "multi-line",
    icon: "AlignLeft",
    codes: [
      `{
  "type": "string",
  "title": "Quote",
  "gddType": "multi-line"
}`,
      `{
  "type": "string",
  "title": "Description",
  "gddType": "multi-line",
  "default": "Add your bio here..."
}`,
    ],
  },
  {
    gddType: "file-path",
    mock: "file-path",
    icon: "FolderOpen",
    codes: [
      `{
  "type": "string",
  "title": "Theme music",
  "gddType": "file-path",
  "gddOptions": { "extensions": [".mp3", ".wav"] }
}`,
      `{
  "type": "string",
  "title": "Replay clip",
  "gddType": "file-path",
  "gddOptions": { "extensions": [".mp4", ".mov"] }
}`,
      `{
  "type": "string",
  "title": "Document",
  "gddType": "file-path"
}`,
    ],
  },
  {
    gddType: "file-path/image-path",
    mock: "image-path",
    icon: "Image",
    codes: [
      `{
  "type": "string",
  "title": "Logo",
  "gddType": "file-path/image-path",
  "gddOptions": { "extensions": [".png", ".svg"] }
}`,
      `{
  "type": "string",
  "title": "Headshot",
  "gddType": "file-path/image-path",
  "gddOptions": { "extensions": [".jpg", ".jpeg", ".png"] }
}`,
    ],
  },
  {
    gddType: "select",
    mock: "select",
    icon: "List",
    codes: [
      `{
  "type": "string",
  "title": "Position",
  "gddType": "select",
  "enum": ["top-left", "top-right", "bottom-left", "bottom-right"],
  "gddOptions": {
    "labels": {
      "top-left":     "Top left",
      "top-right":    "Top right",
      "bottom-left":  "Bottom left",
      "bottom-right": "Bottom right"
    }
  }
}`,
      `{
  "type": "integer",
  "title": "Priority",
  "gddType": "select",
  "enum": [1, 2, 3],
  "gddOptions": {
    "labels": { "1": "Low", "2": "Normal", "3": "Urgent" }
  }
}`,
      `{
  "type": "number",
  "title": "Speed",
  "gddType": "select",
  "enum": [0.5, 1.0, 2.0],
  "gddOptions": {
    "labels": { "0.5": "Half", "1.0": "Normal", "2.0": "Double" }
  }
}`,
    ],
  },
  {
    gddType: "color-rrggbb",
    mock: "color-rrggbb",
    icon: "Pipette",
    codes: [
      `{
  "type": "string",
  "title": "Accent",
  "gddType": "color-rrggbb",
  "pattern": "^#[0-9a-f]{6}$",
  "default": "#2563eb"
}`,
      `{
  "type": "string",
  "title": "Background",
  "gddType": "color-rrggbb",
  "pattern": "^#[0-9a-f]{6}$"
}`,
    ],
  },
  {
    gddType: "color-rrggbbaa",
    mock: "color-rrggbbaa",
    icon: "Pipette",
    codes: [
      `{
  "type": "string",
  "title": "Overlay",
  "gddType": "color-rrggbbaa",
  "pattern": "^#[0-9a-f]{8}$",
  "default": "#0f172a99"
}`,
      `{
  "type": "string",
  "title": "Tint",
  "gddType": "color-rrggbbaa",
  "pattern": "^#[0-9a-f]{8}$"
}`,
    ],
  },
  {
    gddType: "percentage",
    mock: "percentage",
    icon: "Percent",
    codes: [
      `{
  "type": "number",
  "title": "Opacity",
  "gddType": "percentage",
  "default": 1
}`,
      `{
  "type": "number",
  "title": "Progress",
  "gddType": "percentage",
  "minimum": 0,
  "maximum": 1
}`,
    ],
  },
  {
    gddType: "duration-ms",
    mock: "duration-ms",
    icon: "Timer",
    codes: [
      `{
  "type": "integer",
  "title": "Animation duration",
  "gddType": "duration-ms",
  "default": 600
}`,
      `{
  "type": "integer",
  "title": "Hold on screen",
  "gddType": "duration-ms",
  "minimum": 1000,
  "default": 5000
}`,
      `{
  "type": "integer",
  "title": "Fade out",
  "gddType": "duration-ms",
  "default": 400
}`,
    ],
  },
] as const satisfies readonly GddData[];

/* ────────────────────────────────────────────────────────────────────────────
 *  Per-locale text contract
 * ──────────────────────────────────────────────────────────────────────────── */

type FieldEntry = (typeof FIELD_DATA)[number];
type GddEntry = (typeof GDD_DATA)[number];
export type FieldKey = FieldEntry["key"];
export type GddTypeKey = GddEntry["gddType"];

/** One label per JSON example, same count as the examples tuple. */
type LabelsFor<T extends readonly unknown[]> = { readonly [I in keyof T]: string };

interface EntryText<Codes extends readonly unknown[]> {
  readonly friendlyName: string;
  readonly description: string;
  readonly exampleLabels: LabelsFor<Codes>;
}

export interface SchemaLanguageText {
  readonly clusters: {
    readonly [K in FieldCluster]: { readonly title: string; readonly subtitle: string };
  };
  readonly fields: {
    readonly [K in FieldKey]: EntryText<Extract<FieldEntry, { key: K }>["codes"]> & {
      /** Overrides the literal example value when it is prose (e.g. stepCount's hint). */
      readonly exampleValue?: string;
    };
  };
  readonly gddTypes: {
    readonly [K in GddTypeKey]: EntryText<Extract<GddEntry, { gddType: K }>["codes"]>;
  };
}

export interface SchemaLanguage {
  readonly CLUSTERS: readonly ClusterGuide[];
  readonly FIELD_GUIDES: readonly FieldGuide[];
  readonly GDD_TYPES: readonly GddTypeGuide[];
}

function withLabels(codes: readonly string[], labels: readonly string[]): ExampleJson[] {
  return codes.map((code, i) => ({ label: labels[i] ?? "", code }));
}

/** Merge the language-neutral structure with one locale's text. */
export function buildSchemaLanguage(text: SchemaLanguageText): SchemaLanguage {
  return {
    CLUSTERS: CLUSTER_DATA.map((c) => ({ ...c, ...text.clusters[c.id] })),
    FIELD_GUIDES: FIELD_DATA.map((f): FieldGuide => {
      const t = text.fields[f.key];
      const literal = "exampleValue" in f ? f.exampleValue : undefined;
      return {
        key: f.key,
        cluster: f.cluster,
        friendlyName: t.friendlyName,
        description: t.description,
        exampleValue: t.exampleValue ?? literal,
        examples: withLabels(f.codes, t.exampleLabels),
      };
    }),
    GDD_TYPES: GDD_DATA.map((g): GddTypeGuide => {
      const t = text.gddTypes[g.gddType];
      return {
        gddType: g.gddType,
        mock: g.mock,
        icon: g.icon,
        friendlyName: t.friendlyName,
        description: t.description,
        examples: withLabels(g.codes, t.exampleLabels),
      };
    }),
  };
}
