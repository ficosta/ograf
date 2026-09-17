import { CODE, CODE_BLUE } from "../styles";

export const en = {
  title: "Build a breaking news alert.",
  intro: (
    <>
      The breaking news alert is a full-screen interrupt — a bold, red overlay that demands attention. Unlike other graphics, it uses <code className={CODE}>stepCount: 0</code>, meaning it's fire-and-forget: one play takes it in, it holds, and it dismisses itself without the operator having to take it out.
    </>
  ),
  demoTitle: "Breaking News — OGraf Template",
  fields: { headline: "Headline" },
  differentTitle: "What's different from other graphics?",
  cards: [
    {
      title: "Fire-and-forget",
      body: (
        <>
          <code className={CODE}>stepCount: 0</code> in the manifest. The graphic plays in, holds for 3.5 s, then dismisses itself. No operator needed to take it out, though a stop can still cut it short.
        </>
      ),
    },
    {
      title: "Full-screen overlay",
      body: <>Fills the graphic's whole box with an 85% black, blurred backdrop. The red "Breaking News" badge and the headline sit centred on top.</>,
    },
    {
      title: "Staggered reveal",
      body: (
        <>
          One <code className={CODE}>visible</code> class drives three elements with different transition delays: badge, then headline, then the accent line.
        </>
      ),
    },
  ],
  dismissTitle: "The auto-dismiss pattern",
  timingBody: "The timing lives in three constants: 1.2 s for the entrance to land, 3.5 s on air, 0.6 s for the exit.",
  playBody: (
    <>
      <code className={CODE}>playAction</code> adds the <code className={CODE}>visible</code> class and waits only for the entrance. It then starts <code className={CODE}>_autoDismiss</code> without awaiting it and returns <code className={CODE}>currentStep: undefined</code>. The hold and the exit carry on in the background, and the renderer is free to send its next action as soon as the alert is on screen.
    </>
  ),
  insightTitle: "Key insight: stepCount: 0",
  insightBody: (
    <>
      <code className={CODE_BLUE}>stepCount: 0</code> tells the renderer the graphic has no steps of its own: it plays in and ends by itself. The renderer still calls <code className={CODE_BLUE}>playAction</code>, which must return <code className={CODE_BLUE}>currentStep: undefined</code>. The spec says the promise should resolve once the graphic is ready for the next action, so it resolves after the entrance (<code className={CODE_BLUE}>IN_MS</code>), not after the whole hold and exit.
    </>
  ),
  stopTitle: "Stopping it early",
  stopBody: (
    <>
      Fire-and-forget doesn't mean unstoppable. A renderer can still call <code className={CODE}>stopAction</code> to take the alert off before the hold ends, and <code className={CODE}>updateAction</code> can swap the headline while it's up. Every action takes the next <code className={CODE}>this._rev</code>. The background <code className={CODE}>_autoDismiss</code> checks that number after its hold and again after the exit, so a pending dismiss from an earlier play never hides a newer one: play → stop → play sent without waiting ends on air. <code className={CODE}>customAction</code> must exist even though the manifest declares none, and it answers every id with 404.
    </>
  ),
  cssTitle: "The CSS: urgency design",
  cssBody: (
    <>
      The whole overlay fades in over 0.4 s. Inside it, the badge scales out from the centre after 0.2 s, the headline rises into place after 0.4 s, and the accent line draws after 0.6 s: all started by the same <code className={CODE}>visible</code> class, staggered only by <code className={CODE}>transition-delay</code>. The accent line is the last to land, at 1.2 s, which is where <code className={CODE}>IN_MS</code> comes from. On exit the <code className={CODE}>out</code> rules collapse the badge and line and fade everything over 0.6 s.
    </>
  ),
  tipTitle: "Design tip",
  tipBody: "The pulsing white dot in the red badge adds urgency without being distracting. It's a subtle but effective broadcast convention: viewers associate that blinking dot with live, important content. The animation is slow (a 1.5 s cycle) so it doesn't feel frantic.",
  manifestTitle: "Breaking News",
  manifestIntro: "Notice stepCount: 0: that's how OGraf declares a graphic that plays in and ends on its own. The renderer still calls playAction, which returns currentStep: undefined once the entrance has landed.",
  doneTitle: "Breaking news complete.",
  doneBody: "Fire-and-forget with stepCount: 0, a staggered reveal, and a background auto-dismiss that a stop can still cut short.",
  codeLabels: {
    timing: "timing",
    staggeredReveal: "staggered reveal",
    pulsingDot: "pulsing dot",
  },
  next: "Next: Weather",
};

export type BreakingNewsCopy = typeof en;
