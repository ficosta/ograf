import { useCallback, useState } from "react";
import { Link } from "react-router";
import { FileJson, FileCode, FileType, Files, Image, Box, ChevronRight } from "lucide-react";
import { useMeta } from "../hooks/useMeta";
import { DropZone } from "../components/check/DropZone";
import { CheckerSummary } from "../components/check/CheckerSummary";
import { CheckerResults } from "../components/check/CheckerResults";
import { runChecks, toMarkdown } from "../lib/check";
import type { Report } from "../lib/check";

export function Check() {
  useMeta({
    title: "OGraf Package Checker",
    description:
      "A comprehensive in-browser validator for OGraf Graphics Definition v1 packages. Drop a .zip, get a structured report against 30+ rules across manifest, structure, module, styling, and assets.",
  });

  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      const result = await runChecks(file);
      setReport(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to check the package.");
    } finally {
      setBusy(false);
    }
  }, []);

  const downloadReport = useCallback(() => {
    if (!report) return;
    const md = toMarkdown(report);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.pkgName.replace(/\.zip$/i, "")}.check.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [report]);

  const reset = useCallback(() => {
    setReport(null);
    setError(null);
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
            Drop any OGraf <code className="font-mono text-base">.zip</code> package and get a structured report. Validates the manifest against the live EBU schema, looks at the module and stylesheet, checks your fonts and preview image. Everything runs in your browser.
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

        {report && (
          <div className="space-y-6">
            <CheckerSummary report={report} onReset={reset} onDownload={downloadReport} />
            <CheckerResults findings={report.findings} />
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
        <Box className="h-3.5 w-3.5" strokeWidth={2} /> No upload — the checker runs entirely in your browser.
      </p>
    </div>
  );
}
