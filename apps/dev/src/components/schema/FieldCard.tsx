import { useState } from "react";
import { ChevronDown, Hash } from "lucide-react";
import { CodeBlock } from "../CodeBlock";
import type { FieldGuide } from "../../content/schema-language";

interface FieldCardProps {
  readonly guide: FieldGuide;
  /** True if the schema marks this field as required at the top level. */
  readonly required: boolean;
  /** Description from the schema itself — fallback when no curated description. */
  readonly schemaDescription?: string;
}

/**
 * One manifest field, described in plain language for designers. Every card
 * has a stable anchor id (`field-{key}`) so individual fields are link-able.
 */
export function FieldCard({ guide, required, schemaDescription }: FieldCardProps) {
  const [open, setOpen] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  const description = guide.description || schemaDescription || "";
  const examples = guide.examples ?? [];
  const anchorId = `field-${guide.key}`;

  return (
    <div
      id={anchorId}
      className="group/card scroll-mt-24 rounded-2xl bg-white p-5 ring-1 ring-slate-900/5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="font-display text-base font-medium text-slate-900">
              {guide.friendlyName}
            </h3>
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
              {guide.key}
            </code>
            <a
              href={`#${anchorId}`}
              aria-label={`Direct link to ${guide.friendlyName}`}
              title="Copy link to this field"
              className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-700 group-hover/card:opacity-100 focus:opacity-100"
            >
              <Hash className="h-3 w-3" strokeWidth={2.5} />
            </a>
          </div>
          <p className="mt-2 text-sm text-slate-700">{description}</p>
          {guide.exampleValue && (
            <p className="mt-2 text-xs text-slate-400">
              <span className="font-medium text-slate-500">Example:</span>{" "}
              <code className="font-mono">{guide.exampleValue}</code>
            </p>
          )}
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
            required
              ? "bg-rose-50 text-rose-700 ring-rose-600/20"
              : "bg-slate-50 text-slate-600 ring-slate-400/30"
          }`}
        >
          {required ? "Required" : "Optional"}
        </span>
      </div>

      {examples.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {open
              ? `Hide ${examples.length === 1 ? "example" : `${examples.length} examples`}`
              : `Show ${examples.length === 1 ? "example" : `${examples.length} examples`}`}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={2.5}
            />
          </button>
          {open && (
            <div className="mt-3">
              {examples.length > 1 && (
                <div
                  role="tablist"
                  aria-label="Examples"
                  className="mb-2 flex flex-wrap gap-1"
                >
                  {examples.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={activeExample === i}
                      onClick={() => setActiveExample(i)}
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        activeExample === i
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              )}
              <CodeBlock
                code={examples[Math.min(activeExample, examples.length - 1)].code}
                language="JSON"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
