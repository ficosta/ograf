import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "../i18n/Link";
import { Braces, FileJson, FileCode, FileType, Files, Image, Box, ChevronRight, Play, ShieldAlert } from "lucide-react";
import { useRouteMeta } from "../hooks/useMeta";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { canShare, decodeReport, encodeReport } from "../lib/check/share";
import CHECK_RULES from "../content/check-rules.json";
import { DropZone } from "../components/check/DropZone";
import { CheckerSummary } from "../components/check/CheckerSummary";
import { CheckerResults } from "../components/check/CheckerResults";
import { RuntimePanel } from "../components/check/RuntimePanel";
import { runChecks, toMarkdown, unpackFiles } from "../lib/check";
import type { Finding, Pkg, Report } from "../lib/check";
import type { RuntimeSession } from "../lib/check/runtime/types";
import { buildRuntimeFindings } from "../lib/check/runtime/rules";

const RUNTIME_CONSENT_KEY = "ograf-check-runtime-consent";

export function Check() {
  useRouteMeta();

  const [report, setReport] = useState<Report | null>(null);
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtimeOn, setRuntimeOn] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied" | "too-large">("idle");
  /** A report opened from a shared link: read-only, no package behind it. */
  const [sharedReport, setSharedReport] = useState<Report | null>(null);
  const [runtimeSession, setRuntimeSession] = useState<RuntimeSession | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setBusy(true);
    setError(null);
    setReport(null);
    setPkg(null);
    setRuntimeOn(false);
    setRuntimeSession(null);
    try {
      const { report: r, pkg: p } = await runChecks(file);
      setReport(r);
      setPkg(p);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to check the package.");
    } finally {
      setBusy(false);
    }
  }, []);

  const handleFolder = useCallback(async (files: readonly File[]) => {
    setBusy(true);
    setError(null);
    setReport(null);
    setPkg(null);
    setRuntimeOn(false);
    setRuntimeSession(null);
    setSharedReport(null);
    try {
      const p = await unpackFiles(files);
      const { report: r } = await runChecks(p);
      setReport(r);
      setPkg(p);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to check the folder.");
    } finally {
      setBusy(false);
    }
  }, []);

  const runtimeFindings = useMemo<readonly Finding[]>(() => {
    if (!runtimeSession || !pkg) return [];
    return buildRuntimeFindings(runtimeSession, pkg.manifest);
  }, [runtimeSession, pkg]);

  const combinedReport = useMemo<Report | null>(() => {
    if (sharedReport) return sharedReport;
    if (!report) return null;
    if (runtimeFindings.length === 0) return report;
    return {
      ...report,
      findings: [...report.findings, ...runtimeFindings],
      summary: {
        errors: report.findings.concat(runtimeFindings).filter((f) => f.severity === "error").length,
        warnings: report.findings.concat(runtimeFindings).filter((f) => f.severity === "warning").length,
        infos: report.findings.concat(runtimeFindings).filter((f) => f.severity === "info").length,
        passes: report.findings.concat(runtimeFindings).filter((f) => f.severity === "pass").length,
      },
    };
  }, [report, runtimeFindings, sharedReport]);

  const downloadReport = useCallback(() => {
    if (!combinedReport) return;
    const md = toMarkdown(combinedReport);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${combinedReport.pkgName.replace(/\.zip$/i, "")}.check.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [combinedReport]);

  const reset = useCallback(() => {
    setReport(null);
    setPkg(null);
    setError(null);
    setRuntimeOn(false);
    setRuntimeSession(null);
    setSharedReport(null);
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // A /check#r=… link carries a whole report. Decode it once on mount so the
  // recipient sees the same findings without needing the .zip.
  useEffect(() => {
    if (!window.location.hash.startsWith("#r=")) return;
    let cancelled = false;
    void decodeReport(window.location.hash).then((r) => {
      if (!cancelled && r) setSharedReport(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const shareReport = useCallback(async () => {
    if (!combinedReport) return;
    const fragment = await encodeReport(combinedReport);
    if (!fragment) {
      setShareState("too-large");
      return;
    }
    const url = `${window.location.origin}/check#${fragment}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
    } catch {
      // Clipboard denied (insecure context, permissions): put it in the URL bar
      // instead, so the link is still one keystroke away.
      window.location.hash = fragment;
      setShareState("copied");
    }
    setTimeout(() => setShareState("idle"), 2500);
  }, [combinedReport]);

  const startRuntime = useCallback(() => {
    let consented = false;
    try {
      consented = Boolean(window.localStorage.getItem(RUNTIME_CONSENT_KEY));
    } catch {
      /* private mode: treat as not consented and ask again */
    }
    if (!consented) {
      setConsentOpen(true);
      return;
    }
    setRuntimeOn(true);
  }, []);

  const acceptConsent = useCallback(() => {
    try {
      window.localStorage.setItem(RUNTIME_CONSENT_KEY, "1");
    } catch {
      /* private mode etc. — the sandbox still runs, we just ask again next time */
    }
    setConsentOpen(false);
    setRuntimeOn(true);
  }, []);

  return (
    <section className="py-16">
      <ConfirmDialog
        open={consentOpen}
        title="Run the graphic in a sandbox?"
        confirmLabel="Run it"
        cancelLabel="Not now"
        onConfirm={acceptConsent}
        onCancel={() => setConsentOpen(false)}
      >
        <p>
          This executes the JavaScript inside the .zip you dropped, in a sandboxed iframe on this
          page. Only do it with a package you trust.
        </p>
        <p>
          Nothing is uploaded — the code runs in your browser and the results stay there. We&rsquo;ll
          remember this choice on this device.
        </p>
      </ConfirmDialog>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
            <ChevronRight className="h-3 w-3 rotate-180" /> All tools
          </Link>
        </div>
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">Tool</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            OGraf package checker.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg tracking-tight text-slate-700">
            Drop any OGraf <code className="font-mono text-base">.zip</code> and get a structured report. Static rules run instantly; a runtime sandbox mounts the graphic and exercises its lifecycle on demand. Everything stays in your browser.
          </p>
        </div>

        {!report && !sharedReport && (
          <>
            <DropZone onFile={handleFile} onFolder={handleFolder} busy={busy} />
            {error && (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                {error}
              </p>
            )}
            <WhatGetsChecked />
          </>
        )}

        {combinedReport && (pkg || sharedReport) && (
          <div className="space-y-6">
            <CheckerSummary
              report={combinedReport}
              onReset={reset}
              onDownload={downloadReport}
              onShare={canShare() ? shareReport : undefined}
              shareState={shareState}
            />

            {!runtimeOn && pkg && (
              <button
                type="button"
                onClick={startRuntime}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-white">
                    <Play className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-display text-base tracking-tight text-slate-900">Run in sandbox</p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Mount the graphic in a sandboxed iframe and exercise load / play / update / stop / customAction / dispose — plus goToTime and setActionsSchedule when the manifest declares non-real-time support. Adds runtime findings to the report.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 flex-none text-slate-400 group-hover:text-blue-600" strokeWidth={2} />
              </button>
            )}

            {runtimeOn && pkg && (
              <RuntimePanel key={pkg.zipName} pkg={pkg} onSessionChange={setRuntimeSession} />
            )}

            <CheckerResults findings={combinedReport.findings} />
          </div>
        )}
      </div>
    </section>
  );
}

function WhatGetsChecked() {
  // Counts come from check-rules.json, regenerated from the rule modules at
  // build time. They were hand-typed once and drifted twice — the page claimed
  // 53 rules when there were 82, and never mentioned the GDD category at all.
  const n = (key: keyof typeof CHECK_RULES.categories) => CHECK_RULES.categories[key]?.count ?? 0;
  const categories = [
    { Icon: FileJson, label: "Manifest", count: n("manifest"), desc: "Validated against the live EBU schema (draft-2020-12), customActions shape, `main` pointer, $schema freshness, semver — plus cross-field checks a per-field schema cannot make: durations naming an undeclared customAction, unsatisfiable render requirements, missing thumbnails." },
    { Icon: Braces, label: "Data schema (GDD)", count: n("gdd"), desc: "Field types and gddType constraints, required gddOptions, the patterns the spec pins for colours, labels covering every select option, and defaults that match their own field's type, enum, bounds and pattern." },
    { Icon: Files, label: "Package structure", count: n("structure"), desc: "Single top-level folder, README / LICENSE / preview present, referenced assets shipped, no OS junk, large-file warnings." },
    { Icon: FileCode, label: "Graphic module", count: n("module"), desc: "Default-export HTMLElement class, six lifecycle methods, the non-real-time pair when the manifest declares it, no self-registered `customElements.define`, no top-level `document`, Shadow-DOM-safe relative URLs." },
    { Icon: FileType, label: "Styling", count: n("styling"), desc: "`position: fixed` catch, remote `@import` / `@font-face`, `body` selector flag, font-family fallback, Shadow-DOM portability hints." },
    { Icon: Image, label: "Assets", count: n("assets"), desc: "Preview image 16:9 (decoded from raw bytes), fonts shipped with a licence, oversized images, unknown extensions." },
    { Icon: Play, label: "Runtime (optional)", count: n("runtime"), desc: "Mounts the graphic in a sandboxed iframe, drives the full OGraf lifecycle including goToTime and setActionsSchedule where declared, captures timings, return values, console and uncaught errors." },
  ];
  return (
    <div className="mt-10">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">What gets checked</p>
        <Link to="/check/rules" className="text-xs font-medium text-blue-600 hover:underline">
          All {CHECK_RULES.total} rules by id →
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <li key={c.label} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <c.Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                {c.label} <span className="font-normal text-slate-400">· {c.count} rules</span>
              </p>
              <p className="text-[12px] text-slate-600">{c.desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Box className="h-3.5 w-3.5" strokeWidth={2} /> No upload — everything runs in your browser.
      </p>
      <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
        <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2} /> The runtime sandbox executes the package's code; opt-in click required.
      </p>
    </div>
  );
}
