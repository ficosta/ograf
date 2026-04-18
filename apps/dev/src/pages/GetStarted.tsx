import { useRef, useState, useCallback } from "react";
import {
  Play, Square, RefreshCw, FolderOpen, FileJson, Settings, Palette,
  Image, ChevronRight, Download, Trash2, Check,
} from "lucide-react";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { useMeta } from "../hooks/useMeta";

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

function LiveDemo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [name, setName] = useState("Jane Smith");
  const [title, setTitle] = useState("Senior Graphics Engineer");

  const send = useCallback((action: string, data?: Record<string, string>) => {
    iframeRef.current?.contentWindow?.postMessage({ action, data }, "*");
  }, []);

  const handlePlay = () => {
    if (!isPlaying) {
      send("load", { name, title });
      setTimeout(() => send("play"), 100);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    send("stop");
    setIsPlaying(false);
  };

  const handleUpdate = () => {
    send("update", { name, title });
  };

  return (
    <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden shadow-xl shadow-slate-900/10">
      {/* Preview area */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-3 left-4 flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/30">1920 x 1080</span>
          <div className={`h-2 w-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
        </div>
        <iframe
          ref={iframeRef}
          src="/templates/lower-third/demo.html"
          className="w-full aspect-video border-0"
          sandbox="allow-scripts allow-same-origin"
          title="OGraf Lower Third Preview"
        />
      </div>

      {/* Controls */}
      <div className="bg-white p-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Data inputs */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="h-3.5 w-3.5" /> Play
            </button>
            <button
              onClick={handleUpdate}
              disabled={!isPlaying}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Update
            </button>
            <button
              onClick={handleStop}
              disabled={!isPlaying}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Square className="h-3.5 w-3.5" /> Stop
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Try it: type a new name, click <strong>Play</strong> to animate in, change the text and click <strong>Update</strong>, then click <strong>Stop</strong> to animate out.
        </p>
      </div>
    </div>
  );
}

const MANIFEST_CODE = `{
  "$schema": "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",
  "id": "dev.ograf.tutorial.lower-third",
  "version": "1.0.0",
  "name": "CBS-Style Lower Third",
  "description": "Clean white and blue lower third with slide-in animation",
  "author": { "name": "Your Name" },
  "main": "graphic.mjs",
  "stepCount": 1,
  "supportsRealTime": true,
  "supportsNonRealTime": false,
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name",
        "gddType": "single-line",
        "default": "Jane Smith"
      },
      "title": {
        "type": "string",
        "title": "Title",
        "gddType": "single-line",
        "default": "Senior Graphics Engineer"
      }
    }
  }
}`;

const HTML_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1920, height=1080">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <lower-third></lower-third>
  <script type="module" src="graphic.mjs"></script>
</body>
</html>`;

const CSS_CODE = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap');

body { background: transparent; overflow: hidden; }

.l3rd {
  position: fixed;
  bottom: 64px;
  left: 48px;
  font-family: 'Inter', sans-serif;
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
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
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

const JS_CODE = `export default class LowerThird extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`
      <div class="l3rd">
        <div class="l3rd-accent"></div>
        <div class="l3rd-content">
          <div class="l3rd-name"></div>
          <div class="l3rd-title"></div>
        </div>
      </div>
    \`;
    this._root = this.querySelector('.l3rd');
    this._name = this.querySelector('.l3rd-name');
    this._title = this.querySelector('.l3rd-title');
  }

  async load({ data }) {
    if (data?.name) this._name.textContent = data.name;
    if (data?.title) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  async playAction({ delta = 1 } = {}) {
    this._root.classList.remove('out');
    void this._root.offsetWidth; // force reflow
    this._root.classList.add('visible');
    await new Promise(r => setTimeout(r, 700));
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction() {
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 500));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data }) {
    if (data?.name) this._name.textContent = data.name;
    if (data?.title) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  async dispose() {
    this.innerHTML = '';
    return { statusCode: 200 };
  }
}

customElements.define('lower-third', LowerThird);`;

export function GetStarted() {
  useMeta({ title: "Get Started · Lower Third tutorial", description: "Build a CBS-style lower third from scratch. Fifteen minutes from zero to a working OGraf template." });
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold text-blue-600 mb-2">Tutorial</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            Build your first OGraf template.
          </h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            In this tutorial you'll build a production-quality lower third graphic from scratch — the same kind you see on CBS, BBC, or any news broadcast. It slides in, displays a name and title, updates live, and slides out.
          </p>
        </div>

        {/* Live Demo — the result */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-emerald-500" />
            <h2 className="font-display text-lg text-slate-900">What you'll build — try it live</h2>
          </div>
          <LiveDemo />
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
            <CodeBlock filename="lower-third.ograf.json" language="JSON" code={MANIFEST_CODE} />
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

          {/* Step 3: HTML */}
          <div>
            <StepHeader n={3} title="Create the HTML entry point" />
            <p className="text-base text-slate-700 mb-4">
              The HTML file loads your component and styles. The viewport is set to 1920x1080 — standard broadcast resolution. The body is transparent so the graphic overlays cleanly.
            </p>
            <CodeBlock filename="index.html" language="HTML" code={HTML_CODE} />
            <p className="mt-4 text-sm text-slate-500">
              Notice <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">&lt;lower-third&gt;</code> — that's your custom HTML element. The browser doesn't know what it is until your JavaScript registers it.
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
              This is the heart of your OGraf graphic. It's a standard Web Component that the renderer controls by calling five methods in order. Each method returns a Promise — <strong className="text-slate-900">the renderer waits for your animation to finish before doing anything else.</strong>
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
                <p><strong>load()</strong> — Receives the operator's data (name + title) and puts it in the DOM. No animation yet.</p>
                <p><strong>playAction()</strong> — Adds the <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">.visible</code> CSS class, which triggers the slide-in transition. Waits 700ms for it to finish, then tells the renderer "I'm ready."</p>
                <p><strong>updateAction()</strong> — Swaps the text content. In production you'd add a smooth text-swap animation.</p>
                <p><strong>stopAction()</strong> — Adds the <code className="font-mono text-xs bg-blue-100 px-1 py-0.5 rounded">.out</code> class for the exit animation. Waits 500ms, then cleans up.</p>
                <p><strong>dispose()</strong> — Clears the DOM. Called when the graphic is removed from the renderer entirely.</p>
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
                  title: "Option C: Load it in ograf-devtool",
                  desc: "Clone SuperFlyTV/ograf-devtool for a local development server with compliance checks and control GUIs.",
                  link: { href: "https://github.com/SuperFlyTV/ograf-devtool", label: "View on GitHub" },
                },
                {
                  title: "Option D: Open index.html in a browser",
                  desc: "Open the file directly in Chrome. Open DevTools console and call the lifecycle methods manually on the element.",
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
