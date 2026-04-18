import { Link } from "react-router";
import { Check, ChevronRight, Box, FileCode, Tag } from "lucide-react";
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

          {/* Mental model */}
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The mental model — each graphic is its own iframe</h2>
            <p className="text-base text-slate-700 mb-4">
              OGraf graphics are designed to behave like a self-contained little web page. In practice a compliant renderer loads your package inside an iframe sized to the render area (typically 1920×1080). That gives you everything a normal browser document has: your own <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;head&gt;</code>, your own CSS cascade, your own font environment, no naming collisions with other graphics.
            </p>
            <p className="text-base text-slate-700 mb-4">
              Three implications for how you write the module:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <Box className="h-5 w-5 text-blue-600 mb-2" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-slate-900">Use normal CSS</p>
                <p className="text-sm text-slate-600 mt-1">Write <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">style.css</code> like you would for a regular page. Load it from your component with a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">&lt;link&gt;</code> tag.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <FileCode className="h-5 w-5 text-blue-600 mb-2" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-slate-900">Init in load()</p>
                <p className="text-sm text-slate-600 mt-1">The renderer calls <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load()</code> first. Build your DOM there, lazily. Don't rely on <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">connectedCallback</code>.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <Tag className="h-5 w-5 text-blue-600 mb-2" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-slate-900">Renderer picks the tag</p>
                <p className="text-sm text-slate-600 mt-1"><code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">export default</code> the class. Never call <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customElements.define</code> yourself — the renderer does.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from a lower third?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Position</p>
                <p className="text-sm text-slate-600 mt-1">Top-right corner. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">position: absolute</code> anchored to the iframe, <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">top: 40px; right: 40px</code>.</p>
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

          {/* The stylesheet */}
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The stylesheet</h2>
            <p className="text-base text-slate-700 mb-4">
              Everything visual lives in <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">style.css</code>. Font files sit next to it in <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">fonts/</code>, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">@font-face</code> references them with relative URLs — a browser resolves those relative to <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">style.css</code>'s own location, so the font ships with your package.
            </p>
            <CodeBlock filename="style.css (key rules)" language="CSS" code={`@font-face {
  font-family: 'Inter';
  font-weight: 600;
  font-display: swap;
  src: url('./fonts/Inter-SemiBold.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-weight: 800;
  font-display: swap;
  src: url('./fonts/Inter-ExtraBold.woff2') format('woff2');
}

.bug {
  position: absolute;
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

.bug.out {
  transform: scale(0.8);
  opacity: 0;
  filter: blur(8px);
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Why Inter is shipped, not linked</p>
              <p className="mt-2 text-sm text-amber-800">
                A playout box rarely has unrestricted internet. Bundling the font files inside the package means your graphic looks identical whether the renderer is online or air-gapped. Inter is under the SIL Open Font License — just include <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">fonts/LICENSE.txt</code> with the package.
              </p>
            </div>
          </div>

          {/* The Web Component */}
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The Web Component</h2>
            <p className="text-base text-slate-700 mb-4">
              The module is intentionally small. It loads the stylesheet, wires up its DOM lazily in <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_initDom()</code>, and implements the six OGraf lifecycle methods. Every public method calls <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_initDom()</code> first so the graphic works regardless of instantiation order.
            </p>
            <CodeBlock filename="graphic.mjs" language="JavaScript" code={`// Resolve the stylesheet URL relative to this module, so it loads no matter
// where the renderer serves the package from.
const STYLE_URL = new URL('./style.css', import.meta.url).href;

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
    if (this._initialized) return;               // idempotent
    this.innerHTML = TEMPLATE;
    this._root     = this.querySelector('.bug');
    this._label    = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();                             // <-- first line of every method
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
    void this._root.offsetWidth;                 // force reflow before transition
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

  // Required on every graphic, even when the manifest declares no customActions.
  async customAction({ action } = {}) {
    return { statusCode: 404, description: \`Unknown custom action: \${action ?? ""}\` };
  }

  async dispose() {
    this.innerHTML = '';
    this._initialized = false;                   // reset so a re-load re-inits
    return { statusCode: 200 };
  }
}

// Note the absence of customElements.define() -- the renderer picks the tag.`} />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                <p className="text-sm font-semibold text-blue-900">Init on load(), not on connect</p>
                <p className="mt-2 text-sm text-blue-800">
                  The <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">_initialized</code> flag makes <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">_initDom()</code> safe to call any number of times. Every public method calls it first, so the graphic works regardless of whether the renderer inserts the element before or after calling <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">load()</code>.
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
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">A self-contained OGraf package: external stylesheet, local fonts, lazy lifecycle init, renderer-registered tag.</p>
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
