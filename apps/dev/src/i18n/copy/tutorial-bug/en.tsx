import { CODE_AMBER, CODE_SLATE, STRONG } from "../tutorial-ui/styles";

export const en = {
  title: "Build a bug / watermark.",
  lead: "A corner bug is a small branded element — LIVE indicator, channel logo, event badge — that sits in a corner of the screen. It pops in with a scale animation and fades out cleanly.",
  demo: {
    label: "Label",
    sublabel: "Sublabel",
    heading: "Bug — OGraf Template",
  },
  diffTitle: "What's different from a lower third?",
  diffs: [
    { title: "Position", body: <>Top-right corner. <code className={CODE_SLATE}>position: absolute; top: 40px; right: 40px</code> — never <code className={CODE_SLATE}>fixed</code>, which would escape to the viewport instead of the 1920×1080 render area.</> },
    { title: "Animation", body: <>Scale from 50% + blur instead of slide. A "materializing" effect — less intrusive than a slide for something that stays on screen.</> },
    { title: "Pulsing LIVE dot", body: <>A CSS <code className={CODE_SLATE}>@keyframes</code> pulse on an absolutely-positioned sibling creates the broadcast-style LIVE ping without any JavaScript.</> },
  ],
  downloadTitle: "Corner Bug",
  cssTitle: "The key CSS — scale + blur animation",
  cssBody: (
    <>
      Instead of sliding in, the bug <strong className={STRONG}>scales up from 50% with an 8px blur</strong>. The resting state lives on <code className={CODE_SLATE}>.bug</code>; the JavaScript only toggles the <code className={CODE_SLATE}>visible</code> and <code className={CODE_SLATE}>out</code> classes. This creates a subtle "materializing" effect that's less intrusive than a slide — perfect for something that sits in the corner.
    </>
  ),
  keyParts: "style.css (key parts)",
  tipTitle: "Design tip",
  tip: (
    <>
      The in-animation is a 0.6s ease-out that settles gently; the out-animation (<code className={CODE_AMBER}>.bug.out</code>) only shrinks to 80% (not 50%) over a shorter 0.4s ease-in-out, with opacity and blur gone in 0.3s. This asymmetry — soft in, quick out — feels natural. The eye notices the entrance but barely registers the exit.
    </>
  ),
  componentTitle: "The Web Component",
  componentBody: (
    <>
      Same shape as the lower third: a <code className={CODE_SLATE}>&lt;link&gt;</code> to the stylesheet (absolute URL via <code className={CODE_SLATE}>import.meta.url</code>), a lazy <code className={CODE_SLATE}>_initDom()</code>, and all six lifecycle methods. No module-level <code className={CODE_SLATE}>customElements.define()</code> — the renderer picks the tag. This is the complete file from the download:
    </>
  ),
  notes: [
    { title: "Steps.", body: <><code className={CODE_SLATE}>resolveTargetStep()</code> follows the spec: <code className={CODE_SLATE}>goto</code> if given, otherwise the current step (-1 before the first play) plus <code className={CODE_SLATE}>delta</code> (default 1). The bug has one step, so the first play puts it on air at step 0 and a second play takes it off air and returns <code className={CODE_SLATE}>currentStep: undefined</code>.</> },
    { title: "Out-of-order actions.", body: <>Every action bumps <code className={CODE_SLATE}>this._rev</code>. <code className={CODE_SLATE}>stopAction()</code> only removes <code className={CODE_SLATE}>.visible</code> after its 400ms if no newer action has started, so play → stop → play sent without waiting ends on air.</> },
    { title: "Partial updates.", body: <><code className={CODE_SLATE}>load()</code> and <code className={CODE_SLATE}>updateAction()</code> apply each field that is <code className={CODE_SLATE}>!== undefined</code>: send only <code className={CODE_SLATE}>sublabel</code> to change it alone, or an empty string to clear it.</> },
    { title: "Custom actions.", body: <>The renderer calls <code className={CODE_SLATE}>customAction(&#123; id, payload, skipAnimation &#125;)</code> with an <code className={CODE_SLATE}>id</code> from the manifest's <code className={CODE_SLATE}>customActions</code>. The bug declares none, so any id gets <code className={CODE_SLATE}>&#123; statusCode: 404, statusMessage &#125;</code> — a 4xx is the spec's error range.</> },
  ],
  done: {
    title: "Bug complete.",
    body: "Same OGraf package pattern — manifest, CSS, Web Component. Different visual, same interoperability.",
    next: "Next: News Ticker",
  },
};

export type TutorialBugCopy = typeof en;
