import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/countdown/countdown.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/countdown/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/countdown/style.css?raw";
import { excerpt, cssExcerpt } from "../lib/excerpt";
import { useRouteMeta } from "../hooks/useMeta";
import { useCopy, useT } from "../i18n/useLocale";
import { COUNTDOWN_COPY } from "../i18n/copy/tutorials-broadcast/countdown";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const TICK_CODE = excerpt(GRAPHIC_SOURCE, ["_startTicking", "_stopTicking", "_paintTime", "_swap"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["playAction", "updateAction"]);
const CLEANUP_CODE = excerpt(GRAPHIC_SOURCE, ["stopAction", "dispose"]);
const STYLE_CODE = cssExcerpt(STYLE_SOURCE, [
  ".countdown.urgent .countdown-time",
  "@keyframes urgentPulse",
  ".countdown-mins.tick",
  "@keyframes digitSwap",
]);

export function TutorialCountdown() {
  useRouteMeta();
  const t = useT();
  const c = useCopy(COUNTDOWN_COPY);
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
            src="/templates/countdown/demo.html"
            fields={[
              { key: "label", label: c.fields.label, defaultValue: "Show starts in" },
              { key: "seconds", label: c.fields.seconds, defaultValue: "120" },
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
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.tickTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.tickBody}</p>
            <CodeBlock filename={`graphic.mjs (${c.codeLabels.ticking})`} language="JavaScript" code={TICK_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.playTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.playBody}</p>
            <CodeBlock filename="graphic.mjs (playAction, updateAction)" language="JavaScript" code={PLAY_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.cleanupTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.cleanupBody}</p>
            <CodeBlock filename="graphic.mjs (stopAction, dispose)" language="JavaScript" code={CLEANUP_CODE} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">{c.tipTitle}</p>
              <p className="mt-2 text-sm text-amber-800">{c.tipBody}</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.cssTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.cssBody}</p>
            <CodeBlock filename={`style.css (${c.codeLabels.keyParts})`} language="CSS" code={STYLE_CODE} />
          </div>

          <TutorialManifest slug="countdown" title={c.manifestTitle} manifest={MANIFEST} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">{c.doneTitle}</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">{c.doneBody}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/breaking-news" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">{c.next}</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">{t.common.allTutorials}</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/countdown" />
        </div>

      </div>
    </section>
  );
}
