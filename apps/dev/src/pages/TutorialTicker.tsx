import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/ticker/ticker.ograf.json";
import { useMeta } from "../hooks/useMeta";

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/ticker");
const MANIFEST = JSON.stringify(manifestJson, null, 2);

export function TutorialTicker() {
  useMeta({
    title: (TUTORIAL?.title ?? "Tutorial") + " tutorial",
    description: TUTORIAL?.desc ?? undefined,
  });
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
                <p className="text-sm text-slate-600 mt-1">Uses CSS <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">@keyframes</code> with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">infinite</code> repeat. Content is duplicated for seamless looping.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Array data</p>
                <p className="text-sm text-slate-600 mt-1">Instead of single fields, the schema accepts an <strong>array of headlines</strong>. Each item scrolls past in sequence.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Full-width bar</p>
                <p className="text-sm text-slate-600 mt-1">Spans the entire bottom edge. A colored badge sits on the left, the scrolling text flows to its right.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The seamless loop trick</h2>
            <p className="text-base text-slate-700 mb-4">
              The ticker <strong className="text-slate-900">duplicates all the headlines</strong> so the scroll appears infinite. When the first set scrolls fully off-screen, the second set has already taken its place — the animation resets invisibly.
            </p>
            <CodeBlock filename="graphic.mjs (render method)" language="JavaScript" code={`_renderItems(items) {
  // Duplicate the array for seamless looping
  const allItems = [...items, ...items];

  this._content.innerHTML = allItems.map((item, i) =>
    \`<span class="ticker-item">
      <span class="ticker-dot"></span>\${item}
    </span>\` +
    (i < allItems.length - 1
      ? '<span class="ticker-separator"></span>'
      : '')
  ).join('');
}`} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS scroll animation</h2>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.ticker-content {
  display: flex;
  white-space: nowrap;
  animation: scroll 20s linear infinite;
  padding-left: 100%;   /* Start off-screen right */
}

@keyframes scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
  /* -50% because content is duplicated */
}`} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">Why -50%?</p>
              <p className="mt-2 text-sm text-blue-800">
                The content is duplicated (original + copy), so 50% of the total width equals the full length of one set. When the animation hits -50%, the copy has perfectly replaced the original — the loop is seamless.
              </p>
            </div>
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
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">You've learned infinite CSS animations, array data schemas, and the content duplication trick for seamless looping.</p>
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
