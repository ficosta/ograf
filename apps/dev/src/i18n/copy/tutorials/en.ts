export const en = {
  eyebrow: "Tutorials",
  title: "Learn by building real graphics.",
  intro:
    "Each tutorial builds a production-quality broadcast graphic from scratch. Live demos you can interact with, full source code, and step-by-step explanations. Start with the lower third, then explore more complex patterns.",
  demoTitle: (tutorial: string) => `${tutorial} — OGraf Template`,
  startThis: "Start this tutorial",
  ideaTitle: "Have an idea for a tutorial?",
  ideaBody:
    "We're always looking for new graphic types to cover — scoreboards, tickers, data visualizations, AR overlays, or anything you've seen on air and want to learn how to build.",
  suggest: "Suggest a tutorial on GitHub",
  /** TutorialCards */
  cards: {
    moreTutorials: "More tutorials",
    viewAll: (n: number) => `View all ${n}`,
    previewAlt: (tutorial: string) => `${tutorial} preview`,
  },
};

export type TutorialsCopy = typeof en;
