export const en = {
  title: "How OGraf got here.",
  lead: "Every major decision, proposal, and fix that shaped the spec — straight from the working group's resolved discussions on GitHub. Expand any entry to read the original thread.",
  viewSource: "View the live source on GitHub",
  stats: {
    resolved: "Resolved",
    shipped: "Shipped",
    window: "Window",
  },
  /** Stat tiles counting entries by their GitHub labels. */
  categories: {
    graphics: "Graphics",
    manifest: "Manifest",
    gddData: "GDD / Data",
    bugFixes: "Bug fixes",
    other: "Other",
  },
  ctaTitle: "Want to shape what comes next?",
  ctaBody:
    "Open discussions, proposals, and active work live on the EBU OGraf repository. Anyone can read, comment, and contribute.",
  ctaButton: "Join the discussion on GitHub",
  card: {
    merged: (pr: number) => `Merged #${pr}`,
    toggle: (expanded: boolean) => `${expanded ? "Hide" : "Read"} discussion`,
    comments: (n: number) => `(${n} ${n === 1 ? "comment" : "comments"})`,
    opened: "opened this discussion",
  },
};

export type HistoryCopy = typeof en;
export type HistoryCategory = keyof HistoryCopy["categories"];
