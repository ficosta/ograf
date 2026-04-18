import { Download, ExternalLink, FileCode, FileJson, FileText, FileType, Package, Play } from "lucide-react";

interface TemplateDownloadProps {
  readonly slug: string;
  readonly title: string;
}

interface PackageFile {
  readonly icon: typeof FileJson;
  readonly name: string;
  readonly desc: string;
}

function packageFiles(slug: string): readonly PackageFile[] {
  return [
    { icon: FileJson, name: `${slug}.ograf.json`, desc: "Manifest — what a renderer reads (id, schema, lifecycle flags)" },
    { icon: FileCode, name: "graphic.mjs", desc: "Web Component implementing load / play / update / stop / dispose" },
    { icon: FileType, name: "style.css", desc: "Component styles and keyframes" },
    { icon: FileText, name: "README.md", desc: "Usage notes and pointers to real OGraf players" },
  ];
}

interface OtherPlayer {
  readonly name: string;
  readonly href: string;
  readonly desc: string;
}

const OTHER_PLAYERS: readonly OtherPlayer[] = [
  {
    name: "ograf-server",
    href: "https://github.com/SuperFlyTV/ograf-server",
    desc: "Reference renderer with upload + control APIs (self-host).",
  },
  {
    name: "SPX-GC",
    href: "https://github.com/TuomoKu/SPX-GC",
    desc: "Professional browser-based controller with OGraf support.",
  },
  {
    name: "CasparCG",
    href: "https://github.com/CasparCG/server",
    desc: "Open-source playout server — renders OGraf via HTML producer.",
  },
];

export function TemplateDownload({ slug, title }: TemplateDownloadProps) {
  const href = `/downloads/${slug}.zip`;
  const files = packageFiles(slug);
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
            A real OGraf Graphics Definition v1 package — nothing more, nothing
            less. A compliant player reads the manifest and drives the lifecycle
            for you. MIT-licensed.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {files.map((f) => (
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

      <div className="mt-8 rounded-xl bg-blue-50 border border-blue-100 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-600 text-white">
            <Play className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">
              Try it in a real OGraf player
            </p>
            <p className="mt-1 text-sm text-blue-800">
              The SuperFly devtool is the fastest way to validate and run your
              package. It reads the manifest, runs the lifecycle, and catches
              spec issues a bespoke preview can't.
            </p>
            <ol className="mt-3 space-y-1 text-sm text-blue-800 list-decimal pl-5">
              <li>Download <code className="font-mono text-xs bg-white/70 px-1 py-0.5 rounded">{slug}.zip</code>.</li>
              <li>Unzip it.</li>
              <li>
                Open{" "}
                <a
                  href="https://ograf-devtool.superfly.tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline decoration-blue-300 hover:decoration-blue-600"
                >
                  ograf-devtool.superfly.tv
                </a>{" "}
                and point it at the unzipped folder.
              </li>
            </ol>
            <a
              href="https://ograf-devtool.superfly.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              Open ograf-devtool <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Also compatible with
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {OTHER_PLAYERS.map((p) => (
            <li key={p.name}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-1 rounded-lg border border-slate-200 p-3 hover:border-blue-300 hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                  {p.name}
                  <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-blue-400" strokeWidth={2} />
                </span>
                <span className="text-[11px] text-slate-500">{p.desc}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
