import { BRAND } from "./styles";

export const en = {
  /** The hero reads `${heroBefore} <rotating word> ${heroAfter}`. */
  heroBefore: "The missing",
  heroAfter: "for OGraf.",
  /** The first word is what the prerendered HTML shows. */
  rotatingWords: ["community", "guide", "hub", "partner", "toolkit", "resource"],
  heroLead:
    "OGraf is a new open format for broadcast graphics. No vendor lock-in, no proprietary runtimes, one package that plays on any compatible system.",
  startTutorial: "Start the tutorial",
  exploreTools: "Explore tools",
  adopters: {
    heading: "Vendors & adopters",
    vendorsLabel: "Vendors",
    organisationsLabel: "Broadcast organizations",
    sourcePrefix: "Companies and broadcast organizations that, in the EBU's words, support the OGraf specification, as listed on",
  },
  featuresTitle: "Why OGraf matters.",
  featuresLead:
    "The broadcast graphics market has long relied on closed, vendor-specific systems. OGraf adds an open, web-native layer that anyone can render, control, and ship.",
  features: {
    open: {
      title: "Open Standard",
      desc: "No lock-in. No licenses. No gatekeepers. MIT-licensed and EBU-backed — your graphics belong to you, not some vendor's invoice.",
    },
    web: {
      title: "Web Native",
      desc: "If you can build a website, you can build broadcast graphics. HTML, CSS, JavaScript — the skills you already have, live on air.",
    },
    interop: {
      title: "Interoperable",
      desc: "Build once. Ship everywhere. The same OGraf package plays on SPX, CasparCG, Loopic, and any compliant system — no rebuilds, no conversions.",
    },
  },
  compareTitle: "Where OGraf fits in.",
  compareLead:
    "Broadcast graphics is a deep, mature space — Vizrt, Chyron, Ross, Avid, Singular, Flowics and many others power the world's biggest productions. OGraf isn't here to replace them. It adds a portable, open layer so the same graphic can travel between systems.",
  featureColumn: "Feature",
  /** Notes under each system name, in COMPARISON_SYSTEMS order. */
  systemNotes: ["Open spec", "Viz Engine", "PRIME / LyricX", "XPression", "Maestro", "Cloud", "Cloud"],
  /** In COMPARISON_ROWS order. */
  rows: [
    { feature: "Open specification" },
    { feature: "Web-native (HTML/CSS/JS)" },
    { feature: "Cross-renderer portable", note: "Same package runs on any compliant system" },
    { feature: "Self-hosted option" },
    { feature: "Open-source reference implementation" },
    { feature: "Cloud rendering available" },
  ] as ReadonlyArray<{ readonly feature: string; readonly note?: string }>,
  legend: {
    yes: "Supported",
    partial: "Partial / via add-on",
    no: "Not supported",
  },
  compareFootnote: (
    <>
      This chart focuses on one specific axis: whether a graphic authored on one system can be rendered on another. Every platform above earned its place by solving real production problems — OGraf's contribution is the shared format, not a replacement for the runtimes teams already trust. Specialist platforms like <span className={BRAND}>Brainstorm</span>, <span className={BRAND}>Aximmetry</span>, <span className={BRAND}>WASP3D</span>, and <span className={BRAND}>Zero Density</span> lead in virtual studios, AR and XR; open stacks like <span className={BRAND}>CasparCG</span>, <span className={BRAND}>SPX-GC</span>, and <span className={BRAND}>ograf-server</span> render OGraf packages natively today.
    </>
  ),
  ecosystemTitle: "A growing ecosystem of tools.",
  ecosystemLead:
    "From reference renderers to no-code editors, the OGraf ecosystem has everything you need to build, test, and deploy broadcast graphics.",
  /** Keyed by the tool name in ECOSYSTEM_TOOLS. */
  tools: {
    "SPX-GC": {
      cat: "Controller",
      desc: "Professional browser-based graphics controller for live productions. Supports CasparCG, OBS, and vMix.",
    },
    CasparCG: {
      cat: "Renderer",
      desc: "Open-source professional graphics and video playout server with SDI and NDI output.",
    },
    Ferryman: {
      cat: "Converter",
      desc: "Convert After Effects and Lottie animations into OGraf-compatible HTML templates.",
    },
    "ograf-server": {
      cat: "Server",
      desc: "Reference OGraf renderer with upload API, control API, and browser-based rendering.",
    },
    Loopic: {
      cat: "Editor",
      desc: "No-code browser-based TV graphics template builder with one-click OGraf export.",
    },
  },
  viewEcosystem: "View the full ecosystem map",
  statsTitle: "OGraf by the numbers.",
  statsLead: "The EBU-backed standard is in active use across the broadcast graphics industry.",
  stats: [
    { stat: "EBU", label: "Working group maintains the specification on GitHub" },
    { stat: "v1 Stable", label: "Graphics Definition stable since September 2025" },
    { stat: "10+", label: "Tools and renderers supporting the OGraf standard" },
  ],
  tutorialsTitle: "Learn by building real graphics.",
  tutorialsSubtitle:
    "Each tutorial builds a production-quality broadcast graphic from scratch — with live interactive demos.",
  faqTitle: "Common questions.",
};

export type HomeCopy = typeof en;
