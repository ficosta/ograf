import { CHECK_LINK } from "./styles";

/** UI strings for TemplateDemo, TemplateDownload and TutorialManifest. */
export const en = {
  demo: {
    loadingPreview: "Loading preview…",
    previewLabel: (title: string) => `${title} — interactive preview`,
    array: "array",
    itemCount: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
    removeItem: (n: number) => `Remove item ${n}`,
    addItem: "Add item",
    invalidJson: "Invalid JSON",
    playMode: "Play mode",
    runOnce: "Run once",
    loop: "Loop",
    fixJsonBeforePlaying: "Fix the JSON field before playing",
    fixJsonBeforeUpdating: "Fix the JSON field before updating",
    play: "Play",
    update: "Update",
    stop: "Stop",
  },
  download: {
    heading: (title: string) => `Download the full ${title} package`,
    intro: "A real OGraf Graphics Definition v1 package. A compliant renderer reads the manifest and drives the lifecycle. MIT-licensed; drop it into any OGraf-compatible system.",
    files: {
      manifest: "Manifest — what a renderer reads (id, schema, lifecycle flags)",
      graphic: "Web Component with load / play / update / stop / customAction / dispose",
      style: "Stylesheet, loaded by graphic.mjs via a <link> tag",
      thumbnail: "1920×1080 preview, declared in the manifest",
      readme: "Usage notes",
      license: "MIT",
    },
    button: (slug: string) => `Download ${slug}.zip`,
    note: (checkHref: string) => (
      <>
        MIT · fonts included · drop on <a href={checkHref} className={CHECK_LINK}>/check</a> to validate
      </>
    ),
    renderersHeading: "Deploy to a compliant OGraf renderer",
    renderers: {
      "ograf-server": "Reference renderer with upload + control APIs. Self-host.",
      "SPX-GC": "Professional browser-based graphics controller with OGraf support.",
      CasparCG: "Open-source playout server — renders OGraf via the HTML producer.",
    },
  },
  manifestHeading: "The manifest",
};

export type TutorialUiCopy = typeof en;
