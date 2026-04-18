import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ConsoleLine, RuntimeError } from "../../lib/check/runtime/types";

interface ConsoleCaptureProps {
  readonly lines: readonly ConsoleLine[];
  readonly errors: readonly RuntimeError[];
}

const LEVEL_STYLE: Record<ConsoleLine["level"], string> = {
  log: "text-slate-300",
  info: "text-blue-300",
  debug: "text-slate-500",
  warn: "text-amber-300",
  error: "text-rose-300",
};

export function ConsoleCapture({ lines, errors }: ConsoleCaptureProps) {
  const [open, setOpen] = useState(true);
  const total = lines.length + errors.length;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-slate-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left hover:bg-slate-900"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          )}
          <span className="font-mono text-xs text-slate-300">Sandbox console</span>
          <span className="rounded-full bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            {total}
          </span>
        </div>
      </button>

      {open && (
        <div className="max-h-80 overflow-auto border-t border-slate-800">
          {total === 0 ? (
            <p className="px-4 py-6 text-center text-[11px] text-slate-500">
              No console output or errors captured yet.
            </p>
          ) : (
            <div className="px-4 py-3 font-mono text-[11px] leading-relaxed">
              {errors.map((err) => (
                <div key={err.id} className="mb-2 whitespace-pre-wrap text-rose-300">
                  <span className="mr-2 rounded bg-rose-900/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">
                    {err.source}
                  </span>
                  {err.message}
                  {err.stack ? `\n${err.stack}` : ""}
                </div>
              ))}
              {lines.map((l) => (
                <div key={l.id} className={`whitespace-pre-wrap ${LEVEL_STYLE[l.level]}`}>
                  <span className="mr-2 rounded bg-slate-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-400">
                    {l.level}
                  </span>
                  {l.args.join(" ")}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
