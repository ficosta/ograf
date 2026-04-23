import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/score-bug/score-bug.ograf.json";
import { useMeta } from "../hooks/useMeta";

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/score-bug");
const MANIFEST = JSON.stringify(manifestJson, null, 2);

export function TutorialScoreBug() {
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
            <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">Advanced</span>
            <span className="text-xs text-slate-400">25 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a live score bug.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            The score bug is the persistent graphic in the corner of every live sports broadcast — showing teams, scores, time, and period. This tutorial covers the full lifecycle including <strong className="text-slate-900">customActions</strong>, the OGraf mechanism for triggering one-off visual events like a goal flash without changing the graphic's step.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/score-bug/demo.html"
            fields={[
              { key: "home", label: "Home Team", defaultValue: "BRA" },
              { key: "away", label: "Away Team", defaultValue: "ARG" },
              { key: "homeScore", label: "Home Score", defaultValue: "2" },
              { key: "awayScore", label: "Away Score", defaultValue: "1" },
              { key: "time", label: "Match Time", defaultValue: "73:42" },
              { key: "period", label: "Period", defaultValue: "2nd Half" },
            ]}
            title="Score Bug — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from other graphics?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">customActions</p>
                <p className="text-sm text-slate-600 mt-1">This is the <strong>only tutorial</strong> that teaches <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customAction</code> — a method for triggering visual events (goal flash, card shown) without advancing the graphic's step.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Persistent position</p>
                <p className="text-sm text-slate-600 mt-1">Unlike lower thirds that play in and out, the score bug stays on screen for the entire match. It plays in once and receives continuous updates.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Dark, compact design</p>
                <p className="text-sm text-slate-600 mt-1">Small footprint with high contrast. Dark background ensures readability over any video content — bright pitch, crowd shots, replays.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The customAction — goal flash</h2>
            <p className="text-base text-slate-700 mb-4">
              When a goal is scored, the playout system calls <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customAction</code> with an action name. The graphic flashes the scoring team's side, plays a brief animation, and returns to normal — all without changing the graphic's step or requiring a full update cycle.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={`async customAction({ action, data }) {
  if (action === 'goal') {
    const side = data?.team === 'home' ? 'left' : 'right';
    const scoreEl = this.querySelector(\`.score-\${side}\`);
    const flashEl = this.querySelector('.goal-flash');

    // Update the score
    if (data?.score !== undefined) {
      scoreEl.textContent = data.score;
    }

    // Trigger the flash animation
    flashEl.classList.add('active');
    scoreEl.classList.add('pulse');

    await new Promise(r => setTimeout(r, 2000));

    flashEl.classList.remove('active');
    scoreEl.classList.remove('pulse');

    return { statusCode: 200 };
  }

  if (action === 'card') {
    // Show yellow/red card indicator briefly
    const indicator = this.querySelector('.card-indicator');
    indicator.className = \`card-indicator \${data?.cardType || 'yellow'}\`;
    indicator.classList.add('show');
    await new Promise(r => setTimeout(r, 3000));
    indicator.classList.remove('show');
    return { statusCode: 200 };
  }

  return { statusCode: 404, description: \`Unknown action: \${action}\` };
}`} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">Key insight: customAction vs updateAction</p>
              <p className="mt-2 text-sm text-blue-800">
                <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">updateAction</code> changes the graphic's persistent data (score, time, team names). <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">customAction</code> triggers a transient visual event — it plays an animation, then the graphic returns to its previous visual state. Think of it as a notification overlay on top of the base graphic.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — goal flash effect</h2>
            <p className="text-base text-slate-700 mb-4">
              The goal flash is a full-width overlay that pulses with the scoring team's color. The score number itself also scales up briefly with a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">pulse</code> class.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.score-bug {
  position: fixed;
  top: 32px;
  left: 48px;
  background: rgba(15, 15, 25, 0.92);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
}

.goal-flash {
  position: absolute;
  inset: 0;
  background: rgba(255, 215, 0, 0.3);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.goal-flash.active {
  opacity: 1;
  animation: flash-pulse 0.6s ease-in-out 3;
}

@keyframes flash-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.score-left.pulse,
.score-right.pulse {
  animation: score-bump 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes score-bump {
  0% { transform: scale(1); }
  40% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

.team-active {
  background: rgba(255, 255, 255, 0.08);
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                Highlight the team currently in possession by adding a subtle <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">team-active</code> background class. This tiny detail — common in premium sports broadcasts — gives viewers a subconscious sense of momentum without being distracting.
              </p>
            </div>
          </div>

          <TutorialManifest slug="score-bug" title="Score Bug" manifest={MANIFEST} intro="Notice the customActions array — that's how OGraf declares graphic-specific operations beyond play/stop. The graphic must return statusCode 404 for anything not listed." />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Score bug complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Persistent positioning, live updates via updateAction, and transient goal flashes via customAction — the full live sports toolkit.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/countdown" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Countdown</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
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
