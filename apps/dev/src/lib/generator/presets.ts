import type { ColorKnob, PresetDef, PresetSlug } from "./types";

/**
 * What the generator may change in each template, and exactly where.
 *
 * Every literal below is a string that appears in that template's style.css.
 * The transform swaps it for a CSS custom property and declares the property
 * on the root selector, so the download is a themed package rather than one
 * with the colours find-and-replaced into dozens of places. The self-test
 * fails if a literal is no longer found, so these stay in step with the CSS.
 */

const WHITE_SURFACE: ColorKnob = {
  id: "surface",
  default: "#ffffff",
  literals: [],
  rgbaPrefixes: ["rgba(255, 255, 255,"],
};

const INK: ColorKnob = { id: "ink", default: "#0f172a", literals: ["#0f172a"] };

const BLUE_ACCENT = (shades: { dark?: boolean; light?: boolean }): ColorKnob => ({
  id: "accent",
  default: "#2563eb",
  literals: ["#2563eb"],
  shades: {
    ...(shades.dark ? { dark: "#1d4ed8" } : {}),
    ...(shades.light ? { light: "#60a5fa" } : {}),
  },
});

const INSTRUMENT_SERIF_FILES = [
  { path: "fonts/InstrumentSerif-Regular.woff2", src: "/templates/quote/fonts/InstrumentSerif-Regular.woff2" },
  { path: "fonts/InstrumentSerif-Italic.woff2", src: "/templates/quote/fonts/InstrumentSerif-Italic.woff2" },
  { path: "fonts/InstrumentSerif-OFL.txt", src: "/templates/quote/fonts/InstrumentSerif-OFL.txt" },
] as const;

export const PRESETS: readonly PresetDef[] = [
  {
    slug: "lower-third",
    tutorialSlug: "/get-started",
    rootSelector: ".l3rd",
    primaryColor: "accent",
    colors: [BLUE_ACCENT({ dark: true, light: true }), INK, WHITE_SURFACE],
    offsets: [
      { id: "offsetX", selector: ".l3rd", props: ["left"], default: 48 },
      { id: "offsetY", selector: ".l3rd", props: ["bottom"], default: 64 },
    ],
    requiredFonts: [],
  },
  {
    slug: "bug",
    tutorialSlug: "/tutorials/bug",
    rootSelector: ".bug",
    primaryColor: "live",
    colors: [{ id: "live", default: "#ef4444", literals: ["#ef4444"] }, INK, WHITE_SURFACE],
    offsets: [
      { id: "offsetX", selector: ".bug", props: ["right"], default: 40 },
      { id: "offsetY", selector: ".bug", props: ["top"], default: 40 },
    ],
    requiredFonts: [],
  },
  {
    slug: "ticker",
    tutorialSlug: "/tutorials/ticker",
    rootSelector: ".ticker",
    primaryColor: "accent",
    colors: [BLUE_ACCENT({ dark: true }), INK, WHITE_SURFACE],
    offsets: [],
    requiredFonts: [],
  },
  {
    slug: "quote",
    tutorialSlug: "/tutorials/quote",
    rootSelector: ".quote-root",
    primaryColor: "accent",
    colors: [
      BLUE_ACCENT({ light: true }),
      { id: "backdrop", default: "#0f172a", literals: ["#0f172a"], shades: { light: "#1e293b" } },
    ],
    offsets: [],
    requiredFonts: INSTRUMENT_SERIF_FILES,
  },
  {
    slug: "score-bug",
    tutorialSlug: "/tutorials/score-bug",
    rootSelector: ".score-bug-root",
    primaryColor: "accent",
    colors: [
      { ...BLUE_ACCENT({ light: true }), rgbaPrefixes: ["rgba(37, 99, 235,"] },
      { id: "surface", default: "#0f172a", literals: [], rgbaPrefixes: ["rgba(15, 23, 42,"] },
    ],
    offsets: [
      { id: "offsetX", selector: ".score-bug", props: ["left"], default: 24 },
      { id: "offsetY", selector: ".score-bug", props: ["top"], default: 24 },
    ],
    requiredFonts: [],
  },
  {
    slug: "countdown",
    tutorialSlug: "/tutorials/countdown",
    rootSelector: ".countdown-root",
    primaryColor: "accent",
    colors: [
      BLUE_ACCENT({ light: true }),
      INK,
      { id: "urgent", default: "#dc2626", literals: ["#dc2626"] },
      WHITE_SURFACE,
    ],
    offsets: [],
    requiredFonts: [],
  },
  {
    slug: "breaking-news",
    tutorialSlug: "/tutorials/breaking-news",
    rootSelector: ".breaking-news-root",
    primaryColor: "alert",
    colors: [
      { id: "alert", default: "#dc2626", literals: ["#dc2626"] },
      { id: "overlay", default: "#000000", literals: [], rgbaPrefixes: ["rgba(0, 0, 0,"] },
    ],
    offsets: [],
    requiredFonts: [],
  },
  {
    slug: "election-bars",
    tutorialSlug: "/tutorials/election-bars",
    rootSelector: ".election-bars-root",
    primaryColor: "ink",
    colors: [INK, WHITE_SURFACE],
    offsets: [
      { id: "offsetX", selector: ".election", props: ["left", "right"], default: 48 },
      { id: "offsetY", selector: ".election", props: ["bottom"], default: 60 },
    ],
    requiredFonts: [],
  },
  {
    slug: "sport-lineup",
    tutorialSlug: "/tutorials/sport-lineup",
    rootSelector: ".sport-lineup-root",
    primaryColor: "accent",
    colors: [
      BLUE_ACCENT({}),
      { ...INK, shades: { light: "#1e293b" } },
      {
        ...WHITE_SURFACE,
        declarations: [{ from: "background: white;", to: "background: rgb(var(--og-surface-rgb));" }],
      },
    ],
    offsets: [],
    requiredFonts: [],
  },
  {
    slug: "social-card",
    tutorialSlug: "/tutorials/social-card",
    rootSelector: ".social-card-root",
    primaryColor: "accent",
    colors: [BLUE_ACCENT({ dark: true }), INK, WHITE_SURFACE],
    offsets: [
      { id: "offsetX", selector: ".social", props: ["right"], default: 48 },
      { id: "offsetY", selector: ".social", props: ["bottom"], default: 80 },
    ],
    requiredFonts: [],
  },
  {
    slug: "weather",
    tutorialSlug: "/tutorials/weather",
    rootSelector: ".weather-root",
    primaryColor: "accent",
    colors: [BLUE_ACCENT({ light: true }), INK, WHITE_SURFACE],
    offsets: [
      { id: "offsetX", selector: ".weather", props: ["left"], default: 48 },
      { id: "offsetY", selector: ".weather", props: ["bottom"], default: 60 },
    ],
    requiredFonts: [],
  },
];

export function presetDef(slug: PresetSlug): PresetDef {
  const found = PRESETS.find((p) => p.slug === slug);
  if (!found) throw new Error(`unknown preset: ${slug}`);
  return found;
}
