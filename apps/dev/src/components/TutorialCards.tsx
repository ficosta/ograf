import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import tutorials from "../content/tutorials.json";
import type { Tutorial, TutorialDifficulty } from "../content/tutorials.types";

const TUTORIALS = tutorials as readonly Tutorial[];

const DIFFICULTY_STYLES: Record<TutorialDifficulty, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

interface TutorialCardsProps {
  readonly exclude?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly max?: number;
}

export function TutorialCards({ exclude, title = "More tutorials", subtitle, max }: TutorialCardsProps) {
  let filtered = exclude ? TUTORIALS.filter((t) => t.slug !== exclude) : TUTORIALS;
  if (max) filtered = filtered.slice(0, max);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <Link to="/tutorials" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600">
          View all {TUTORIALS.length} <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((tut) => (
          <Link
            key={tut.slug}
            to={tut.slug}
            className="group flex flex-col rounded-2xl ring-1 ring-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-900/5 transition-all"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={tut.preview}
                alt={`${tut.title} preview`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
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
