import { AlertCircle, AlertTriangle, CheckCircle2, ExternalLink, Info } from "lucide-react";
import type { Finding } from "../../lib/check/types";

const SEVERITY_STYLES = {
  error:   { Icon: AlertCircle,    tone: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200"    },
  warning: { Icon: AlertTriangle,  tone: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200"   },
  info:    { Icon: Info,           tone: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200"    },
  pass:    { Icon: CheckCircle2,   tone: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
} as const;

interface FindingRowProps {
  readonly finding: Finding;
}

export function FindingRow({ finding }: FindingRowProps) {
  const style = SEVERITY_STYLES[finding.severity];
  const { Icon } = style;
  return (
    <div className={`flex gap-3 rounded-lg border ${style.border} ${style.bg} p-3`}>
      <Icon className={`mt-0.5 h-4 w-4 flex-none ${style.tone}`} strokeWidth={2} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold ${style.tone}`}>
            {finding.id}
          </span>
          <p className="text-sm font-medium text-slate-900">{finding.title}</p>
        </div>
        <p className="mt-1 text-sm text-slate-700">{finding.message}</p>
        {(finding.path || finding.specRef) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
            {finding.path && (
              <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-slate-600">{finding.path}</code>
            )}
            {finding.specRef && (
              <a
                href={finding.specRef}
                target={finding.specRef.startsWith("http") ? "_blank" : undefined}
                rel={finding.specRef.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 text-slate-600 underline decoration-slate-300 hover:decoration-slate-600"
              >
                spec
                {finding.specRef.startsWith("http") && <ExternalLink className="h-3 w-3" strokeWidth={2} />}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
