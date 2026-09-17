/**
 * Shared UI strings — the chrome every page uses. Page-specific prose lives
 * next to its page, not here. `Messages` is derived from this file, so the
 * other languages fail to type-check the moment a key is added here and not
 * there.
 */
export const en = {
  nav: {
    home: "Home",
    tutorials: "Tutorials",
    tools: "Tools",
    ecosystem: "Ecosystem",
    history: "History",
    news: "News",
    spec: "Spec",
    about: "About",
    getStarted: "Get started",
    toggleNavigation: "Toggle navigation",
    language: "Language",
  },
  footer: {
    quickLinks: "Quick links",
    cookiePreferences: "Cookie preferences",
    githubLabel: "ograf.dev on GitHub",
    curatedBy: "Curated by Felipe Iasi with the OGraf community.",
    notAffiliated: "Not affiliated with the EBU · Source available — see",
    spottedSomething: "· Spotted something off?",
    openIssue: "open a pull request or issue",
  },
  common: {
    loading: "Loading...",
    allTutorials: "All tutorials",
    difficulty: {
      Beginner: "Beginner",
      Intermediate: "Intermediate",
      Advanced: "Advanced",
    },
    translationNotice: "",
  },
};

export type Messages = typeof en;
