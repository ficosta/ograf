import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/election-bars/election-bars.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/election-bars/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/election-bars/style.css?raw";
import { excerpt, cssExcerpt } from "../lib/excerpt";
import { useRouteMeta } from "../hooks/useMeta";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const RENDER_CODE = excerpt(GRAPHIC_SOURCE, ["_renderBars"]);
const ANIMATE_CODE = excerpt(GRAPHIC_SOURCE, ["_animateBars", "_resetBars"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["resolveTargetStep", "playAction", "_showBarsInstantly"]);
const COUNT_CODE = excerpt(GRAPHIC_SOURCE, ["_countUp"]);
const BARS_CSS = cssExcerpt(STYLE_SOURCE, [
  ":where(.election-bars-root, .election-bars-root *)",
  ".election-row",
  ".election-row.show",
  ".election-bar-fill",
  ".election-pct",
  ".election-pct.inside",
  ".election-pct.outside",
]);

export function TutorialElectionBars() {
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
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build election result bars.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            Election bars are the backbone of results night coverage — think CNN's election night or the BBC's general election broadcast. Each row represents a party with a color-coded bar that grows to its vote percentage, creating a visceral, at-a-glance comparison of results.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/election-bars/demo.html"
            fields={[
              { key: "title", label: "Title", defaultValue: "General Election Results" },
              { key: "subtitle", label: "Subtitle", defaultValue: "National Vote Share" },
              { key: "parties", label: "Parties", type: "json" as const, defaultValue: [
                { name: "Conservative", color: "#0087DC", votes: 13966454, pct: 44 },
                { name: "Labour", color: "#DC241f", votes: 10269051, pct: 32 },
                { name: "Liberal Democrats", color: "#FAA61A", votes: 3696423, pct: 12 },
                { name: "SNP", color: "#FDF38E", votes: 1242380, pct: 4 },
              ]},
            ]}
            title="Election Bars — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from a lower third?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Data-driven widths</p>
                <p className="text-sm text-slate-600 mt-1">Each fill carries its percentage in <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">data-pct</code>, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_animateBars</code> sets <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">fill.style.width = pct + '%'</code> inline. The data controls the visual, not a CSS class.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Staggered reveal</p>
                <p className="text-sm text-slate-600 mt-1">Rows get the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">show</code> class 120 ms apart, on top of an inline <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code> of 100 ms per row, so they cascade in from top to bottom.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Color-coded identity</p>
                <p className="text-sm text-slate-600 mt-1">Each party's <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">color</code> comes from the data and becomes the fill's inline background — no hardcoded palette. Works for any election, any country, any party system.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Rendering the bars</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_renderBars</code> builds one <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.election-row</code> per party: name and vote count on the left, a track with a colored fill on the right, and a percentage label that starts at <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">0%</code>. Name and color go through <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">escapeHtml</code>, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">pct</code> and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">votes</code> through <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">Number()</code>, so operator data can't inject markup. The key trick: <strong className="text-slate-900">nothing grows yet</strong>. Every fill starts at <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">width: 0</code>, and its target waits in <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">data-pct</code> until <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_animateBars</code> runs.
            </p>
            <CodeBlock filename="graphic.mjs (rendering)" language="JavaScript" code={RENDER_CODE} />
            <p className="text-base text-slate-700 mt-6 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_animateBars</code> shows the rows 120 ms apart, then after 200 ms writes every fill's width and moves each label to the bar's edge; 150 ms later the label counts up from 0 over 900 ms with an ease-out curve. A later <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> that includes <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">parties</code> re-renders the rows; on air it runs <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_animateBars</code> again so the bars regrow to the new results, and off air it leaves them for the next play. Every timer inside <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_animateBars</code> checks the revision it started under, so a stop that lands mid-reveal is never overwritten, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> calls <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_resetBars</code> once the panel is gone so a replay grows the bars from zero again.
            </p>
            <CodeBlock filename="graphic.mjs (animation)" language="JavaScript" code={ANIMATE_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Playing it on air</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">playAction</code> follows the OGraf step model. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">resolveTargetStep</code> picks the target: <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goto</code> if given, otherwise the current step (-1 before the first play) plus <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">delta</code>, which defaults to 1. This graphic has one step, so the first play lands on step 0 and a second play goes past the end — the graphic runs <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>. On step 0 it adds <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> to slide the panel up, waits 400 ms, then starts the bars and resolves 1400 ms later. With <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">skipAnimation</code> it adds <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">instant</code> to the root — a class that switches every transition off — and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_showBarsInstantly</code> sets the final widths and labels at once.
            </p>
            <CodeBlock filename="graphic.mjs (step model)" language="JavaScript" code={PLAY_CODE} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">Why the revision counter?</p>
              <p className="mt-2 text-sm text-blue-800">
                Every play and stop takes the next <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">this._rev</code>. If a newer action arrives during the 400 ms wait, <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">playAction</code> skips <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">_animateBars</code>, and a stale <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">stopAction</code> won't hide the panel — so play → stop → play sent without waiting ends on air.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — bar animation</h2>
            <p className="text-base text-slate-700 mb-4">
              Rows slide in from 20px left when they get <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">show</code>. The fill transitions <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">width</code> over 1.2 s, and the percentage label transitions <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">left</code> with the same duration and curve, so it rides the edge of the growing bar. The reset at the top is scoped with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">:where(.election-bars-root, …)</code>, so it never restyles the renderer's page.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={BARS_CSS} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                Use asymmetric percentage labels. <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">_renderBars</code> gives the label the <strong>inside</strong> class when the party has 15% or more (white text, pulled back inside the bar) and <strong>outside</strong> below that (dark text just past the bar's end). Tiny bars never have to fit a label they can't hold — a common pitfall in election graphics.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Number formatting</h2>
            <p className="text-base text-slate-700 mb-4">
              Large vote counts are hard to read without separators. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_renderBars</code> writes <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">{"(Number(p.votes) || 0).toLocaleString()"}</code>, which adds thousands separators for the renderer's locale — <strong className="text-slate-900">1,284,000</strong> is far more readable than 1284000. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">votes</code> is optional in the schema, so a missing value shows as 0. The percentage label is formatted separately: <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_countUp</code> rounds each eased frame to a whole number.
            </p>
            <CodeBlock filename="graphic.mjs (count-up)" language="JavaScript" code={COUNT_CODE} />
          </div>

          <TutorialManifest slug="election-bars" title="Election Bars" manifest={MANIFEST} intro="The parties field is a typed array — items.type is object with required name, pct, and color. That's how OGraf declares structured repeating data." />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Election bars complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Data-driven widths, staggered reveals, color-coded parties, and a spec-compliant step model — everything you need for results night coverage.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/sport-lineup" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Sport Lineup</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/election-bars" />
        </div>

      </div>
    </section>
  );
}
