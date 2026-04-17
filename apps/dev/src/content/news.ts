/**
 * News items and events curated by the community.
 * Keep entries sorted newest-first. Add source attribution honestly —
 * if you haven't verified the date, leave it approximate (e.g. "2026-04")
 * and prefer checking the article itself rather than guessing.
 */

export type NewsType = "announcement" | "article" | "community";

export interface NewsItem {
  /** ISO date (YYYY-MM-DD) when the article was published. Approximate is ok — just document it. */
  readonly date: string;
  readonly title: string;
  readonly source: string;
  readonly url: string;
  readonly type: NewsType;
  readonly summary: string;
}

export interface Event {
  /** ISO date (YYYY-MM-DD) of the event itself. */
  readonly date: string;
  /** Optional ISO end date for multi-day events. */
  readonly endDate?: string;
  readonly title: string;
  readonly location: string;
  readonly speaker?: string;
  readonly url: string;
  readonly summary: string;
}

export const NEWS_ITEMS: readonly NewsItem[] = [
  {
    date: "2026-04-13",
    title: "Maps Without Borders: Everviz joins the OGraf revolution",
    source: "Everviz",
    url: "https://www.everviz.com/blog/maps-without-borders-everviz-joins-the-ograf-revolution/",
    type: "announcement",
    summary:
      "Everviz adds native OGraf export to their interactive maps and dynamic charts. Create a map once, play it on any OGraf-compliant renderer — SPX, Erizos, and beyond.",
  },
  {
    date: "2026-04-01",
    title: "From HTML Graphics to Agile Storytelling",
    source: "Media Tailor",
    url: "https://mediatailor.fi/blog/from-html-graphics-to-agile-storytelling-key-insights-from-the-mediatech-festival-2026/",
    type: "article",
    summary:
      "Takeaways from MediaTech Festival 2026. Media Tailor frames OGraf as the industry's open answer to decades of vendor lock-in and details their investment in SPX Graphics to accelerate Nordic adoption.",
  },
  {
    date: "2025-08-20",
    title: "Loopic at IBC 2025",
    source: "Loopic",
    url: "https://docs.loopic.io/blog/loopic-at-ibc-2025",
    type: "announcement",
    summary:
      "Loopic showcases one-click OGraf export at IBC — their no-code HTML graphics editor now produces OGraf packages playable on any compliant renderer.",
  },
];

export const EVENTS: readonly Event[] = [
  {
    date: "2026-04-18",
    title: "SMPTE VIBE: OGraf — Making Broadcast Graphics Open and Interoperable",
    location: "NAB Show, Las Vegas · N259LMR · 2:20–2:35 p.m.",
    speaker: "Willem Vermost, EBU",
    url: "https://www.nabshow.com/session/smpte-vibe-ograf-making-broadcast-graphics-open-and-interoperable/",
    summary:
      "The EBU's Willem Vermost introduces OGraf at SMPTE's VIBE conference — how one graphic package runs across mixed vendor stacks, covering live broadcast, streaming, and post-production.",
  },
];
