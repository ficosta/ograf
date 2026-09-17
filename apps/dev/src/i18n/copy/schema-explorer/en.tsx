import { Link } from "../../Link";
import { DARK_LINK, EXTRA_CODE, INLINE_CODE } from "./styles";

export const en = {
  hero: {
    eyebrow: "Schema Explorer",
    title: "Every field of an OGraf manifest, in plain language.",
    intro:
      "Designer-friendly catalogue of the canonical EBU manifest schema. Browse the top-level fields, see every operator-input type with a real visual mock, and skip the JSON-Schema jargon entirely.",
  },
  stats: {
    fields: "Manifest fields",
    required: "Required",
    clusters: "Clusters",
    types: "Operator-input types",
  },
  mindMap: {
    title: "The whole shape, at a glance",
    intro: (
      <>
        Everything an OGraf manifest can contain — required fields in pink, optional in
        slate. Click any branch below to jump to the detailed card.
      </>
    ),
    legendRequired: "required",
    legendOptional: "optional",
    legendClick: "click any branch to jump to its full card below",
    rootLabel: "OGraf Manifest",
    hints: {
      schema: "string · const URL",
      main: "string · entry file",
      version: "string · sortable",
      stepCount: "number · default 1 · -1 = dynamic",
      actionSchema: "object | null  (null = no params)",
      operatorForm: "gdd/object.json — operator data form",
      gddType: "1 of 9 below ↓",
      gddOptions: "object — extensions, labels…",
      default: "type-dependent",
      hidden: "boolean — skip in display label",
      order: "number — UI sort hint, lower first",
      items: "(if type=array)  → recursive object.json",
      properties: "(if type=object) → recursive object.json",
      gddTypes: "9 canonical types",
      renderRequirements: "array of requirement objects",
      engineType: "string — CEF, Gecko, …",
      engineVersion: "string — engine-specific",
      vendorLabel: "v_*  (vendor extensions)",
      vendor: "any custom fields prefixed v_ are allowed at every level",
    },
  },
  fields: {
    title: "Manifest fields",
    intro: (
      <>
        Everything that can live at the top of an <code className={INLINE_CODE}>.ograf.json</code> manifest, grouped into the five things designers actually care about: who is this graphic, how does it behave, what data does it ask the operator for, what custom buttons can the operator press, and what does it need from the renderer.
      </>
    ),
  },
  gdd: {
    title: "Operator-input types",
    intro: (
      <>
        Inside the <code className={INLINE_CODE}>schema</code> field — that's the form the controller builds for the operator. These are the input types you can use, each one with a mock of what the operator actually sees in the controller. Compose them to ask for whatever your graphic needs: name, score, photo, colour, position…
      </>
    ),
    extrasTitle: "Two extras every field can have",
    hidden: (
      <>
        <code className={EXTRA_CODE}>hidden: true</code> — when present, the
        field's value is{" "}
        <strong>excluded from the graphic's display label</strong> in playout/automation
        UIs. Use it for technical or noisy fields.
      </>
    ),
    order: (
      <>
        <code className={EXTRA_CODE}>order: 0</code> — UI ordering hint. Lower
        numbers come first. Lets you control where each field appears in the operator's
        form.
      </>
    ),
  },
  cta: {
    title: "Ready to put the pieces together?",
    body: "The Spec page walks you through the full manifest end-to-end with a worked example. The Tutorials show 11 graphics built start to finish. The Package Checker validates a finished package against this same schema.",
    spec: "Read the Spec",
    tutorials: "Browse tutorials",
    check: "Validate a package",
    source: "Source:",
  },
  cards: {
    example: "Example:",
    required: "Required",
    optional: "Optional",
    toggleExamples: (open: boolean, count: number) =>
      `${open ? "Hide" : "Show"} ${count === 1 ? "example" : `${count} examples`}`,
    examplesAria: "Examples",
    directLink: (name: string) => `Direct link to ${name}`,
    copyFieldLink: "Copy link to this field",
    copyTypeLink: "Copy link to this type",
    operatorSees: "What the operator sees",
  },
  mocks: {
    name: "Name",
    quote: "Quote",
    quoteValue: "Open graphics, open broadcast, open standards. That's the future.",
    themeMusic: "Theme music",
    browse: "Browse…",
    logo: "Logo",
    dropOrBrowse: "Drop or browse",
    position: "Position",
    bottomRight: "Bottom right",
    overlay: "Overlay",
    accent: "Accent",
    opacity: "Opacity",
    animationDuration: "Animation duration",
  },
  source: {
    fetching: "Fetching live schema from ograf.ebu.io…",
    synced: "Synced with EBU",
    fetched: (ago: string) => `· fetched ${ago}`,
    justNow: "just now",
    secondsAgo: (n: number) => `${n}s ago`,
    minutesAgo: (n: number) => `${n} min ago`,
    hoursAgo: (n: number) => `${n} h ago`,
    daysAgo: (n: number) => `${n}d ago`,
    bundledSnapshot: "Bundled snapshot",
    offline: "Offline · using local copy",
  },
  ai: {
    badge: "AI helper",
    title: "Get an AI to check or compose your manifest.",
    intro:
      "Copy the prompt below into any chat AI. It teaches the model the OGraf rules at a level a designer can rely on — required fields, the canonical gddTypes, vendor extensions, the lot.",
    whereToPaste: "Where to paste it",
    tipsTitle: "Tips for better answers",
    copied: "Copied",
    copyPrompt: "Copy prompt",
    platformNotes: {
      ChatGPT:
        "OpenAI's flagship. Most designers already have an account. GPT-4 / 5 class models handle the prompt comfortably.",
      Claude:
        "Anthropic. Particularly strong at structured-data tasks like JSON Schema validation. Free tier is generous.",
      Gemini:
        "Google. Has live web access — can fetch the canonical schema at ograf.ebu.io while it answers.",
      Perplexity:
        "Web-grounded. Useful when you also want to discover ecosystem tools or recent OGraf news in the same conversation.",
    },
    tips: [
      "Paste your full .ograf.json with the prompt. The AI can spot missing required fields and typos in seconds.",
      "Describe the graphic in plain English and let the AI draft the manifest for you. \"Lower third with a name, title, and team-colour picker, 1 step, real-time only.\"",
      "Always run the result through the Package Checker (ograf.dev/check) before shipping. AI output is a great draft, not a final answer.",
      "Mention which gddType you want for each operator field. Without that, the AI will often default to plain JSON Schema strings, which controllers can't render as nicely.",
      "If you're using a vendor-specific feature, add a v_yourCompany_field — the spec rejects unknown top-level keys but allows v_ prefixes everywhere.",
      "When the AI gives you JSON, ask \"validate this against https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json\" — models with browsing will fetch the canonical version and double-check themselves.",
    ] as readonly string[],
    headsUp: (
      <>
        A heads-up: AI output is a great <em>draft</em>, never a final answer. Always run what you get through the{" "}
        <Link to="/check" className={DARK_LINK}>
          Package Checker
        </Link>{" "}
        before shipping.
      </>
    ),
    cites: (
      <>
        The prompt cites{" "}
        <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className={DARK_LINK}>
          ograf.ebu.io
        </a>{" "}
        so models with browsing can fetch the canonical schema while answering.
      </>
    ),
  },
};

export type SchemaExplorerCopy = typeof en;
