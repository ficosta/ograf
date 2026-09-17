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
            <span className="text-xs text-slate-400">15 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a countdown timer.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            Countdown timers are used everywhere in broadcast — pre-show countdowns, segment timers, auction clocks, and event countdowns. This graphic is unique because it <strong className="text-slate-900">ticks itself</strong> using <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">setInterval</code> — no external update calls needed once it starts.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/countdown/demo.html"
            fields={[
              { key: "label", label: "Label", defaultValue: "Show starts in" },
              { key: "seconds", label: "Seconds", defaultValue: "120" },
            ]}
            title="Countdown — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from other graphics?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Self-ticking</p>
                <p className="text-sm text-slate-600 mt-1">Uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">setInterval</code> internally. Once it has played in, it counts down on its own. No <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> calls from the renderer are needed.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Urgency state</p>
                <p className="text-sm text-slate-600 mt-1">When 10 seconds or fewer remain, the digits turn red and pulse, signalling urgency to the viewer without any operator intervention.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Clean teardown</p>
                <p className="text-sm text-slate-600 mt-1">The interval <strong>must</strong> be cleared in both <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction()</code> and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">dispose()</code>. Forgetting either leaves a ghost timer ticking in the background.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The ticking engine</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_startTicking</code> clears any previous interval, then starts a 1-second one. Each tick decrements <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_remaining</code>, repaints the clock and toggles the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">urgent</code> class at 10 seconds. When it reaches zero it stops itself, leaving 00:00 on screen. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_paintTime</code> only touches the minutes or seconds span whose text actually changed, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_swap</code> restarts that span's <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">tick</code> animation with a forced reflow.
            </p>
            <CodeBlock filename="graphic.mjs (ticking)" language="JavaScript" code={TICK_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Starting after the entrance</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load</code> paints the starting time from the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">seconds</code> field; the clock only starts moving on play. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">playAction</code> follows the spec's step model (<code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goto</code>, else current step plus <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">delta</code>). With <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stepCount: 1</code>, a second play goes past the last step, so it stops the graphic and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>. The interval starts only after the 800 ms entrance, and only if <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code> hasn't moved on: a stop sent during the entrance must not be followed by a clock that starts ticking anyway. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> takes partial data; if the clock was running it restarts from the new value.
            </p>
            <CodeBlock filename="graphic.mjs (playAction, updateAction)" language="JavaScript" code={PLAY_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Cleaning up</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> clears the interval before its 500 ms exit, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">dispose</code> clears it again and bumps the revision so nothing pending touches the emptied element.
            </p>
            <CodeBlock filename="graphic.mjs (stopAction, dispose)" language="JavaScript" code={CLEANUP_CODE} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                Always clear intervals in <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">stopAction()</code> and <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">dispose()</code>. In a broadcast environment, graphics are loaded and unloaded frequently. A forgotten interval means a timer ticking in the background, consuming CPU and potentially causing unexpected behaviour when the graphic is reloaded.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS: tick animation and urgency</h2>
            <p className="text-base text-slate-700 mb-4">
              Each digit pair that changes slides up into place over 0.36 s with the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">tick</code> class. When urgency kicks in, the time turns red and pulses gently in scale once a second.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={STYLE_CODE} />
          </div>

          <TutorialManifest slug="countdown" title="Countdown Timer" manifest={MANIFEST} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Countdown complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Self-ticking with setInterval, an urgency state, and proper cleanup in stopAction() and dispose(): a self-contained timer graphic.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/breaking-news" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Breaking News</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
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
