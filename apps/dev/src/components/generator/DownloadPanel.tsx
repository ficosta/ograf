import { Download, Loader2 } from "lucide-react";
import { useCopy } from "../../i18n/useLocale";
import { GENERATOR_COPY } from "../../i18n/copy/generator";
import type { GeneratedPackage } from "../../lib/generator/types";

interface DownloadPanelProps {
  readonly pkg: GeneratedPackage | null;
  readonly zipName: string | null;
  /** Why the download is disabled, or null when it is allowed. */
  readonly blockedReason: string | null;
  readonly busy: boolean;
  readonly onDownload: () => void;
}

function formatKb(bytes: number): string {
  return (bytes / 1024).toFixed(1);
}

export function DownloadPanel({ pkg, zipName, blockedReason, busy, onDownload }: DownloadPanelProps) {
  const c = useCopy(GENERATOR_COPY);
  const t = c.download;
  const total = pkg?.files.reduce((n, f) => n + f.bytes.byteLength, 0) ?? 0;
  const disabled = !pkg || blockedReason !== null || busy;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onDownload}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} /> : <Download className="h-4 w-4" strokeWidth={2.25} />}
        {busy ? t.preparing : zipName ? `${t.button} · ${zipName}` : t.button}
      </button>
      {blockedReason && (
        <p role="alert" className="text-xs text-rose-700">
          {blockedReason}
        </p>
      )}

      {pkg && (
        <div>
          <p className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <span>{t.contents}</span>
            <span className="font-mono font-normal normal-case tracking-normal">{t.size(formatKb(total))}</span>
          </p>
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50/60 font-mono text-[11px] text-slate-700">
            <li className="flex items-center justify-between px-3 py-1.5 text-slate-500">
              <span>{pkg.slug}/</span>
            </li>
            {pkg.files.map((f) => (
              <li key={f.path} className="flex items-center justify-between gap-3 px-3 py-1.5">
                <span className="min-w-0 truncate pl-3">{f.path}</span>
                <span className="flex-none text-slate-400">{t.size(formatKb(f.bytes.byteLength))}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t.next}</p>
        <ol className="list-decimal space-y-1 pl-5 text-xs text-slate-600">
          {t.nextSteps.map((step) => (
            <li key={step.slice(0, 24)}>{step}</li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] text-slate-400">{t.license}</p>
      </div>
    </div>
  );
}
