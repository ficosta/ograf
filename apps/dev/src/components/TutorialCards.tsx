import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

const TUTORIALS = [
  {
    slug: "/get-started",
    title: "Lower Third",
    subtitle: "Name & title overlay",
    difficulty: "Beginner" as const,
    time: "15 min",
    preview: "/templates/lower-third/demo.html",
  },
  {
    slug: "/tutorials/bug",
    title: "Bug / LIVE",
    subtitle: "Corner indicator",
    difficulty: "Beginner" as const,
    time: "10 min",
    preview: "/templates/bug/demo.html",
  },
  {
    slug: "/tutorials/ticker",
    title: "News Ticker",
    subtitle: "Scrolling crawl",
    difficulty: "Intermediate" as const,
    time: "20 min",
    preview: "/templates/ticker/demo.html",
  },
  {
    slug: "/tutorials/quote",
    title: "Full Page Quote",
    subtitle: "Cinematic typography",
    difficulty: "Intermediate" as const,
    time: "15 min",
    preview: "/templates/quote/demo.html",
  },
];

const DIFFICULTY_STYLES = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
};

interface TutorialCardsProps {
  readonly exclude?: string;
  readonly title?: string;
  readonly subtitle?: string;
}

export function TutorialCards({ exclude, title = "More tutorials", subtitle }: TutorialCardsProps) {
  const filtered = exclude ? TUTORIALS.filter((t) => t.slug !== exclude) : TUTORIALS;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <Link to="/tutorials" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600">
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((tut) => (
          <Link
            key={tut.slug}
            to={tut.slug}
            className="group flex flex-col rounded-2xl ring-1 ring-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-900/5 transition-all"
          >
            {/* Mini preview — iframe is 3x the card width, scaled to 33% to show full graphic */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 aspect-[16/10] overflow-hidden">
              <iframe
                src={tut.preview}
                className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
                style={{ width: "300%", height: "300%", transform: "scale(0.333)" }}
                tabIndex={-1}
                loading="lazy"
                title={tut.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_STYLES[tut.difficulty]}`}>
                  {tut.difficulty}
                </span>
                <span className="text-[10px] text-slate-400">{tut.time}</span>
              </div>
              <p className="font-display text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{tut.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{tut.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
