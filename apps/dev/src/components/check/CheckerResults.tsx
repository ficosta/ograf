import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_ORDER, type Category, type Finding } from "../../lib/check/types";
import { FindingRow } from "./FindingRow";

interface CheckerResultsProps {
  readonly findings: readonly Finding[];
}

export function CheckerResults({ findings }: CheckerResultsProps) {
  const grouped = useMemo(() => groupByCategory(findings), [findings]);

  const [openMap, setOpenMap] = useState<Record<Category, boolean>>(() => {
    const base = {} as Record<Category, boolean>;
    for (const cat of CATEGORY_ORDER) {
      const items = grouped.get(cat) ?? [];
      // default-open if anything is an error; otherwise open if warnings; otherwise closed
      const hasErrors = items.some((f) => f.severity === "error");
      const hasWarnings = items.some((f) => f.severity === "warning");
      base[cat] = hasErrors || hasWarnings;
    }
    return base;
  });

  return (
    <div className="space-y-3">
      {CATEGORY_ORDER.map((category) => {
        const items = grouped.get(category) ?? [];
        if (items.length === 0) return null;
        const open = openMap[category];
        const summary = summariseCategory(items);
        return (
          <section key={category} className="rounded-2xl border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setOpenMap((m) => ({ ...m, [category]: !m[category] }))}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg text-slate-900">{CATEGORY_LABEL[category]}</h3>
                <span className="text-xs text-slate-500">{items.length} check{items.length === 1 ? "" : "s"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CategorySummary summary={summary} />
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
              </div>
            </button>
            {open && (
              <div className="space-y-2 border-t border-slate-100 p-4">
                {items.map((f, i) => (
                  <FindingRow key={`${f.id}-${i}`} finding={f} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function CategorySummary({ summary }: { summary: { errors: number; warnings: number; infos: number; passes: number } }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium">
      {summary.errors > 0 && <Pill count={summary.errors} tone="bg-rose-100 text-rose-800" />}
      {summary.warnings > 0 && <Pill count={summary.warnings} tone="bg-amber-100 text-amber-800" />}
      {summary.infos > 0 && <Pill count={summary.infos} tone="bg-blue-100 text-blue-800" />}
      {summary.passes > 0 && <Pill count={summary.passes} tone="bg-emerald-100 text-emerald-800" />}
    </div>
  );
}

function Pill({ count, tone }: { count: number; tone: string }) {
  return <span className={`inline-flex min-w-[1.25rem] justify-center rounded-full px-1.5 py-0.5 ${tone}`}>{count}</span>;
}

function summariseCategory(items: readonly Finding[]) {
  return {
    errors: items.filter((f) => f.severity === "error").length,
    warnings: items.filter((f) => f.severity === "warning").length,
    infos: items.filter((f) => f.severity === "info").length,
    passes: items.filter((f) => f.severity === "pass").length,
  };
}

function groupByCategory(findings: readonly Finding[]): Map<Category, Finding[]> {
  const map = new Map<Category, Finding[]>();
  for (const f of findings) {
    const arr = map.get(f.category) ?? [];
    arr.push(f);
    map.set(f.category, arr);
  }
  return map;
}
