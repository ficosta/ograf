import type { ReactNode } from "react";
import { Link } from "../../Link";
import type { Category } from "../../../lib/check/types";

/** The Package Checker UI. Findings themselves (rule titles, messages) stay English. */
export const en = {
  /** Shown near the report and the rules list on translated pages; null in English. */
  findingsNote: null as string | null,
  categories: {
    manifest: "Manifest",
    gdd: "Data schema (GDD)",
    structure: "Package structure",
    module: "Graphic module",
    styling: "Styling",
    assets: "Assets",
    runtime: "Runtime",
  } satisfies Record<Category, string>,
  rules: (n: number) => `${n} rules`,

  page: {
    failedPackage: "Failed to check the package.",
    failedFolder: "Failed to check the folder.",
    consentTitle: "Run the graphic in a sandbox?",
    consentConfirm: "Run it",
    consentCancel: "Not now",
    consentBody: [
      "This executes the JavaScript inside the .zip you dropped, in a sandboxed iframe on this page. Only do it with a package you trust.",
      "Nothing is uploaded — the code runs in your browser and the results stay there. We’ll remember this choice on this device.",
    ],
    allTools: "All tools",
    eyebrow: "Tool",
    title: "OGraf package checker.",
    intro: (
      <>
        Drop any OGraf <code className="font-mono text-base">.zip</code> and get a structured report. Static rules run instantly; a runtime sandbox mounts the graphic and exercises its lifecycle on demand. Everything stays in your browser.
      </>
    ) as ReactNode,
    runTitle: "Run in sandbox",
    runDesc:
      "Mount the graphic in a sandboxed iframe and exercise load / play / update / stop / customAction / dispose — plus goToTime and setActionsSchedule when the manifest declares non-real-time support. Adds runtime findings to the report.",
    checkedTitle: "What gets checked",
    allRules: (n: number) => `All ${n} rules by id →`,
    checked: {
      manifest: {
        label: "Manifest",
        desc: "Validated against the live EBU schema (draft-2020-12), customActions shape, `main` pointer, $schema freshness, semver — plus cross-field checks a per-field schema cannot make: durations naming an undeclared customAction, unsatisfiable render requirements, missing thumbnails.",
      },
      gdd: {
        label: "Data schema (GDD)",
        desc: "Field types and gddType constraints, required gddOptions, the patterns the spec pins for colours, labels covering every select option, and defaults that match their own field's type, enum, bounds and pattern.",
      },
      structure: {
        label: "Package structure",
        desc: "Single top-level folder, README / LICENSE / preview present, referenced assets shipped, no OS junk, large-file warnings.",
      },
      module: {
        label: "Graphic module",
        desc: "Default-export HTMLElement class, six lifecycle methods, the non-real-time pair when the manifest declares it, no self-registered `customElements.define`, no top-level `document`, Shadow-DOM-safe relative URLs.",
      },
      styling: {
        label: "Styling",
        desc: "`position: fixed` catch, remote `@import` / `@font-face`, `body` selector flag, font-family fallback, Shadow-DOM portability hints.",
      },
      assets: {
        label: "Assets",
        desc: "Preview image 16:9 (decoded from raw bytes), fonts shipped with a licence, oversized images, unknown extensions.",
      },
      runtime: {
        label: "Runtime (optional)",
        desc: "Mounts the graphic in a sandboxed iframe, drives the full OGraf lifecycle including goToTime and setActionsSchedule where declared, captures timings, return values, console and uncaught errors.",
      },
    } satisfies Record<Category, { label: string; desc: string }>,
    noUpload: "No upload — everything runs in your browser.",
    optIn: "The runtime sandbox executes the package's code; opt-in click required.",
  },

  rulesPage: {
    back: "Package Checker",
    eyebrow: "Reference",
    title: "Checker rules.",
    intro: (total: number, categories: number) =>
      `All ${total} rules, across ${categories} categories. Reports cite these ids, so this is where to look one up. The list is generated from the checker's own source on every build — it cannot drift from what actually runs.`,
    prefix: {
      manifest: "M — the .ograf.json itself, validated against the EBU schema and then across its own fields.",
      gdd: "G — the data schema controllers build operator forms from.",
      structure: "S — what the package contains and how it is laid out.",
      module: "C — the graphic module's source: exports, lifecycle, portability.",
      styling: "X — stylesheet rules that decide whether a graphic survives a different renderer.",
      assets: "A — images, fonts and the licences that must ship beside them.",
      runtime: "R — assertions made while the graphic actually runs in the sandbox.",
    } as Partial<Record<Category, string>>,
    footer: (
      <>
        A rule with no description raises more than one kind of finding, and its message says which.
        Run a package through the{" "}
        <Link to="/check" className="text-blue-600 hover:underline">
          checker
        </Link>{" "}
        to see them in context.
      </>
    ) as ReactNode,
  },

  summary: {
    meta: (kb: string, ms: string) => `${kb} KB · checked in ${ms} ms`,
    shareHint:
      "Copy a link that carries this whole report. Nothing is uploaded — the report travels inside the URL fragment.",
    copied: "Link copied",
    tooLarge: "Too big to link",
    copyLink: "Copy link",
    download: "Report.md",
    tryAnother: "Try another",
    errors: "Errors",
    warnings: "Warnings",
    info: "Info",
    passed: "Passed",
  },

  results: {
    checks: (n: number) => `${n} check${n === 1 ? "" : "s"}`,
  },

  finding: {
    spec: "spec",
  },

  schema: {
    live: "Validated against the live EBU schema",
    bundled: "Validated against the bundled snapshot",
    /** English shows the checker's own note, which carries the reason. */
    bundledNote: (note: string | undefined) => note ?? "Live schema not reachable.",
    fetched: (time: string) => `· fetched ${time}`,
    dateLocale: undefined as string | undefined,
  },

  dropZone: {
    busyTitle: "Running checks...",
    idleTitle: "Drop your OGraf .zip here",
    busyHint: "This only takes a moment.",
    idleHint: "or click anywhere in this box to choose a file",
    local: "stays in your browser · no upload",
    folder: "or check an unzipped folder",
  },

  runtime: {
    title: "Runtime sandbox",
    desc: "The graphic runs in a sandboxed iframe with the package served by an in-browser service worker. No upload.",
    booting: "booting sandbox...",
    running: "running...",
    iframeTitle: "OGraf runtime sandbox",
    preparing: "Preparing sandbox...",
    failedTitle: "Sandbox did not start",
    noMain: "This package has no `main` module declared in the manifest.",
    initFailed: "sandbox failed to initialise",
    timeline: "Lifecycle timeline",
    controls: {
      load: "load",
      play: "play",
      update: "update",
      stop: "stop",
      dispose: "dispose",
    },
  },

  timeline: {
    running: "Running...",
    empty: "No lifecycle calls yet. The smoke run starts once the sandbox is ready, or use the controls to call methods by hand.",
  },

  console: {
    title: "Sandbox console",
    empty: "No console output or errors captured yet.",
  },

  dataForm: {
    noSchema: "This graphic declares no data schema, so there is nothing for an operator to fill in.",
    heading: "Data — what an operator would type",
    reset: "Reset to defaults",
    asJson: (type: string) => `· ${type}, edited as JSON`,
  },
};

export type CheckCopy = typeof en;
