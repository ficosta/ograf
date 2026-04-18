import { Download, RotateCcw } from "lucide-react";
import type { Report } from "../../lib/check/types";
import { SchemaBadge } from "./SchemaBadge";

interface CheckerSummaryProps {
  readonly report: Report;
  readonly onReset: () => void;
  readonly onDownload: () => void;
}

export function CheckerSummary({ report, onReset, onDownload }: CheckerSummaryProps) {
  const { pkgName, pkgSize, summary, durationMs } = report;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm text-slate-500">{pkgName}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {(pkgSize / 1024).toFixed(1)} KB · checked in {durationMs.toFixed(0)} ms
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} /> Report.md
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} /> Try another
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile label="Errors" count={summary.errors} tone="error" />
        <SummaryTile label="Warnings" count={summary.warnings} tone="warning" />
        <SummaryTile label="Info" count={summary.infos} tone="info" />
        <SummaryTile label="Passed" count={summary.passes} tone="pass" />
      </div>

      <div className="mt-5">
        <SchemaBadge source={report.schemaSource} />
      </div>
    </div>
  );
}

function SummaryTile({ label, count, tone }: { label: string; count: number; tone: "error" | "warning" | "info" | "pass" }) {
  const bg =
    tone === "error"
      ? "bg-rose-50 text-rose-900 ring-rose-200"
      : tone === "warning"
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : tone === "info"
      ? "bg-blue-50 text-blue-900 ring-blue-200"
      : "bg-emerald-50 text-emerald-900 ring-emerald-200";
  return (
    <div className={`rounded-xl px-4 py-3 text-center ring-1 ring-inset ${bg}`}>
      <p className="font-display text-2xl font-semibold">{count}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider opacity-70">{label}</p>
    </div>
  );
}
