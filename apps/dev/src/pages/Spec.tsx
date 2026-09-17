import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "../i18n/Link";
import {
  Lightbulb, Palette, Package, Tv, Download, Play, RefreshCw, Square, Trash2,
  FolderOpen, FileJson, Settings, Image, Type, AlignLeft, List, Pipette, Percent,
  Timer, Wrench, BookOpen, Map, CheckCircle, Target, ChevronRight,
} from "lucide-react";
import { TutorialCards } from "../components/TutorialCards";
import { WorkflowDiagram } from "../components/WorkflowDiagram";
import { CodeBlock } from "../components/CodeBlock";
import { useRouteMeta } from "../hooks/useMeta";
import { useCopy } from "../i18n/useLocale";
import { SPEC_COPY } from "../i18n/copy/spec";
import CHECK_RULES from "../content/check-rules.json";

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

function Analogy({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-amber-50 border border-amber-100 p-5 mt-6">
      <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" /> {label}
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

function SectionNav({ items, heading }: { items: readonly { id: string; label: string }[]; heading: string }) {
  return (
    <nav className="sticky top-24 hidden xl:block">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{heading}</p>
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

function MobileSectionNav({ items }: { items: readonly { id: string; label: string }[] }) {
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

const NAV_IDS = [
  "big-picture",
  "whats-inside",
  "manifest",
  "lifecycle",
  "steps",
  "data",
  "real-world",
  "advanced",
  "next",
] as const;

const LIFECYCLE_ICONS = [
  <Download key="load" className="h-4 w-4 text-blue-600 inline" />,
  <Play key="play" className="h-4 w-4 text-blue-600 inline" />,
  <RefreshCw key="update" className="h-4 w-4 text-blue-600 inline" />,
  <Square key="stop" className="h-4 w-4 text-blue-600 inline" />,
  <Trash2 key="dispose" className="h-4 w-4 text-blue-600 inline" />,
];

const FIELD_TYPES = [
  { type: "single-line", icon: <Type className="h-4 w-4 text-slate-500" /> },
  { type: "multi-line", icon: <AlignLeft className="h-4 w-4 text-slate-500" /> },
  { type: "select", icon: <List className="h-4 w-4 text-slate-500" /> },
  { type: "color-rrggbb", icon: <Pipette className="h-4 w-4 text-slate-500" /> },
  { type: "color-rrggbbaa", icon: <Pipette className="h-4 w-4 text-slate-500" /> },
  { type: "file-path", icon: <FolderOpen className="h-4 w-4 text-slate-500" /> },
  { type: "file-path/image-path", icon: <Image className="h-4 w-4 text-slate-500" /> },
  { type: "percentage", icon: <Percent className="h-4 w-4 text-slate-500" /> },
  { type: "duration-ms", icon: <Timer className="h-4 w-4 text-slate-500" /> },
] as const;

const STEP_COUNTS = ["stepCount: 0", "stepCount: 1", "stepCount: 3", "stepCount: -1"] as const;

export function Spec() {
  useRouteMeta();
  const c = useCopy(SPEC_COPY);
  const navItems = useMemo(() => NAV_IDS.map((id) => ({ id, label: c.nav[id] })), [c]);
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-[1fr_220px] xl:gap-12">
          <div className="max-w-3xl">

            {/* Header */}
            <div className="mb-16">
              <p className="text-sm font-semibold text-blue-600 mb-2">{c.eyebrow}</p>
              <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
                {c.title}
              </h1>
              <p className="mt-6 text-lg tracking-tight text-slate-700">
                {c.intro}
              </p>
            </div>

            <MobileSectionNav items={navItems} />

            {/* Big Picture */}
            <div id="big-picture" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.bigPicture.title}</h2>
              <div className="space-y-4 text-base text-slate-700">
                <p>
                  {c.bigPicture.p1}
                </p>
                <p>
                  {c.bigPicture.p2}
                </p>
              </div>

              <Visual caption={c.bigPicture.rolesCaption}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Palette className="h-5 w-5 text-blue-600" /></div>
                    <p className="font-display text-base font-medium text-slate-900">{c.bigPicture.roles[0].title}</p>
                    <p className="mt-1 text-sm text-slate-500">{c.bigPicture.roles[0].desc}</p>
                  </div>
                  <div className="flex items-center justify-center sm:hidden">
                    <ChevronRight className="h-5 w-5 text-slate-300 rotate-90" />
                  </div>
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Package className="h-5 w-5 text-blue-600" /></div>
                    <p className="font-display text-base font-medium text-slate-900">{c.bigPicture.roles[1].title}</p>
                    <p className="mt-1 text-sm text-slate-500">{c.bigPicture.roles[1].desc}</p>
                  </div>
                  <div className="flex items-center justify-center sm:hidden">
                    <ChevronRight className="h-5 w-5 text-slate-300 rotate-90" />
                  </div>
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Tv className="h-5 w-5 text-blue-600" /></div>
                    <p className="font-display text-base font-medium text-slate-900">{c.bigPicture.roles[2].title}</p>
                    <p className="mt-1 text-sm text-slate-500">{c.bigPicture.roles[2].desc}</p>
                  </div>
                </div>
              </Visual>

              <Analogy label={c.analogyLabel}>
                <p>{c.bigPicture.analogy}</p>
              </Analogy>

              <div className="mt-10">
                <WorkflowDiagram />
              </div>
            </div>

            {/* What's Inside */}
            <div id="whats-inside" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.inside.title}</h2>
              <p className="text-base text-slate-700 mb-6">
                {c.inside.intro}
              </p>

              <Visual caption={c.inside.caption}>
                <div className="font-mono text-sm space-y-1.5">
                  {[
                    { indent: 0, icon: <FolderOpen className="h-4 w-4 text-blue-500" />, name: "my-lower-third/", desc: "" },
                    { indent: 1, icon: <FileJson className="h-4 w-4 text-amber-500" />, name: "my-lower-third.ograf.json", desc: c.inside.tree.manifest },
                    { indent: 1, icon: <Settings className="h-4 w-4 text-slate-500" />, name: "graphic.mjs", desc: c.inside.tree.code },
                    { indent: 1, icon: <Palette className="h-4 w-4 text-purple-500" />, name: "style.css", desc: c.inside.tree.styles },
                    { indent: 1, icon: <Image className="h-4 w-4 text-green-500" />, name: "thumbnail.png", desc: c.inside.tree.thumbnail },
                    { indent: 1, icon: <FolderOpen className="h-4 w-4 text-blue-500" />, name: "assets/", desc: "" },
                    { indent: 2, icon: <Type className="h-4 w-4 text-slate-400" />, name: "brand-font.woff2", desc: c.inside.tree.font },
                    { indent: 2, icon: <Image className="h-4 w-4 text-green-500" />, name: "logo.svg", desc: c.inside.tree.logo },
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
                <p>{c.inside.required}</p>
              </div>

              <Callout icon={<Palette className="h-4 w-4" />} title={c.inside.calloutTitle}>
                {c.inside.callout}
              </Callout>
            </div>

            {/* Manifest */}
            <div id="manifest" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.manifest.title}</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  {c.manifest.p1}
                </p>
                <p>
                  {c.manifest.p2}
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

              <p className="mt-6 text-sm text-slate-500 italic">{c.manifest.breakdown}</p>

              <div className="mt-6 space-y-3">
                <Accordion title={c.manifest.identity.title} subtitle={c.manifest.identity.subtitle}>
                  {c.manifest.identity.body}
                </Accordion>

                <Accordion title={c.manifest.code.title} subtitle={c.manifest.code.subtitle}>
                  {c.manifest.code.body}
                </Accordion>

                <Accordion title={c.manifest.behavior.title} subtitle={c.manifest.behavior.subtitle}>
                  {c.manifest.behavior.body}
                </Accordion>

                <Accordion title={c.manifest.data.title} subtitle={c.manifest.data.subtitle}>
                  {c.manifest.data.body}
                </Accordion>
              </div>

              <Analogy label={c.analogyLabel}>
                <p>{c.manifest.analogy}</p>
              </Analogy>
            </div>

            {/* Lifecycle */}
            <div id="lifecycle" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.lifecycle.title}</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  {c.lifecycle.intro}
                </p>
              </div>

              <Visual caption={c.lifecycle.caption}>
                <div className="space-y-0">
                  {LIFECYCLE_ICONS.map((icon, i) => ({ step: String(i + 1), icon, ...c.lifecycle.steps[i] })).map((s, i) => (
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
                  {c.lifecycle.body}
                </p>
              </div>

              <Callout icon={<Target className="h-4 w-4" />} title={c.lifecycle.calloutTitle}>
                <p>{c.lifecycle.callout}</p>
              </Callout>
            </div>

            {/* Steps */}
            <div id="steps" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.steps.title}</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  {c.steps.intro}
                </p>
              </div>

              <Visual>
                <div className="space-y-6">
                  {c.steps.models.map((m, i) => ({ ...m, count: STEP_COUNTS[i] })).map((s) => (
                    <div key={s.count} className="flex gap-4">
                      <div className="shrink-0">
                        <code className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{s.count}</code>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                        <p className="text-sm text-slate-600 mt-0.5">{s.desc}</p>
                        <p className="text-xs text-slate-400 mt-1">{c.steps.examples(s.examples)}</p>
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
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.data.title}</h2>
              <div className="space-y-4 text-base text-slate-700 mb-6">
                <p>
                  {c.data.p1}
                </p>
                <p>
                  {c.data.p2}
                </p>
              </div>

              <Visual caption={c.data.caption}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* What the operator sees */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{c.data.operatorSees}</p>
                    <div className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-slate-200 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">{c.data.form.headline}</label>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900">{c.data.form.headlineValue}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">{c.data.form.bgColor}</label>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-blue-600 ring-1 ring-slate-200" />
                          <span className="text-xs text-slate-500 font-mono">#2563eb</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">{c.data.form.position}</label>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900">{c.data.form.positionValue}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">{c.data.form.duration}</label>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900">500 ms</div>
                      </div>
                    </div>
                  </div>

                  {/* What you write */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{c.data.youWrite}</p>
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

              <h3 className="font-display text-lg text-slate-900 mt-8 mb-4">{c.data.fieldTypesTitle}</h3>
              <p className="text-sm text-slate-700 mb-4">
                {c.data.fieldTypesIntro}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FIELD_TYPES.map((g) => (
                  <div key={g.type} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="shrink-0">{g.icon}</span>
                    <div>
                      <code className="text-xs font-mono font-semibold text-blue-600">{g.type}</code>
                      <p className="text-xs text-slate-500">{c.data.fieldTypes[g.type]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-World Examples — linked to actual tutorials */}
            <div id="real-world" className="mb-20 scroll-mt-24">
              <p className="text-base text-slate-700 mb-6">
                {c.realWorld.intro}
              </p>
              <TutorialCards
                title={c.realWorld.cardsTitle}
                subtitle={c.realWorld.cardsSubtitle}
              />
            </div>

            {/* Advanced */}
            <div id="advanced" className="mb-20 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.advanced.title}</h2>
              <p className="text-base text-slate-700 mb-6">
                {c.advanced.intro}
              </p>

              <div className="space-y-3">
                <Accordion title={c.advanced.customActions.title} subtitle={c.advanced.customActions.subtitle}>
                  {c.advanced.customActions.body}
                </Accordion>
                <Accordion title={c.advanced.renderRequirements.title} subtitle={c.advanced.renderRequirements.subtitle}>
                  {c.advanced.renderRequirements.body}
                </Accordion>
                <Accordion title={c.advanced.nonRealTime.title} subtitle={c.advanced.nonRealTime.subtitle}>
                  {c.advanced.nonRealTime.body}
                </Accordion>
                <Accordion title={c.advanced.vendorExtensions.title} subtitle={c.advanced.vendorExtensions.subtitle}>
                  {c.advanced.vendorExtensions.body}
                </Accordion>
              </div>
            </div>

            {/* Next Steps */}
            <div id="next" className="mb-16 scroll-mt-24">
              <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-6">{c.next.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/get-started" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Wrench className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">{c.next.build.title}</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">{c.next.build.desc}</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">{c.next.build.cta} &rarr;</p>
                </Link>
                <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><BookOpen className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">{c.next.spec.title}</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">{c.next.spec.desc}</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">{c.next.spec.cta} &rarr;</p>
                </a>
                <Link to="/ecosystem" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><Map className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">{c.next.ecosystem.title}</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">{c.next.ecosystem.desc}</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">{c.next.ecosystem.cta} &rarr;</p>
                </Link>
                <Link to="/check" className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-3"><CheckCircle className="h-5 w-5 text-blue-600" /></div>
                  <p className="font-display text-lg text-slate-900">{c.next.check.title}</p>
                  <p className="mt-2 text-sm text-slate-500 flex-1">{c.next.check.desc(CHECK_RULES.total)}</p>
                  <p className="mt-4 text-sm font-medium text-blue-600">{c.next.check.cta} &rarr;</p>
                </Link>
              </div>
            </div>

          </div>

          {/* Side nav */}
          <div className="hidden xl:block">
            <SectionNav items={navItems} heading={c.onThisPage} />
          </div>
        </div>
      </div>
    </section>
  );
}
