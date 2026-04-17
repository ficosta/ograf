/**
 * Thin loader for news-related content.
 *
 * All data lives in sibling JSON files, so non-devs can edit them directly
 * without touching TypeScript:
 *
 *   news-items.json    — blog posts, articles, community threads
 *   events.json        — conferences, talks, meetups (upcoming + past)
 *   presentations.json — decks and PDFs (local copies under /public/docs/)
 *   videos.json        — YouTube videos to embed on the News page
 *   resources.json     — reference links surfaced in the "Reference links" block
 *
 * To add or edit content, open the relevant JSON file. The types defined here
 * are enforced at build time, so malformed data fails typecheck.
 */

import newsItemsJson from "./news-items.json";
import eventsJson from "./events.json";
import presentationsJson from "./presentations.json";
import videosJson from "./videos.json";
import resourcesJson from "./resources.json";

export type NewsType = "announcement" | "article" | "community";

export interface NewsItem {
  readonly date: string;
  readonly title: string;
  readonly source: string;
  readonly url: string;
  readonly type: NewsType;
  readonly summary: string;
}

export interface Event {
  readonly date: string;
  readonly endDate?: string;
  readonly title: string;
  readonly location: string;
  readonly speaker?: string;
  readonly url: string;
  readonly summary: string;
}

export interface Presentation {
  readonly date: string;
  readonly title: string;
  readonly speaker?: string;
  readonly localUrl?: string;
  readonly externalUrl: string;
  readonly summary: string;
}

export interface Video {
  readonly youtubeId: string;
  readonly title: string;
  readonly author: string;
  readonly summary: string;
}

export interface Resource {
  readonly title: string;
  readonly url: string;
  readonly description: string;
}

export const NEWS_ITEMS = newsItemsJson as readonly NewsItem[];
export const EVENTS = eventsJson as readonly Event[];
export const PRESENTATIONS = presentationsJson as readonly Presentation[];
export const VIDEOS = videosJson as readonly Video[];
export const RESOURCES = resourcesJson as readonly Resource[];
