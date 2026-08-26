/**
 * The operator form, generated from the graphic's own GDD schema.
 *
 * Until now the sandbox could only replay the `default` values baked into the
 * manifest, which answers "does it run" but not "does it work". A graphic that
 * silently truncates a long headline, or breaks on an empty array, or ignores a
 * field entirely, passes a defaults-only run and fails on air.
 *
 * This is also the form every controller will build from the same schema — so
 * seeing it here is the closest thing to seeing what an operator will get,
 * before shipping the package to one.
 *
 * Deliberately not a general JSON-Schema form renderer: it covers the gddTypes
 * the spec defines and falls back to a JSON textarea for anything it does not
 * recognise, so an exotic schema degrades instead of disappearing.
 */

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";

type Json = Record<string, unknown>;

interface DataFormProps {
  /** The GDD schema — `manifest.schema` or a customAction's. */
  readonly schema: unknown;
  readonly value: Json;
  readonly onChange: (next: Json) => void;
  readonly onReset: () => void;
  readonly disabled?: boolean;
}

interface Field {
  readonly key: string;
  readonly label: string;
  readonly type: string;
  readonly gddType?: string;
  readonly enumValues?: readonly unknown[];
  readonly labels?: Record<string, string>;
  readonly description?: string;
}

function readFields(schema: unknown): readonly Field[] {
  if (!schema || typeof schema !== "object") return [];
  const props = (schema as { properties?: unknown }).properties;
  if (!props || typeof props !== "object") return [];

  return Object.entries(props as Json).map(([key, raw]) => {
    const f = (raw ?? {}) as Json;
    const opts = (f.gddOptions ?? {}) as Json;
    return {
      key,
      label: typeof f.title === "string" ? f.title : key,
      type: typeof f.type === "string" ? f.type : "string",
      gddType: typeof f.gddType === "string" ? f.gddType : undefined,
      enumValues: Array.isArray(f.enum) ? f.enum : undefined,
      labels: typeof opts.labels === "object" && opts.labels ? (opts.labels as Record<string, string>) : undefined,
      description: typeof f.description === "string" ? f.description : undefined,
    };
  });
}

/** Fields we can render as a real control rather than raw JSON. */
function isSimple(f: Field): boolean {
  if (f.enumValues) return true;
  return f.type === "string" || f.type === "number" || f.type === "integer" || f.type === "boolean";
}

const INPUT =
  "w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-900 " +
  "focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50";

export function DataForm({ schema, value, onChange, onReset, disabled }: DataFormProps) {
  const fields = useMemo(() => readFields(schema), [schema]);
  const simple = fields.filter(isSimple);
  const complex = fields.filter((f) => !isSimple(f));

  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  if (fields.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        This graphic declares no data schema, so there is nothing for an operator to fill in.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Data — what an operator would type
        </p>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 disabled:opacity-50"
        >
          <RotateCcw className="h-3 w-3" strokeWidth={2} /> Reset to defaults
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {simple.map((f) => {
          const v = value[f.key];
          return (
            <label key={f.key} className="block">
              <span className="mb-1 block text-xs font-medium text-slate-700">{f.label}</span>

              {f.enumValues ? (
                <select
                  className={INPUT}
                  disabled={disabled}
                  value={String(v ?? "")}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const match = f.enumValues?.find((o) => String(o) === raw);
                    set(f.key, match ?? raw);
                  }}
                >
                  {f.enumValues.map((o) => (
                    <option key={String(o)} value={String(o)}>
                      {f.labels?.[String(o)] ?? String(o)}
                    </option>
                  ))}
                </select>
              ) : f.type === "boolean" ? (
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={Boolean(v)}
                  onChange={(e) => set(f.key, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              ) : f.gddType === "color-rrggbb" || f.gddType === "color-rrggbbaa" ? (
                <span className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={disabled}
                    value={typeof v === "string" && /^#[0-9a-f]{6}/i.test(v) ? v.slice(0, 7) : "#000000"}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="h-8 w-10 flex-none cursor-pointer rounded border border-slate-200"
                  />
                  <input
                    className={INPUT}
                    disabled={disabled}
                    value={typeof v === "string" ? v : ""}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </span>
              ) : f.gddType === "multi-line" ? (
                <textarea
                  rows={2}
                  className={INPUT}
                  disabled={disabled}
                  value={typeof v === "string" ? v : ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : f.type === "number" || f.type === "integer" ? (
                <input
                  type="number"
                  className={INPUT}
                  disabled={disabled}
                  value={typeof v === "number" ? v : ""}
                  onChange={(e) => {
                    // An empty box means "no value", not 0 — sending 0 would be
                    // a different test than the one the user is running.
                    const raw = e.target.value;
                    if (raw === "") return set(f.key, undefined);
                    const n = f.type === "integer" ? parseInt(raw, 10) : Number(raw);
                    set(f.key, Number.isNaN(n) ? undefined : n);
                  }}
                />
              ) : (
                <input
                  className={INPUT}
                  disabled={disabled}
                  value={typeof v === "string" ? v : ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}

              {f.description && <span className="mt-1 block text-[11px] text-slate-400">{f.description}</span>}
            </label>
          );
        })}
      </div>

      {complex.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-1 block text-xs font-medium text-slate-700">
            {f.label} <span className="font-normal text-slate-400">· {f.type}, edited as JSON</span>
          </span>
          <textarea
            rows={4}
            spellCheck={false}
            disabled={disabled}
            className={`${INPUT} font-mono text-xs`}
            value={JSON.stringify(value[f.key] ?? null, null, 2)}
            onChange={(e) => {
              try {
                set(f.key, JSON.parse(e.target.value));
              } catch {
                // Mid-typing JSON is invalid more often than not; keep the last
                // parseable value rather than flashing an error on every key.
              }
            }}
          />
        </label>
      ))}
    </div>
  );
}
