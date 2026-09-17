import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/breaking-news/breaking-news.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/breaking-news/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/breaking-news/style.css?raw";
import { excerpt, cssExcerpt } from "../lib/excerpt";
import { useRouteMeta } from "../hooks/useMeta";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const TIMING_CODE = excerpt(GRAPHIC_SOURCE, ["IN_MS", "HOLD_MS", "OUT_MS"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["playAction", "_autoDismiss"]);
const STOP_CODE = excerpt(GRAPHIC_SOURCE, ["stopAction", "customAction"]);
const REVEAL_CSS = cssExcerpt(STYLE_SOURCE, [
  ".breaking.visible",
  ".breaking.visible .breaking-badge",
  ".breaking.visible .breaking-headline",
  ".breaking.visible .breaking-line",
]);
const DOT_CSS = cssExcerpt(STYLE_SOURCE, [".breaking-badge-dot", "@keyframes badgePulse"]);

export function TutorialBreakingNews() {
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
            <span className="text-xs text-slate-400">15 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a breaking news alert.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            The breaking news alert is a full-screen interrupt — a bold, red overlay that demands attention. Unlike other graphics, it uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stepCount: 0</code>, meaning it's fire-and-forget: one play takes it in, it holds, and it dismisses itself without the operator having to take it out.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/breaking-news/demo.html"
            fields={[
              { key: "headline", label: "Headline", defaultValue: "Major earthquake strikes off the coast — tsunami warning issued for coastal regions" },
            ]}
            title="Breaking News — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from other graphics?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Fire-and-forget</p>
                <p className="text-sm text-slate-600 mt-1"><code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stepCount: 0</code> in the manifest. The graphic plays in, holds for 3.5 s, then dismisses itself. No operator needed to take it out, though a stop can still cut it short.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Full-screen overlay</p>
                <p className="text-sm text-slate-600 mt-1">Fills the graphic's whole box with an 85% black, blurred backdrop. The red "Breaking News" badge and the headline sit centred on top.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Staggered reveal</p>
                <p className="text-sm text-slate-600 mt-1">One <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> class drives three elements with different transition delays: badge, then headline, then the accent line.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The auto-dismiss pattern</h2>
            <p className="text-base text-slate-700 mb-4">
              The timing lives in three constants: 1.2 s for the entrance to land, 3.5 s on air, 0.6 s for the exit.
            </p>
            <CodeBlock filename="graphic.mjs (timing)" language="JavaScript" code={TIMING_CODE} />
            <p className="mt-4 text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">playAction</code> adds the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> class and waits only for the entrance. It then starts <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_autoDismiss</code> without awaiting it and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>. The hold and the exit carry on in the background, and the renderer is free to send its next action as soon as the alert is on screen.
            </p>
            <CodeBlock filename="graphic.mjs (playAction)" language="JavaScript" code={PLAY_CODE} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">Key insight: stepCount: 0</p>
              <p className="mt-2 text-sm text-blue-800">
                <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">stepCount: 0</code> tells the renderer the graphic has no steps of its own: it plays in and ends by itself. The renderer still calls <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">playAction</code>, which must return <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">currentStep: undefined</code>. The spec says the promise should resolve once the graphic is ready for the next action, so it resolves after the entrance (<code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">IN_MS</code>), not after the whole hold and exit.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Stopping it early</h2>
            <p className="text-base text-slate-700 mb-4">
              Fire-and-forget doesn't mean unstoppable. A renderer can still call <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> to take the alert off before the hold ends, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> can swap the headline while it's up. Every action takes the next <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code>. The background <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_autoDismiss</code> checks that number after its hold and again after the exit, so a pending dismiss from an earlier play never hides a newer one: play → stop → play sent without waiting ends on air. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customAction</code> must exist even though the manifest declares none, and it answers every id with 404.
            </p>
            <CodeBlock filename="graphic.mjs (stopAction, customAction)" language="JavaScript" code={STOP_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS: urgency design</h2>
            <p className="text-base text-slate-700 mb-4">
              The whole overlay fades in over 0.4 s. Inside it, the badge scales out from the centre after 0.2 s, the headline rises into place after 0.4 s, and the accent line draws after 0.6 s: all started by the same <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> class, staggered only by <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code>. The accent line is the last to land, at 1.2 s, which is where <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">IN_MS</code> comes from. On exit the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">out</code> rules collapse the badge and line and fade everything over 0.6 s.
            </p>
            <CodeBlock filename="style.css (staggered reveal)" language="CSS" code={REVEAL_CSS} />
            <div className="mt-4">
              <CodeBlock filename="style.css (pulsing dot)" language="CSS" code={DOT_CSS} />
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The pulsing white dot in the red badge adds urgency without being distracting. It's a subtle but effective broadcast convention: viewers associate that blinking dot with live, important content. The animation is slow (a 1.5 s cycle) so it doesn't feel frantic.
              </p>
            </div>
          </div>

          <TutorialManifest slug="breaking-news" title="Breaking News" manifest={MANIFEST} intro="Notice stepCount: 0: that's how OGraf declares a graphic that plays in and ends on its own. The renderer still calls playAction, which returns currentStep: undefined once the entrance has landed." />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Breaking news complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Fire-and-forget with stepCount: 0, a staggered reveal, and a background auto-dismiss that a stop can still cut short.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/weather" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Weather</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/breaking-news" />
        </div>

      </div>
    </section>
  );
}
