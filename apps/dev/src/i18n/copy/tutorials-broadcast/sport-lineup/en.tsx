import { CODE, CODE_AMBER } from "../styles";

export const en = {
  title: "Build a sport lineup card.",
  intro: "The pre-match lineup graphic is a staple of sports broadcasting — from Premier League coverage to the World Cup. A grid of player cards reveals one by one, showing number, name, and position, with the formation and coach in the footer.",
  demoTitle: "Sport Lineup — OGraf Template",
  fields: { team: "Team", meta: "Match Info", formation: "Formation", coach: "Coach", players: "Players" },
  differentTitle: "What's different from other graphics?",
  cards: [
    {
      title: "Grid layout",
      body: (
        <>
          Uses CSS Grid with <code className={CODE}>auto-fill</code> columns at least 120px wide. Cards reflow naturally whether you have 11 players or 5 subs.
        </>
      ),
    },
    {
      title: "Staggered cards",
      body: (
        <>
          Each player card gets an inline <code className={CODE}>transition-delay</code> of 300 ms + 60 ms per card, creating a wave of cards appearing across the grid.
        </>
      ),
    },
    {
      title: "Three-part structure",
      body: <>Dark gradient header with team name and match info, then the player grid, then a footer with formation and coach — three distinct visual zones.</>,
    },
  ],
  renderTitle: "Rendering the players",
  renderBody: (
    <>
      <code className={CODE}>_renderPlayers</code> builds a <code className={CODE}>.lineup-card</code> for each player: the number in a dark circle, the name, and the position beneath it. Every value goes through <code className={CODE}>escapeHtml</code> before it lands in the markup, and each card's <code className={CODE}>transition-delay</code> is calculated from its index. <code className={CODE}>load</code> and <code className={CODE}>updateAction</code> both call <code className={CODE}>_applyData</code>, which only touches fields that are not <code className={CODE}>undefined</code> — so a partial update changes just what it sends, an empty string blanks a field (for formation and coach, the "Formation:" / "Coach:" label goes too), and a <code className={CODE}>players</code> array re-renders the grid.
    </>
  ),
  playTitle: "Playing it on air",
  playBody: (
    <>
      <code className={CODE}>resolveTargetStep</code> implements the OGraf step model: <code className={CODE}>goto</code> if given, otherwise the current step (-1 before the first play) plus <code className={CODE}>delta</code>, default 1. With one step, the first play lands on step 0 and a second play goes past the end, so the graphic stops and returns <code className={CODE}>currentStep: undefined</code>. On step 0, <code className={CODE}>playAction</code> adds <code className={CODE}>visible</code> and waits until the last card has finished: 300 ms + 60 ms per card + 500 ms for the card's own transition. <code className={CODE}>stopAction</code> fades out over 400 ms and only clears the classes if no newer action (a higher <code className={CODE}>this._rev</code>) has started meanwhile.
    </>
  ),
  cssTitle: "The CSS — grid and card reveal",
  cssBody: (
    <>
      The player grid uses <code className={CODE}>grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))</code> so it adapts to the container width; a 2px gap over a light grey background draws the dividers between cards. Each card fades in and rises 12px when the parent gets the <code className={CODE}>visible</code> class. The reset is scoped with <code className={CODE}>:where(.sport-lineup-root, …)</code>, so it never restyles the renderer's page.
    </>
  ),
  tipTitle: "Design tip",
  tipBody: (
    <>
      Use <code className={CODE_AMBER}>auto-fill</code> instead of a fixed column count. This way the grid gracefully handles 11 starters, 5 substitutes, or any other roster size without layout changes in the template code.
    </>
  ),
  manifestTitle: "Sport Lineup",
  manifestIntro: "The players field is a typed array — items.type is object with required number, name, and position. A controller can add, remove, and reorder rows automatically.",
  doneTitle: "Sport lineup complete.",
  doneBody: "CSS Grid, staggered card reveals, and a clean header/footer structure — ready for matchday broadcasts.",
  codeLabels: {
    rendering: "rendering",
    stepModel: "step model",
    keyParts: "key parts",
  },
  next: "Next: Score Bug",
};

export type SportLineupCopy = typeof en;
