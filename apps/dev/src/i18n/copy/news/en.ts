import type { NewsType } from "../../../content/news";

export const en = {
  title: "News, events & talks.",
  lead: "Everything OGraf, in one place — announcements, editorial coverage, conference sessions, presentation decks, and demo videos.",
  stats: {
    news: "News items",
    upcoming: "Upcoming events",
    past: "Past events",
    decks: "Decks",
    videos: "Videos",
  },
  typeLabels: {
    announcement: "Announcement",
    article: "Article",
    community: "Community",
  } satisfies Record<NewsType, string>,
  pastBadge: "Past",
  watchOnYouTube: "Watch on YouTube",
  localCopy: "Local copy",
  ebuSignIn: "EBU sign-in",
  openPdf: "Open PDF",
  viewOnEbu: "View on EBU",
  source: "source",
  upcomingTitle: "Upcoming events",
  upcomingLead: "Conferences, talks, and meetups with OGraf on the agenda.",
  pastTitle: "Past events",
  pastLead: "Sessions and roundtables worth catching the recordings or decks for.",
  videosTitle: "Videos & demos",
  videosLead: "OGraf in motion — workflow demos and walkthroughs from the ecosystem.",
  decksTitle: "Presentations & decks",
  decksLead:
    "EBU webinars, NTS sessions, and tech-i magazine features. Local copies served here when possible; the rest link to the EBU archive.",
  newsTitle: "Latest news",
  newsLead: "Announcements, deep dives, and industry coverage.",
  resourcesTitle: "Reference links",
  resourcesLead: "Official spec, repos, and pages to watch for fresh OGraf coverage.",
  ctaTitle: "Spotted something we missed?",
  ctaBody:
    "Article, talk, deck, video, or community thread — if it's OGraf-relevant, we want to list it. Open an issue and we'll add it.",
  ctaButton: "Submit on GitHub",
};

export type NewsCopy = typeof en;
