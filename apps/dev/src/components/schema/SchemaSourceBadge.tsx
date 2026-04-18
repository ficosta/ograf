import { CheckCircle2, CloudOff, Loader2 } from "lucide-react";
import type { SchemaSource } from "../../lib/check/types";

interface SchemaSourceBadgeProps {
  readonly source: SchemaSource | null;
  readonly loading: boolean;
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Pill that tells the visitor whether the schema currently rendered is the
 * live EBU canonical version or the bundled fallback. Updates automatically
 * once the loader settles.
 */
export function SchemaSourceBadge({ source, loading }: SchemaSourceBadgeProps) {
  if (loading) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-300/60"
        aria-live="polite"
      >
        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
        Fetching live schema from ograf.ebu.io…
      </span>
    );
  }

  if (!source) return null;

  if (source.kind === "live") {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
        aria-live="polite"
      >
        <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
        Synced with EBU
        <span className="text-emerald-600/70">· fetched {formatRelativeTime(source.fetchedAt)}</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20"
      title={source.note ?? "Bundled snapshot"}
      aria-live="polite"
    >
      <CloudOff className="h-3 w-3" strokeWidth={2.5} />
      Offline · using local copy
    </span>
  );
}
