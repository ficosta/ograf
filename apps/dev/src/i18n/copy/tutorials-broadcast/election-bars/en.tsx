import { CODE, CODE_AMBER, CODE_BLUE_LIGHT, STRONG } from "../styles";

export const en = {
  title: "Build election result bars.",
  intro: "Election bars are the backbone of results night coverage — think CNN's election night or the BBC's general election broadcast. Each row represents a party with a color-coded bar that grows to its vote percentage, creating a visceral, at-a-glance comparison of results.",
  demoTitle: "Election Bars — OGraf Template",
  fields: { title: "Title", subtitle: "Subtitle", parties: "Parties" },
  differentTitle: "What's different from a lower third?",
  cards: [
    {
      title: "Data-driven widths",
      body: (
        <>
          Each fill carries its percentage in <code className={CODE}>data-pct</code>, and <code className={CODE}>_animateBars</code> sets <code className={CODE}>fill.style.width = pct + '%'</code> inline. The data controls the visual, not a CSS class.
        </>
      ),
    },
    {
      title: "Staggered reveal",
      body: (
        <>
          Rows get the <code className={CODE}>show</code> class 120 ms apart, on top of an inline <code className={CODE}>transition-delay</code> of 100 ms per row, so they cascade in from top to bottom.
        </>
      ),
    },
    {
      title: "Color-coded identity",
      body: (
        <>
          Each party's <code className={CODE}>color</code> comes from the data and becomes the fill's inline background — no hardcoded palette. Works for any election, any country, any party system.
        </>
      ),
    },
  ],
  renderTitle: "Rendering the bars",
  renderBody: (
    <>
      <code className={CODE}>_renderBars</code> builds one <code className={CODE}>.election-row</code> per party: name and vote count on the left, a track with a colored fill on the right, and a percentage label that starts at <code className={CODE}>0%</code>. Name and color go through <code className={CODE}>escapeHtml</code>, and <code className={CODE}>pct</code> and <code className={CODE}>votes</code> through <code className={CODE}>Number()</code>, so operator data can't inject markup. The key trick: <strong className={STRONG}>nothing grows yet</strong>. Every fill starts at <code className={CODE}>width: 0</code>, and its target waits in <code className={CODE}>data-pct</code> until <code className={CODE}>_animateBars</code> runs.
    </>
  ),
  animateBody: (
    <>
      <code className={CODE}>_animateBars</code> shows the rows 120 ms apart, then after 200 ms writes every fill's width and moves each label to the bar's edge; 150 ms later the label counts up from 0 over 900 ms with an ease-out curve. A later <code className={CODE}>updateAction</code> that includes <code className={CODE}>parties</code> re-renders the rows; on air it runs <code className={CODE}>_animateBars</code> again so the bars regrow to the new results, and off air it leaves them for the next play. Every timer inside <code className={CODE}>_animateBars</code> checks the revision it started under, so a stop that lands mid-reveal is never overwritten, and <code className={CODE}>stopAction</code> calls <code className={CODE}>_resetBars</code> once the panel is gone so a replay grows the bars from zero again.
    </>
  ),
  playTitle: "Playing it on air",
  playBody: (
    <>
      <code className={CODE}>playAction</code> follows the OGraf step model. <code className={CODE}>resolveTargetStep</code> picks the target: <code className={CODE}>goto</code> if given, otherwise the current step (-1 before the first play) plus <code className={CODE}>delta</code>, which defaults to 1. This graphic has one step, so the first play lands on step 0 and a second play goes past the end — the graphic runs <code className={CODE}>stopAction</code> and returns <code className={CODE}>currentStep: undefined</code>. On step 0 it adds <code className={CODE}>visible</code> to slide the panel up, waits 400 ms, then starts the bars and resolves 1400 ms later. With <code className={CODE}>skipAnimation</code> it adds <code className={CODE}>instant</code> to the root — a class that switches every transition off — and <code className={CODE}>_showBarsInstantly</code> sets the final widths and labels at once.
    </>
  ),
  revTitle: "Why the revision counter?",
  revBody: (
    <>
      Every play and stop takes the next <code className={CODE_BLUE_LIGHT}>this._rev</code>. If a newer action arrives during the 400 ms wait, <code className={CODE_BLUE_LIGHT}>playAction</code> skips <code className={CODE_BLUE_LIGHT}>_animateBars</code>, and a stale <code className={CODE_BLUE_LIGHT}>stopAction</code> won't hide the panel — so play → stop → play sent without waiting ends on air.
    </>
  ),
  cssTitle: "The CSS — bar animation",
  cssBody: (
    <>
      Rows slide in from 20px left when they get <code className={CODE}>show</code>. The fill transitions <code className={CODE}>width</code> over 1.2 s, and the percentage label transitions <code className={CODE}>left</code> with the same duration and curve, so it rides the edge of the growing bar. The reset at the top is scoped with <code className={CODE}>:where(.election-bars-root, …)</code>, so it never restyles the renderer's page.
    </>
  ),
  tipTitle: "Design tip",
  tipBody: (
    <>
      Use asymmetric percentage labels. <code className={CODE_AMBER}>_renderBars</code> gives the label the <strong>inside</strong> class when the party has 15% or more (white text, pulled back inside the bar) and <strong>outside</strong> below that (dark text just past the bar's end). Tiny bars never have to fit a label they can't hold — a common pitfall in election graphics.
    </>
  ),
  formatTitle: "Number formatting",
  formatBody: (
    <>
      Large vote counts are hard to read without separators. <code className={CODE}>_renderBars</code> writes <code className={CODE}>{"(Number(p.votes) || 0).toLocaleString()"}</code>, which adds thousands separators for the renderer's locale — <strong className={STRONG}>1,284,000</strong> is far more readable than 1284000. <code className={CODE}>votes</code> is optional in the schema, so a missing value shows as 0. The percentage label is formatted separately: <code className={CODE}>_countUp</code> rounds each eased frame to a whole number.
    </>
  ),
  manifestTitle: "Election Bars",
  manifestIntro: "The parties field is a typed array — items.type is object with required name, pct, and color. That's how OGraf declares structured repeating data.",
  doneTitle: "Election bars complete.",
  doneBody: "Data-driven widths, staggered reveals, color-coded parties, and a spec-compliant step model — everything you need for results night coverage.",
  codeLabels: {
    rendering: "rendering",
    animation: "animation",
    stepModel: "step model",
    keyParts: "key parts",
    countUp: "count-up",
  },
  next: "Next: Sport Lineup",
};

export type ElectionBarsCopy = typeof en;
