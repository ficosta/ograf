import type { ColorKnobId, FontChoiceId, IssueCode, OffsetKnobId } from "../../../lib/generator/types";

export const en = {
  page: {
    allTools: "All tools",
    eyebrow: "Template Generator",
    title: "Scaffold a new OGraf package from a preset.",
    intro:
      "Pick a base, give it a name and your colours, watch it run live, and download a spec-valid package with manifest, module, stylesheet and local fonts already wired up. Every download is checked against the Package Checker first.",
    noUpload: "Everything runs in your browser — nothing is uploaded.",
    loading: "Loading the base template…",
    loadFailed: "The base template could not be loaded. Check your connection and reload the page.",
    buildFailed: "The package could not be built from this configuration.",
  },

  steps: {
    preset: "Preset",
    identity: "Identity",
    look: "Look",
    data: "Default data",
    output: "Preview, check, download",
  },

  gallery: {
    title: "Choose a base",
    intro:
      "Each preset is one of the hand-made tutorial templates: a Web Component with the full lifecycle, local fonts and a 1080p thumbnail. Your choices are applied to its real files.",
    selected: "Selected",
    tutorial: "Tutorial",
  },

  identity: {
    title: "Package identity",
    intro: "What a renderer and an operator see when they browse for this graphic.",
    name: "Name",
    nameHint: "Shown in controller UIs. Also names the folder and the manifest file.",
    id: "Package id",
    idHint:
      "Must be unique. Any character except “/” is allowed; the spec recommends reverse domain name notation, like com.my-company.my-lowerthird.",
    idDerived: "Derived from the author URL and the name until you edit it.",
    idDerive: "Derive from name again",
    version: "Version",
    versionHint: "Semantic version, e.g. 1.0.0. Renderers sort versions alphabetically.",
    description: "Description",
    descriptionHint: "Optional, but controllers show it in galleries.",
    authorName: "Author",
    authorNameHint: "Optional. Required if you give a URL.",
    authorUrl: "Author URL",
    authorUrlHint: "Optional. Also seeds the id prefix: https://acme.tv → tv.acme.",
    files: (slug: string, manifest: string) => `Download: ${slug}/ with ${manifest}`,
    issues: {
      nameRequired: "Give the package a name.",
      nameTooLong: "Keep the name under 120 characters.",
      idRequired: "The id is required.",
      idSlash: "The spec forbids “/” in an id.",
      idWhitespace: "Remove spaces from the id.",
      idNotReverseDns: "Valid, but reverse domain name notation (com.company.graphic) is recommended.",
      versionRequired: "The version is required.",
      versionNotSemver: "Use a semantic version such as 1.0.0 or 2.1.0-beta.1.",
      authorUrlInvalid: "Use a full http(s) URL.",
      authorNameRequiredWithUrl: "An author with a URL also needs a name — the schema requires it.",
      colorInvalid: "Use a six-digit hex colour like #2563eb.",
      offsetRange: "Use a whole number between 0 and 600.",
    } satisfies Record<IssueCode, string>,
  },

  look: {
    title: "Look",
    intro:
      "Colours, body font and position become CSS custom properties at the top of style.css, so the download is a themed package you can keep re-skinning by hand.",
    colors: {
      accent: "Accent",
      ink: "Text",
      surface: "Panel",
      live: "Live dot",
      alert: "Alert",
      urgent: "Urgent",
      backdrop: "Backdrop",
      overlay: "Overlay",
    } satisfies Record<ColorKnobId, string>,
    colorsHint: "Gradient ends and tints are derived from the accent automatically.",
    font: "Body font",
    fontOptions: {
      inter: "Inter — variable weight, bundled",
      "instrument-serif": "Instrument Serif — editorial, bundled",
      system: "System UI — no font files shipped",
    } satisfies Record<FontChoiceId, string>,
    fontNotes: {
      inter: "One variable file covers every weight. Licence travels in fonts/.",
      "instrument-serif": "Regular and italic at one weight; bold is synthesised by the renderer. Licence travels in fonts/.",
      system: "Each renderer uses its own UI font, so the look varies between machines.",
    } satisfies Record<FontChoiceId, string>,
    offsets: {
      offsetX: "Horizontal margin",
      offsetY: "Vertical margin",
    } satisfies Record<OffsetKnobId, string>,
    offsetsHint: "Distance from the screen edge in pixels at 1920 × 1080. Broadcast safe area starts around 48 px.",
    offsetsNone: "This preset fills the frame, so there is no position to set.",
    reset: "Reset look",
  },

  data: {
    title: "Default data",
    intro:
      "What the operator form is pre-filled with. Written into the manifest schema as each field's default, so controllers and the preview start from the same values.",
  },

  preview: {
    title: "Live preview",
    desc: "The generated graphic.mjs runs at 1920 × 1080 in a sandboxed iframe, served by an in-browser service worker exactly as a renderer would.",
    booting: "starting…",
    running: "running…",
    iframeTitle: "Generated graphic preview",
    preparing: "Preparing the preview…",
    failedTitle: "The preview did not start",
    unsupported: "Live preview needs a browser with service workers. The download still works.",
    controls: {
      play: "play",
      stop: "stop",
      update: "update",
      replay: "replay",
    },
    background: {
      label: "Background",
      dark: "Dark",
      light: "Light",
      checker: "Checker",
    },
    facts: {
      stepCount: (n: number) => (n === 0 ? "auto-dismisses (stepCount 0)" : n === 1 ? "play / stop (stepCount 1)" : `${n} steps`),
      customActions: (n: number) => `${n} custom action${n === 1 ? "" : "s"}`,
      realTime: "real-time",
    },
  },

  validation: {
    title: "Package check",
    desc: "The same rules as the Package Checker, run on the exact zip you will download.",
    running: "checking…",
    clean: "No errors, no warnings. Ready to ship.",
    counts: {
      errors: "errors",
      warnings: "warnings",
      infos: "notes",
      passes: "passed",
    },
    showPasses: "Show passed checks",
    hidePasses: "Hide passed checks",
    openChecker: "Open the full Package Checker",
    waiting: "The check runs once the package is built.",
  },

  download: {
    title: "Download",
    button: "Download .zip",
    preparing: "Preparing…",
    contents: "Package contents",
    size: (kb: string) => `${kb} KB`,
    blockedForm: "Fix the highlighted fields first.",
    blockedErrors: "The package check found errors; see above.",
    blockedBuild: "The package could not be built.",
    next: "Next steps",
    nextSteps: [
      "Unzip and point an OGraf renderer at the manifest, or drop the zip on the Package Checker.",
      "Edit the theme tokens at the top of style.css to keep re-skinning by hand.",
      "Change the markup in graphic.mjs and the data schema in the manifest together: load() and updateAction() read the same fields.",
    ],
    license: "The generated package is MIT licensed, like the tutorial templates it is built from.",
  },
};

export type GeneratorCopy = typeof en;
