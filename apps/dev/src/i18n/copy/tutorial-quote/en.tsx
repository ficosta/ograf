import { CODE_AMBER, CODE_SLATE_SM, STRONG } from "../tutorial-ui/styles";

export const en = {
  title: "Build a full page quote.",
  lead: "An elegant full-screen quote card — the kind used for interview soundbites, motivational segments, or editorial intros. The text, divider, and attribution reveal in a staggered sequence for cinematic impact.",
  demo: {
    text: "Quote",
    author: "Author",
    role: "Role",
    heading: "Full Page Quote — OGraf Template",
  },
  staggerTitle: "The staggered reveal technique",
  staggerBody: (
    <>
      The magic here is <strong className={STRONG}>CSS transition delays</strong>. The text and attribution start transparent and slightly below their final position; the divider starts at zero width. When the <code className={CODE_SLATE_SM}>.visible</code> class is added, they animate in sequence:
    </>
  ),
  stagger: [
    { delay: "0.3s", element: "Quote text", desc: "Fades up from below" },
    { delay: "0.4s", element: "Divider line", desc: "Scales from center" },
    { delay: "0.5s", element: "Attribution", desc: "Fades up last" },
  ],
  cssTitle: "The CSS — staggered transitions",
  cssBody: (
    <>
      Everything lives inside <code className={CODE_SLATE_SM}>.quote-root</code>. The reset is scoped with <code className={CODE_SLATE_SM}>:where(.quote-root, …)</code>, so it never restyles the renderer's page, and the root fills whatever box the renderer provides with <code className={CODE_SLATE_SM}>position: absolute; inset: 0</code>. Each child's hidden state (like <code className={CODE_SLATE_SM}>.quote-text</code> below) sits 20px low at zero opacity; the <code className={CODE_SLATE_SM}>.visible</code> rules carry the delays.
    </>
  ),
  cssFile: "style.css (key parts)",
  tipTitle: "Design tip",
  tip: (
    <>
      The background uses <code className={CODE_AMBER}>scale(1.1)</code> as its starting state, then transitions to <code className={CODE_AMBER}>scale(1)</code>. This creates a subtle "camera settling" effect — the background gently zooms in as the quote appears. Cinematic feel with one line of CSS.
    </>
  ),
  typeTitle: "Typography choices",
  typeBody: (
    <>
      This template uses <strong className={STRONG}>two fonts</strong> for contrast:
    </>
  ),
  serifSample: "\"The quote\"",
  serifDesc: "Instrument Serif — italic, large (48px). The editorial, elegant voice.",
  sansSample: "The Attribution",
  sansRole: "ROLE / TITLE",
  sansDesc: "Inter — clean, modern sans-serif. The factual voice.",
  timingTitle: "The playAction timing",
  timing: [
    <>Since the staggered animation takes longer than a simple slide, the <code className={CODE_SLATE_SM}>playAction()</code> promise waits <strong className={STRONG}>1300ms</strong> before it resolves — the length of the slowest reveal. By then the background (1s), the quote text (0.3s delay + 0.8s), the divider (0.4s + 0.6s) and the attribution (0.5s + 0.8s) have all landed. <code className={CODE_SLATE_SM}>stopAction()</code> fades the whole card out over 500ms.</>,
    <>The rest follows the OGraf step model. <code className={CODE_SLATE_SM}>resolveTargetStep()</code> takes <code className={CODE_SLATE_SM}>goto</code> if given, otherwise the current step plus <code className={CODE_SLATE_SM}>delta</code> (default 1). The first play puts the quote on air at step 0; a second play goes past the single step, so it runs the stop and returns <code className={CODE_SLATE_SM}>currentStep: undefined</code>. Each action bumps <code className={CODE_SLATE_SM}>this._rev</code>, and a stop only removes <code className={CODE_SLATE_SM}>.visible</code> if nothing newer has started — play → stop → play without waiting ends on air.</>,
  ],
  playFile: "graphic.mjs (key parts)",
  downloadTitle: "Full Page Quote",
  done: {
    title: "Quote complete.",
    body: "You've learned staggered CSS transitions, full-screen layouts, typographic contrast, and timing coordination between CSS and JavaScript.",
    spec: "Read the spec guide",
  },
};

export type TutorialQuoteCopy = typeof en;
