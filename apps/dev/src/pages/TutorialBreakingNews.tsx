import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/breaking-news/breaking-news.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/breaking-news/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/breaking-news/style.css?raw";
import { excerpt, cssExcerpt } from "../lib/excerpt";
import { useRouteMeta } from "../hooks/useMeta";
import { useCopy, useT } from "../i18n/useLocale";
import { BREAKING_NEWS_COPY } from "../i18n/copy/tutorials-broadcast/breaking-news";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const TIMING_CODE = excerpt(GRAPHIC_SOURCE, ["IN_MS", "HOLD_MS", "OUT_MS"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["playAction", "_autoDismiss"]);
const STOP_CODE = excerpt(GRAPHIC_SOURCE, ["stopAction", "customAction"]);
const REVEAL_CSS = cssExcerpt(STYLE_SOURCE, [
  ".breaking.visible",
  ".breaking.visible .breaking-badge",
  ".breaking.visible .breaking-headline",
  ".breaking.visible .breaking-line",
]);
const DOT_CSS = cssExcerpt(STYLE_SOURCE, [".breaking-badge-dot", "@keyframes badgePulse"]);

export function TutorialBreakingNews() {
  useRouteMeta();
  const t = useT();
  const c = useCopy(BREAKING_NEWS_COPY);
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
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">{t.common.difficulty.Intermediate}</span>
            <span className="text-xs text-slate-400">15 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">{c.title}</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">{c.intro}</p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/breaking-news/demo.html"
            fields={[
              { key: "headline", label: c.fields.headline, defaultValue: "Major earthquake strikes off the coast — tsunami warning issued for coastal regions" },
            ]}
            title={c.demoTitle}
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.differentTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {c.cards.map((card) => (
                <div key={card.title} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.dismissTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.timingBody}</p>
            <CodeBlock filename={`graphic.mjs (${c.codeLabels.timing})`} language="JavaScript" code={TIMING_CODE} />
            <p className="mt-4 text-base text-slate-700 mb-4">{c.playBody}</p>
            <CodeBlock filename="graphic.mjs (playAction)" language="JavaScript" code={PLAY_CODE} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">{c.insightTitle}</p>
              <p className="mt-2 text-sm text-blue-800">{c.insightBody}</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.stopTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.stopBody}</p>
            <CodeBlock filename="graphic.mjs (stopAction, customAction)" language="JavaScript" code={STOP_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.cssTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.cssBody}</p>
            <CodeBlock filename={`style.css (${c.codeLabels.staggeredReveal})`} language="CSS" code={REVEAL_CSS} />
            <div className="mt-4">
              <CodeBlock filename={`style.css (${c.codeLabels.pulsingDot})`} language="CSS" code={DOT_CSS} />
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">{c.tipTitle}</p>
              <p className="mt-2 text-sm text-amber-800">{c.tipBody}</p>
            </div>
          </div>

          <TutorialManifest slug="breaking-news" title={c.manifestTitle} manifest={MANIFEST} intro={c.manifestIntro} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">{c.doneTitle}</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">{c.doneBody}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/weather" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">{c.next}</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">{t.common.allTutorials}</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/breaking-news" />
        </div>

      </div>
    </section>
  );
}
