import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/sport-lineup/sport-lineup.ograf.json";
import { useMeta } from "../hooks/useMeta";

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/sport-lineup");
const MANIFEST = JSON.stringify(manifestJson, null, 2);

export function TutorialSportLineup() {
  useMeta({
    title: (TUTORIAL?.title ?? "Tutorial") + " tutorial",
    description: TUTORIAL?.desc ?? undefined,
  });
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
            The pre-match lineup graphic is a staple of sports broadcasting — from Premier League coverage to the World Cup. A grid of player cards reveals one by one, showing name, number, and position, followed by the formation and coaching staff.
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
                <p className="text-sm text-slate-600 mt-1">Uses CSS Grid to arrange player cards in responsive columns. Cards reflow naturally whether you have 11 players or 5 subs.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Staggered cards</p>
                <p className="text-sm text-slate-600 mt-1">Each player card gets an increasing <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code>, creating a wave of cards appearing across the grid.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Two-part structure</p>
                <p className="text-sm text-slate-600 mt-1">Dark header bar with team name, then the player grid, then a footer with formation and coach — three distinct visual zones.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Rendering the players</h2>
            <p className="text-base text-slate-700 mb-4">
              The <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_renderPlayers</code> method creates a card for each player. The number gets a bold circle treatment, and the position badge sits beneath the name. Each card's <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code> is calculated from its index.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={`_renderPlayers(players) {
  const grid = this.querySelector('.player-grid');
  grid.innerHTML = '';

  players.forEach((player, i) => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.style.transitionDelay = \`\${i * 80}ms\`;

    card.innerHTML = \`
      <div class="player-number">\${player.number}</div>
      <div class="player-name">\${player.name}</div>
      <div class="player-position">\${player.position}</div>
    \`;

    grid.appendChild(card);
  });
}

async load({ data }) {
  if (data?.team) this._teamName.textContent = data.team;
  if (data?.meta) this._meta.textContent = data.meta;
  if (data?.players) this._renderPlayers(data.players);
  if (data?.formation) this._formation.textContent = data.formation;
  if (data?.coach) this._coach.textContent = \`Coach: \${data.coach}\`;
  return { statusCode: 200 };
}

async playAction() {
  this._root.classList.add('visible');
  await new Promise(r => setTimeout(r, 1200));
  return { statusCode: 200, currentStep: 0 };
}`} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — grid and card reveal</h2>
            <p className="text-base text-slate-700 mb-4">
              The player grid uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))</code> so it adapts to the container width. Each card fades and scales in when the parent gets the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> class.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.lineup-header {
  background: #1a1a2e;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  padding: 16px;
}

.player-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  /* transition-delay set per card via JS */
}

.visible .player-card {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.player-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  font-weight: 700;
  font-size: 16px;
}

.lineup-footer {
  background: #1a1a2e;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}`} />
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
