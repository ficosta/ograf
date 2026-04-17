import { Link } from "react-router";
import { TemplateDemo } from "../components/TemplateDemo";
import tutorials from "../content/tutorials.json";
import type { Tutorial, TutorialDifficulty, TutorialField } from "../content/tutorials.types";
import { useMeta } from "../hooks/useMeta";

const TUTORIALS = tutorials as readonly Tutorial[];

const DIFFICULTY_STYLES: Record<TutorialDifficulty, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

export function Tutorials() {
  useMeta({ title: "Tutorials", description: "Learn by building real broadcast graphics. Eleven live interactive demos with source code and step-by-step walkthroughs." });
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-2">Tutorials</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            Learn by building real graphics.
          </h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            Each tutorial builds a production-quality broadcast graphic from scratch. Live demos you can interact with, full source code, and step-by-step explanations. Start with the lower third, then explore more complex patterns.
          </p>
        </div>

        {/* Tutorial cards */}
        <div className="space-y-24">
          {TUTORIALS.map((tut, i) => (
            <div key={tut.slug} id={tut.title.toLowerCase().replace(/\s+/g, '-')}>
              {/* Tutorial header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-600 text-white text-xs font-bold">{i + 1}</span>
                    <h2 className="font-display text-2xl tracking-tight text-slate-900">{tut.title}</h2>
                    <span className="text-sm text-slate-400">{tut.subtitle}</span>
                  </div>
                  <p className="text-base text-slate-600 max-w-2xl">{tut.desc}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[tut.difficulty]}`}>
                    {tut.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">{tut.time}</span>
                </div>
              </div>

              {/* Live demo */}
              <TemplateDemo
                src={tut.demo.src}
                fields={tut.demo.fields as readonly TutorialField[]}
                title={`${tut.title} — OGraf Template`}
                defaultData={tut.demo.defaultData}
              />

              {/* Concepts + CTA */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {tut.concepts.map((c) => (
                    <span key={c} className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{c}</span>
                  ))}
                </div>
                <Link
                  to={tut.slug}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 shrink-0"
                >
                  Start this tutorial
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Suggest a tutorial */}
        <div className="mt-24 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-8 sm:p-12 text-center">
          <p className="font-display text-2xl tracking-tight text-slate-900">
            Have an idea for a tutorial?
          </p>
          <p className="mt-3 text-sm text-slate-600 max-w-lg mx-auto">
            We're always looking for new graphic types to cover — scoreboards, tickers, data visualizations, AR overlays, or anything you've seen on air and want to learn how to build.
          </p>
          <a
            href="https://github.com/ebu/ograf/issues/new?title=Tutorial+idea:+&labels=tutorial&body=I'd+like+to+see+a+tutorial+for..."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:ring-slate-300 hover:bg-white transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" /></svg>
            Suggest a tutorial on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
