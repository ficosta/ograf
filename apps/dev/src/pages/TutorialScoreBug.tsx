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

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const CUSTOM_CODE = excerpt(GRAPHIC_SOURCE, ["customAction"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["resolveTargetStep", "playAction"]);
const GOAL_CSS = cssExcerpt(STYLE_SOURCE, [".score-bug.goal .score-bug-inner", "@keyframes goalFlash"]);
const ACTIVE_CODE = excerpt(GRAPHIC_SOURCE, ["_updateActiveTeam"]);
const ACTIVE_CSS = cssExcerpt(STYLE_SOURCE, [".score-team.active .score-team-name", ".score-team.active .score-value"]);

export function TutorialScoreBug() {
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
                <p className="text-sm text-slate-600 mt-1">The manifest declares one custom action, <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goal</code>. The renderer triggers it through <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customAction</code> to flash the bug without changing its data or its step.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Persistent position</p>
                <p className="text-sm text-slate-600 mt-1">Unlike lower thirds that play in and out, the score bug stays on screen for the entire match. It plays in once, then takes partial <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> calls for the score, clock and period.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Dark, compact design</p>
                <p className="text-sm text-slate-600 mt-1">A small top-left card on a near-opaque dark background with a blue accent bar. It stays readable over any video: bright pitch, crowd shots, replays.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The customAction: goal flash</h2>
            <p className="text-base text-slate-700 mb-4">
              When a goal is scored, the renderer calls <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">{"customAction({ id, payload, skipAnimation })"}</code> with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">id: "goal"</code>, one of the ids declared in the manifest's <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">customActions</code>. The graphic adds a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goal</code> class for 800 ms, then removes it. Nothing else changes: the score itself arrives separately through <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code>. An id the graphic doesn't know gets a 404, which is how a renderer learns the action is unsupported.
            </p>
            <CodeBlock filename="graphic.mjs (customAction)" language="JavaScript" code={CUSTOM_CODE} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">Key insight: customAction vs updateAction</p>
              <p className="mt-2 text-sm text-blue-800">
                <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">updateAction</code> changes the graphic's persistent data (score, time, team names). <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">customAction</code> triggers a transient visual event: it plays an animation, then the graphic returns to its previous visual state. With <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">skipAnimation</code> the flash is pure animation, so there is nothing left to do and it just returns.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Playing in, and playing again</h2>
            <p className="text-base text-slate-700 mb-4">
              The manifest says <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stepCount: 1</code>. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">resolveTargetStep</code> applies the spec's rule: <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goto</code> if given, otherwise the current step (-1 before the first play) plus <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">delta</code>, which defaults to 1. The first play lands on step 0 and runs the 600 ms entrance. A second play targets step 1, which is past the last step, so the graphic goes to its end: it runs <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>.
            </p>
            <CodeBlock filename="graphic.mjs (step model)" language="JavaScript" code={PLAY_CODE} />
            <p className="mt-4 text-base text-slate-700">
              Every action takes the next <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code>. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> only removes the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> class if no newer action started during its 400 ms exit, so play → stop → play sent without waiting ends on air.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS: goal flash effect</h2>
            <p className="text-base text-slate-700 mb-4">
              The flash is a single keyframe animation on the inner card. It keeps the card's normal drop shadow and grows a blue glow around it, peaking halfway through, then fades back to nothing. Its 0.8 s duration matches the 800 ms the graphic waits before removing the class.
            </p>
            <CodeBlock filename="style.css (goal flash)" language="CSS" code={GOAL_CSS} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Highlighting the leader</h2>
            <p className="text-base text-slate-700 mb-4">
              After every load and update, the team with more goals gets an <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">active</code> class; on a draw neither does. Updates may be partial, so a clock-only update carries no scores: the graphic then falls back to the scores already on screen instead of dropping the highlight.
            </p>
            <CodeBlock filename="graphic.mjs (_updateActiveTeam)" language="JavaScript" code={ACTIVE_CODE} />
            <div className="mt-4">
              <CodeBlock filename="style.css (active team)" language="CSS" code={ACTIVE_CSS} />
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The leader's score turns light blue and its name goes pure white. It's a small cue, common in premium sports broadcasts, that tells viewers who is ahead at a glance without adding anything to the layout. When a score does change, <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">updateAction</code> also gives the number a 350 ms <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">updating</code> pop.
              </p>
            </div>
          </div>

          <TutorialManifest slug="score-bug" title="Score Bug" manifest={MANIFEST} intro="Notice the customActions array: that's how OGraf declares graphic-specific operations beyond play, update and stop. The renderer only sends ids listed there, and the graphic answers anything else with a 4xx (this one uses 404)." />

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
