import { AlertCircle, CheckCircle2, Play, Square, RefreshCw, Trash2, Zap, Clock } from "lucide-react";
import type { RuntimeCall } from "../../lib/check/runtime/types";

const ICONS = {
  load: RefreshCw,
  playAction: Play,
  updateAction: RefreshCw,
  stopAction: Square,
  customAction: Zap,
  dispose: Trash2,
} as const;

interface LifecycleTimelineProps {
  readonly calls: readonly RuntimeCall[];
  readonly running: boolean;
}

export function LifecycleTimeline({ calls, running }: LifecycleTimelineProps) {
  if (calls.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 p-4 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5" strokeWidth={2} />
        {running ? "Running..." : "No lifecycle calls yet. Click Play or Run smoke test."}
      </div>
    );
  }
  return (
    <ol className="space-y-1.5">
      {calls.map((call, i) => {
        const Icon = ICONS[call.action] ?? Play;
        const failed = Boolean(call.error);
        const toneBorder = failed ? "border-rose-200" : "border-slate-200";
        const toneBg = failed ? "bg-rose-50" : "bg-white";
        const toneIcon = failed ? "text-rose-600" : "text-slate-500";
        return (
          <li
            key={`${call.action}-${i}`}
            className={`flex items-start gap-2 rounded-lg border ${toneBorder} ${toneBg} p-2.5`}
          >
            <Icon className={`mt-0.5 h-4 w-4 flex-none ${toneIcon}`} strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-2">
                <p className="font-mono text-xs font-semibold text-slate-900">{call.label}</p>
                <span className="text-[11px] font-mono text-slate-400">
                  {call.durationMs.toFixed(0)} ms
                </span>
              </div>
              {call.error ? (
                <p className="mt-0.5 flex items-start gap-1 text-[11px] text-rose-700">
                  <AlertCircle className="mt-0.5 h-3 w-3 flex-none" strokeWidth={2} />
                  <span className="break-words font-mono">{call.error}</span>
                </p>
              ) : (
                <p className="mt-0.5 flex items-start gap-1 text-[11px] text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 flex-none text-emerald-600" strokeWidth={2} />
                  <span className="truncate font-mono">{summariseResult(call.result)}</span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function summariseResult(result: unknown): string {
  if (result == null) return "undefined";
  try {
    const s = JSON.stringify(result);
    return s.length > 120 ? s.slice(0, 117) + "..." : s;
  } catch {
    return String(result);
  }
}
