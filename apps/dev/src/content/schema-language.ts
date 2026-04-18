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
 * Add a new entry here when EBU adds a new field or gddType. If no curated
 * entry exists, the Explorer falls back to the technical name + the schema's
 * own description.
 *
 * Voice: borrowed from Spec.tsx — "Don't let the name intimidate you — it's
 * just a way to say 'this graphic needs a text field called Name and a colour
 * picker called Background.'"
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

export const CLUSTERS: readonly ClusterGuide[] = [
  {
    id: "identity",
    title: "Identity",
    subtitle: "Who is this graphic? A name, a version, a credit.",
    icon: "Tag",
    tone: "blue",
  },
  {
    id: "behaviour",
    title: "Behaviour",
    subtitle: "How does it run? Pages, modes, where it can play.",
    icon: "Activity",
    tone: "violet",
  },
  {
    id: "operator-data",
    title: "Operator data",
    subtitle: "What the operator types in — like a form: name, title, score.",
    icon: "ClipboardList",
    tone: "emerald",
  },
  {
    id: "custom-buttons",
    title: "Custom buttons",
    subtitle: "Special actions the operator can press during playback.",
    icon: "MousePointerClick",
    tone: "amber",
  },
  {
    id: "render-needs",
    title: "What it needs to render",
    subtitle: "The minimum the renderer must guarantee — size, transparency, audio.",
    icon: "Tv",
    tone: "rose",
  },
];

export const FIELD_GUIDES: readonly FieldGuide[] = [
  // ── Identity ────────────────────────────────────────────────────────────
  {
    key: "$schema",
    friendlyName: "Schema link",
    cluster: "identity",
    description:
      "Tells controllers and validators which version of the OGraf manifest format you wrote against. Always the canonical EBU URL — most editors fill it in for you.",
    exampleValue: "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",
    examples: [
      {
        label: "Always this value",
        code: `"$schema": "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json"`,
      },
    ],
  },
  {
    key: "id",
    friendlyName: "Unique ID",
    cluster: "identity",
    description:
      "A name no other graphic in the world should share. Use a reverse-domain pattern so collisions are basically impossible.",
    exampleValue: "com.yourstation.lower-third",
    examples: [
      {
        label: "Reverse domain (recommended)",
        code: `"id": "com.yourstation.lower-third"`,
      },
      {
        label: "Project namespaced",
        code: `"id": "ograf-news-package/ticker"`,
      },
      {
        label: "Date-coded for batches",
        code: `"id": "graphics-2026-04-001"`,
      },
    ],
  },
  {
    key: "name",
    friendlyName: "Display name",
    cluster: "identity",
    description:
      "What operators see when they pick this graphic from a list. Keep it short — it has to fit in a controller's UI.",
    exampleValue: "News Lower Third",
    examples: [
      { label: "Plain", code: `"name": "News Lower Third"` },
      { label: "Variant suffix", code: `"name": "Lower Third — Sports"` },
      { label: "Tagged for live use", code: `"name": "Election Bars (Live)"` },
    ],
  },
  {
    key: "version",
    friendlyName: "Version",
    cluster: "identity",
    description:
      "When you change anything important, bump this. Use major.minor.patch — bump the major number when you break something operators rely on.",
    exampleValue: "1.0.0",
    examples: [
      { label: "Stable semver", code: `"version": "1.2.0"` },
      { label: "Pre-release", code: `"version": "2.0.0-beta.3"` },
      { label: "Date-based", code: `"version": "2026.04.18"` },
    ],
  },
  {
    key: "description",
    friendlyName: "Description",
    cluster: "identity",
    description:
      "One sentence about what this graphic does. Helps operators pick the right one when there are dozens of templates.",
    exampleValue: "Two-line name + title overlay with logo",
    examples: [
      {
        label: "Plain",
        code: `"description": "Two-line name + title overlay with optional logo"`,
      },
      {
        label: "Mention key feature",
        code: `"description": "Match scoreboard with a goal celebration animation"`,
      },
      {
        label: "Audience-tagged",
        code: `"description": "Quote card optimised for studio interview segments"`,
      },
    ],
  },
  {
    key: "main",
    friendlyName: "Entry file",
    cluster: "identity",
    description:
      "The file the renderer loads first. Usually graphic.mjs or index.html. The path is relative to the manifest.",
    exampleValue: "graphic.mjs",
    examples: [
      { label: "ES module", code: `"main": "graphic.mjs"` },
      { label: "HTML entry", code: `"main": "index.html"` },
      { label: "Inside a subfolder", code: `"main": "src/graphic.mjs"` },
    ],
  },
  {
    key: "author",
    friendlyName: "Author",
    cluster: "identity",
    description:
      "Who made this. Optional, but a name + email helps operators know who to ping when something looks off.",
    examples: [
      {
        label: "Solo designer",
        code: `"author": {
  "name": "Jane Smith",
  "email": "jane@yourstation.example",
  "url": "https://yourstation.example"
}`,
      },
      {
        label: "Organisation",
        code: `"author": {
  "name": "Your Station — Graphics Department",
  "url": "https://yourstation.example/graphics"
}`,
      },
      {
        label: "Community handle only",
        code: `"author": { "name": "OGraf community" }`,
      },
    ],
  },
  {
    key: "thumbnails",
    friendlyName: "Thumbnails",
    cluster: "identity",
    description:
      "Preview images of the graphic so operators recognise it visually. PNG, JPG, GIF or WebP. Multiple sizes welcome — controllers pick the best fit.",
    examples: [
      {
        label: "Single thumbnail",
        code: `"thumbnails": [
  {
    "file": "thumb.png",
    "resolution": { "width": 1920, "height": 1080 }
  }
]`,
      },
      {
        label: "Multiple sizes",
        code: `"thumbnails": [
  { "file": "thumb-1920.png", "resolution": { "width": 1920, "height": 1080 } },
  { "file": "thumb-960.png",  "resolution": { "width": 960,  "height": 540  } },
  { "file": "thumb-320.png",  "resolution": { "width": 320,  "height": 180  } }
]`,
      },
      {
        label: "Multiple aspect ratios",
        code: `"thumbnails": [
  { "file": "thumb-16x9.png", "resolution": { "width": 1920, "height": 1080 } },
  { "file": "thumb-9x16.png", "resolution": { "width": 1080, "height": 1920 } },
  { "file": "thumb-1x1.png",  "resolution": { "width": 600,  "height": 600  } }
]`,
      },
    ],
  },

  // ── Behaviour ───────────────────────────────────────────────────────────
  {
    key: "stepCount",
    friendlyName: "Pages or stages",
    cluster: "behaviour",
    description:
      "How many separate views your graphic has. -1 means dynamic (graphic decides at runtime), 0 is a fire-and-forget sting, 1 is a single state that stays on screen until stopped (a lower third), 2+ is a multi-page graphic the operator clicks through. Default is 1.",
    exampleValue: "default 1   ·   min -1   ·   -1 = dynamic",
    examples: [
      {
        label: "Lower third (default — single state)",
        code: `"stepCount": 1`,
      },
      {
        label: "Sting (plays once, no operator step)",
        code: `"stepCount": 0`,
      },
      {
        label: "Multi-page (3 results screens)",
        code: `"stepCount": 3`,
      },
      {
        label: "Dynamic (graphic decides at runtime)",
        code: `"stepCount": -1`,
      },
    ],
  },
  {
    key: "supportsRealTime",
    friendlyName: "Live broadcast?",
    cluster: "behaviour",
    description:
      "True if your graphic can run on live air — the most common case. You must declare this explicitly, even if it's true.",
    exampleValue: "true",
    examples: [
      {
        label: "Live only",
        code: `"supportsRealTime": true,
"supportsNonRealTime": false`,
      },
      {
        label: "Live + post-production",
        code: `"supportsRealTime": true,
"supportsNonRealTime": true`,
      },
    ],
  },
  {
    key: "supportsNonRealTime",
    friendlyName: "Post-production?",
    cluster: "behaviour",
    description:
      "True if your graphic can run faster or slower than real time — useful for offline rendering pipelines (frame-by-frame, batch). If true, you must implement goToTime() and setActionsSchedule().",
    exampleValue: "false",
    examples: [
      { label: "Live only", code: `"supportsNonRealTime": false` },
      { label: "Allow offline render", code: `"supportsNonRealTime": true` },
    ],
  },

  // ── Operator data ───────────────────────────────────────────────────────
  {
    key: "schema",
    friendlyName: "Operator data fields",
    cluster: "operator-data",
    description:
      "What the operator types in. Like a form: a Name field, a Title field, a Colour picker. The controller reads this and builds the form automatically — you never have to design the operator's UI.",
    examples: [
      {
        label: "Just text fields",
        code: `"schema": {
  "type": "object",
  "properties": {
    "name":  { "type": "string", "title": "Name",  "gddType": "single-line" },
    "title": { "type": "string", "title": "Title", "gddType": "single-line" }
  },
  "required": ["name"]
}`,
      },
      {
        label: "With a colour picker and a select",
        code: `"schema": {
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
      },
      {
        label: "Image + array of strings",
        code: `"schema": {
  "type": "object",
  "properties": {
    "logo": { "type": "string", "title": "Logo", "gddType": "file-path/image-path" },
    "headlines": {
      "type": "array", "title": "Headlines",
      "items": { "type": "string", "gddType": "single-line" }
    }
  }
}`,
      },
    ],
  },

  // ── Custom buttons ──────────────────────────────────────────────────────
  {
    key: "customActions",
    friendlyName: "Custom buttons",
    cluster: "custom-buttons",
    description:
      "Special actions the operator can trigger during playback — celebrate a goal, flash a warning, swap a colour. Each button has an ID, a name, and an optional data form (set schema to null if the action takes no parameters).",
    examples: [
      {
        label: "Single button, no payload",
        code: `"customActions": [
  {
    "id":          "goal",
    "name":        "Goal scored",
    "description": "Flash celebration animation",
    "schema":      null
  }
]`,
      },
      {
        label: "Button with payload schema",
        code: `"customActions": [
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
      },
      {
        label: "Multiple buttons",
        code: `"customActions": [
  { "id": "goal",    "name": "Goal scored" },
  { "id": "penalty", "name": "Penalty"     },
  { "id": "timeout", "name": "Timeout"     }
]`,
      },
    ],
  },

  // ── Render needs ────────────────────────────────────────────────────────
  {
    key: "renderRequirements",
    friendlyName: "Render requirements",
    cluster: "render-needs",
    description:
      "A list of acceptable rendering environments — at least one entry must be satisfied. Each entry can constrain resolution, frame rate, internet access, and the rendering engine + version. Constraints use min/max/exact/ideal so the renderer can negotiate the best match.",
    examples: [
      {
        label: "HD 60 fps minimum",
        code: `"renderRequirements": [
  {
    "resolution": {
      "width":  { "min": 1280 },
      "height": { "min": 720 }
    },
    "frameRate": { "min": 60 }
  }
]`,
      },
      {
        label: "Needs internet access (live data)",
        code: `"renderRequirements": [
  {
    "accessToPublicInternet": { "exact": true }
  }
]`,
      },
      {
        label: "Engine constraint (CEF 139+)",
        code: `"renderRequirements": [
  {
    "engine": [
      { "type": "CEF",   "version": { "min": "139" } },
      { "type": "Gecko", "version": { "min": "120.0" } }
    ]
  }
]`,
      },
      {
        label: "UHD with ideal frame rate",
        code: `"renderRequirements": [
  {
    "resolution": {
      "width":  { "min": 3840 },
      "height": { "min": 2160 }
    },
    "frameRate": { "min": 30, "ideal": 60 }
  }
]`,
      },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 *  GDD types — canonical list from gdd-types.json (EBU). Every type ships
 *  with a visual mock of the operator-facing input.
 * ──────────────────────────────────────────────────────────────────────────── */

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

export const GDD_TYPES: readonly GddTypeGuide[] = [
  {
    gddType: "single-line",
    friendlyName: "Short text",
    description: "A one-line text input. Names, titles, scores, hashtags.",
    mock: "single-line",
    icon: "Type",
    examples: [
      {
        label: "Name field",
        code: `{
  "type": "string",
  "title": "Name",
  "gddType": "single-line"
}`,
      },
      {
        label: "With a placeholder default",
        code: `{
  "type": "string",
  "title": "Title",
  "gddType": "single-line",
  "default": "Senior Reporter"
}`,
      },
      {
        label: "Required field",
        code: `{
  "type": "string",
  "title": "Hashtag",
  "gddType": "single-line",
  "minLength": 1
}`,
      },
    ],
  },
  {
    gddType: "multi-line",
    friendlyName: "Long text",
    description: "A multi-line textarea. Quotes, descriptions, longer copy.",
    mock: "multi-line",
    icon: "AlignLeft",
    examples: [
      {
        label: "Quote",
        code: `{
  "type": "string",
  "title": "Quote",
  "gddType": "multi-line"
}`,
      },
      {
        label: "Description with default",
        code: `{
  "type": "string",
  "title": "Description",
  "gddType": "multi-line",
  "default": "Add your bio here..."
}`,
      },
    ],
  },
  {
    gddType: "file-path",
    friendlyName: "File path",
    description:
      "A generic file picker. Use when a graphic needs an asset from a path. Restrict the allowed file extensions via gddOptions.",
    mock: "file-path",
    icon: "FolderOpen",
    examples: [
      {
        label: "Audio file",
        code: `{
  "type": "string",
  "title": "Theme music",
  "gddType": "file-path",
  "gddOptions": { "extensions": [".mp3", ".wav"] }
}`,
      },
      {
        label: "Video clip",
        code: `{
  "type": "string",
  "title": "Replay clip",
  "gddType": "file-path",
  "gddOptions": { "extensions": [".mp4", ".mov"] }
}`,
      },
      {
        label: "No extension restriction",
        code: `{
  "type": "string",
  "title": "Document",
  "gddType": "file-path"
}`,
      },
    ],
  },
  {
    gddType: "file-path/image-path",
    friendlyName: "Image",
    description:
      "An image picker. The controller knows to render a thumbnail preview. Logos, headshots, social avatars.",
    mock: "image-path",
    icon: "Image",
    examples: [
      {
        label: "Logo",
        code: `{
  "type": "string",
  "title": "Logo",
  "gddType": "file-path/image-path",
  "gddOptions": { "extensions": [".png", ".svg"] }
}`,
      },
      {
        label: "Headshot",
        code: `{
  "type": "string",
  "title": "Headshot",
  "gddType": "file-path/image-path",
  "gddOptions": { "extensions": [".jpg", ".jpeg", ".png"] }
}`,
      },
    ],
  },
  {
    gddType: "select",
    friendlyName: "Choices",
    description:
      "A dropdown with a fixed set of options. Use enum to list the values, and gddOptions.labels to give each value a friendlier display label.",
    mock: "select",
    icon: "List",
    examples: [
      {
        label: "String options with labels",
        code: `{
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
      },
      {
        label: "Integer levels",
        code: `{
  "type": "integer",
  "title": "Priority",
  "gddType": "select",
  "enum": [1, 2, 3],
  "gddOptions": {
    "labels": { "1": "Low", "2": "Normal", "3": "Urgent" }
  }
}`,
      },
      {
        label: "Number rates",
        code: `{
  "type": "number",
  "title": "Speed",
  "gddType": "select",
  "enum": [0.5, 1.0, 2.0],
  "gddOptions": {
    "labels": { "0.5": "Half", "1.0": "Normal", "2.0": "Double" }
  }
}`,
      },
    ],
  },
  {
    gddType: "color-rrggbb",
    friendlyName: "Colour (solid)",
    description:
      "A colour picker that returns a 6-character hex string like #2563eb. Lower-case hex only — operators see a swatch and a hex field.",
    mock: "color-rrggbb",
    icon: "Pipette",
    examples: [
      {
        label: "Brand accent",
        code: `{
  "type": "string",
  "title": "Accent",
  "gddType": "color-rrggbb",
  "pattern": "^#[0-9a-f]{6}$",
  "default": "#2563eb"
}`,
      },
      {
        label: "Background",
        code: `{
  "type": "string",
  "title": "Background",
  "gddType": "color-rrggbb",
  "pattern": "^#[0-9a-f]{6}$"
}`,
      },
    ],
  },
  {
    gddType: "color-rrggbbaa",
    friendlyName: "Colour (with transparency)",
    description:
      "A colour picker that includes an alpha channel — 8-character hex like #2563ebcc. Use for overlays, glass-effect backgrounds, or anywhere you want partial transparency.",
    mock: "color-rrggbbaa",
    icon: "Pipette",
    examples: [
      {
        label: "Translucent overlay",
        code: `{
  "type": "string",
  "title": "Overlay",
  "gddType": "color-rrggbbaa",
  "pattern": "^#[0-9a-f]{8}$",
  "default": "#0f172a99"
}`,
      },
      {
        label: "Glass-effect tint",
        code: `{
  "type": "string",
  "title": "Tint",
  "gddType": "color-rrggbbaa",
  "pattern": "^#[0-9a-f]{8}$"
}`,
      },
    ],
  },
  {
    gddType: "percentage",
    friendlyName: "Percentage",
    description:
      "A number representing a percentage. Operators usually see a slider and a 0-100 number input — great for opacity, progress, scale, volume.",
    mock: "percentage",
    icon: "Percent",
    examples: [
      {
        label: "Opacity",
        code: `{
  "type": "number",
  "title": "Opacity",
  "gddType": "percentage",
  "default": 1
}`,
      },
      {
        label: "Progress bar",
        code: `{
  "type": "number",
  "title": "Progress",
  "gddType": "percentage",
  "minimum": 0,
  "maximum": 1
}`,
      },
    ],
  },
  {
    gddType: "duration-ms",
    friendlyName: "Duration (milliseconds)",
    description:
      "An integer measured in milliseconds. Animation length, hold time, fade-out duration. The controller may show it as seconds for friendliness.",
    mock: "duration-ms",
    icon: "Timer",
    examples: [
      {
        label: "Animation length",
        code: `{
  "type": "integer",
  "title": "Animation duration",
  "gddType": "duration-ms",
  "default": 600
}`,
      },
      {
        label: "Hold time",
        code: `{
  "type": "integer",
  "title": "Hold on screen",
  "gddType": "duration-ms",
  "minimum": 1000,
  "default": 5000
}`,
      },
      {
        label: "Fade out",
        code: `{
  "type": "integer",
  "title": "Fade out",
  "gddType": "duration-ms",
  "default": 400
}`,
      },
    ],
  },
];
