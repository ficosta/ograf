import { Link } from "react-router";
import { Check, ChevronRight, Shield, Layers, Tag } from "lucide-react";
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

          {/* NEW: three realities every OGraf graphic has to handle */}
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Three realities a real OGraf player imposes</h2>
            <p className="text-base text-slate-700 mb-4">
              Before any code, the hard constraints. If your graphic ignores any of these, it will "work" in your browser and break the moment a real renderer (like <a href="https://ograf-devtool.superfly.tv" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium underline underline-offset-4 decoration-blue-200 hover:decoration-blue-600">ograf-devtool</a>, ograf-server, or SPX-GC) loads it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <Layers className="h-5 w-5 text-blue-600 mb-2" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-slate-900">Shadow DOM isolation</p>
                <p className="text-sm text-slate-600 mt-1">The renderer mounts your graphic inside a closed shadow root. Your <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">style.css</code> never loads. Styles must live inside the component's own DOM via a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;style&gt;</code> tag.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <Shield className="h-5 w-5 text-blue-600 mb-2" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-slate-900">Detached element</p>
                <p className="text-sm text-slate-600 mt-1">The renderer's test harness calls <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load()</code> on an element that was never inserted into the DOM, so <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">connectedCallback</code> never fires. Do your DOM init lazily from <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load()</code>.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <Tag className="h-5 w-5 text-blue-600 mb-2" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-slate-900">Renderer picks the tag</p>
                <p className="text-sm text-slate-600 mt-1">The renderer registers your class as <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">graphic-component0</code>, <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">...1</code>, etc. If you call <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customElements.define</code> yourself, the renderer's own register throws.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from a lower third?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Position</p>
                <p className="text-sm text-slate-600 mt-1">Top-right corner. Uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">position: absolute; top; right</code> — never <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">fixed</code>, which would escape to the browser viewport instead of the 1920×1080 render area.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Animation</p>
                <p className="text-sm text-slate-600 mt-1">Scale from 50% + blur instead of slide. A "materialising" effect — less intrusive than a slide for something that stays on screen.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Pulsing LIVE dot</p>
                <p className="text-sm text-slate-600 mt-1">A CSS <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">@keyframes</code> pulse on an absolutely-positioned sibling creates the broadcast-style LIVE ping without any JavaScript.</p>
              </div>
            </div>
          </div>

          <TutorialManifest slug="bug" title="Corner Bug" manifest={MANIFEST} />

          {/* NEW: styles inside the component */}
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Styles inside the component</h2>
            <p className="text-base text-slate-700 mb-4">
              Because the renderer wraps your graphic in a closed shadow root, a sibling <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">style.css</code> can never reach it. The solution: put your CSS in a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;style&gt;</code> tag at the top of the template string you assign to <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this.innerHTML</code>. Those styles are scoped to the same shadow root the renderer creates and apply exactly to your markup.
            </p>
            <CodeBlock filename="graphic.mjs (template constant)" language="JavaScript" code={`const TEMPLATE = \`
  <style>
    /* fonts + keyframes omitted here -- see sections below */

    .bug {
      position: absolute;         /* NOT fixed */
      top: 40px;
      right: 40px;
      font-family: 'Inter', sans-serif;
      transform: scale(0.5);
      opacity: 0;
      filter: blur(8px);
    }

    .bug.visible {
      transform: scale(1);
      opacity: 1;
      filter: blur(0);
      transition:
        transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.4s ease,
        filter 0.4s ease;
    }

    /* ...bug-container, bug-live, bug-label, etc... */
  </style>
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
\`;`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Why <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">position: absolute</code>?</p>
              <p className="mt-2 text-sm text-amber-800">
                The renderer places your graphic inside a positioned container sized to the render area. <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">absolute</code> means "relative to that container." <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">fixed</code> would skip past the container all the way up to the browser viewport — so on a running playout your bug would end up in the wrong place.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Scale + blur animation</h2>
            <p className="text-base text-slate-700 mb-4">
              Instead of sliding in, the bug <strong className="text-slate-900">scales up from 50% with a blur</strong>. This creates a subtle "materialising" effect that's less intrusive than a slide — perfect for something that sits in the corner.
            </p>
            <CodeBlock filename="graphic.mjs (key rules)" language="CSS" code={`.bug {
  position: absolute;
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

          {/* NEW: shipping the font locally */}
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Shipping the font locally</h2>
            <p className="text-base text-slate-700 mb-4">
              A <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">@import</code> from Google Fonts assumes the playout box can reach <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">fonts.googleapis.com</code>. Many on-prem broadcast environments block it — CSP, firewalls, or simply no internet. Ship the font files inside your package instead.
            </p>
            <div className="rounded-xl bg-slate-50 p-4 mb-4 text-sm text-slate-700">
              <p className="font-mono text-xs text-slate-500 mb-2">bug/</p>
              <pre className="font-mono text-xs text-slate-700 leading-6 whitespace-pre-wrap">{`├── bug.ograf.json
├── graphic.mjs
├── style.css           (only used by the site's iframe demo)
└── fonts/
    ├── Inter-SemiBold.woff2
    ├── Inter-ExtraBold.woff2
    └── LICENSE.txt     (SIL Open Font License 1.1)`}</pre>
            </div>
            <p className="text-base text-slate-700 mb-4">
              Relative URLs inside an inlined <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;style&gt;</code> tag resolve against the document, not your module — so <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">url('./fonts/Inter-SemiBold.woff2')</code> would 404 on any real renderer. Compute absolute URLs from <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">import.meta.url</code> and interpolate them into the template:
            </p>
            <CodeBlock filename="graphic.mjs (font wiring)" language="JavaScript" code={`const FONT_SEMI_BOLD  = new URL('./fonts/Inter-SemiBold.woff2',  import.meta.url).href;
const FONT_EXTRA_BOLD = new URL('./fonts/Inter-ExtraBold.woff2', import.meta.url).href;

const TEMPLATE = \`
  <style>
    @font-face {
      font-family: 'Inter';
      font-weight: 600;
      font-display: swap;
      src: url('\${FONT_SEMI_BOLD}') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-weight: 800;
      font-display: swap;
      src: url('\${FONT_EXTRA_BOLD}') format('woff2');
    }

    /* ...rest of the styles... */
  </style>
  <!-- ...markup... -->
\`;`} />
            <p className="mt-4 text-sm text-slate-600">
              Inter is licensed under the SIL Open Font License, which requires you to include the license text alongside the font. Drop the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">LICENSE.txt</code> from the Inter repo into your <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">fonts/</code> folder and you're good. Different font, different license — check.
            </p>
          </div>

          {/* The Web Component — rewritten to match graphic.mjs */}
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The Web Component</h2>
            <p className="text-base text-slate-700 mb-4">
              Everything the component does — load data, play, update, stop, dispose — assumes the DOM is ready. But we can't rely on <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">connectedCallback</code> firing. So DOM init happens in a private idempotent <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_initDom()</code> method that every public lifecycle method calls first.
            </p>
            <CodeBlock filename="graphic.mjs (the class)" language="JavaScript" code={`export default class BugGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;          // idempotent
    this.innerHTML = TEMPLATE;
    this._root     = this.querySelector('.bug');
    this._label    = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();                        // <-- first line of every method
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
    void this._root.offsetWidth;            // force reflow before transition
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

  // Required on every graphic, even if the manifest declares no customActions.
  async customAction({ action } = {}) {
    return { statusCode: 404, description: \`Unknown custom action: \${action ?? ""}\` };
  }

  async dispose() {
    this.innerHTML = '';
    this._initialized = false;              // reset so a re-load re-inits
    return { statusCode: 200 };
  }
}

// Note the absence of customElements.define() -- the renderer picks the tag.`} />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                <p className="text-sm font-semibold text-blue-900">Init on load(), not on connect</p>
                <p className="mt-2 text-sm text-blue-800">
                  The <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">_initialized</code> flag makes <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">_initDom()</code> safe to call any number of times. Every public method calls it first, so the graphic works whether the renderer attaches the element or not.
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                <p className="text-sm font-semibold text-blue-900">Export default, never define</p>
                <p className="mt-2 text-sm text-blue-800">
                  The module's job ends at <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">export default class ...</code>. The renderer imports the default export and picks the tag itself. Your code should never touch <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">customElements.define</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Bug complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Self-contained styles, local fonts, lazy DOM init, no self-registered tag. A real OGraf package that drops into any compliant renderer.</p>
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
