import { RotateCcw, FolderTree } from "lucide-react";
import { useCopy } from "../../i18n/useLocale";
import { GENERATOR_COPY } from "../../i18n/copy/generator";
import type { FieldId, FieldIssue, GeneratorConfig } from "../../lib/generator/types";
import { NAME_MAX } from "../../lib/generator/validate";
import { Field, describedBy, inputClass } from "./fields";

interface IdentityFormProps {
  readonly config: GeneratorConfig;
  readonly issues: readonly FieldIssue[];
  readonly onPatch: (patch: Partial<GeneratorConfig>) => void;
  /** True while the id still follows the name; false once the user typed one. */
  readonly idDerived: boolean;
  readonly onDeriveId: () => void;
  readonly slug: string;
  readonly manifestPath: string;
}

export function IdentityForm({ config, issues, onPatch, idDerived, onDeriveId, slug, manifestPath }: IdentityFormProps) {
  const c = useCopy(GENERATOR_COPY);
  const t = c.identity;

  const issueFor = (field: FieldId) => {
    const hit = issues.find((i) => i.field === field);
    if (!hit) return { error: undefined, warning: undefined, state: "ok" as const };
    const message = t.issues[hit.code];
    return hit.severity === "error"
      ? { error: message, warning: undefined, state: "error" as const }
      : { error: undefined, warning: message, state: "warning" as const };
  };

  const name = issueFor("name");
  const id = issueFor("id");
  const version = issueFor("version");
  const authorName = issueFor("authorName");
  const authorUrl = issueFor("authorUrl");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Field id="gen-name" label={t.name} hint={t.nameHint} error={name.error}>
          <input
            id="gen-name"
            className={inputClass(name.state)}
            value={config.name}
            maxLength={NAME_MAX + 20}
            onChange={(e) => onPatch({ name: e.target.value })}
            {...describedBy("gen-name", Boolean(name.error), true, name.state === "error")}
          />
        </Field>
        <Field id="gen-version" label={t.version} hint={t.versionHint} error={version.error}>
          <input
            id="gen-version"
            className={`${inputClass(version.state)} font-mono`}
            value={config.version}
            inputMode="decimal"
            onChange={(e) => onPatch({ version: e.target.value })}
            {...describedBy("gen-version", Boolean(version.error), true, version.state === "error")}
          />
        </Field>
      </div>

      <Field id="gen-id" label={t.id} hint={idDerived ? `${t.idDerived} ${t.idHint}` : t.idHint} error={id.error} warning={id.warning}>
        <div className="flex gap-2">
          <input
            id="gen-id"
            className={`${inputClass(id.state)} font-mono`}
            value={config.id}
            spellCheck={false}
            onChange={(e) => onPatch({ id: e.target.value })}
            {...describedBy("gen-id", Boolean(id.error ?? id.warning), true, id.state === "error")}
          />
          {!idDerived && (
            <button
              type="button"
              onClick={onDeriveId}
              title={t.idDerive}
              className="inline-flex flex-none items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">{t.idDerive}</span>
            </button>
          )}
        </div>
      </Field>

      <Field id="gen-description" label={t.description} hint={t.descriptionHint}>
        <textarea
          id="gen-description"
          rows={2}
          className={inputClass("ok")}
          value={config.description}
          onChange={(e) => onPatch({ description: e.target.value })}
          aria-describedby="gen-description-hint"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="gen-author" label={t.authorName} hint={t.authorNameHint} error={authorName.error}>
          <input
            id="gen-author"
            className={inputClass(authorName.state)}
            value={config.authorName}
            onChange={(e) => onPatch({ authorName: e.target.value })}
            {...describedBy("gen-author", Boolean(authorName.error), true, authorName.state === "error")}
          />
        </Field>
        <Field id="gen-author-url" label={t.authorUrl} hint={t.authorUrlHint} error={authorUrl.error}>
          <input
            id="gen-author-url"
            type="url"
            inputMode="url"
            placeholder="https://"
            className={inputClass(authorUrl.state)}
            value={config.authorUrl}
            onChange={(e) => onPatch({ authorUrl: e.target.value })}
            {...describedBy("gen-author-url", Boolean(authorUrl.error), true, authorUrl.state === "error")}
          />
        </Field>
      </div>

      <p className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-600">
        <FolderTree className="h-3.5 w-3.5 flex-none text-slate-400" strokeWidth={2} />
        <span className="min-w-0 break-all">{t.files(slug, manifestPath)}</span>
      </p>
    </div>
  );
}
