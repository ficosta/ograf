import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import tutorials from "../content/tutorials.json";
import { useMeta } from "../hooks/useMeta";

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

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The manifest</h2>
            <CodeBlock filename="bug.ograf.json" language="JSON" code={`{
  "$schema": "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",
  "id": "dev.ograf.tutorial.bug",
  "version": "1.0.0",
  "name": "Corner Bug",
  "main": "graphic.mjs",
  "stepCount": 1,
  "supportsRealTime": true,
  "supportsNonRealTime": false,
  "schema": {
    "type": "object",
    "properties": {
      "label": {
        "type": "string",
        "title": "Label",
        "gddType": "single-line",
        "default": "LIVE"
      },
      "sublabel": {
        "type": "string",
        "title": "Sublabel",
        "gddType": "single-line",
        "default": "Breaking News"
      }
    }
  }
}`} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The key CSS — scale + blur animation</h2>
            <p className="text-base text-slate-700 mb-4">
              Instead of sliding in, the bug <strong className="text-slate-900">scales up from 50% with a blur</strong>. This creates a subtle "materializing" effect that's less intrusive than a slide — perfect for something that sits in the corner.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.bug {
  position: absolute;           /* Anchors to the renderer's frame, not the viewport */
  top: 40px;
  right: 40px;
  transform: scale(0.5);        /* Start small */
  opacity: 0;
  filter: blur(8px);            /* Start blurred */
}

.bug.visible {
  transform: scale(1);          /* Scale to full size */
  opacity: 1;
  filter: blur(0);              /* Sharpen */
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.4s ease,
              filter 0.4s ease;
}

.bug.out {
  transform: scale(0.8);        /* Shrink slightly on exit */
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
              Same shape as the lower third: a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;link&gt;</code> to the stylesheet (absolute URL via <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">import.meta.url</code>), a lazy <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_initDom()</code>, and all six lifecycle methods. No module-level <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customElements.define()</code> — the renderer picks the tag.
            </p>
            <CodeBlock filename="graphic.mjs" language="JavaScript" code={`const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = \`
  <link rel="stylesheet" href="\${STYLE_URL}">
  <div class="bug">
    <div class="bug-container">
      <div class="bug-live">
        <div class="bug-live-ping"></div>
        <div class="bug-live-dot"></div>
      </div>
      <div class="bug-text">
        <div class="bug-label"></div>
        <div class="bug-sublabel"></div>
      </div>
    </div>
  </div>
\`;

export default class BugGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root     = this.querySelector('.bug');
    this._label    = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.label)    this._label.textContent    = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    this._initDom();
    this._root.classList.remove('out');
    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: 0 };
    }
    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await new Promise(r => setTimeout(r, 600));
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.label)    this._label.textContent    = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
    return { statusCode: 200 };
  }

  async customAction({ action } = {}) {
    return { statusCode: 404, description: \`Unknown custom action: \${action ?? ""}\` };
  }

  async dispose() {
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
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
