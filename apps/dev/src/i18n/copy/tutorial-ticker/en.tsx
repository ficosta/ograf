import { CODE_BLUE, CODE_SLATE, STRONG } from "../tutorial-ui/styles";

export const en = {
  title: "Build a news ticker.",
  lead: "The scrolling crawl at the bottom of the screen — CNN, BBC News, Bloomberg. Headlines flow continuously from right to left. This tutorial covers infinite CSS animations, dynamic data arrays, and seamless looping.",
  demo: {
    badge: "Badge Text",
    items: "Headlines",
    heading: "News Ticker — OGraf Template",
  },
  diffTitle: "What makes a ticker different?",
  diffs: [
    { title: "Infinite scroll", body: <>Uses CSS <code className={CODE_SLATE}>@keyframes</code> with <code className={CODE_SLATE}>infinite</code> repeat on <code className={CODE_SLATE}>.ticker-content</code> (20s per cycle). Content is duplicated for seamless looping.</> },
    { title: "Array data", body: <>Instead of single fields, the schema accepts an <strong>array of headlines</strong>. Each item scrolls past in sequence.</> },
    { title: "Full-width bar", body: <>Spans the entire bottom edge in a 48px bar. The blue badge (the <code className={CODE_SLATE}>badge</code> field) sits on the left, the scrolling text flows to its right.</> },
  ],
  loopTitle: "The seamless loop trick",
  loopBody: (
    <>
      The ticker <strong className={STRONG}>duplicates all the headlines</strong> so the scroll appears infinite. When the first set scrolls fully off-screen, the second set has already taken its place — the animation resets invisibly. Each headline goes through <code className={CODE_SLATE}>escapeHtml()</code> before it reaches <code className={CODE_SLATE}>innerHTML</code>, so a headline containing <code className={CODE_SLATE}>&lt;</code> or <code className={CODE_SLATE}>&amp;</code> shows as text. <code className={CODE_SLATE}>_applyData()</code> only re-renders when <code className={CODE_SLATE}>items</code> is an array, and an optional <code className={CODE_SLATE}>loop: false</code> (used by the demo's play-mode switch; not in the manifest schema) makes the crawl run once and hold instead of repeating.
    </>
  ),
  renderFile: "graphic.mjs (rendering the data)",
  cssTitle: "The CSS scroll animation",
  keyParts: "style.css (key parts)",
  whyTitle: "Why -50%?",
  why: (
    <>
      <code className={CODE_BLUE}>_renderItems</code> writes the headlines twice, each one followed by its separator, and every child of <code className={CODE_BLUE}>.ticker-content</code> carries the same 40px trailing margin. The two halves are therefore exactly the same width, so translating by -50% moves the copy precisely onto the spot where the original started — and when the animation restarts, nothing jumps. That is also why the spacing is a margin rather than <code className={CODE_BLUE}>gap</code> or a <code className={CODE_BLUE}>padding-left</code>: either would make the halves unequal. <code className={CODE_BLUE}>.ticker-track</code> clips everything with <code className={CODE_BLUE}>overflow: hidden</code>.
    </>
  ),
  promiseTitle: "An infinite animation, a prompt promise",
  promiseBody: (
    <>
      The crawl never ends, but <code className={CODE_SLATE}>playAction()</code> resolves after the bar's 500ms slide-up. The spec says long or infinite animations should not delay the promise — the renderer needs to know the graphic is on air, not when the crawl finishes. The step model is the spec's: the first play lands on step 0, a second play takes the one-step ticker off air and returns <code className={CODE_SLATE}>currentStep: undefined</code>. <code className={CODE_SLATE}>stopAction()</code> slides the bar down over 400ms and checks <code className={CODE_SLATE}>this._rev</code> before hiding it, so a play sent during that stop wins.
    </>
  ),
  playFile: "graphic.mjs (play and stop)",
  downloadTitle: "News Ticker",
  manifestIntro: "Notice the schema uses an array of strings for headlines, not a single text field. Controllers render this as a list where the operator can add, remove, and reorder items.",
  done: {
    title: "Ticker complete.",
    body: "You've learned infinite CSS animations, array data schemas, the content duplication trick for seamless looping, and why an endless crawl still resolves playAction right away.",
    next: "Next: Full Page Quote",
  },
};

export type TutorialTickerCopy = typeof en;
