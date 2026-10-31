import type { FontChoice, FontChoiceId } from "./types";

/**
 * The fonts that ship with the tutorial templates, so a generated package can
 * swap between them without a network request at render time. Files are
 * fetched from the template folders that already host them.
 */
const INTER_FACE = `@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;          /* variable axis — one file covers every weight */
  font-display: block;           /* block, not swap: never flash a fallback on air */
  src: url('./fonts/Inter-Variable.woff2') format('woff2-variations');
}
`;

const INSTRUMENT_SERIF_FACE = `@font-face {
  font-family: 'Instrument Serif';
  font-style: italic;
  font-weight: 400;
  font-display: block;
  src: url('./fonts/InstrumentSerif-Italic.woff2') format('woff2');
}

@font-face {
  font-family: 'Instrument Serif';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('./fonts/InstrumentSerif-Regular.woff2') format('woff2');
}
`;

export const FONT_CHOICES: readonly FontChoice[] = [
  {
    id: "inter",
    family: "Inter",
    files: [
      { path: "fonts/Inter-Variable.woff2", src: "/templates/lower-third/fonts/Inter-Variable.woff2" },
      { path: "fonts/LICENSE.txt", src: "/templates/lower-third/fonts/LICENSE.txt" },
    ],
    faceCss: INTER_FACE,
  },
  {
    id: "instrument-serif",
    family: "Instrument Serif",
    files: [
      { path: "fonts/InstrumentSerif-Regular.woff2", src: "/templates/quote/fonts/InstrumentSerif-Regular.woff2" },
      { path: "fonts/InstrumentSerif-Italic.woff2", src: "/templates/quote/fonts/InstrumentSerif-Italic.woff2" },
      { path: "fonts/InstrumentSerif-OFL.txt", src: "/templates/quote/fonts/InstrumentSerif-OFL.txt" },
    ],
    faceCss: INSTRUMENT_SERIF_FACE,
  },
  {
    id: "system",
    family: null,
    files: [],
    faceCss: "",
  },
];

export function fontChoice(id: FontChoiceId): FontChoice {
  const found = FONT_CHOICES.find((f) => f.id === id);
  if (!found) throw new Error(`unknown font choice: ${id}`);
  return found;
}

/** The value of `--og-font`; the declaration adds the generic fallbacks. */
export function fontFamilyValue(choice: FontChoice): string {
  return choice.family ? `'${choice.family}'` : "system-ui";
}
