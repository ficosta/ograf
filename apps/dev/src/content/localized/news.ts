import type { Locale } from "../../i18n/locales";
import {
  EVENTS,
  NEWS_ITEMS,
  PRESENTATIONS,
  RESOURCES,
  VIDEOS,
  type Event,
  type NewsItem,
  type Presentation,
  type Resource,
  type Video,
} from "../news";
import esEvents from "../i18n/es/events.json";
import esNews from "../i18n/es/news-items.json";
import esPresentations from "../i18n/es/presentations.json";
import esResources from "../i18n/es/resources.json";
import esVideos from "../i18n/es/videos.json";
import ptEvents from "../i18n/pt/events.json";
import ptNews from "../i18n/pt/news-items.json";
import ptPresentations from "../i18n/pt/presentations.json";
import ptResources from "../i18n/pt/resources.json";
import ptVideos from "../i18n/pt/videos.json";

export interface NewsContent {
  readonly newsItems: readonly NewsItem[];
  readonly events: readonly Event[];
  readonly presentations: readonly Presentation[];
  readonly videos: readonly Video[];
  readonly resources: readonly Resource[];
}

/** News page content per language. Shape parity is enforced by scripts/check-i18n.mjs. */
export const NEWS: Readonly<Record<Locale, NewsContent>> = {
  en: {
    newsItems: NEWS_ITEMS,
    events: EVENTS,
    presentations: PRESENTATIONS,
    videos: VIDEOS,
    resources: RESOURCES,
  },
  pt: {
    newsItems: ptNews as readonly NewsItem[],
    events: ptEvents as readonly Event[],
    presentations: ptPresentations as readonly Presentation[],
    videos: ptVideos as readonly Video[],
    resources: ptResources as readonly Resource[],
  },
  es: {
    newsItems: esNews as readonly NewsItem[],
    events: esEvents as readonly Event[],
    presentations: esPresentations as readonly Presentation[],
    videos: esVideos as readonly Video[],
    resources: esResources as readonly Resource[],
  },
};
