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
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Intermediate</span>
            <span className="text-xs text-slate-400">20 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a sport lineup card.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            The pre-match lineup graphic is a staple of sports broadcasting — from Premier League coverage to the World Cup. A grid of player cards reveals one by one, showing number, name, and position, with the formation and coach in the footer.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/sport-lineup/demo.html"
            fields={[
              { key: "team", label: "Team", defaultValue: "FC Barcelona" },
              { key: "meta", label: "Match Info", defaultValue: "La Liga — Matchday 28" },
              { key: "formation", label: "Formation", defaultValue: "4-3-3" },
              { key: "coach", label: "Coach", defaultValue: "Hansi Flick" },
              { key: "players", label: "Players", type: "json" as const, defaultValue: [
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
            title="Sport Lineup — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from other graphics?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Grid layout</p>
                <p className="text-sm text-slate-600 mt-1">Uses CSS Grid with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">auto-fill</code> columns at least 120px wide. Cards reflow naturally whether you have 11 players or 5 subs.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Staggered cards</p>
                <p className="text-sm text-slate-600 mt-1">Each player card gets an inline <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code> of 300 ms + 60 ms per card, creating a wave of cards appearing across the grid.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Three-part structure</p>
                <p className="text-sm text-slate-600 mt-1">Dark gradient header with team name and match info, then the player grid, then a footer with formation and coach — three distinct visual zones.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Rendering the players</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_renderPlayers</code> builds a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.lineup-card</code> for each player: the number in a dark circle, the name, and the position beneath it. Every value goes through <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">escapeHtml</code> before it lands in the markup, and each card's <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code> is calculated from its index. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load</code> and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> both call <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_applyData</code>, which only touches fields that are not <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">undefined</code> — so a partial update changes just what it sends, an empty string blanks a field (for formation and coach, the "Formation:" / "Coach:" label goes too), and a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">players</code> array re-renders the grid.
            </p>
            <CodeBlock filename="graphic.mjs (rendering)" language="JavaScript" code={RENDER_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Playing it on air</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">resolveTargetStep</code> implements the OGraf step model: <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goto</code> if given, otherwise the current step (-1 before the first play) plus <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">delta</code>, default 1. With one step, the first play lands on step 0 and a second play goes past the end, so the graphic stops and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>. On step 0, <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">playAction</code> adds <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> and waits until the last card has finished: 300 ms + 60 ms per card + 500 ms for the card's own transition. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> fades out over 400 ms and only clears the classes if no newer action (a higher <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code>) has started meanwhile.
            </p>
            <CodeBlock filename="graphic.mjs (step model)" language="JavaScript" code={PLAY_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — grid and card reveal</h2>
            <p className="text-base text-slate-700 mb-4">
              The player grid uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))</code> so it adapts to the container width; a 2px gap over a light grey background draws the dividers between cards. Each card fades in and rises 12px when the parent gets the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> class. The reset is scoped with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">:where(.sport-lineup-root, …)</code>, so it never restyles the renderer's page.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={LINEUP_CSS} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                Use <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">auto-fill</code> instead of a fixed column count. This way the grid gracefully handles 11 starters, 5 substitutes, or any other roster size without layout changes in the template code.
              </p>
            </div>
          </div>

          <TutorialManifest slug="sport-lineup" title="Sport Lineup" manifest={MANIFEST} intro="The players field is a typed array — items.type is object with required number, name, and position. A controller can add, remove, and reorder rows automatically." />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Sport lineup complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">CSS Grid, staggered card reveals, and a clean header/footer structure — ready for matchday broadcasts.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/score-bug" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Score Bug</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
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
