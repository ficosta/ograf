import { Link } from "react-router";
import { TemplateDemo } from "../components/TemplateDemo";

const TUTORIALS = [
  {
    slug: "/get-started",
    title: "Lower Third",
    subtitle: "The classic name & title overlay",
    difficulty: "Beginner",
    time: "15 min",
    desc: "The most common broadcast graphic. A name and title card that slides in from the left with a clean CBS-inspired design. Learn the full OGraf lifecycle: load, play, update, stop.",
    demo: {
      src: "/templates/lower-third/demo.html",
      fields: [
        { key: "name", label: "Name", defaultValue: "Jane Smith" },
        { key: "title", label: "Title", defaultValue: "Senior Graphics Engineer" },
      ],
    },
    concepts: ["Web Component basics", "Manifest structure", "CSS transitions", "Lifecycle methods"],
  },
  {
    slug: "/tutorials/bug",
    title: "Bug / Watermark",
    subtitle: "Corner logo with status indicator",
    difficulty: "Beginner",
    time: "10 min",
    desc: "A corner bug that pops in with a scale animation. Typically used for channel branding, LIVE indicators, or event logos. Demonstrates simple animations and minimal data schema.",
    demo: {
      src: "/templates/bug/demo.html",
      fields: [
        { key: "label", label: "Label", defaultValue: "LIVE" },
        { key: "sublabel", label: "Sublabel", defaultValue: "Breaking News" },
      ],
    },
    concepts: ["Scale animations", "Corner positioning", "Minimal manifest", "Brand consistency"],
  },
  {
    slug: "/tutorials/ticker",
    title: "News Ticker",
    subtitle: "Scrolling headline crawl",
    difficulty: "Intermediate",
    time: "20 min",
    desc: "A continuous scrolling ticker at the bottom of the screen — the kind you see on CNN or BBC News. Demonstrates infinite CSS animations, dynamic data arrays, and seamless looping.",
    demo: {
      src: "/templates/ticker/demo.html",
      fields: [
        { key: "badge", label: "Badge", defaultValue: "Breaking" },
      ],
    },
    concepts: ["CSS keyframe animations", "Dynamic data arrays", "Seamless looping", "Bottom bar layout"],
  },
  {
    slug: "/tutorials/quote",
    title: "Full Page Quote",
    subtitle: "Cinematic full-screen typography",
    difficulty: "Intermediate",
    time: "15 min",
    desc: "An elegant full-screen quote card with staggered reveal animations — quote text, divider line, then attribution appear sequentially. Uses Instrument Serif for editorial impact.",
    demo: {
      src: "/templates/quote/demo.html",
      fields: [
        { key: "text", label: "Quote", defaultValue: "Open graphics, open broadcast, open standards. That's the future." },
        { key: "author", label: "Author", defaultValue: "Demo Quote" },
        { key: "role", label: "Role", defaultValue: "Sample Credit" },
      ],
    },
    concepts: ["Staggered animations", "Full-screen layout", "Typography design", "CSS transition delays"],
  },
];

const DIFFICULTY_STYLES = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
};

export function Tutorials() {
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
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[tut.difficulty as keyof typeof DIFFICULTY_STYLES]}`}>
                    {tut.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">{tut.time}</span>
                </div>
              </div>

              {/* Live demo */}
              <TemplateDemo
                src={tut.demo.src}
                fields={tut.demo.fields}
                title={`${tut.title} — OGraf Template`}
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
      </div>
    </section>
  );
}
