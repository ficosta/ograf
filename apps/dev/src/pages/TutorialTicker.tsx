import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/ticker/ticker.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/ticker/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/ticker/style.css?raw";
import { useRouteMeta } from "../hooks/useMeta";
import { cssExcerpt, excerpt } from "../lib/excerpt";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const RENDER_CODE = excerpt(GRAPHIC_SOURCE, ["_renderItems", "_applyPlayMode", "_applyData", "escapeHtml"]);
const CSS_CODE = cssExcerpt(STYLE_SOURCE, [".ticker-track", ".ticker-content", "@keyframes scroll"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["resolveTargetStep", "playAction", "stopAction"]);

export function TutorialTicker() {
  useRouteMeta();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="mb-4">
          <Link to="/tutorials" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
            <ChevronRight className="h-3 w-3 rotate-180" /> All tutorials
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Intermediate</span>
            <span className="text-xs text-slate-400">20 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a news ticker.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            The scrolling crawl at the bottom of the screen — CNN, BBC News, Bloomberg. Headlines flow continuously from right to left. This tutorial covers infinite CSS animations, dynamic data arrays, and seamless looping.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/ticker/demo.html"
            fields={[
              { key: "badge", label: "Badge Text", defaultValue: "Breaking" },
              {
                key: "items",
                label: "Headlines",
                type: "list",
                defaultValue: [
                  "EBU releases OGraf Graphics Definition v1 — the open standard for broadcast graphics",
                  "SPX Graphics Controller adds full OGraf compliance in upcoming v1.4 release",
                  "CasparCG community explores native OGraf renderer integration",
                  "Loopic announces one-click OGraf export for all template projects",
                  "StreamShapers Ferryman now converts Lottie animations to OGraf format",
                ],
              },
            ]}
            showPlayMode
            title="News Ticker — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What makes a ticker different?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Infinite scroll</p>
                <p className="text-sm text-slate-600 mt-1">Uses CSS <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">@keyframes</code> with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">infinite</code> repeat. on <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.ticker-content</code> (20s per cycle). Content is duplicated for seamless looping.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Array data</p>
                <p className="text-sm text-slate-600 mt-1">Instead of single fields, the schema accepts an <strong>array of headlines</strong>. Each item scrolls past in sequence.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Full-width bar</p>
                <p className="text-sm text-slate-600 mt-1">Spans the entire bottom edge in a 48px bar. The blue badge (the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">badge</code> field) sits on the left, the scrolling text flows to its right.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The seamless loop trick</h2>
            <p className="text-base text-slate-700 mb-4">
              The ticker <strong className="text-slate-900">duplicates all the headlines</strong> so the scroll appears infinite. When the first set scrolls fully off-screen, the second set has already taken its place — the animation resets invisibly. Each headline goes through <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">escapeHtml()</code> before it reaches <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">innerHTML</code>, so a headline containing <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;</code> or <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&amp;</code> shows as text. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_applyData()</code> only re-renders when <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">items</code> is an array, and an optional <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">loop: false</code> (used by the demo's play-mode switch; not in the manifest schema) makes the crawl run once and hold instead of repeating.
            </p>
            <CodeBlock filename="graphic.mjs (rendering the data)" language="JavaScript" code={RENDER_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS scroll animation</h2>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={CSS_CODE} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">Why -50%?</p>
              <p className="mt-2 text-sm text-blue-800">
                <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">_renderItems</code> writes the headlines twice, each one followed by its separator, and every child of <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">.ticker-content</code> carries the same 40px trailing margin. The two halves are therefore exactly the same width, so translating by -50% moves the copy precisely onto the spot where the original started — and when the animation restarts, nothing jumps. That is also why the spacing is a margin rather than <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">gap</code> or a <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">padding-left</code>: either would make the halves unequal. <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">.ticker-track</code> clips everything with <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">overflow: hidden</code>.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">An infinite animation, a prompt promise</h2>
            <p className="text-base text-slate-700 mb-4">
              The crawl never ends, but <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">playAction()</code> resolves after the bar's 500ms slide-up. The spec says long or infinite animations should not delay the promise — the renderer needs to know the graphic is on air, not when the crawl finishes. The step model is the spec's: the first play lands on step 0, a second play takes the one-step ticker off air and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction()</code> slides the bar down over 400ms and checks <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code> before hiding it, so a play sent during that stop wins.
            </p>
            <CodeBlock filename="graphic.mjs (play and stop)" language="JavaScript" code={PLAY_CODE} />
          </div>

          <TutorialManifest
            slug="ticker"
            title="News Ticker"
            manifest={MANIFEST}
            intro="Notice the schema uses an array of strings for headlines, not a single text field. Controllers render this as a list where the operator can add, remove, and reorder items."
          />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Ticker complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">You've learned infinite CSS animations, array data schemas, the content duplication trick for seamless looping, and why an endless crawl still resolves playAction right away.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/quote" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Full Page Quote</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/ticker" />
        </div>

      </div>
    </section>
  );
}
