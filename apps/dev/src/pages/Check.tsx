import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { FileJson, FileCode, FileType, Files, Image, Box, ChevronRight, Play, ShieldAlert } from "lucide-react";
import { useMeta } from "../hooks/useMeta";
import { DropZone } from "../components/check/DropZone";
import { CheckerSummary } from "../components/check/CheckerSummary";
import { CheckerResults } from "../components/check/CheckerResults";
import { RuntimePanel } from "../components/check/RuntimePanel";
import { runChecks, toMarkdown } from "../lib/check";
import type { Finding, Pkg, Report } from "../lib/check";
import type { RuntimeSession } from "../lib/check/runtime/types";
import { buildRuntimeFindings } from "../lib/check/runtime/rules";

const RUNTIME_CONSENT_KEY = "ograf-check-runtime-consent";

export function Check() {
  useMeta({
    title: "OGraf Package Checker",
    description:
      "A comprehensive in-browser validator for OGraf Graphics Definition v1 packages. Drop a .zip, get a structured report against 30+ static rules and run it live in a sandbox.",
  });

  const [report, setReport] = useState<Report | null>(null);
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtimeOn, setRuntimeOn] = useState(false);
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

  const runtimeFindings = useMemo<readonly Finding[]>(() => {
    if (!runtimeSession || !pkg) return [];
    return buildRuntimeFindings(runtimeSession, pkg.manifest);
  }, [runtimeSession, pkg]);

  const combinedReport = useMemo<Report | null>(() => {
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
  }, [report, runtimeFindings]);

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
  }, []);

  const startRuntime = useCallback(() => {
    if (typeof window !== "undefined" && !window.localStorage.getItem(RUNTIME_CONSENT_KEY)) {
      const ok = window.confirm(
        "The runtime sandbox will execute the code inside the .zip you dropped, in a sandboxed iframe on this page. It still doesn't leave your browser.\n\nProceed?"
      );
      if (!ok) return;
      try {
        window.localStorage.setItem(RUNTIME_CONSENT_KEY, "1");
      } catch {
        /* private mode etc. — ignore */
      }
    }
    setRuntimeOn(true);
  }, []);

  return (
    <section className="py-16">
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

        {!report && (
          <>
            <DropZone onFile={handleFile} busy={busy} />
            {error && (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                {error}
              </p>
            )}
            <WhatGetsChecked />
          </>
        )}

        {combinedReport && pkg && (
          <div className="space-y-6">
            <CheckerSummary report={combinedReport} onReset={reset} onDownload={downloadReport} />

            {!runtimeOn && (
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
                      Mount the graphic in a sandboxed iframe and exercise load / play / update / stop / customAction / dispose. Adds runtime findings to the report.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 flex-none text-slate-400 group-hover:text-blue-600" strokeWidth={2} />
              </button>
            )}

            {runtimeOn && (
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
  const categories = [
    { Icon: FileJson, label: "Manifest", desc: "10 rules · validated against the live EBU schema (draft-2020-12), customActions shape (no `label`!), main pointer exists, $schema freshness, semver." },
    { Icon: Files, label: "Package structure", desc: "9 rules · single top-level folder, README / LICENSE / preview present, no OS junk, large-file warnings." },
    { Icon: FileCode, label: "Graphic module", desc: "8 rules · default-export HTMLElement class, six lifecycle methods, no self-registered `customElements.define`, no top-level `document`, Shadow-DOM-safe relative URLs." },
    { Icon: FileType, label: "Styling", desc: "9 rules · `position: fixed` catch, remote `@import` / `@font-face`, `body` selector flag, font-family fallback, Shadow-DOM portability hints." },
    { Icon: Image, label: "Assets", desc: "5 rules · preview image 16:9 (decoded from raw bytes), fonts shipped with licence, oversized images, unknown extensions." },
    { Icon: Play, label: "Runtime (optional)", desc: "12 checks · mounts the graphic in a sandboxed iframe, drives the full OGraf lifecycle, captures timings, return values, console, uncaught errors." },
  ];
  return (
    <div className="mt-10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">What gets checked</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <li key={c.label} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <c.Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{c.label}</p>
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
