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

export function TutorialBreakingNews() {
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
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a breaking news alert.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            The breaking news alert is a full-screen interrupt — a bold, red overlay that demands attention. Unlike other graphics, it uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stepCount: 0</code>, meaning it's fire-and-forget: it plays in, holds, and auto-dismisses without any operator interaction.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/breaking-news/demo.html"
            fields={[
              { key: "headline", label: "Headline", defaultValue: "Major earthquake strikes off the coast — tsunami warning issued for coastal regions" },
            ]}
            title="Breaking News — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from other graphics?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Fire-and-forget</p>
                <p className="text-sm text-slate-600 mt-1"><code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stepCount: 0</code> in the manifest. The graphic plays in, holds for a set duration, then auto-dismisses. No operator needed to take it out.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Full-screen overlay</p>
                <p className="text-sm text-slate-600 mt-1">Covers the entire viewport with a semi-transparent dark background. The red "BREAKING NEWS" badge and headline dominate the screen.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Staggered reveal</p>
                <p className="text-sm text-slate-600 mt-1">Three elements animate in sequence — badge, then headline, then the accent line — creating a dramatic reveal that builds urgency.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The auto-dismiss pattern</h2>
            <p className="text-base text-slate-700 mb-4">
              With <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stepCount: 0</code>, the playout system expects the graphic to handle its own lifecycle. The <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">playAction</code> method plays the entrance animation, holds for a fixed duration, then plays the exit — all in a single async call.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={`async playAction() {
  // Phase 1: Reveal the overlay
  this._root.classList.add('visible');
  await new Promise(r => setTimeout(r, 300));

  // Phase 2: Reveal the badge
  this._badge.classList.add('show');
  await new Promise(r => setTimeout(r, 400));

  // Phase 3: Reveal the headline
  this._headline.classList.add('show');
  await new Promise(r => setTimeout(r, 200));

  // Phase 4: Reveal the accent line
  this._line.classList.add('show');

  // Hold for 8 seconds
  await new Promise(r => setTimeout(r, 8000));

  // Phase 5: Auto-dismiss
  this._root.classList.add('out');
  await new Promise(r => setTimeout(r, 600));
  this._root.classList.remove('visible', 'out');
  this._badge.classList.remove('show');
  this._headline.classList.remove('show');
  this._line.classList.remove('show');

  return { statusCode: 200 };
}

async load({ data }) {
  if (data?.headline) this._headline.textContent = data.headline;
  return { statusCode: 200 };
}

// No stopAction needed — the graphic dismisses itself
// No updateAction needed — fire-and-forget`} />
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-semibold text-blue-900">Key insight: stepCount: 0</p>
              <p className="mt-2 text-sm text-blue-800">
                Setting <code className="font-mono text-xs bg-blue-200 px-1 py-0.5 rounded">stepCount: 0</code> tells the playout system this graphic has no interactive steps. It plays, runs its full animation cycle (including hold and exit), and returns. The system won't send play/stop commands — the graphic is fully autonomous once triggered.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — urgency design</h2>
            <p className="text-base text-slate-700 mb-4">
              The breaking news alert uses a dark semi-transparent backdrop, a bold red badge, and a pulsing red dot to convey urgency. The staggered reveal uses increasing <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code> values for each element.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.breaking-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 15, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.breaking-overlay.visible {
  opacity: 1;
}

.breaking-badge {
  background: #dc2626;
  color: white;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.breaking-badge.show {
  opacity: 1;
  transform: translateY(0);
}

/* Pulsing red dot */
.breaking-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: dot-pulse 1.5s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.breaking-headline {
  font-size: 36px;
  font-weight: 600;
  color: white;
  text-align: center;
  max-width: 800px;
  margin-top: 24px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.breaking-headline.show {
  opacity: 1;
  transform: translateY(0);
}

.breaking-line {
  width: 60px;
  height: 3px;
  background: #dc2626;
  margin-top: 20px;
  opacity: 0;
  transform: scaleX(0);
  transition: opacity 0.3s ease, transform 0.4s ease;
}

.breaking-line.show {
  opacity: 1;
  transform: scaleX(1);
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The pulsing red dot in the badge adds urgency without being distracting. It's a subtle but effective broadcast convention — viewers associate that blinking dot with live, important content. The animation is slow (1.5s cycle) so it doesn't feel frantic.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Breaking news complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Fire-and-forget with stepCount: 0, staggered dramatic reveal, and auto-dismiss — a fully autonomous alert graphic.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/weather" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Weather</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
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
