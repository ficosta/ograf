import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/election-bars/election-bars.ograf.json";
import { useMeta } from "../hooks/useMeta";

const MANIFEST = JSON.stringify(manifestJson, null, 2);

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/election-bars");

export function TutorialElectionBars() {
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
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build election result bars.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            Election bars are the backbone of results night coverage — think CNN's election night or the BBC's general election broadcast. Each row represents a party with a color-coded bar that grows to its vote percentage, creating a visceral, at-a-glance comparison of results.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/election-bars/demo.html"
            fields={[
              { key: "title", label: "Title", defaultValue: "General Election Results" },
              { key: "subtitle", label: "Subtitle", defaultValue: "National Vote Share" },
              { key: "parties", label: "Parties", type: "json" as const, defaultValue: [
                { name: "Conservative", color: "#0087DC", votes: 13966454, pct: 44 },
                { name: "Labour", color: "#DC241f", votes: 10269051, pct: 32 },
                { name: "Liberal Democrats", color: "#FAA61A", votes: 3696423, pct: 12 },
                { name: "SNP", color: "#FDF38E", votes: 1242380, pct: 4 },
              ]},
            ]}
            title="Election Bars — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from a lower third?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Data-driven widths</p>
                <p className="text-sm text-slate-600 mt-1">Bar widths are set via <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">style.width = percent + '%'</code> inline — no fixed CSS classes. The data controls the visual.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Staggered reveal</p>
                <p className="text-sm text-slate-600 mt-1">Each row animates in with increasing <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code>, creating a cascading waterfall effect from top to bottom.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Color-coded identity</p>
                <p className="text-sm text-slate-600 mt-1">Each party's bar color is passed in the data — no hardcoded palette. Works for any election, any country, any party system.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Rendering the bars</h2>
            <p className="text-base text-slate-700 mb-4">
              The <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_renderBars</code> method loops through each party, creates a row with the party name, a colored bar sized to its percentage, and a vote count. The key trick: <strong className="text-slate-900">bar width starts at 0 and transitions to its target percentage</strong> when the <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> class is added.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={`_renderBars(parties) {
  const container = this.querySelector('.bars-container');
  container.innerHTML = '';

  parties.forEach((party, i) => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.style.transitionDelay = \`\${i * 120}ms\`;

    const bar = document.createElement('div');
    bar.className = 'bar-fill';
    bar.style.backgroundColor = party.color;
    bar.style.width = '0%';

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = party.name;

    const value = document.createElement('span');
    value.className = 'bar-value';
    value.textContent = party.percent > 15
      ? \`\${party.percent}%\`
      : '';

    const votes = document.createElement('span');
    votes.className = 'bar-votes';
    votes.textContent = party.votes.toLocaleString();

    bar.appendChild(value);
    row.append(label, bar, votes);
    container.appendChild(row);

    // Store target width for animation
    bar._targetWidth = party.percent + '%';
  });
}

async playAction() {
  // Animate bars to their target widths
  this.querySelectorAll('.bar-fill').forEach(bar => {
    bar.style.width = bar._targetWidth;
  });
  this._root.classList.add('visible');
  await new Promise(r => setTimeout(r, 800));
  return { statusCode: 200, currentStep: 0 };
}`} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — bar animation</h2>
            <p className="text-base text-slate-700 mb-4">
              The bar fill uses a CSS transition on <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">width</code>. Combined with the staggered <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code> on each row, you get the classic election night cascading reveal.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  /* transition-delay set per row via JS */
}

.visible .bar-row {
  opacity: 1;
  transform: translateX(0);
}

.bar-fill {
  height: 36px;
  border-radius: 4px;
  width: 0%;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
}

.bar-label {
  width: 160px;
  font-weight: 600;
  font-size: 14px;
  text-align: right;
  flex-shrink: 0;
}

.bar-votes {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 90px;
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                Use asymmetric percentage labels — show the percentage <strong>inside</strong> the bar when it's wider than 15%, and <strong>outside</strong> (or omit it) when the bar is small. This prevents tiny bars from overflowing their label, a common pitfall in election graphics.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Number formatting</h2>
            <p className="text-base text-slate-700 mb-4">
              Large vote counts are hard to read without separators. Use <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">toLocaleString()</code> to automatically format numbers with thousands separators based on the viewer's locale — <strong className="text-slate-900">13,966,454</strong> is far more readable than 13966454.
            </p>
            <CodeBlock filename="graphic.mjs" language="JavaScript" code={`// Format votes with locale-aware thousands separators
votes.textContent = party.votes.toLocaleString();
// en-US: "13,966,454"
// de-DE: "13.966.454"
// fr-FR: "13 966 454"`} />
          </div>

          <TutorialManifest slug="election-bars" title="Election Bars" manifest={MANIFEST} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Election bars complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Data-driven widths, staggered reveals, and color-coded parties — everything you need for results night coverage.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/sport-lineup" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Sport Lineup</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/election-bars" />
        </div>

      </div>
    </section>
  );
}
