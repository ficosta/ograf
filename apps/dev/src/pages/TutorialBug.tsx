import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/bug/bug.ograf.json";
import { useMeta } from "../hooks/useMeta";

const MANIFEST = JSON.stringify(manifestJson, null, 2);

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/bug");

export function TutorialBug() {
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
                <p className="text-sm text-slate-600 mt-1">Top-right corner instead of bottom-left. Uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">position: fixed; top; right</code>.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Animation</p>
                <p className="text-sm text-slate-600 mt-1">Scale from 50% + blur instead of slide. Creates a "pop in from nowhere" effect.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Size</p>
                <p className="text-sm text-slate-600 mt-1">Small and compact. Designed to stay on screen without distracting from the content.</p>
              </div>
            </div>
          </div>

          <TutorialManifest slug="bug" title="Corner Bug" manifest={MANIFEST} />

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The key CSS — scale + blur animation</h2>
            <p className="text-base text-slate-700 mb-4">
              Instead of sliding in, the bug <strong className="text-slate-900">scales up from 50% with a blur</strong>. This creates a subtle "materializing" effect that's less intrusive than a slide — perfect for something that sits in the corner.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.bug {
  position: fixed;
  top: 40px;
  right: 40px;
  transform: scale(0.5);      /* Start small */
  opacity: 0;
  filter: blur(8px);           /* Start blurred */
}

.bug.visible {
  transform: scale(1);         /* Scale to full size */
  opacity: 1;
  filter: blur(0);             /* Sharpen */
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.4s ease,
              filter 0.4s ease;
}

.bug.out {
  transform: scale(0.8);       /* Shrink slightly on exit */
  opacity: 0;
  filter: blur(8px);
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The out-animation shrinks to 80% (not 50%) and uses a faster easing. This asymmetry — slow in, quick out — feels natural. The eye notices the entrance but barely registers the exit.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The Web Component</h2>
            <p className="text-base text-slate-700 mb-4">
              Nearly identical to the lower third — same lifecycle methods, same pattern. The only difference is the HTML structure (icon + label instead of name + title).
            </p>
            <CodeBlock filename="graphic.mjs" language="JavaScript" code={`export default class BugGraphic extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`
      <div class="bug">
        <div class="bug-container">
          <div class="bug-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <div>
            <div class="bug-label"></div>
            <div class="bug-sublabel"></div>
          </div>
        </div>
      </div>
    \`;
    this._root = this.querySelector('.bug');
    this._label = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
  }

  async load({ data }) {
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
    return { statusCode: 200 };
  }

  async playAction() {
    this._root.classList.remove('out');
    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await new Promise(r => setTimeout(r, 600));
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction() {
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data }) {
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
    return { statusCode: 200 };
  }

  async dispose() { this.innerHTML = ''; return { statusCode: 200 }; }
}

// Guard against the module being re-evaluated (devtool reloads, hot reload).
// An unguarded customElements.define throws on the second call.
if (!customElements.get('bug-graphic')) {
  customElements.define('bug-graphic', BugGraphic);
}`} />
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
