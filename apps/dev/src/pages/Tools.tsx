import { Link } from "../i18n/Link";
import { ArrowRight, ShieldCheck, Wand2, FileSearch, Clock } from "lucide-react";
import { useRouteMeta } from "../hooks/useMeta";
import CHECK_RULES from "../content/check-rules.json";
import { useCopy } from "../i18n/useLocale";
import { TOOLS_COPY } from "../i18n/copy/tools";
import type { ToolsCopy } from "../i18n/copy/tools/en";

type ToolSlug = keyof ToolsCopy["tools"];

interface Tool {
  readonly slug: ToolSlug;
  readonly icon: typeof ShieldCheck;
  readonly href: string;
  readonly status: "available" | "coming-soon";
}

const TOOLS: readonly Tool[] = [
  { slug: "check", icon: ShieldCheck, href: "/check", status: "available" },
  { slug: "schema", icon: FileSearch, href: "/tools/schema-explorer", status: "available" },
  { slug: "generator", icon: Wand2, href: "#", status: "coming-soon" },
];

export function Tools() {
  useRouteMeta();
  const c = useCopy(TOOLS_COPY);
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">{c.eyebrow}</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            {c.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            {c.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <ToolCard key={t.slug} tool={t} copy={c} />
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-slate-500">{c.idea}</p>
      </div>
    </section>
  );
}

function ToolCard({ tool, copy }: { readonly tool: Tool; readonly copy: ToolsCopy }) {
  const Icon = tool.icon;
  const text = copy.tools[tool.slug];
  const disabled = tool.status === "coming-soon";

  const content = (
    <div className="flex items-start gap-4">
      <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${disabled ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg text-slate-900">{text.name}</h2>
          {text.badge && (
            <span className="inline-flex rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              {text.badge}
            </span>
          )}
          {disabled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              <Clock className="h-2.5 w-2.5" strokeWidth={2.5} /> {copy.comingSoon}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-slate-700">{text.tagline}</p>
        <p className="mt-2 text-sm text-slate-600">{text.description(CHECK_RULES.total)}</p>
        {!disabled && (
          <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
            {text.open}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </p>
        )}
      </div>
    </div>
  );

  const className = `block rounded-2xl border border-slate-200 bg-white p-5 transition-all ${disabled ? "cursor-not-allowed opacity-70" : "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"}`;

  if (disabled) return <div className={className}>{content}</div>;

  return (
    <Link to={tool.href} className={className}>
      {content}
    </Link>
  );
}
