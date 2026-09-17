import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/sport-lineup/sport-lineup.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/sport-lineup/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/sport-lineup/style.css?raw";
import { excerpt, cssExcerpt } from "../lib/excerpt";
import { useRouteMeta } from "../hooks/useMeta";
import { useCopy, useT } from "../i18n/useLocale";
import { SPORT_LINEUP_COPY } from "../i18n/copy/tutorials-broadcast/sport-lineup";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const RENDER_CODE = excerpt(GRAPHIC_SOURCE, ["_renderPlayers", "_applyData"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["resolveTargetStep", "playAction", "stopAction"]);
const LINEUP_CSS = cssExcerpt(STYLE_SOURCE, [
  ":where(.sport-lineup-root, .sport-lineup-root *)",
  ".lineup.visible",
  ".lineup.visible .lineup-card",
  ".lineup.out",
  ".lineup-header",
  ".lineup-grid",
  ".lineup-card",
  ".lineup-number",
]);

export function TutorialSportLineup() {
  useRouteMeta();
  const t = useT();
  const c = useCopy(SPORT_LINEUP_COPY);
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
            <span className="text-xs text-slate-400">20 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">{c.title}</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">{c.intro}</p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/sport-lineup/demo.html"
            fields={[
              { key: "team", label: c.fields.team, defaultValue: "FC Barcelona" },
              { key: "meta", label: c.fields.meta, defaultValue: "La Liga — Matchday 28" },
              { key: "formation", label: c.fields.formation, defaultValue: "4-3-3" },
              { key: "coach", label: c.fields.coach, defaultValue: "Hansi Flick" },
              { key: "players", label: c.fields.players, type: "json" as const, defaultValue: [
                { name: "Ter Stegen", number: 1, position: "GK" },
                { name: "Koundé", number: 23, position: "RB" },
                { name: "Araujo", number: 4, position: "CB" },
                { name: "Christensen", number: 15, position: "CB" },
                { name: "Baldé", number: 3, position: "LB" },
                { name: "Pedri", number: 8, position: "CM" },
                { name: "De Jong", number: 21, position: "CM" },
                { name: "Gavi", number: 6, position: "CM" },
                { name: "Raphinha", number: 11, position: "RW" },
                { name: "Lewandowski", number: 9, position: "ST" },
                { name: "Yamal", number: 19, position: "LW" },
              ]},
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
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.renderTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.renderBody}</p>
            <CodeBlock filename={`graphic.mjs (${c.codeLabels.rendering})`} language="JavaScript" code={RENDER_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.playTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.playBody}</p>
            <CodeBlock filename={`graphic.mjs (${c.codeLabels.stepModel})`} language="JavaScript" code={PLAY_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.cssTitle}</h2>
            <p className="text-base text-slate-700 mb-4">{c.cssBody}</p>
            <CodeBlock filename={`style.css (${c.codeLabels.keyParts})`} language="CSS" code={LINEUP_CSS} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">{c.tipTitle}</p>
              <p className="mt-2 text-sm text-amber-800">{c.tipBody}</p>
            </div>
          </div>

          <TutorialManifest slug="sport-lineup" title={c.manifestTitle} manifest={MANIFEST} intro={c.manifestIntro} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">{c.doneTitle}</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">{c.doneBody}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/score-bug" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">{c.next}</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">{t.common.allTutorials}</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/sport-lineup" />
        </div>

      </div>
    </section>
  );
}
