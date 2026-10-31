import { RotateCcw } from "lucide-react";
import { useCopy } from "../../i18n/useLocale";
import { GENERATOR_COPY } from "../../i18n/copy/generator";
import { FONT_CHOICES } from "../../lib/generator/fonts";
import { isHexColor } from "../../lib/generator/color";
import { OFFSET_MAX, OFFSET_MIN } from "../../lib/generator/validate";
import type { FieldIssue, FontChoiceId, GeneratorConfig, PresetDef } from "../../lib/generator/types";
import { Field, describedBy, inputClass } from "./fields";

interface LookFormProps {
  readonly def: PresetDef;
  readonly config: GeneratorConfig;
  readonly issues: readonly FieldIssue[];
  readonly onPatch: (patch: Partial<GeneratorConfig>) => void;
  readonly onReset: () => void;
}

export function LookForm({ def, config, issues, onPatch, onReset }: LookFormProps) {
  const c = useCopy(GENERATOR_COPY);
  const t = c.look;
  const hasIssue = (field: FieldIssue["field"]) => issues.some((i) => i.field === field && i.severity === "error");

  const setColor = (id: PresetDef["colors"][number]["id"], value: string) =>
    onPatch({ colors: { ...config.colors, [id]: value } });

  const setOffset = (id: PresetDef["offsets"][number]["id"], raw: string) => {
    const n = raw === "" ? Number.NaN : Number(raw);
    onPatch({ offsets: { ...config.offsets, [id]: Number.isNaN(n) ? Number.NaN : Math.round(n) } });
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {def.colors.map((knob) => {
            const value = config.colors[knob.id] ?? knob.default;
            const invalid = hasIssue(`color.${knob.id}`);
            const fieldId = `gen-color-${knob.id}`;
            return (
              <Field key={knob.id} id={fieldId} label={t.colors[knob.id]} error={invalid ? c.identity.issues.colorInvalid : undefined}>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label={`${t.colors[knob.id]} (picker)`}
                    value={isHexColor(value) ? value : knob.default}
                    onChange={(e) => setColor(knob.id, e.target.value)}
                    className="h-9 w-11 flex-none cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5"
                  />
                  <input
                    id={fieldId}
                    className={`${inputClass(invalid ? "error" : "ok")} font-mono`}
                    value={value}
                    spellCheck={false}
                    maxLength={7}
                    onChange={(e) => setColor(knob.id, e.target.value)}
                    {...describedBy(fieldId, invalid, false, invalid)}
                  />
                </div>
              </Field>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">{t.colorsHint}</p>
      </div>

      <Field id="gen-font" label={t.font} hint={t.fontNotes[config.font]}>
        <select
          id="gen-font"
          className={inputClass("ok")}
          value={config.font}
          onChange={(e) => onPatch({ font: e.target.value as FontChoiceId })}
          aria-describedby="gen-font-hint"
        >
          {FONT_CHOICES.map((f) => (
            <option key={f.id} value={f.id}>
              {t.fontOptions[f.id]}
            </option>
          ))}
        </select>
      </Field>

      {def.offsets.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 gap-3">
            {def.offsets.map((knob) => {
              const value = config.offsets[knob.id];
              const invalid = hasIssue(`offset.${knob.id}`);
              const fieldId = `gen-offset-${knob.id}`;
              return (
                <Field key={knob.id} id={fieldId} label={t.offsets[knob.id]} error={invalid ? c.identity.issues.offsetRange : undefined}>
                  <div className="relative">
                    <input
                      id={fieldId}
                      type="number"
                      inputMode="numeric"
                      min={OFFSET_MIN}
                      max={OFFSET_MAX}
                      step={1}
                      className={`${inputClass(invalid ? "error" : "ok")} pr-9 font-mono`}
                      value={typeof value === "number" && !Number.isNaN(value) ? value : ""}
                      onChange={(e) => setOffset(knob.id, e.target.value)}
                      {...describedBy(fieldId, invalid, false, invalid)}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">px</span>
                  </div>
                </Field>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">{t.offsetsHint}</p>
        </div>
      ) : (
        <p className="text-[11px] text-slate-400">{t.offsetsNone}</p>
      )}

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
      >
        <RotateCcw className="h-3 w-3" strokeWidth={2} /> {t.reset}
      </button>
    </div>
  );
}
