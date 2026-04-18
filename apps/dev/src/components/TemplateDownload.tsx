import { Download, FileCode, FileJson, FileType, Package } from "lucide-react";

interface TemplateDownloadProps {
  readonly slug: string;
  readonly title: string;
}

const FILES = [
  { icon: FileJson, name: ".ograf.json", desc: "Manifest — id, schema, lifecycle flags" },
  { icon: FileCode, name: "graphic.mjs", desc: "Web Component with load / play / update / stop" },
  { icon: FileType, name: "style.css", desc: "Visual styling and keyframes" },
  { icon: FileCode, name: "demo.html", desc: "Local preview harness" },
];

export function TemplateDownload({ slug, title }: TemplateDownloadProps) {
  const href = `/downloads/${slug}.zip`;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Package className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg tracking-tight text-slate-900">
            Download the full {title} package
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            A complete OGraf package you can drop into any compliant renderer — SPX-GC, ograf-server, or your own. MIT-licensed, no attribution required.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FILES.map((f) => (
          <li key={f.name} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
            <f.icon className="h-4 w-4 flex-none text-slate-400" strokeWidth={1.75} />
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium text-slate-900">{f.name}</p>
              <p className="truncate text-[11px] text-slate-500">{f.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={href}
          download
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:scale-[0.97] transition-[colors,transform]"
        >
          <Download className="h-4 w-4" strokeWidth={2} /> Download {slug}.zip
        </a>
        <span className="text-xs text-slate-500">Zipped · typically under 10 KB</span>
      </div>
    </div>
  );
}
