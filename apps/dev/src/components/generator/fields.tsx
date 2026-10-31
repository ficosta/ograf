import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Shared form primitives for the generator, matching the Check page's inputs. */

export const INPUT =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50";

export const INPUT_INVALID = "border-rose-300 focus:border-rose-400 focus:ring-rose-100";

export const INPUT_WARNING = "border-amber-300 focus:border-amber-400 focus:ring-amber-100";

export function inputClass(state: "ok" | "error" | "warning"): string {
  if (state === "error") return `${INPUT} ${INPUT_INVALID}`;
  if (state === "warning") return `${INPUT} ${INPUT_WARNING}`;
  return INPUT;
}

interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly warning?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Label, control, hint and inline message, wired together for screen readers. */
export function Field({ id, label, hint, error, warning, children, className = "" }: FieldProps) {
  const message = error ?? warning;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-700">
        {label}
      </label>
      {children}
      {message ? (
        <p id={`${id}-message`} role={error ? "alert" : undefined} className={`mt-1 text-[11px] ${error ? "text-rose-700" : "text-amber-700"}`}>
          {message}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[11px] text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** aria attributes a control inside <Field> should spread. */
export function describedBy(id: string, hasMessage: boolean, hasHint: boolean, invalid: boolean) {
  return {
    "aria-invalid": invalid || undefined,
    "aria-describedby": hasMessage ? `${id}-message` : hasHint ? `${id}-hint` : undefined,
  } as const;
}

interface SectionCardProps {
  readonly step: number;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly intro?: ReactNode;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly id?: string;
}

export function SectionCard({ step, icon: Icon, title, intro, action, children, id }: SectionCardProps) {
  return (
    <section id={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-semibold text-white">
              {step}
            </span>
          </div>
          <div>
            <h2 className="font-display text-lg tracking-tight text-slate-900">{title}</h2>
            {intro && <p className="mt-0.5 text-xs text-slate-500">{intro}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
