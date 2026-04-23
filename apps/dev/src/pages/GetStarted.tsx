import { Link } from "react-router";
import {
  Play, Square, RefreshCw, FolderOpen, FileJson, Settings, Palette,
  Image, ChevronRight, Download, Trash2, Check,
} from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TemplateDownload } from "../components/TemplateDownload";
import manifestJson from "../../public/templates/lower-third/lower-third.ograf.json";
import { useMeta } from "../hooks/useMeta";

const MANIFEST_JSON_FROM_DISK = JSON.stringify(manifestJson, null, 2);

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
        {n}
      </div>
      <h2 className="font-display text-xl tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
    </div>
  );
}

const FOLDER_TREE = `lower-third/
├── lower-third.ograf.json
├── graphic.mjs
├── style.css
└── fonts/
    ├── Inter-Medium.woff2
    ├── Inter-Bold.woff2
    └── LICENSE.txt`;

const CSS_CODE = `/* style.css -- loaded via <link> injected by graphic.mjs.
   URLs below resolve relative to this file, so the fonts in ./fonts/ just work. */

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('./fonts/Inter-Medium.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('./fonts/Inter-Bold.woff2') format('woff2');
}

.l3rd, .l3rd *, .l3rd *::before, .l3rd *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.l3rd {
  position: absolute;               /* NOT fixed -- anchor to the renderer's frame */
  bottom: 64px;
  left: 48px;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  transform: translateX(-120%);
  opacity: 0;
  filter: blur(4px);
}

.l3rd.visible {
  transform: translateX(0);
  opacity: 1;
  filter: blur(0);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.5s ease, filter 0.5s ease;
}

.l3rd.out {
  transform: translateX(-120%);
  opacity: 0;
  filter: blur(4px);
  transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1),
              opacity 0.4s ease 0.1s, filter 0.4s ease 0.1s;
}

.l3rd-accent {
  width: 5px;
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  border-radius: 3px 0 0 3px;
}

.l3rd-content {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  padding: 16px 32px 16px 20px;
  border-radius: 0 6px 6px 0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.l3rd-name {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.l3rd-title {
  font-size: 13px;
  font-weight: 500;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-top: 3px;
}`;

const JS_CODE = `// Resolve the stylesheet URL relative to this module so it loads no matter
// where the renderer serves the package from.
const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = \`
  <link rel="stylesheet" href="\${STYLE_URL}">
  <div class="l3rd">
    <div class="l3rd-accent"></div>
    <div class="l3rd-content">
      <div class="l3rd-name"></div>
      <div class="l3rd-title"></div>
    </div>
  </div>
\`;

export default class LowerThird extends HTMLElement {

  _initDom() {
    if (this._initialized) return;                 // idempotent
    this.innerHTML = TEMPLATE;
    this._root  = this.querySelector('.l3rd');
    this._name  = this.querySelector('.l3rd-name');
    this._title = this.querySelector('.l3rd-title');
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();                               // <-- first line of every public method
    if (data?.name)  this._name.textContent  = data.name;
    if (data?.title) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    this._initDom();
    this._root.classList.remove('out');
    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: 0 };
    }
    void this._root.offsetWidth;                   // force reflow before transition
    this._root.classList.add('visible');
    await new Promise(r => setTimeout(r, 700));
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 500));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.name)  this._name.textContent  = data.name;
    if (data?.title) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  // Required on every graphic, even when the manifest declares no customActions.
  async customAction({ action } = {}) {
    return { statusCode: 404, description: \`Unknown custom action: \${action ?? ""}\` };
  }

  async dispose() {
    this.innerHTML = '';
    this._initialized = false;                     // reset so a re-load re-inits
    return { statusCode: 200 };
  }
}

// Note the absence of customElements.define() -- the renderer picks the tag.`;

export function GetStarted() {
  useMeta({ title: "Get Started · Lower Third tutorial", description: "Build a CBS-style lower third from scratch. Fifteen minutes from zero to a working OGraf template." });
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
            <span className="text-xs text-slate-400">15 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build your first OGraf template.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            In this tutorial you'll build a production-quality lower third graphic from scratch — the same kind you see on CBS, BBC, or any news broadcast. It slides in, displays a name and title, updates live, and slides out.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/lower-third/demo.html"
            fields={[
              { key: "name", label: "Name", defaultValue: "Jane Smith" },
              { key: "title", label: "Title", defaultValue: "Senior Graphics Engineer" },
            ]}
            title="Lower Third — OGraf Template"
          />
        </div>

        {/* Prerequisites */}
        <div className="rounded-xl bg-slate-50 p-6 mb-16">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Before you start</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" /> Basic knowledge of HTML and CSS (JavaScript helps but isn't required to follow along)</li>
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" /> A text editor — VS Code, Sublime Text, or anything you're comfortable with</li>
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" /> A web browser (Chrome, Firefox, Edge, Safari)</li>
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-20">

          {/* Step 1: Project Structure */}
          <div>
            <StepHeader n={1} title="Create your project folder" />
            <p className="text-base text-slate-700 mb-6">
              Create a new folder with these four files. That's your entire OGraf package — no build tools, no npm, no framework.
            </p>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
              <div className="font-mono text-sm space-y-1.5">
                {[
                  { indent: 0, icon: <FolderOpen className="h-4 w-4 text-blue-500" />, name: "lower-third/", bold: true },
                  { indent: 1, icon: <FileJson className="h-4 w-4 text-amber-500" />, name: "lower-third.ograf.json", note: "manifest" },
                  { indent: 1, icon: <Settings className="h-4 w-4 text-slate-500" />, name: "graphic.mjs", note: "logic" },
                  { indent: 1, icon: <Palette className="h-4 w-4 text-purple-500" />, name: "style.css", note: "design" },
                  { indent: 1, icon: <Image className="h-4 w-4 text-green-500" />, name: "index.html", note: "entry point" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2" style={{ paddingLeft: f.indent * 20 }}>
                    {f.icon}
                    <span className={`text-slate-900 ${f.bold ? "font-semibold" : ""}`}>{f.name}</span>
                    {f.note && <span className="text-xs text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">{f.note}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm text-blue-800">
                <strong className="text-blue-900">That's it.</strong> Four files. No <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">node_modules</code>, no <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">package.json</code>, no build step. OGraf packages are plain web files.
              </p>
            </div>
          </div>

          {/* Step 2: The Manifest */}
          <div>
            <StepHeader n={2} title="Write the manifest — your graphic's ID card" />
            <p className="text-base text-slate-700 mb-4">
              The manifest tells every OGraf system who your graphic is and what it needs. When an operator loads your graphic in SPX or any controller, <strong className="text-slate-900">this file is the first thing it reads</strong>. It auto-generates the data form you saw in the demo above.
            </p>
            <CodeBlock filename="lower-third.ograf.json" language="JSON" code={MANIFEST_JSON_FROM_DISK} />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Identity</p>
                <p className="text-sm text-slate-700"><code className="font-mono text-xs text-blue-600">id</code> and <code className="font-mono text-xs text-blue-600">name</code> — how controllers identify and display your graphic.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Behavior</p>
                <p className="text-sm text-slate-700"><code className="font-mono text-xs text-blue-600">stepCount: 1</code> — one step: it appears, holds, then disappears when stopped.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Entry Point</p>
                <p className="text-sm text-slate-700"><code className="font-mono text-xs text-blue-600">main</code> — points to your JavaScript file with the Web Component class.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Data Schema</p>
                <p className="text-sm text-slate-700"><code className="font-mono text-xs text-blue-600">schema</code> — defines the form fields. Controllers auto-generate the input UI from this.</p>
              </div>
            </div>
          </div>

          {/* Step 3: Folder structure */}
          <div>
            <StepHeader n={3} title="Assemble the package folder" />
            <p className="text-base text-slate-700 mb-4">
              An OGraf package is a small folder with a manifest, a JavaScript module, a stylesheet, and any static assets the graphic needs. There is no HTML entry point — the renderer mounts the default-exported class under its own tag, so the module just has to export a class that extends <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">HTMLElement</code>.
            </p>
            <CodeBlock filename="lower-third/" language="Text" code={FOLDER_TREE} />
            <p className="mt-4 text-sm text-slate-500">
              The <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">fonts/</code> folder ships the Inter weights this graphic uses along with their license (SIL OFL) — playout boxes are often offline, so bundling fonts avoids CDN calls that would silently fail.
            </p>
          </div>

          {/* Step 4: CSS */}
          <div>
            <StepHeader n={4} title="Design the look — CSS" />
            <p className="text-base text-slate-700 mb-4">
              This is where the visual design lives. We're building a CBS-inspired clean look: white background, blue accent bar on the left, uppercase blue title. The slide-in uses CSS transitions with <strong className="text-slate-900">cubic-bezier easing</strong> for that broadcast-quality feel.
            </p>
            <CodeBlock filename="style.css" language="CSS" code={CSS_CODE} />

            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                <Palette className="h-4 w-4" /> Design tip
              </p>
              <p className="mt-2 text-sm text-amber-800">
                The <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">cubic-bezier(0.16, 1, 0.3, 1)</code> easing is key — it starts fast and decelerates smoothly, giving that snappy broadcast motion feel. The out-animation uses <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">cubic-bezier(0.76, 0, 0.24, 1)</code> for a quick, punchy exit.
              </p>
            </div>
          </div>

          {/* Step 5: JavaScript */}
          <div>
            <StepHeader n={5} title="Write the logic — the Web Component" />
            <p className="text-base text-slate-700 mb-4">
              This is the heart of your OGraf graphic. It's a standard Web Component that the renderer controls by calling six methods — five linear lifecycle steps plus <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">customAction</code> for graphic-specific extras. Each returns a Promise: <strong className="text-slate-900">the renderer waits for your animation to finish before doing anything else.</strong>
            </p>

            {/* Visual lifecycle flow */}
            <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6">
              {[
                { icon: <Download className="h-3.5 w-3.5" />, label: "load", desc: "Get data" },
                { icon: <Play className="h-3.5 w-3.5" />, label: "play", desc: "Animate in" },
                { icon: <RefreshCw className="h-3.5 w-3.5" />, label: "update", desc: "Change data" },
                { icon: <Square className="h-3.5 w-3.5" />, label: "stop", desc: "Animate out" },
                { icon: <Trash2 className="h-3.5 w-3.5" />, label: "dispose", desc: "Clean up" },
              ].map((m, i) => (
                <div key={m.label} className="flex items-center gap-1 shrink-0">
                  <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                    <div className="flex items-center justify-center text-blue-600 mb-0.5">{m.icon}</div>
                    <p className="text-xs font-mono font-semibold text-blue-700">{m.label}</p>
                    <p className="text-[10px] text-blue-500">{m.desc}</p>
                  </div>
                  {i < 4 && <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />}
                </div>
              ))}
            </div>

            <CodeBlock filename="graphic.mjs" language="JavaScript" code={JS_CODE} />

            <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <Settings className="h-4 w-4" /> How it works
              </p>
              <div className="mt-2 text-sm text-blue-800 space-y-2">
                <p><strong>_initDom()</strong> — A private helper, idempotent. The first public method to run calls it to set <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">innerHTML</code> + grab element refs. This way the graphic works whether the renderer inserts the element before or after calling <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">load()</code>.</p>
                <p><strong>load()</strong> — Receives the operator's data (name + title) and puts it in the DOM. No animation yet.</p>
                <p><strong>playAction()</strong> — Adds the <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">.visible</code> CSS class, which triggers the slide-in transition. Waits 700ms for it to finish, then tells the renderer "I'm ready."</p>
                <p><strong>updateAction()</strong> — Swaps the text content. In production you'd add a smooth text-swap animation.</p>
                <p><strong>stopAction()</strong> — Adds the <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">.out</code> class for the exit animation. Waits 500ms, then cleans up.</p>
                <p><strong>customAction()</strong> — OGraf requires every graphic to expose this, even without any declared in the manifest. A no-op that returns <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">statusCode: 404</code> for unknown actions is the correct default.</p>
                <p><strong>dispose()</strong> — Clears the DOM and resets <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">_initialized</code> so a re-load rebuilds cleanly. Called when the graphic is removed from the renderer entirely.</p>
              </div>
            </div>
          </div>

          {/* Step 6: Test */}
          <div>
            <StepHeader n={6} title="Test it" />
            <p className="text-base text-slate-700 mb-6">
              Your graphic is ready. Here's how to test it:
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "Option A: Use the live demo above",
                  desc: "Scroll up — the interactive preview at the top of this page is running the exact same code. Click Play, change the text, click Update, click Stop.",
                },
                {
                  title: "Option B: Check your package",
                  desc: "Zip your folder and drop it on /check. You'll get a structured report against 30+ rules and the live EBU schema.",
                  link: { href: "/check", label: "Open checker" },
                },
                {
                  title: "Option C: Load it in an OGraf renderer",
                  desc: "Deploy to a compliant renderer: ograf-server (self-hosted reference), SPX-GC (browser controller), or CasparCG (via the HTML producer). Links are on the download card below.",
                },
              ].map((opt) => (
                <div key={opt.title} className="rounded-xl ring-1 ring-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-900">{opt.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{opt.desc}</p>
                  {opt.link && (
                    <a href={opt.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                      {opt.link.label} <ChevronRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Download the full package */}
          <TemplateDownload slug="lower-third" title="CBS-Style Lower Third" />

          {/* Done */}
          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">You built an OGraf graphic.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">
              This package works with any OGraf-compatible system — SPX, ograf-server, CasparCG (via HTML producer), and more. Same files, everywhere.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">
                Read the full spec
              </a>
              <a href="https://github.com/nytamin/ograf-graphics" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">
                Browse more templates
              </a>
            </div>
          </div>

        </div>

        {/* More tutorials */}
        <div className="mt-20">
          <TutorialCards exclude="/get-started" />
        </div>

      </div>
    </section>
  );
}
