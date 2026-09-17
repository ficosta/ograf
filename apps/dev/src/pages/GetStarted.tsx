import { Link } from "../i18n/Link";
import {
  Play, Square, RefreshCw, FolderOpen, FileJson, Settings, Palette,
  Image, ChevronRight, Download, Trash2, Check,
} from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TemplateDownload } from "../components/TemplateDownload";
import manifestJson from "../../public/templates/lower-third/lower-third.ograf.json";
import { useRouteMeta } from "../hooks/useMeta";
import CHECK_RULES from "../content/check-rules.json";
import { useCopy, useLocalePath, useT } from "../i18n/useLocale";
import { GET_STARTED_COPY } from "../i18n/copy/get-started";

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The spec's step rule: goto wins; otherwise current step (-1 before the
// first play) + delta, which defaults to 1. At or past stepCount → the end.
function resolveTargetStep(currentStep, { goto, delta } = {}, stepCount = 1) {
  const target = Number.isInteger(goto) && goto >= 0
    ? goto
    : (currentStep ?? -1) + (Number.isInteger(delta) ? delta : 1);
  return target >= stepCount ? undefined : Math.max(target, 0);
}

export default class LowerThird extends HTMLElement {

  _initDom() {
    if (this._initialized) return;                 // idempotent
    this.innerHTML = TEMPLATE;
    this._root  = this.querySelector('.l3rd');
    this._name  = this.querySelector('.l3rd-name');
    this._title = this.querySelector('.l3rd-title');
    this._step = undefined;                        // "start": nothing on air yet
    this._rev = 0;                                 // bumped by every action
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();                               // <-- first line of every public method
    if (data?.name !== undefined)  this._name.textContent  = data.name;
    if (data?.title !== undefined) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  async playAction({ goto, delta, skipAnimation } = {}) {
    this._initDom();
    const target = resolveTargetStep(this._step, { goto, delta });
    if (target === undefined) {                    // "next" on the last step = go off air
      await this.stopAction({ skipAnimation });
      return { statusCode: 200, currentStep: undefined };
    }
    ++this._rev;
    this._step = target;
    this._root.classList.remove('out');
    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: this._step };
    }
    void this._root.offsetWidth;                   // force reflow before transition
    this._root.classList.add('visible');
    await sleep(700);
    return { statusCode: 200, currentStep: this._step };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    const rev = ++this._rev;
    this._step = undefined;
    if (skipAnimation) {
      this._root.classList.remove('visible', 'out');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await sleep(500);
    // A play that arrived while we were animating out wins.
    if (rev === this._rev) this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    // !== undefined, not a truthy check: an empty string clears the field.
    if (data?.name !== undefined)  this._name.textContent  = data.name;
    if (data?.title !== undefined) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  // Required on every graphic, even when the manifest declares no customActions.
  // The renderer calls customAction({ id, payload, skipAnimation }).
  async customAction({ id } = {}) {
    return { statusCode: 404, statusMessage: \`Unknown custom action: \${id ?? ''}\` };
  }

  async dispose() {
    this._rev++;                                   // cancels anything still pending
    this.innerHTML = '';
    this._initialized = false;                     // reset so a re-load re-inits
    return { statusCode: 200 };
  }
}

// Note the absence of customElements.define() -- the renderer picks the tag.`;

export function GetStarted() {
  useRouteMeta();
  const c = useCopy(GET_STARTED_COPY);
  const t = useT();
  const localize = useLocalePath();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="mb-4">
          <Link to="/tutorials" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
            <ChevronRight className="h-3 w-3 rotate-180" /> {t.common.allTutorials}
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{t.common.difficulty.Beginner}</span>
            <span className="text-xs text-slate-400">15 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">{c.title}</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            {c.lead}
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/lower-third/demo.html"
            fields={[
              { key: "name", label: c.demo.name, defaultValue: "Jane Smith" },
              { key: "title", label: c.demo.title, defaultValue: "Senior Graphics Engineer" },
            ]}
            title={c.demo.heading}
          />
        </div>

        {/* Prerequisites */}
        <div className="rounded-xl bg-slate-50 p-6 mb-16">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">{c.prereqTitle}</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {c.prereqs.map((item) => (
              <li key={item} className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" /> {item}</li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-20">

          {/* Step 1: Project Structure */}
          <div>
            <StepHeader n={1} title={c.step1.title} />
            <p className="text-base text-slate-700 mb-6">
              {c.step1.body}
            </p>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
              <div className="font-mono text-sm space-y-1.5">
                {[
                  { indent: 0, icon: <FolderOpen className="h-4 w-4 text-blue-500" />, name: "lower-third/", bold: true },
                  { indent: 1, icon: <FileJson className="h-4 w-4 text-amber-500" />, name: "lower-third.ograf.json", note: c.step1.notes.manifest },
                  { indent: 1, icon: <Settings className="h-4 w-4 text-slate-500" />, name: "graphic.mjs", note: c.step1.notes.logic },
                  { indent: 1, icon: <Palette className="h-4 w-4 text-purple-500" />, name: "style.css", note: c.step1.notes.design },
                  { indent: 1, icon: <Image className="h-4 w-4 text-green-500" />, name: "thumbnail.webp", note: c.step1.notes.preview },
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
                {c.step1.callout}
              </p>
            </div>
          </div>

          {/* Step 2: The Manifest */}
          <div>
            <StepHeader n={2} title={c.step2.title} />
            <p className="text-base text-slate-700 mb-4">
              {c.step2.body}
            </p>
            <CodeBlock filename="lower-third.ograf.json" language="JSON" code={MANIFEST_JSON_FROM_DISK} />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {c.step2.cards.map((card) => (
                <div key={card.label} className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
                  <p className="text-sm text-slate-700">{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Folder structure */}
          <div>
            <StepHeader n={3} title={c.step3.title} />
            <p className="text-base text-slate-700 mb-4">
              {c.step3.body}
            </p>
            <CodeBlock filename="lower-third/" language={c.step3.language} code={FOLDER_TREE} />
            <p className="mt-4 text-sm text-slate-500">
              {c.step3.note}
            </p>
          </div>

          {/* Step 4: CSS */}
          <div>
            <StepHeader n={4} title={c.step4.title} />
            <p className="text-base text-slate-700 mb-4">
              {c.step4.body}
            </p>
            <CodeBlock filename="style.css" language="CSS" code={CSS_CODE} />

            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                <Palette className="h-4 w-4" /> {c.step4.tipTitle}
              </p>
              <p className="mt-2 text-sm text-amber-800">
                {c.step4.tip}
              </p>
            </div>
          </div>

          {/* Step 5: JavaScript */}
          <div>
            <StepHeader n={5} title={c.step5.title} />
            <p className="text-base text-slate-700 mb-4">
              {c.step5.body}
            </p>

            {/* Visual lifecycle flow */}
            <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6">
              {[
                { icon: <Download className="h-3.5 w-3.5" />, label: "load", desc: c.step5.lifecycle.load },
                { icon: <Play className="h-3.5 w-3.5" />, label: "play", desc: c.step5.lifecycle.play },
                { icon: <RefreshCw className="h-3.5 w-3.5" />, label: "update", desc: c.step5.lifecycle.update },
                { icon: <Square className="h-3.5 w-3.5" />, label: "stop", desc: c.step5.lifecycle.stop },
                { icon: <Trash2 className="h-3.5 w-3.5" />, label: "dispose", desc: c.step5.lifecycle.dispose },
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
                <Settings className="h-4 w-4" /> {c.step5.howTitle}
              </p>
              <div className="mt-2 text-sm text-blue-800 space-y-2">
                {c.step5.how.map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Step 6: Test */}
          <div>
            <StepHeader n={6} title={c.step6.title} />
            <p className="text-base text-slate-700 mb-6">
              {c.step6.body}
            </p>
            <div className="space-y-3">
              {[
                c.step6.optionA,
                {
                  title: c.step6.optionB.title,
                  desc: c.step6.optionB.desc(CHECK_RULES.total),
                  link: { href: localize("/check"), label: c.step6.optionB.link },
                },
                c.step6.optionC,
              ].map((opt) => (
                <div key={opt.title} className="rounded-xl ring-1 ring-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-900">{opt.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{opt.desc}</p>
                  {"link" in opt && opt.link && (
                    <a href={opt.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                      {opt.link.label} <ChevronRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Download the full package */}
          <TemplateDownload slug="lower-third" title={c.downloadTitle} />

          {/* Done */}
          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">{c.done.title}</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">
              {c.done.body}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">
                {c.done.spec}
              </a>
              <a href="https://github.com/nytamin/ograf-graphics" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">
                {c.done.more}
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
