import type { SchemaLanguageText } from "../../../content/schema-language";

export const en: SchemaLanguageText = {
  clusters: {
    identity: {
      title: "Identity",
      subtitle: "Who is this graphic? A name, a version, a credit.",
    },
    behaviour: {
      title: "Behaviour",
      subtitle: "How does it run? Pages, modes, where it can play.",
    },
    "operator-data": {
      title: "Operator data",
      subtitle: "What the operator types in — like a form: name, title, score.",
    },
    "custom-buttons": {
      title: "Custom buttons",
      subtitle: "Special actions the operator can press during playback.",
    },
    "render-needs": {
      title: "What it needs to render",
      subtitle: "The minimum the renderer must guarantee — size, transparency, audio.",
    },
  },
  fields: {
    $schema: {
      friendlyName: "Schema link",
      description:
        "Tells controllers and validators which version of the OGraf manifest format you wrote against. Always the canonical EBU URL — most editors fill it in for you.",
      exampleLabels: ["Always this value"],
    },
    id: {
      friendlyName: "Unique ID",
      description:
        "A name no other graphic in the world should share. Use a reverse-domain pattern so collisions are basically impossible.",
      exampleLabels: ["Reverse domain (recommended)", "Project namespaced", "Date-coded for batches"],
    },
    name: {
      friendlyName: "Display name",
      description:
        "What operators see when they pick this graphic from a list. Keep it short — it has to fit in a controller's UI.",
      exampleLabels: ["Plain", "Variant suffix", "Tagged for live use"],
    },
    version: {
      friendlyName: "Version",
      description:
        "When you change anything important, bump this. Use major.minor.patch — bump the major number when you break something operators rely on.",
      exampleLabels: ["Stable semver", "Pre-release", "Date-based"],
    },
    description: {
      friendlyName: "Description",
      description:
        "One sentence about what this graphic does. Helps operators pick the right one when there are dozens of templates.",
      exampleLabels: ["Plain", "Mention key feature", "Audience-tagged"],
    },
    main: {
      friendlyName: "Entry file",
      description:
        "The file the renderer loads first. Usually graphic.mjs or index.html. The path is relative to the manifest.",
      exampleLabels: ["ES module", "HTML entry", "Inside a subfolder"],
    },
    author: {
      friendlyName: "Author",
      description:
        "Who made this. Optional, but a name + email helps operators know who to ping when something looks off.",
      exampleLabels: ["Solo designer", "Organisation", "Community handle only"],
    },
    thumbnails: {
      friendlyName: "Thumbnails",
      description:
        "Preview images of the graphic so operators recognise it visually. PNG, JPG, GIF or WebP. Multiple sizes welcome — controllers pick the best fit.",
      exampleLabels: ["Single thumbnail", "Multiple sizes", "Multiple aspect ratios"],
    },
    stepCount: {
      friendlyName: "Pages or stages",
      description:
        "How many separate views your graphic has. -1 means dynamic (graphic decides at runtime), 0 is a fire-and-forget sting, 1 is a single state that stays on screen until stopped (a lower third), 2+ is a multi-page graphic the operator clicks through. Default is 1.",
      exampleValue: "default 1   ·   min -1   ·   -1 = dynamic",
      exampleLabels: [
        "Lower third (default — single state)",
        "Sting (plays once, no operator step)",
        "Multi-page (3 results screens)",
        "Dynamic (graphic decides at runtime)",
      ],
    },
    supportsRealTime: {
      friendlyName: "Live broadcast?",
      description:
        "True if your graphic can run on live air — the most common case. You must declare this explicitly, even if it's true.",
      exampleLabels: ["Live only", "Live + post-production"],
    },
    supportsNonRealTime: {
      friendlyName: "Post-production?",
      description:
        "True if your graphic can run faster or slower than real time — useful for offline rendering pipelines (frame-by-frame, batch). If true, you must implement goToTime() and setActionsSchedule().",
      exampleLabels: ["Live only", "Allow offline render"],
    },
    schema: {
      friendlyName: "Operator data fields",
      description:
        "What the operator types in. Like a form: a Name field, a Title field, a Colour picker. The controller reads this and builds the form automatically — you never have to design the operator's UI.",
      exampleLabels: ["Just text fields", "With a colour picker and a select", "Image + array of strings"],
    },
    customActions: {
      friendlyName: "Custom buttons",
      description:
        "Special actions the operator can trigger during playback — celebrate a goal, flash a warning, swap a colour. Each button has an ID, a name, and an optional data form (set schema to null if the action takes no parameters).",
      exampleLabels: ["Single button, no payload", "Button with payload schema", "Multiple buttons"],
    },
    renderRequirements: {
      friendlyName: "Render requirements",
      description:
        "A list of acceptable rendering environments — at least one entry must be satisfied. Each entry can constrain resolution, frame rate, internet access, and the rendering engine + version. Constraints use min/max/exact/ideal so the renderer can negotiate the best match.",
      exampleLabels: [
        "HD 60 fps minimum",
        "Needs internet access (live data)",
        "Engine constraint (CEF 139+)",
        "UHD with ideal frame rate",
      ],
    },
  },
  gddTypes: {
    "single-line": {
      friendlyName: "Short text",
      description: "A one-line text input. Names, titles, scores, hashtags.",
      exampleLabels: ["Name field", "With a placeholder default", "Required field"],
    },
    "multi-line": {
      friendlyName: "Long text",
      description: "A multi-line textarea. Quotes, descriptions, longer copy.",
      exampleLabels: ["Quote", "Description with default"],
    },
    "file-path": {
      friendlyName: "File path",
      description:
        "A generic file picker. Use when a graphic needs an asset from a path. Restrict the allowed file extensions via gddOptions.",
      exampleLabels: ["Audio file", "Video clip", "No extension restriction"],
    },
    "file-path/image-path": {
      friendlyName: "Image",
      description:
        "An image picker. The controller knows to render a thumbnail preview. Logos, headshots, social avatars.",
      exampleLabels: ["Logo", "Headshot"],
    },
    select: {
      friendlyName: "Choices",
      description:
        "A dropdown with a fixed set of options. Use enum to list the values, and gddOptions.labels to give each value a friendlier display label.",
      exampleLabels: ["String options with labels", "Integer levels", "Number rates"],
    },
    "color-rrggbb": {
      friendlyName: "Colour (solid)",
      description:
        "A colour picker that returns a 6-character hex string like #2563eb. Lower-case hex only — operators see a swatch and a hex field.",
      exampleLabels: ["Brand accent", "Background"],
    },
    "color-rrggbbaa": {
      friendlyName: "Colour (with transparency)",
      description:
        "A colour picker that includes an alpha channel — 8-character hex like #2563ebcc. Use for overlays, glass-effect backgrounds, or anywhere you want partial transparency.",
      exampleLabels: ["Translucent overlay", "Glass-effect tint"],
    },
    percentage: {
      friendlyName: "Percentage",
      description:
        "A number representing a percentage. Operators usually see a slider and a 0-100 number input — great for opacity, progress, scale, volume.",
      exampleLabels: ["Opacity", "Progress bar"],
    },
    "duration-ms": {
      friendlyName: "Duration (milliseconds)",
      description:
        "An integer measured in milliseconds. Animation length, hold time, fade-out duration. The controller may show it as seconds for friendliness.",
      exampleLabels: ["Animation length", "Hold time", "Fade out"],
    },
  },
};
