import { CODE, CODE_AMBER, CODE_BLUE, STRONG } from "../styles";

export const en = {
  title: "Build a live score bug.",
  intro: (
    <>
      The score bug is the persistent graphic in the corner of every live sports broadcast — showing teams, scores, time, and period. This tutorial covers the full lifecycle including <strong className={STRONG}>customActions</strong>, the OGraf mechanism for triggering one-off visual events like a goal flash without changing the graphic's step.
    </>
  ),
  demoTitle: "Score Bug — OGraf Template",
  fields: {
    home: "Home Team",
    away: "Away Team",
    homeScore: "Home Score",
    awayScore: "Away Score",
    time: "Match Time",
    period: "Period",
  },
  differentTitle: "What's different from other graphics?",
  cards: [
    {
      title: "customActions",
      body: (
        <>
          The manifest declares one custom action, <code className={CODE}>goal</code>. The renderer triggers it through <code className={CODE}>customAction</code> to flash the bug without changing its data or its step.
        </>
      ),
    },
    {
      title: "Persistent position",
      body: (
        <>
          Unlike lower thirds that play in and out, the score bug stays on screen for the entire match. It plays in once, then takes partial <code className={CODE}>updateAction</code> calls for the score, clock and period.
        </>
      ),
    },
    {
      title: "Dark, compact design",
      body: <>A small top-left card on a near-opaque dark background with a blue accent bar. It stays readable over any video: bright pitch, crowd shots, replays.</>,
    },
  ],
  customTitle: "The customAction: goal flash",
  customBody: (
    <>
      When a goal is scored, the renderer calls <code className={CODE}>{"customAction({ id, payload, skipAnimation })"}</code> with <code className={CODE}>id: "goal"</code>, one of the ids declared in the manifest's <code className={CODE}>customActions</code>. The graphic adds a <code className={CODE}>goal</code> class for 800 ms, then removes it. Nothing else changes: the score itself arrives separately through <code className={CODE}>updateAction</code>. An id the graphic doesn't know gets a 404, which is how a renderer learns the action is unsupported.
    </>
  ),
  insightTitle: "Key insight: customAction vs updateAction",
  insightBody: (
    <>
      <code className={CODE_BLUE}>updateAction</code> changes the graphic's persistent data (score, time, team names). <code className={CODE_BLUE}>customAction</code> triggers a transient visual event: it plays an animation, then the graphic returns to its previous visual state. With <code className={CODE_BLUE}>skipAnimation</code> the flash is pure animation, so there is nothing left to do and it just returns.
    </>
  ),
  playTitle: "Playing in, and playing again",
  playBody: (
    <>
      The manifest says <code className={CODE}>stepCount: 1</code>. <code className={CODE}>resolveTargetStep</code> applies the spec's rule: <code className={CODE}>goto</code> if given, otherwise the current step (-1 before the first play) plus <code className={CODE}>delta</code>, which defaults to 1. The first play lands on step 0 and runs the 600 ms entrance. A second play targets step 1, which is past the last step, so the graphic goes to its end: it runs <code className={CODE}>stopAction</code> and returns <code className={CODE}>currentStep: undefined</code>.
    </>
  ),
  playRev: (
    <>
      Every action takes the next <code className={CODE}>this._rev</code>. <code className={CODE}>stopAction</code> only removes the <code className={CODE}>visible</code> class if no newer action started during its 400 ms exit, so play → stop → play sent without waiting ends on air.
    </>
  ),
  cssTitle: "The CSS: goal flash effect",
  cssBody: "The flash is a single keyframe animation on the inner card. It keeps the card's normal drop shadow and grows a blue glow around it, peaking halfway through, then fades back to nothing. Its 0.8 s duration matches the 800 ms the graphic waits before removing the class.",
  leaderTitle: "Highlighting the leader",
  leaderBody: (
    <>
      After every load and update, the team with more goals gets an <code className={CODE}>active</code> class; on a draw neither does. Updates may be partial, so a clock-only update carries no scores: the graphic then falls back to the scores already on screen instead of dropping the highlight.
    </>
  ),
  tipTitle: "Design tip",
  tipBody: (
    <>
      The leader's score turns light blue and its name goes pure white. It's a small cue, common in premium sports broadcasts, that tells viewers who is ahead at a glance without adding anything to the layout. When a score does change, <code className={CODE_AMBER}>updateAction</code> also gives the number a 350 ms <code className={CODE_AMBER}>updating</code> pop.
    </>
  ),
  manifestTitle: "Score Bug",
  manifestIntro: "Notice the customActions array: that's how OGraf declares graphic-specific operations beyond play, update and stop. The renderer only sends ids listed there, and the graphic answers anything else with a 4xx (this one uses 404).",
  doneTitle: "Score bug complete.",
  doneBody: "Persistent positioning, live updates via updateAction, and transient goal flashes via customAction — the full live sports toolkit.",
  codeLabels: {
    stepModel: "step model",
    goalFlash: "goal flash",
    activeTeam: "active team",
  },
  next: "Next: Countdown",
};

export type ScoreBugCopy = typeof en;
