import { Link } from "react-router";
import { ArrowRight, ShieldCheck, Play, Wand2, FileSearch, Clock } from "lucide-react";
import { useMeta } from "../hooks/useMeta";

interface Tool {
  readonly name: string;
  readonly slug: string;
  readonly tagline: string;
  readonly description: string;
  readonly icon: typeof ShieldCheck;
  readonly href: string;
  readonly status: "available" | "coming-soon";
  readonly badge?: string;
}

const TOOLS: readonly Tool[] = [
  {
    name: "Package Checker",
    slug: "check",
    tagline: "Validate a .zip before you ship.",
    description:
      "Drop any OGraf package and get a structured report against 30+ rules across manifest, structure, module, styling, and assets. Validates against the live EBU schema. Runs entirely in your browser — no upload.",
    icon: ShieldCheck,
    href: "/check",
    status: "available",
    badge: "New",
  },
  {
    name: "Runtime Harness",
    slug: "runtime",
    tagline: "Load your package and drive the lifecycle.",
    description:
      "Mount a package in a sandboxed iframe and call load / playAction / updateAction / stopAction / customAction / dispose for real. Captures timings, return values, console output, and a live preview.",
    icon: Play,
    href: "#",
    status: "coming-soon",
  },
  {
    name: "Schema Explorer",
    slug: "schema",
    tagline: "Browse the OGraf manifest schema in plain language.",
    description:
      "Every top-level field of an .ograf.json manifest, grouped into five designer-friendly clusters, plus a visual catalogue of every operator-input type. Sourced live from the EBU schema with a bundled fallback.",
    icon: FileSearch,
    href: "/tools/schema-explorer",
    status: "available",
  },
  {
    name: "Template Generator",
    slug: "generator",
    tagline: "Scaffold a new OGraf package from a preset.",
    description:
      "Pick a base (lower third, bug, ticker, …), tweak a handful of fields, and download a ready-to-edit package with manifest, module, stylesheet, and local fonts already wired up correctly.",
    icon: Wand2,
    href: "#",
    status: "coming-soon",
  },
];

export function Tools() {
  useMeta({
    title: "Tools",
    description:
      "OGraf developer tools on ograf.dev — a client-side package checker today, with a runtime harness, schema explorer, and template generator next. All browser-based, no upload.",
  });
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">Tools</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            Build, check, and ship OGraf packages.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            A growing set of browser-based tools for everyone writing OGraf graphics. Everything runs client-side — no sign-up, no upload.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-slate-500">
          Got an idea for a tool? Open an issue on{" "}
          <a
            href="https://github.com/ficosta/ograf/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function ToolCard({ tool }: { readonly tool: Tool }) {
  const Icon = tool.icon;
  const disabled = tool.status === "coming-soon";

  const content = (
    <div className="flex items-start gap-4">
      <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${disabled ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg text-slate-900">{tool.name}</h2>
          {tool.badge && (
            <span className="inline-flex rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              {tool.badge}
            </span>
          )}
          {disabled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              <Clock className="h-2.5 w-2.5" strokeWidth={2.5} /> Coming soon
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-slate-700">{tool.tagline}</p>
        <p className="mt-2 text-sm text-slate-600">{tool.description}</p>
        {!disabled && (
          <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
            Open {tool.name.toLowerCase()}
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
