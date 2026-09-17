import { LINK } from "./styles";

export const en = {
  eyebrow: "Tools",
  title: "Build, check, and ship OGraf packages.",
  intro:
    "A growing set of browser-based tools for everyone writing OGraf graphics. Everything runs client-side — no sign-up, no upload.",
  comingSoon: "Coming soon",
  tools: {
    check: {
      name: "Package Checker",
      tagline: "Validate a .zip before you ship.",
      description: (rules: number) =>
        `Drop any OGraf package and get a structured report against ${rules} rules across manifest, data schema (GDD), structure, module, styling, assets and runtime. Validates against the official EBU schema — live, with a pinned offline snapshot as fallback. Runs entirely in your browser — no upload.`,
      badge: "New" as string | undefined,
      open: "Open package checker",
    },
    schema: {
      name: "Schema Explorer",
      tagline: "Browse the OGraf manifest schema in plain language.",
      description: (_rules: number) =>
        "Every top-level field of an .ograf.json manifest, grouped into five designer-friendly clusters, plus a visual catalogue of every operator-input type. Sourced live from the EBU schema with a bundled fallback.",
      badge: undefined as string | undefined,
      open: "Open schema explorer",
    },
    generator: {
      name: "Template Generator",
      tagline: "Scaffold a new OGraf package from a preset.",
      description: (_rules: number) =>
        "Pick a base (lower third, bug, ticker, …), tweak a handful of fields, and download a ready-to-edit package with manifest, module, stylesheet, and local fonts already wired up correctly.",
      badge: undefined as string | undefined,
      open: "Open template generator",
    },
  },
  idea: (
    <>
      Got an idea for a tool? Open an issue on{" "}
      <a href="https://github.com/ficosta/ograf/issues" target="_blank" rel="noopener noreferrer" className={LINK}>
        GitHub
      </a>
      .
    </>
  ),
};

export type ToolsCopy = typeof en;
