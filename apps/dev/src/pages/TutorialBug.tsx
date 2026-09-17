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
import { useCopy, useT } from "../i18n/useLocale";
import { TUTORIAL_BUG_COPY } from "../i18n/copy/tutorial-bug";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const CSS_CODE = cssExcerpt(STYLE_SOURCE, [".bug {", ".bug.visible", ".bug.out"]);

export function TutorialBug() {
  useRouteMeta();
  const c = useCopy(TUTORIAL_BUG_COPY);
  const t = useT();
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
            <span className="text-xs text-slate-400">10 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">{c.title}</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            {c.lead}
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/bug/demo.html"
            fields={[
              { key: "label", label: c.demo.label, defaultValue: "LIVE" },
              { key: "sublabel", label: c.demo.sublabel, defaultValue: "Breaking News" },
            ]}
            title={c.demo.heading}
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.diffTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {c.diffs.map((d) => (
                <div key={d.title} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{d.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{d.body}</p>
                </div>
              ))}
            </div>
          </div>

          <TutorialManifest slug="bug" title={c.downloadTitle} manifest={MANIFEST} />

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.cssTitle}</h2>
            <p className="text-base text-slate-700 mb-4">
              {c.cssBody}
            </p>
            <CodeBlock filename={c.keyParts} language="CSS" code={CSS_CODE} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">{c.tipTitle}</p>
              <p className="mt-2 text-sm text-amber-800">
                {c.tip}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.componentTitle}</h2>
            <p className="text-base text-slate-700 mb-4">
              {c.componentBody}
            </p>
            <CodeBlock filename="graphic.mjs" language="JavaScript" code={GRAPHIC_SOURCE} />
            <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
              {c.notes.map((n) => (
                <li key={n.title}><strong className="text-slate-900">{n.title}</strong> {n.body}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">{c.done.title}</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">{c.done.body}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/ticker" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">{c.done.next}</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">{t.common.allTutorials}</Link>
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
