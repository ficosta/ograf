import { ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";
import type { SchemaSource } from "../../lib/check/types";

interface SchemaBadgeProps {
  readonly source: SchemaSource;
}

export function SchemaBadge({ source }: SchemaBadgeProps) {
  const live = source.kind === "live";
  const Icon = live ? ShieldCheck : ShieldAlert;
  const tone = live
    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
    : "bg-amber-50 text-amber-800 ring-amber-200";
  return (
    <div className={`inline-flex items-start gap-2 rounded-lg px-3 py-2 text-xs ring-1 ring-inset ${tone}`}>
      <Icon className="mt-0.5 h-4 w-4 flex-none" strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="font-medium">
          {live ? "Validated against the live EBU schema" : "Validated against the bundled snapshot"}
        </p>
        <p className="mt-0.5 text-[11px] leading-relaxed opacity-80">
          {live ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline decoration-emerald-300 hover:decoration-emerald-600"
            >
              {source.url}
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          ) : (
            <span>{source.note ?? "Live schema not reachable."}</span>
          )}
          <span className="ml-2 opacity-70">· fetched {formatTime(source.fetchedAt)}</span>
        </p>
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
