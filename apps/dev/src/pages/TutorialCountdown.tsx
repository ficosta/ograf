import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";

function CodeBlock({ code, filename, language }: { code: string; filename?: string; language?: string }) {
  return (
    <div className="rounded-xl bg-slate-900 overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50">
          <span className="text-xs text-slate-400 font-mono">{filename}</span>
          {language && <span className="text-xs text-slate-500">{language}</span>}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm/6 text-slate-300 font-mono"><code>{code}</code></pre>
    </div>
  );
}

export function TutorialCountdown() {
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
                <p className="text-sm text-slate-600 mt-1">Uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">setInterval</code> internally. Once started, it counts down on its own — no <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> calls from the playout system.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Urgency state</p>
                <p className="text-sm text-slate-600 mt-1">When 10 seconds or fewer remain, the timer shifts to red with a pulsing animation — signaling urgency to the viewer without any operator intervention.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Clean dispose</p>
                <p className="text-sm text-slate-600 mt-1">The interval <strong>must</strong> be cleared in <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">dispose()</code>. Forgetting this causes memory leaks and ghost timers ticking in the background.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The ticking engine</h2>
            <p className="text-base text-slate-700 mb-4">
              The <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_startTicking</code> method sets up a 1-second interval. Each tick decrements the remaining seconds, formats the display, and checks for the urgency threshold. When it hits zero, it clears itself.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={`_startTicking() {
  this._clearInterval();
  this._remaining = this._totalSeconds;
  this._updateDisplay();

  this._interval = setInterval(() => {
    this._remaining--;

    if (this._remaining <= 10 && this._remaining > 0) {
      this._root.classList.add('urgent');
    }

    if (this._remaining <= 0) {
      this._remaining = 0;
      this._clearInterval();
      this._root.classList.add('finished');
      this._root.classList.remove('urgent');
    }

    this._updateDisplay();
  }, 1000);
}

_updateDisplay() {
  const mins = Math.floor(this._remaining / 60);
  const secs = this._remaining % 60;
  this._display.textContent =
    \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
}

_clearInterval() {
  if (this._interval) {
    clearInterval(this._interval);
    this._interval = null;
  }
}

async load({ data }) {
  this._totalSeconds = data?.seconds || 60;
  if (data?.label) this._label.textContent = data.label;
  this._remaining = this._totalSeconds;
  this._updateDisplay();
  return { statusCode: 200 };
}

async playAction() {
  this._root.classList.add('visible');
  this._startTicking();
  await new Promise(r => setTimeout(r, 600));
  return { statusCode: 200, currentStep: 0 };
}

async dispose() {
  this._clearInterval();
  this.innerHTML = '';
  return { statusCode: 200 };
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                Always clear intervals in <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">dispose()</code>. In a broadcast environment, graphics are loaded and unloaded frequently. A forgotten interval means a timer ticking in the background, consuming CPU and potentially causing unexpected behavior when the graphic is reloaded.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — tick animation and urgency</h2>
            <p className="text-base text-slate-700 mb-4">
              Each second tick gets a subtle scale animation on the digits. When urgency kicks in, the entire timer shifts to red with a pulsing glow.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.countdown {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  opacity: 0;
  text-align: center;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.countdown.visible {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.countdown-display {
  font-size: 72px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -2px;
  color: white;
  animation: tick 1s steps(1) infinite;
}

@keyframes tick {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Urgency state — last 10 seconds */
.countdown.urgent .countdown-display {
  color: #ef4444;
  animation: urgent-pulse 1s ease-in-out infinite;
}

@keyframes urgent-pulse {
  0%, 100% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
  50% { text-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
}

/* Finished state */
.countdown.finished .countdown-display {
  color: #22c55e;
  animation: none;
}`} />
          </div>

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Countdown complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Self-ticking with setInterval, urgency states, and proper cleanup in dispose() — a self-contained timer graphic.</p>
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
