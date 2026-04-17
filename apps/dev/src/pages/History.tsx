import { ExternalLink, GitMerge } from "lucide-react";
import { SPEC_HISTORY, type SpecHistoryEntry } from "../content/specHistory";
import { HistoryEntryCard } from "../components/HistoryEntryCard";

function groupByYear(entries: SpecHistoryEntry[]): Record<string, SpecHistoryEntry[]> {
  return entries.reduce<Record<string, SpecHistoryEntry[]>>((acc, entry) => {
    const year = entry.closedAt.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(entry);
    return acc;
  }, {});
}

const CATEGORY_COUNTS = (() => {
  const counts: Record<string, number> = {
    Graphics: 0,
    Manifest: 0,
    "GDD / Data": 0,
    "Bug fixes": 0,
    Other: 0,
  };
  for (const e of SPEC_HISTORY) {
    if (e.labels.includes("Issue / Bug")) counts["Bug fixes"]++;
    else if (e.labels.some((l) => l === "GDD Types" || l === "Data Types")) counts["GDD / Data"]++;
    else if (e.labels.includes("Manifest")) counts["Manifest"]++;
    else if (e.labels.some((l) => l === "OGraf Graphic" || l === "ograf-graphics"))
      counts["Graphics"]++;
    else counts["Other"]++;
  }
  return counts;
})();

const MERGED_COUNT = SPEC_HISTORY.filter((e) => e.mergedBy !== undefined).length;

export function History() {
  const grouped = groupByYear(SPEC_HISTORY);
  const years = Object.keys(grouped).sort().reverse();
  const oldest = SPEC_HISTORY[SPEC_HISTORY.length - 1].closedAt.slice(0, 4);
  const newest = SPEC_HISTORY[0].closedAt.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
          How OGraf got here.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          Every major decision, proposal, and fix that shaped the spec — straight from the working group's resolved discussions on GitHub. Expand any entry to read the original thread.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com/ebu/ograf/issues?q=is%3Aissue%20state%3Aclosed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            View the live source on GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-7">
            <div className="text-center">
              <p className="font-display text-4xl font-light text-blue-600">
                {SPEC_HISTORY.length}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Resolved
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-violet-600">
                <span className="inline-flex items-center gap-1">
                  <GitMerge className="h-5 w-5" strokeWidth={2} />
                  {MERGED_COUNT}
                </span>
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Shipped
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-blue-600">
                {oldest === newest ? oldest : `${oldest}–${newest}`}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Window
              </p>
            </div>
            {Object.entries(CATEGORY_COUNTS)
              .filter(([, count]) => count > 0)
              .map(([name, count]) => (
                <div key={name} className="text-center">
                  <p className="font-display text-4xl font-light text-slate-900">{count}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {years.map((year) => (
            <div key={year} className="mb-16 last:mb-0">
              <h2 className="mb-8 font-display text-3xl font-medium tracking-tight text-slate-900">
                {year}
              </h2>
              <ol className="relative border-l-2 border-slate-200 pl-8">
                {grouped[year].map((entry) => (
                  <HistoryEntryCard key={entry.number} entry={entry} />
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl tracking-tight text-slate-900">
            Want to shape what comes next?
          </h2>
          <p className="mt-3 text-slate-700">
            Open discussions, proposals, and active work live on the EBU OGraf repository. Anyone can read, comment, and contribute.
          </p>
          <a
            href="https://github.com/ebu/ograf/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Join the discussion on GitHub
          </a>
        </div>
      </section>
    </>
  );
}
