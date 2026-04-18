import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/quote/quote.ograf.json";
import { useMeta } from "../hooks/useMeta";

const MANIFEST = JSON.stringify(manifestJson, null, 2);

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/quote");

export function TutorialQuote() {
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
            <span className="text-xs text-slate-400">15 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a full page quote.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            An elegant full-screen quote card — the kind used for interview soundbites, motivational segments, or editorial intros. The text, divider, and attribution reveal in a staggered sequence for cinematic impact.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/quote/demo.html"
            fields={[
              { key: "text", label: "Quote", defaultValue: "Open graphics, open broadcast, open standards. That's the future." },
              { key: "author", label: "Author", defaultValue: "Demo Quote" },
              { key: "role", label: "Role", defaultValue: "Sample Credit" },
            ]}
            title="Full Page Quote — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The staggered reveal technique</h2>
            <p className="text-base text-slate-700 mb-4">
              The magic here is <strong className="text-slate-900">CSS transition delays</strong>. Each element starts hidden and below its final position. When the <code className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">.visible</code> class is added, they animate in sequence:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { delay: "0.3s", element: "Quote text", desc: "Fades up from below" },
                { delay: "0.4s", element: "Divider line", desc: "Scales from center" },
                { delay: "0.5s", element: "Attribution", desc: "Fades up last" },
              ].map((s) => (
                <div key={s.element} className="rounded-xl bg-slate-50 p-4 text-center">
                  <code className="text-xs font-mono text-blue-600">delay: {s.delay}</code>
                  <p className="text-sm font-semibold text-slate-900 mt-2">{s.element}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — staggered transitions</h2>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.quote {
  position: fixed;
  inset: 0;            /* Full screen */
  opacity: 0;
}

.quote.visible { opacity: 1; transition: opacity 0.8s ease; }

/* Each child has its own delay */
.quote.visible .quote-text {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease 0.3s,       /* 300ms delay */
              transform 0.8s ease-out 0.3s;
}

.quote.visible .quote-line {
  transform: scaleX(1);
  transition: transform 0.6s ease-out 0.4s;  /* 400ms delay */
}

.quote.visible .quote-attr {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease 0.5s,         /* 500ms delay */
              transform 0.8s ease-out 0.5s;
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The background uses <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">scale(1.1)</code> as its starting state, then transitions to <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">scale(1)</code>. This creates a subtle "camera settling" effect — the background gently zooms in as the quote appears. Cinematic feel with one line of CSS.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Typography choices</h2>
            <p className="text-base text-slate-700 mb-4">
              This template uses <strong className="text-slate-900">two fonts</strong> for contrast:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-6">
                <p className="font-serif text-2xl italic text-slate-900">"The quote"</p>
                <p className="text-xs text-slate-500 mt-3">Instrument Serif — italic, large (48px). The editorial, elegant voice.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-6">
                <p className="text-base font-semibold text-slate-900">The Attribution</p>
                <p className="text-xs text-blue-600 uppercase tracking-wider mt-1">ROLE / TITLE</p>
                <p className="text-xs text-slate-500 mt-3">Inter — clean, modern sans-serif. The factual voice.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The playAction timing</h2>
            <p className="text-base text-slate-700 mb-4">
              Since the staggered animation takes longer than a simple slide, the <code className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">playAction()</code> promise waits <strong className="text-slate-900">1200ms</strong> — enough for all three elements to finish their reveal before the renderer considers the graphic "ready."
            </p>
            <CodeBlock filename="graphic.mjs" language="JavaScript" code={`async playAction({ skipAnimation } = {}) {
  this._root.classList.remove('out');
  if (skipAnimation) {
    this._root.classList.add('visible');
    return { statusCode: 200, currentStep: 0 };
  }
  void this._root.offsetWidth;
  this._root.classList.add('visible');

  // Wait for all staggered animations to complete
  // Quote text: 0.3s delay + 0.8s duration = 1.1s
  // Attribution: 0.5s delay + 0.8s duration = 1.3s
  await new Promise(r => setTimeout(r, 1200));

  return { statusCode: 200, currentStep: 0 };
}`} />
          </div>

          <TutorialManifest slug="quote" title="Full Page Quote" manifest={MANIFEST} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Quote complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">You've learned staggered CSS transitions, full-screen layouts, typographic contrast, and timing coordination between CSS and JavaScript.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">All tutorials</Link>
              <Link to="/spec" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">Read the spec guide</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/quote" />
        </div>

      </div>
    </section>
  );
}
