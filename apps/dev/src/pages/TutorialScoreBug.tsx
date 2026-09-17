import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/score-bug/score-bug.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/score-bug/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/score-bug/style.css?raw";
import { excerpt, cssExcerpt } from "../lib/excerpt";
import { useRouteMeta } from "../hooks/useMeta";
import { useCopy, useT } from "../i18n/useLocale";
import { SCORE_BUG_COPY } from "../i18n/copy/tutorials-broadcast/score-bug";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const CUSTOM_CODE = excerpt(GRAPHIC_SOURCE, ["customAction"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["resolveTargetStep", "playAction"]);
const GOAL_CSS = cssExcerpt(STYLE_SOURCE, [".score-bug.goal .score-bug-inner", "@keyframes goalFlash"]);
const ACTIVE_CODE = excerpt(GRAPHIC_SOURCE, ["_updateActiveTeam"]);
const ACTIVE_CSS = cssExcerpt(STYLE_SOURCE, [".score-team.active .score-team-name", ".score-team.active .score-value"]);

export function TutorialScoreBug() {
  useRouteMeta();
  const t = useT();
  const c = useCopy(SCORE_BUG_COPY);
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
            <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">{t.common.difficulty.Advanced}</span>
            <span className="text-xs text-slate-400">25 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">{c.title}</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">{c.intro}</p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/score-bug/demo.html"
            fields={[
              { key: "home", label: c.fields.home, defaultValue: "BRA" },
              { key: "away", label: c.fields.away, defaultValue: "ARG" },
              { key: "homeScore", label: c.fields.homeScore, defaultValue: "2" },
              { key: "awayScore", label: c.fields.awayScore, defaultValue: "1" },
              { key: "time", label: c.fields.time, defaultValue: "73:42" },
              { key: "period", label: c.fields.period, defaultValue: "2nd Half" },
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
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.customTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.customBody}</p>
            <CodeBlock filename="graphic.mjs (customAction)" language="JavaScript" code={CUSTOM_CODE} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">{c.insightTitle}</p>
              <p className="mt-2 text-sm text-blue-800">{c.insightBody}</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.playTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.playBody}</p>
            <CodeBlock filename={`graphic.mjs (${c.codeLabels.stepModel})`} language="JavaScript" code={PLAY_CODE} />
            <p className="mt-4 text-base text-slate-700">{c.playRev}</p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.cssTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.cssBody}</p>
            <CodeBlock filename={`style.css (${c.codeLabels.goalFlash})`} language="CSS" code={GOAL_CSS} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.leaderTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.leaderBody}</p>
            <CodeBlock filename="graphic.mjs (_updateActiveTeam)" language="JavaScript" code={ACTIVE_CODE} />
            <div className="mt-4">
              <CodeBlock filename={`style.css (${c.codeLabels.activeTeam})`} language="CSS" code={ACTIVE_CSS} />
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">{c.tipTitle}</p>
              <p className="mt-2 text-sm text-amber-800">{c.tipBody}</p>
            </div>
          </div>

          <TutorialManifest slug="score-bug" title={c.manifestTitle} manifest={MANIFEST} intro={c.manifestIntro} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">{c.doneTitle}</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">{c.doneBody}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/countdown" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">{c.next}</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">{t.common.allTutorials}</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/score-bug" />
        </div>

      </div>
    </section>
  );
}
