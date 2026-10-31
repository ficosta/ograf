import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "../../i18n/Link";
import { useCopy } from "../../i18n/useLocale";
import { GENERATOR_COPY } from "../../i18n/copy/generator";
import { CHECK_COPY } from "../../i18n/copy/check";
import type { Report } from "../../lib/check/types";
import { FindingRow } from "../check/FindingRow";

interface ValidationPanelProps {
  readonly report: Report | null;
  readonly busy: boolean;
}

const CHIP: Readonly<Record<"errors" | "warnings" | "infos" | "passes", string>> = {
  errors: "bg-rose-50 text-rose-700",
  warnings: "bg-amber-50 text-amber-700",
  infos: "bg-blue-50 text-blue-700",
  passes: "bg-emerald-50 text-emerald-700",
};

/** The Package Checker's verdict on the zip about to be downloaded. */
export function ValidationPanel({ report, busy }: ValidationPanelProps) {
  const c = useCopy(GENERATOR_COPY);
  const check = useCopy(CHECK_COPY);
  const [showPasses, setShowPasses] = useState(false);

  if (!report) {
    return (
      <p className="flex items-center gap-2 text-xs text-slate-500">
        {busy && <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />}
        {busy ? c.validation.running : c.validation.waiting}
      </p>
    );
  }

  const { summary } = report;
  const clean = summary.errors === 0 && summary.warnings === 0;
  const visible = report.findings.filter((f) => showPasses || f.severity !== "pass");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5" aria-live="polite">
        {(["errors", "warnings", "infos", "passes"] as const).map((k) => (
          <span key={k} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] ${CHIP[k]}`}>
            <span className="font-semibold">{summary[k]}</span> {c.validation.counts[k]}
          </span>
        ))}
        {busy && <Loader2 className="h-3 w-3 animate-spin text-slate-400" strokeWidth={2.5} />}
      </div>

      {clean && (
        <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 flex-none" strokeWidth={2} />
          {c.validation.clean}
        </p>
      )}

      {visible.length > 0 && (
        <div className="space-y-2">
          {visible.map((f, i) => (
            <FindingRow key={`${f.id}-${i}`} finding={f} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button type="button" onClick={() => setShowPasses((v) => !v)} className="text-slate-500 hover:text-blue-600">
          {showPasses ? c.validation.hidePasses : c.validation.showPasses}
        </button>
        <Link to="/check" className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline">
          {c.validation.openChecker} <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </Link>
      </div>
      {check.findingsNote && <p className="text-[11px] text-slate-400">{check.findingsNote}</p>}
    </div>
  );
}
