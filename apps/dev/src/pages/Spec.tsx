import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Lightbulb, Palette, Package, Tv, Download, Play, RefreshCw, Square, Trash2,
  FolderOpen, FileJson, Settings, Image, Type, AlignLeft, List, Pipette, Percent,
  Timer, Wrench, BookOpen, Map, CheckCircle, Target, ChevronRight,
} from "lucide-react";
import { TutorialCards } from "../components/TutorialCards";
import { WorkflowDiagram } from "../components/WorkflowDiagram";
import { CodeBlock } from "../components/CodeBlock";
import { useMeta } from "../hooks/useMeta";

function Callout({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-blue-50 border border-blue-100 p-5 mt-6">
      <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
        {icon} {title}
      </p>
      <div className="mt-2 text-sm text-blue-800">{children}</div>
    </div>
  );
}

function Analogy({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-amber-50 border border-amber-100 p-5 mt-6">
      <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" /> Think of it this way
      </p>
      <div className="mt-2 text-sm text-amber-800">{children}</div>
    </div>
  );
}

function Visual({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div className="my-8">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
        {children}
      </div>
      {caption && <p className="mt-2 text-xs text-slate-400 text-center">{caption}</p>}
    </div>
  );
}

function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="sticky top-24 hidden xl:block">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">On this page</p>
      <ul className="space-y-2 border-l border-slate-200">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block pl-4 text-sm text-slate-500 hover:text-slate-900 transition-colors -ml-px border-l border-transparent hover:border-slate-400"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileSectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const pill = nav.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (pill) pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-10 border-y border-slate-200 bg-white/90 backdrop-blur xl:hidden sm:-mx-6 lg:-mx-8">
      <nav ref={navRef} className="flex gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active ? "true" : undefined}
              className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function Accordion({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl ring-1 ring-slate-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <svg className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-slate-200 px-5 py-4 bg-slate-50/50 text-sm text-slate-600 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { id: "big-picture", label: "The Big Picture" },
  { id: "whats-inside", label: "What's Inside a Package" },
  { id: "manifest", label: "The Manifest File" },
  { id: "lifecycle", label: "How a Graphic Comes to Life" },
  { id: "steps", label: "Steps (Multi-Page Graphics)" },
  { id: "data", label: "Data & Forms" },
  { id: "real-world", label: "Real-World Examples" },
  { id: "advanced", label: "Advanced Topics" },
  { id: "next", label: "Next Steps" },
];

export function Spec() {
  useMeta({ title: "Specification Guide", description: "How OGraf works, explained plainly. Packaging, manifests, the Web Component lifecycle, and data schemas — without jargon." });
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-[1fr_220px] xl:gap-12">
          <div className="max-w-3xl">

            {/* Header */}
            <div className="mb-16">
              <p className="text-sm font-semibold text-blue-600 mb-2">Specification Guide</p>
              <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
                How OGraf works — explained simply.
              </h1>
              <p className="mt-6 text-lg tracking-tight text-slate-700">
                Whether you're a designer, developer, or broadcaster, this guide explains the OGraf format in plain language with real examples. No prior experience needed. For the full technical specification, see the{" "}
                <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium underline underline-offset-4 decoration-blue-200 hover:decoration-blue-600">
                  official EBU documentation
                </a>.
              </p>
            </div>

            <MobileSectionNav items={NAV_ITEMS} />

            {/* Big Picture */}
            <div id="big-picture" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The big picture</h2>
              <div className="space-y-4 text-base text-slate-700">
                <p>
                  Imagine you design a lower third in After Effects. Today, you'd export it differently for every system — one version for CasparCG, another for SPX, another for Vizrt. Each with its own format, quirks, and limitations.
                </p>
                <p>
                  <strong className="text-slate-900">OGraf eliminates that.</strong> You build your graphic once as a small web page (HTML + CSS + JavaScript), wrap it in a standard package, and it plays on <em>any</em> OGraf-compatible system. Same file, everywhere.
                </p>
              </div>

              <Visual caption="The three roles in the OGraf ecosystem">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Palette className="h-5 w-5 text-blue-600" /></div>
                    <p className="font-display text-base font-medium text-slate-900">You create</p>
                    <p className="mt-1 text-sm text-slate-500">Design the graphic using HTML, CSS, and JavaScript — the same tools used to build websites.</p>
                  </div>
                  <div className="flex items-center justify-center sm:hidden">
                    <ChevronRight className="h-5 w-5 text-slate-300 rotate-90" />
                  </div>
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Package className="h-5 w-5 text-blue-600" /></div>
                    <p className="font-display text-base font-medium text-slate-900">You package</p>
                    <p className="mt-1 text-sm text-slate-500">Add a manifest file that describes your graphic — its name, data fields, and behavior.</p>
                  </div>
                  <div className="flex items-center justify-center sm:hidden">
                    <ChevronRight className="h-5 w-5 text-slate-300 rotate-90" />
                  </div>
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Tv className="h-5 w-5 text-blue-600" /></div>
                    <p className="font-display text-base font-medium text-slate-900">It plays</p>
                    <p className="mt-1 text-sm text-slate-500">Any OGraf-compatible playout system (SPX, CasparCG, Loopic…) can load and run it.</p>
                  </div>
                </div>
              </Visual>

              <Analogy>
                <p>Think of OGraf like a PDF. A PDF looks the same whether you open it in Adobe Reader, Chrome, or Preview. An OGraf graphic works the same whether it runs on SPX, CasparCG, or any other compatible system. The format is the contract.</p>
              </Analogy>

              <div className="mt-10">
                <WorkflowDiagram />
              </div>
            </div>

            {/* What's Inside */}
            <div id="whats-inside" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's inside a package</h2>
              <p className="text-base text-slate-700 mb-6">
                An OGraf package is just a folder with a few files. No special software needed to create one — you can build it with any text editor.
              </p>

              <Visual caption="A typical OGraf package for a lower third">
                <div className="font-mono text-sm space-y-1.5">
                  {[
                    { indent: 0, icon: <FolderOpen className="h-4 w-4 text-blue-500" />, name: "my-lower-third/", desc: "" },
                    { indent: 1, icon: <FileJson className="h-4 w-4 text-amber-500" />, name: "my-lower-third.ograf.json", desc: "← The manifest (required)" },
                    { indent: 1, icon: <Settings className="h-4 w-4 text-slate-500" />, name: "graphic.mjs", desc: "← Your graphic code" },
                    { indent: 1, icon: <Palette className="h-4 w-4 text-purple-500" />, name: "style.css", desc: "← Your styles" },
                    { indent: 1, icon: <Image className="h-4 w-4 text-green-500" />, name: "thumbnail.png", desc: "← Preview image" },
                    { indent: 1, icon: <FolderOpen className="h-4 w-4 text-blue-500" />, name: "assets/", desc: "" },
                    { indent: 2, icon: <Type className="h-4 w-4 text-slate-400" />, name: "brand-font.woff2", desc: "← Custom font" },
                    { indent: 2, icon: <Image className="h-4 w-4 text-green-500" />, name: "logo.svg", desc: "← Logo or images" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ paddingLeft: f.indent * 24 }}>
                      {f.icon}
                      <span className="text-slate-900">{f.name}</span>
                      {f.desc && <span className="text-slate-400 text-xs">{f.desc}</span>}
                    </div>
                  ))}
                </div>
              </Visual>

              <div className="space-y-4 text-base text-slate-700">
                <p>The only required file is the manifest (<code className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">.ograf.json</code>). Everything else is up to you — use any fonts, images, CSS frameworks, or JavaScript libraries you want.</p>
              </div>

              <Callout icon={<Palette className="h-4 w-4" />} title="For After Effects designers">
                If you use tools like <strong>Ferryman</strong> or <strong>Loopic</strong>, they generate this package for you automatically. You design visually, and the tool exports an OGraf-ready folder. No coding required.
              </Callout>
            </div>

            {/* Manifest */}
            <div id="manifest" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The manifest file</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  The manifest is a small JSON file that <strong className="text-slate-900">describes your graphic to the world</strong>. It answers questions like: What's this graphic called? What data does it need? How does it behave?
                </p>
                <p>
                  When someone loads your graphic in SPX or any other controller, <strong className="text-slate-900">the controller reads this file first</strong>. It uses the information to show the graphic's name in the template list, generate data entry forms for the operator, and know how to control playback.
                </p>
              </div>

              <CodeBlock
                filename="my-lower-third.ograf.json"
                language="JSON"
                code={`{
  "$schema": "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",

  "id": "com.mystation.lower-third",
  "version": "1.0.0",
  "name": "News Lower Third",
  "description": "Standard two-line name and title overlay",

  "author": {
    "name": "Jane Smith",
    "email": "jane@mystation.com"
  },

  "main": "graphic.mjs",

  "stepCount": 1,
  "supportsRealTime": true,
  "supportsNonRealTime": false,

  "schema": {
    "type": "object",
    "properties": {
      "name":  { "type": "string", "title": "Name",  "default": "John Doe" },
      "title": { "type": "string", "title": "Title", "default": "Reporter" }
    }
  }
}`}
              />

              <p className="mt-6 text-sm text-slate-500 italic">Let's break down each part:</p>

              <div className="mt-6 space-y-3">
                <Accordion title="Identity — who is this graphic?" subtitle="id, version, name, description, author">
                  <p><code className="font-mono text-xs text-blue-600">id</code> — A unique identifier, like a product barcode. Use your company domain reversed: <code className="font-mono text-xs">com.mystation.lower-third</code></p>
                  <p><code className="font-mono text-xs text-blue-600">name</code> — The friendly name operators see in the template list: <em>"News Lower Third"</em></p>
                  <p><code className="font-mono text-xs text-blue-600">version</code> — So systems know which version they're running: <em>"1.0.0"</em>, <em>"2.3.1"</em></p>
                  <p><code className="font-mono text-xs text-blue-600">description</code> — A short sentence explaining what the graphic does</p>
                  <p><code className="font-mono text-xs text-blue-600">author</code> — Your name and contact info</p>
                </Accordion>

                <Accordion title="Code — where's the graphic?" subtitle="main">
                  <p><code className="font-mono text-xs text-blue-600">main</code> — The path to the JavaScript file that contains your graphic's logic. This is where the animation, data handling, and rendering code lives.</p>
                  <p>Example: <code className="font-mono text-xs">"graphic.mjs"</code> — a file in the same folder as the manifest.</p>
                </Accordion>

                <Accordion title="Behavior — how does it work?" subtitle="stepCount, supportsRealTime, supportsNonRealTime">
                  <p><code className="font-mono text-xs text-blue-600">stepCount</code> — How many "pages" or states does this graphic have? A simple lower third has <strong>1 step</strong> (it appears, then disappears). Election results with multiple pages might have <strong>5 steps</strong>. More on this below.</p>
                  <p><code className="font-mono text-xs text-blue-600">supportsRealTime</code> — Can this graphic run live on air? (Almost always <code className="font-mono text-xs">true</code>)</p>
                  <p><code className="font-mono text-xs text-blue-600">supportsNonRealTime</code> — Can this graphic be rendered frame-by-frame for post-production? (Advanced feature, usually <code className="font-mono text-xs">false</code>)</p>
                </Accordion>

                <Accordion title="Data — what information does it display?" subtitle="schema">
                  <p>The <code className="font-mono text-xs text-blue-600">schema</code> tells controllers <strong>what fields the operator needs to fill in</strong>. The controller reads this and auto-generates a form — text boxes, color pickers, dropdown menus — so the operator never touches code.</p>
                  <p>In the example above, the schema says: <em>"This graphic needs a Name (text) and a Title (text)."</em> The controller shows two text inputs. The operator types "Jane Smith" and "Senior Reporter," clicks Play, and the lower third appears on screen with that data.</p>
                </Accordion>
              </div>

              <Analogy>
                <p>The manifest is like the back of a board game box. It tells you the game's name, how many players it supports, what's included, and the basic rules — before you even open it. Controllers read the manifest to know how to present and operate your graphic.</p>
              </Analogy>
            </div>

            {/* Lifecycle */}
            <div id="lifecycle" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">How a graphic comes to life</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  When an operator clicks "Play" in their controller (like SPX), a precise sequence happens behind the scenes. Understanding this sequence is key to understanding OGraf.
                </p>
              </div>

              <Visual caption="The lifecycle of an OGraf graphic during a live broadcast">
                <div className="space-y-0">
                  {[
                    { step: "1", action: "Load", what: "The graphic receives the operator's data (name, title, colors…) and gets ready.", icon: <Download className="h-4 w-4 text-blue-600 inline" />, example: 'Operator fills in "Jane Smith" and "Reporter" in the form.' },
                    { step: "2", action: "Play", what: "The graphic animates onto screen. The lower third slides in from the left.", icon: <Play className="h-4 w-4 text-blue-600 inline" />, example: "Director clicks Play. The name super smoothly animates in." },
                    { step: "3", action: "Update", what: "Data changes while the graphic is on-air. The text updates live.", icon: <RefreshCw className="h-4 w-4 text-blue-600 inline" />, example: 'Title changes from "Reporter" to "Senior Correspondent" mid-show.' },
                    { step: "4", action: "Stop", what: "The graphic animates off screen. The lower third slides back out.", icon: <Square className="h-4 w-4 text-blue-600 inline" />, example: "Director clicks Stop. The graphic animates out cleanly." },
                    { step: "5", action: "Dispose", what: "Everything is cleaned up. Memory released. Ready for the next graphic.", icon: <Trash2 className="h-4 w-4 text-blue-600 inline" />, example: "System clears the graphic from the renderer's memory." },
                  ].map((s, i) => (
                    <div key={s.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">{s.step}</div>
                        {i < 4 && <div className="w-0.5 flex-1 bg-blue-200 my-1" />}
                      </div>
                      <div className="pb-8">
                        <p className="font-display text-base font-medium text-slate-900 flex items-center gap-2">{s.icon} {s.action}</p>
                        <p className="mt-1 text-sm text-slate-700">{s.what}</p>
                        <p className="mt-1 text-xs text-slate-400 italic">{s.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Visual>

              <div className="space-y-4 text-base text-slate-700">
                <p>
                  Each of these steps is a <strong className="text-slate-900">method in your code</strong>. The renderer calls them in order, and <strong className="text-slate-900">waits for each to finish</strong> before calling the next. This means: when you tell the renderer "my animation takes 500ms," it respects that and doesn't interrupt.
                </p>
              </div>

              <Callout icon={<Target className="h-4 w-4" />} title="The key insight">
                <p>OGraf doesn't care <em>how</em> you animate your graphic — CSS transitions, JavaScript, GSAP, Lottie, canvas, SVG — anything works. It only cares <em>when</em> you're done. Signal "I'm ready" and the renderer moves on.</p>
              </Callout>
            </div>

            {/* Steps */}
            <div id="steps" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Steps — for multi-page graphics</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  Not every graphic is a simple lower third. Election results might have 5 pages. A sports scoreboard might update dynamically. OGraf handles this with <strong className="text-slate-900">steps</strong>.
                </p>
              </div>

              <Visual>
                <div className="space-y-6">
                  {[
                    {
                      count: "stepCount: 0",
                      label: "Fire-and-forget",
                      desc: "Plays once automatically — in and out. No operator interaction needed.",
                      examples: "Replay sting, transition wipe, bumper animation",
                      visual: ["▶️ In", "✨ Auto", "⏹️ Out"],
                    },
                    {
                      count: "stepCount: 1",
                      label: "Single step (most common)",
                      desc: "Appears when played, stays visible, disappears when stopped.",
                      examples: "Lower third, bug, logo watermark, clock",
                      visual: ["▶️ In", "⏸️ Hold", "⏹️ Out"],
                    },
                    {
                      count: "stepCount: 3",
                      label: "Multi-step",
                      desc: "Each Play advances to the next page. Stop exits from any page.",
                      examples: "Election results (3 parties), multi-stat graphic, slideshow",
                      visual: ["▶️ Page 1", "▶️ Page 2", "▶️ Page 3", "⏹️ Out"],
                    },
                    {
                      count: "stepCount: -1",
                      label: "Dynamic steps",
                      desc: "Number of pages depends on the data — could be 2 or 20.",
                      examples: "Data-driven tables, live leaderboards, scrolling lists",
                      visual: ["▶️ Page 1", "▶️ ...", "▶️ Page N", "⏹️ Out"],
                    },
                  ].map((s) => (
                    <div key={s.count} className="flex gap-4">
                      <div className="shrink-0">
                        <code className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{s.count}</code>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                        <p className="text-sm text-slate-600 mt-0.5">{s.desc}</p>
                        <p className="text-xs text-slate-400 mt-1">Examples: {s.examples}</p>
                        <div className="flex gap-1.5 mt-2">
                          {s.visual.map((v, i) => (
                            <span key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{v}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Visual>
            </div>

            {/* Data & Forms */}
            <div id="data" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Data and forms</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  The most powerful part of OGraf for designers: <strong className="text-slate-900">you define what data your graphic needs, and the controller automatically builds a form for the operator</strong>. No custom UI required.
                </p>
                <p>
                  This is done through the <code className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">schema</code> in your manifest, using a format called <strong className="text-slate-900">GDD</strong> (Graphics Data Definition). Don't let the name intimidate you — it's just a way to say "this graphic needs a text field called Name and a color picker called Background."
                </p>
              </div>

              <Visual caption="What the operator sees vs. what you write in the manifest">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* What the operator sees */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">What the operator sees</p>
                    <div className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-slate-200 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Headline</label>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900">Breaking News</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Background Color</label>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-blue-600 ring-1 ring-slate-200" />
                          <span className="text-xs text-slate-500 font-mono">#2563eb</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Position</label>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900">Left ▾</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Animation Duration</label>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900">500 ms</div>
                      </div>
                    </div>
                  </div>

                  {/* What you write */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">What you write in the manifest</p>
                    <div className="rounded-xl bg-slate-900 p-4 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">
{`"schema": {
  "properties": {
    "headline": {
      "type": "string",
      "gddType": "single-line",
      "default": "Breaking News"
    },
    "bgColor": {
      "type": "string",
      "gddType": "color-rrggbb",
      "default": "#2563eb"
    },
    "position": {
      "type": "string",
      "gddType": "select",
      "enum": ["left","center","right"]
    },
    "duration": {
      "type": "integer",
      "gddType": "duration-ms",
      "default": 500
    }
  }
}`}
                    </div>
                  </div>
                </div>
              </Visual>

              <h3 className="font-display text-lg text-slate-900 mt-8 mb-4">Available field types</h3>
              <p className="text-sm text-slate-700 mb-4">
                The <code className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">gddType</code> tells the controller what kind of input to show. Here are the options:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { type: "single-line", icon: <Type className="h-4 w-4 text-slate-500" />, desc: "Text input (one line)" },
                  { type: "multi-line", icon: <AlignLeft className="h-4 w-4 text-slate-500" />, desc: "Text area (multiple lines)" },
                  { type: "select", icon: <List className="h-4 w-4 text-slate-500" />, desc: "Dropdown menu with choices" },
                  { type: "color-rrggbb", icon: <Pipette className="h-4 w-4 text-slate-500" />, desc: "Color picker" },
                  { type: "color-rrggbbaa", icon: <Pipette className="h-4 w-4 text-slate-500" />, desc: "Color picker with transparency" },
                  { type: "file-path", icon: <FolderOpen className="h-4 w-4 text-slate-500" />, desc: "File browser" },
                  { type: "file-path/image-path", icon: <Image className="h-4 w-4 text-slate-500" />, desc: "Image file browser" },
                  { type: "percentage", icon: <Percent className="h-4 w-4 text-slate-500" />, desc: "Percentage slider" },
                  { type: "duration-ms", icon: <Timer className="h-4 w-4 text-slate-500" />, desc: "Duration in milliseconds" },
                ].map((g) => (
                  <div key={g.type} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="shrink-0">{g.icon}</span>
                    <div>
                      <code className="text-xs font-mono font-semibold text-blue-600">{g.type}</code>
                      <p className="text-xs text-slate-500">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-World Examples — linked to actual tutorials */}
            <div id="real-world" className="mb-20 scroll-mt-24">
              <p className="text-base text-slate-700 mb-6">
                Every concept in this spec maps to something real you can build. Each tutorial walks you through one complete OGraf graphic — manifest, Web Component, animation, data — in 10 to 25 minutes.
              </p>
              <TutorialCards
                title="Real-world examples"
                subtitle="Pick one and build it. Every example ships as a working OGraf package."
              />
            </div>

            {/* Advanced */}
            <div id="advanced" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Advanced topics</h2>
              <p className="text-base text-slate-700 mb-6">
                These features are less common but important for specialized workflows.
              </p>

              <div className="space-y-3">
                <Accordion title="Custom Actions" subtitle="Graphic-specific buttons for operators">
                  <p>Beyond play/stop/update, you can define <strong>custom operations</strong> with their own buttons and data forms. A scoreboard might have a "Goal Scored" button that triggers a celebration animation. A ticker might have an "Add Item" button.</p>
                  <p className="mt-2">You define them in the manifest, and controllers auto-generate the UI — the operator just clicks a button.</p>
                </Accordion>
                <Accordion title="Render Requirements" subtitle="What the playout system needs to support">
                  <p>If your graphic needs a specific resolution (e.g., 1920x1080 minimum), frame rate (e.g., 50fps), or browser engine version, you can declare it. The renderer checks before loading — if it can't meet the requirements, it tells the operator instead of rendering a broken graphic.</p>
                </Accordion>
                <Accordion title="Non-Real-Time Rendering" subtitle="Frame-by-frame for post-production">
                  <p>For video editing and post-production, renderers can step through your graphic frame-by-frame instead of playing in real time. This produces perfect-quality output for pre-recorded content. Your graphic needs two extra methods: one to jump to a specific time, and one to receive the full action timeline upfront.</p>
                </Accordion>
                <Accordion title="Vendor Extensions" subtitle="Custom fields for specific systems">
                  <p>Any field starting with <code className="font-mono text-xs">v_</code> is reserved for vendor-specific data. SPX might add <code className="font-mono text-xs">v_spx_category</code>; CasparCG might add <code className="font-mono text-xs">v_casparcg_channel</code>. These fields are ignored by other systems — they don't break compatibility.</p>
                </Accordion>
              </div>
            </div>

            {/* Next Steps */}
            <div id="next" className="mb-16 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-6">Next steps</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/get-started" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Wrench className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">Build your first template</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">Hands-on tutorial. Zero to a working lower third in 15 minutes.</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">Start building &rarr;</p>
                </Link>
                <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><BookOpen className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">Official EBU specification</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">The full technical specification with JSON schemas and TypeScript types.</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">Read the spec &rarr;</p>
                </a>
                <Link to="/ecosystem" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Map className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">Explore the ecosystem</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">Discover editors, renderers, controllers, and tools that support OGraf.</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">See all tools &rarr;</p>
                </Link>
                <a href="https://ograf.tools/validate" target="_blank" rel="noopener noreferrer" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><CheckCircle className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">Validate your manifest</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">Paste your .ograf.json and check it against the spec instantly.</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">Open validator &rarr;</p>
                </a>
              </div>
            </div>

          </div>

          {/* Side nav */}
          <div className="hidden xl:block">
            <SectionNav items={NAV_ITEMS} />
          </div>
        </div>
      </div>
    </section>
  );
}
