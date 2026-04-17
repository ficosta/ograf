import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  ExternalLink,
  FileCode2,
  Gamepad2,
  Heart,
  PenTool,
  Plus,
  Server,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
interface EcoItem {
  readonly name: string;
  readonly desc: string;
  readonly url: string;
  readonly type: "oss" | "commercial" | "official";
  readonly stars?: string;
}

interface CategoryJson {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly items: readonly EcoItem[];
  readonly featured?: boolean;
}

interface Category extends Omit<CategoryJson, "icon"> {
  readonly icon: LucideIcon;
}

const CATEGORIES: readonly Category[] = [
  {
    id: "community-hub",
    name: "Community Hub",
    icon: Heart,
    description: "That's us. The independent, community-driven home for learning, building, and testing OGraf.",
    featured: true,
    items: [
      {
        name: "ograf.dev",
        desc: "This site. Tutorials, ecosystem map, spec history, migration guides, and everything else the community needs to ship OGraf graphics.",
        url: "https://ograf.dev",
        type: "oss",
      },
      {
        name: "ograf.tools",
        desc: "Our companion workbench. Browser-based validator, live preview sandbox, schema explorer, and template generator. Zero install.",
        url: "https://ograf.tools",
        type: "oss",
      },
const CATEGORIES: readonly Category[] = (ecosystemJson as readonly CategoryJson[]).map(
  (c) => ({ ...c, icon: resolveIcon(c.icon) }),
);
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
          The complete OGraf landscape.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          Every tool, renderer, editor, and resource worth knowing about — from the official spec to community projects and commercial products.
        </p>
      </div>

      {/* Stats */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <p className="font-display text-4xl font-light text-blue-600">{TOTAL}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Projects
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-emerald-600">{OSS_COUNT}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Open source
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-amber-600">{COMMERCIAL_COUNT}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Commercial
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-slate-900">{CATEGORIES.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-0 z-40 border-y border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <c.icon className="h-3.5 w-3.5" strokeWidth={2} />
              {c.name}
              <span className="text-xs text-slate-400">{c.items.length}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const iconBadge = category.featured
            ? "bg-rose-50 text-rose-600"
            : "bg-blue-50 text-blue-600";
          const cardHover = category.featured
            ? "hover:ring-rose-300 group-hover:text-rose-600"
            : "hover:ring-slate-900/10 group-hover:text-blue-600";
          return (
            <section key={category.id} id={category.id} className="mb-16 scroll-mt-20 last:mb-0">
              <div className="mb-8 flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${iconBadge.split(" ")[0]}`}
                >
                  <Icon
                    className={`h-6 w-6 ${iconBadge.split(" ")[1]}`}
                    strokeWidth={1.5}
                    fill={category.featured ? "currentColor" : "none"}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                      {category.name}
                    </h2>
                    {category.featured && (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-rose-700 ring-1 ring-inset ring-rose-600/20">
                        You are here
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600 sm:text-base">{category.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-md ${cardHover.split(" ")[0]}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-display text-lg text-slate-900 transition-colors ${cardHover.split(" ")[1]}`}
                      >
                        {item.name}
                      </h3>
                      <ExternalLink
                        className={`h-4 w-4 flex-none text-slate-300 transition-colors ${category.featured ? "group-hover:text-rose-600" : "group-hover:text-blue-600"}`}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TYPE_STYLES[item.type]}`}
                      >
                        {TYPE_LABELS[item.type]}
                      </span>
                      {item.stars && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Star className="h-3 w-3 fill-slate-400 text-slate-400" />
                          {item.stars}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 flex-1 text-sm text-slate-700">{item.desc}</p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
            Missing from the list?
          </h2>
          <p className="mt-3 text-slate-700">
            If you built or know of an OGraf-compatible tool, editor, or resource that isn't here, open an issue or a PR and we'll add it.
          </p>
          <a
            href="https://github.com/ebu/ograf/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Submit on GitHub
          </a>
        </div>
      </section>
    </>
  );
}
