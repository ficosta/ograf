import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/bug/bug.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/bug/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/bug/style.css?raw";
import { useRouteMeta } from "../hooks/useMeta";
import { cssExcerpt } from "../lib/excerpt";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const CSS_CODE = cssExcerpt(STYLE_SOURCE, [".bug {", ".bug.visible", ".bug.out"]);

export function TutorialBug() {
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
            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Beginner</span>
            <span className="text-xs text-slate-400">10 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a bug / watermark.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            A corner bug is a small branded element — LIVE indicator, channel logo, event badge — that sits in a corner of the screen. It pops in with a scale animation and fades out cleanly.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/bug/demo.html"
            fields={[
              { key: "label", label: "Label", defaultValue: "LIVE" },
              { key: "sublabel", label: "Sublabel", defaultValue: "Breaking News" },
            ]}
            title="Bug — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from a lower third?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Position</p>
                <p className="text-sm text-slate-600 mt-1">Top-right corner. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">position: absolute; top: 40px; right: 40px</code> — never <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">fixed</code>, which would escape to the viewport instead of the 1920×1080 render area.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Animation</p>
                <p className="text-sm text-slate-600 mt-1">Scale from 50% + blur instead of slide. A "materializing" effect — less intrusive than a slide for something that stays on screen.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Pulsing LIVE dot</p>
                <p className="text-sm text-slate-600 mt-1">A CSS <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">@keyframes</code> pulse on an absolutely-positioned sibling creates the broadcast-style LIVE ping without any JavaScript.</p>
              </div>
            </div>
          </div>

          <TutorialManifest slug="bug" title="Corner Bug" manifest={MANIFEST} />

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The key CSS — scale + blur animation</h2>
            <p className="text-base text-slate-700 mb-4">
              Instead of sliding in, the bug <strong className="text-slate-900">scales up from 50% with an 8px blur</strong>. The resting state lives on <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.bug</code>; the JavaScript only toggles the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">out</code> classes. This creates a subtle "materializing" effect that's less intrusive than a slide — perfect for something that sits in the corner.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={CSS_CODE} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The in-animation is a 0.6s ease-out that settles gently; the out-animation (<code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">.bug.out</code>) only shrinks to 80% (not 50%) over a shorter 0.4s ease-in-out, with opacity and blur gone in 0.3s. This asymmetry — soft in, quick out — feels natural. The eye notices the entrance but barely registers the exit.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The Web Component</h2>
            <p className="text-base text-slate-700 mb-4">
              Same shape as the lower third: a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;link&gt;</code> to the stylesheet (absolute URL via <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">import.meta.url</code>), a lazy <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_initDom()</code>, and all six lifecycle methods. No module-level <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customElements.define()</code> — the renderer picks the tag. This is the complete file from the download:
            </p>
            <CodeBlock filename="graphic.mjs" language="JavaScript" code={GRAPHIC_SOURCE} />
            <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li><strong className="text-slate-900">Steps.</strong> <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">resolveTargetStep()</code> follows the spec: <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goto</code> if given, otherwise the current step (-1 before the first play) plus <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">delta</code> (default 1). The bug has one step, so the first play puts it on air at step 0 and a second play takes it off air and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>.</li>
              <li><strong className="text-slate-900">Out-of-order actions.</strong> Every action bumps <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code>. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction()</code> only removes <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.visible</code> after its 400ms if no newer action has started, so play → stop → play sent without waiting ends on air.</li>
              <li><strong className="text-slate-900">Partial updates.</strong> <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load()</code> and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction()</code> apply each field that is <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">!== undefined</code>: send only <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">sublabel</code> to change it alone, or an empty string to clear it.</li>
              <li><strong className="text-slate-900">Custom actions.</strong> The renderer calls <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customAction(&#123; id, payload, skipAnimation &#125;)</code> with an <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">id</code> from the manifest's <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customActions</code>. The bug declares none, so any id gets <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&#123; statusCode: 404, statusMessage &#125;</code> — a 4xx is the spec's error range.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Bug complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Same OGraf package pattern — manifest, CSS, Web Component. Different visual, same interoperability.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/ticker" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: News Ticker</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/bug" />
        </div>

      </div>
    </section>
  );
}
