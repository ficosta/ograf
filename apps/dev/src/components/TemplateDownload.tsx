import { Download, ExternalLink, FileCode, FileImage, FileJson, FileText, FileType, Package } from "lucide-react";
import { useCopy, useLocalePath } from "../i18n/useLocale";
import { TUTORIAL_UI_COPY } from "../i18n/copy/tutorial-ui";
import type { TutorialUiCopy } from "../i18n/copy/tutorial-ui/en";

interface TemplateDownloadProps {
  readonly slug: string;
  readonly title: string;
}

interface PackageFile {
  readonly icon: typeof FileJson;
  readonly name: string;
  readonly desc: string;
}

function packageFiles(slug: string, desc: TutorialUiCopy["download"]["files"]): readonly PackageFile[] {
  return [
    { icon: FileJson, name: `${slug}.ograf.json`, desc: desc.manifest },
    { icon: FileCode, name: "graphic.mjs", desc: desc.graphic },
    { icon: FileType, name: "style.css", desc: desc.style },
    { icon: FileImage, name: "thumbnail.webp", desc: desc.thumbnail },
    { icon: FileText, name: "README.md", desc: desc.readme },
    { icon: FileText, name: "LICENSE", desc: desc.license },
  ];
}

type RendererName = keyof TutorialUiCopy["download"]["renderers"];

interface Renderer {
  readonly name: RendererName;
  readonly href: string;
}

const RENDERERS: readonly Renderer[] = [
  {
    name: "ograf-server",
    href: "https://github.com/SuperFlyTV/ograf-server",
  },
  {
    name: "SPX-GC",
    href: "https://github.com/TuomoKu/SPX-GC",
  },
  {
    name: "CasparCG",
    href: "https://github.com/CasparCG/server",
  },
];

export function TemplateDownload({ slug, title }: TemplateDownloadProps) {
  const href = `/downloads/${slug}.zip`;
  const c = useCopy(TUTORIAL_UI_COPY).download;
  const localize = useLocalePath();
  const files = packageFiles(slug, c.files);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Package className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg tracking-tight text-slate-900">
            {c.heading(title)}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {c.intro}
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
          <Download className="h-4 w-4" strokeWidth={2} /> {c.button(slug)}
        </a>
        <span className="text-xs text-slate-500">
          {c.note(localize("/check"))}
        </span>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          {c.renderersHeading}
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {RENDERERS.map((r) => (
            <li key={r.name}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-1 rounded-lg border border-slate-200 p-3 hover:border-blue-300 hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                  {r.name}
                  <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-blue-400" strokeWidth={2} />
                </span>
                <span className="text-[11px] text-slate-500">{c.renderers[r.name]}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
