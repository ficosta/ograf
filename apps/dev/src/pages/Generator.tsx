import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Braces, ChevronRight, Eye, Fingerprint, LayoutGrid, Palette, ShieldCheck, Download, Wand2 } from "lucide-react";
import { Link } from "../i18n/Link";
import { useRouteMeta } from "../hooks/useMeta";
import { useDebounced } from "../hooks/useDebounced";
import { useCopy } from "../i18n/useLocale";
import { GENERATOR_COPY } from "../i18n/copy/generator";
import { runChecks } from "../lib/check";
import type { Report } from "../lib/check";
import {
  buildPackage,
  defaultConfig,
  deriveId,
  extractCustomActions,
  extractStepCount,
  fontChoice,
  hasErrors,
  loadFontFiles,
  loadPresetSources,
  packageFileMap,
  packageSlug,
  packageToZipBytes,
  presetDef,
  validateConfig,
  zipFileName,
  type FontChoiceId,
  type GeneratedPackage,
  type GeneratorConfig,
  type PresetSlug,
  type PresetSources,
} from "../lib/generator";
import { SectionCard } from "../components/generator/fields";
import { PresetGallery } from "../components/generator/PresetGallery";
import { IdentityForm } from "../components/generator/IdentityForm";
import { LookForm } from "../components/generator/LookForm";
import { GeneratorPreview } from "../components/generator/GeneratorPreview";
import { ValidationPanel } from "../components/generator/ValidationPanel";
import { DownloadPanel } from "../components/generator/DownloadPanel";
import { DataForm } from "../components/check/DataForm";

type FontFiles = ReadonlyMap<string, Uint8Array>;

interface Built {
  readonly pkg: GeneratedPackage;
  /** Changes only when the files the sandbox loads change, not on a name edit. */
  readonly rebootKey: string;
}

const BUILD_DEBOUNCE_MS = 250;
const CHECK_DEBOUNCE_MS = 600;

export function Generator() {
  useRouteMeta();
  const c = useCopy(GENERATOR_COPY);

  const [preset, setPreset] = useState<PresetSlug>("lower-third");
  const [sources, setSources] = useState<PresetSources | null>(null);
  const [fontFiles, setFontFiles] = useState<FontFiles | null>(null);
  const [config, setConfig] = useState<GeneratorConfig | null>(null);
  const [idDerived, setIdDerived] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [built, setBuilt] = useState<Built | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const sourcesCache = useRef(new Map<PresetSlug, PresetSources>());
  const fontCache = useRef(new Map<FontChoiceId, FontFiles>());

  // Base template: fetched once per preset, then the form is (re)seeded.
  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    (async () => {
      try {
        const cached = sourcesCache.current.get(preset);
        const next = cached ?? (await loadPresetSources(preset));
        sourcesCache.current.set(preset, next);
        if (cancelled) return;
        setSources(next);
        // A new base resets what belongs to the base, including the id (it
        // carries the name's slug); who you are carries over.
        setIdDerived(true);
        setConfig((prev) => {
          const fresh = defaultConfig(preset, next.manifest);
          if (!prev) return fresh;
          const carried = {
            ...fresh,
            version: prev.version,
            authorName: prev.authorName,
            authorUrl: prev.authorUrl,
            font: prev.font,
          };
          return { ...carried, id: deriveId(carried.name, carried.authorUrl, preset) };
        });
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preset]);

  // Body font files: fetched once per choice.
  const fontId = config?.font ?? "inter";
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = fontCache.current.get(fontId);
        const next = cached ?? (await loadFontFiles(fontChoice(fontId)));
        fontCache.current.set(fontId, next);
        if (!cancelled) setFontFiles(next);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fontId]);

  const patch = useCallback(
    (p: Partial<GeneratorConfig>) => {
      setConfig((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...p };
        if ("id" in p) return next;
        if (idDerived && ("name" in p || "authorUrl" in p)) {
          return { ...next, id: deriveId(next.name, next.authorUrl, next.preset) };
        }
        return next;
      });
      if ("id" in p) setIdDerived(false);
    },
    [idDerived],
  );

  const reDeriveId = useCallback(() => {
    setIdDerived(true);
    setConfig((prev) => (prev ? { ...prev, id: deriveId(prev.name, prev.authorUrl, prev.preset) } : prev));
  }, []);

  const resetLook = useCallback(() => {
    if (!sources) return;
    const fresh = defaultConfig(sources.slug, sources.manifest);
    setConfig((prev) => (prev ? { ...prev, colors: fresh.colors, offsets: fresh.offsets, font: fresh.font } : prev));
  }, [sources]);

  const resetData = useCallback(() => {
    if (!sources) return;
    setConfig((prev) => (prev ? { ...prev, data: defaultConfig(sources.slug, sources.manifest).data } : prev));
  }, [sources]);

  const issues = useMemo(() => (config ? validateConfig(config) : []), [config]);
  const formBlocked = hasErrors(issues);

  // Build the package once edits pause; a form with errors keeps the last good build.
  const debouncedConfig = useDebounced(config, BUILD_DEBOUNCE_MS);
  useEffect(() => {
    if (!debouncedConfig || !sources || !fontFiles) return;
    if (debouncedConfig.preset !== sources.slug) return;
    if (hasErrors(validateConfig(debouncedConfig))) return;
    try {
      const pkg = buildPackage({ sources, config: debouncedConfig, fontFiles });
      const { preset: p, colors, font, offsets } = debouncedConfig;
      setBuilt({ pkg, rebootKey: JSON.stringify({ p, colors, font, offsets }) });
      setBuildError(null);
    } catch (err) {
      setBuildError(err instanceof Error ? err.message : String(err));
    }
  }, [debouncedConfig, sources, fontFiles]);

  // Run the Package Checker over the exact zip the download produces.
  const checkSeq = useRef(0);
  useEffect(() => {
    if (!built) return;
    const seq = ++checkSeq.current;
    setChecking(true);
    const timer = setTimeout(async () => {
      try {
        const bytes = await packageToZipBytes(built.pkg);
        const file = new File([bytes], zipFileName(built.pkg), { type: "application/zip" });
        const { report: r } = await runChecks(file);
        if (seq === checkSeq.current) setReport(r);
      } catch (err) {
        console.error(err);
      } finally {
        if (seq === checkSeq.current) setChecking(false);
      }
    }, CHECK_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [built]);

  const download = useCallback(async () => {
    if (!built) return;
    setDownloading(true);
    try {
      const bytes = await packageToZipBytes(built.pkg);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/zip" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = zipFileName(built.pkg);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }, [built]);

  const files = useMemo(() => (built ? packageFileMap(built.pkg) : null), [built]);
  const customActions = useMemo(() => (built ? extractCustomActions(built.pkg.manifest) : []), [built]);
  const facts = useMemo(() => {
    if (!built) return [];
    const m = built.pkg.manifest;
    const out = [c.preview.facts.stepCount(extractStepCount(m))];
    if (customActions.length) out.push(c.preview.facts.customActions(customActions.length));
    if (m.supportsRealTime === true) out.push(c.preview.facts.realTime);
    return out;
  }, [built, customActions, c]);

  const blockedReason = formBlocked
    ? c.download.blockedForm
    : buildError
      ? c.download.blockedBuild
      : report && report.summary.errors > 0
        ? c.download.blockedErrors
        : null;

  const def = config ? presetDef(config.preset) : null;
  const slug = config ? packageSlug(config) : "";
  const dataSchema = sources ? (sources.manifest as { schema?: unknown }).schema : undefined;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
            <ChevronRight className="h-3 w-3 rotate-180" /> {c.page.allTools}
          </Link>
        </div>

        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            <Wand2 className="h-6 w-6 text-blue-600" strokeWidth={1.75} />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">{c.page.eyebrow}</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">{c.page.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">{c.page.intro}</p>
        </div>

        <SectionCard step={1} icon={LayoutGrid} title={c.gallery.title} intro={c.gallery.intro}>
          <PresetGallery selected={preset} onSelect={setPreset} />
        </SectionCard>

        {loadError && (
          <p role="alert" className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {c.page.loadFailed} <span className="font-mono text-xs">{loadError}</span>
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionCard step={2} icon={Fingerprint} title={c.identity.title} intro={c.identity.intro}>
              {config && built !== undefined ? (
                <IdentityForm
                  config={config}
                  issues={issues}
                  onPatch={patch}
                  idDerived={idDerived}
                  onDeriveId={reDeriveId}
                  slug={slug}
                  manifestPath={`${slug}.ograf.json`}
                />
              ) : (
                <Placeholder label={c.page.loading} />
              )}
            </SectionCard>

            <SectionCard step={3} icon={Palette} title={c.look.title} intro={c.look.intro}>
              {config && def ? (
                <LookForm def={def} config={config} issues={issues} onPatch={patch} onReset={resetLook} />
              ) : (
                <Placeholder label={c.page.loading} />
              )}
            </SectionCard>

            <SectionCard step={4} icon={Braces} title={c.data.title} intro={c.data.intro}>
              {config ? (
                <DataForm schema={dataSchema} value={config.data} onChange={(data) => patch({ data })} onReset={resetData} />
              ) : (
                <Placeholder label={c.page.loading} />
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard step={5} icon={Eye} title={c.preview.title} intro={c.preview.desc}>
              <GeneratorPreview
                files={files}
                rebootKey={built?.rebootKey ?? ""}
                data={config?.data ?? {}}
                customActions={customActions}
                facts={facts}
              />
            </SectionCard>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <PanelHeading icon={ShieldCheck} title={c.validation.title} desc={c.validation.desc} />
              {buildError && (
                <p role="alert" className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  {c.page.buildFailed} <span className="font-mono">{buildError}</span>
                </p>
              )}
              <ValidationPanel report={report} busy={checking} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <PanelHeading icon={Download} title={c.download.title} />
              <DownloadPanel
                pkg={built?.pkg ?? null}
                zipName={built ? zipFileName(built.pkg) : null}
                blockedReason={blockedReason}
                busy={downloading}
                onDownload={() => void download()}
              />
            </section>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">{c.page.noUpload}</p>
      </div>
    </section>
  );
}

function Placeholder({ label }: { readonly label: string }) {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="h-9 w-full animate-pulse rounded-lg bg-slate-100" />
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-slate-100" />
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function PanelHeading({ icon: Icon, title, desc }: { readonly icon: typeof Eye; readonly title: string; readonly desc?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div>
        <h2 className="font-display text-lg tracking-tight text-slate-900">{title}</h2>
        {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
      </div>
    </div>
  );
}
