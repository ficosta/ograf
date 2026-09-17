import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  Clapperboard,
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
import { ECOSYSTEM, type EcoCategoryJson, type EcoItem } from "../content/localized/ecosystem";
import { useRouteMeta } from "../hooks/useMeta";
import { ECOSYSTEM_COPY } from "../i18n/copy/ecosystem";
import type { Locale } from "../i18n/locales";
import { useCopy } from "../i18n/useLocale";

interface Category extends Omit<EcoCategoryJson, "icon"> {
  readonly icon: LucideIcon;
}

const ICON_MAP: Readonly<Record<string, LucideIcon>> = {
  BookOpen,
  Briefcase,
  Clapperboard,
  FileCode2,
  Gamepad2,
  Heart,
  PenTool,
  Server,
  ShieldCheck,
  Wrench,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Wrench;
}

function resolveCategories(json: readonly EcoCategoryJson[]): readonly Category[] {
  return json.map((c) => ({ ...c, icon: resolveIcon(c.icon) }));
}

const CATEGORIES_BY_LOCALE: Readonly<Record<Locale, readonly Category[]>> = {
  en: resolveCategories(ECOSYSTEM.en),
  pt: resolveCategories(ECOSYSTEM.pt),
  es: resolveCategories(ECOSYSTEM.es),
};

/** Counts and ids are identical in every language, so they come from English. */
const CATEGORIES = CATEGORIES_BY_LOCALE.en;

const TYPE_STYLES: Record<EcoItem["type"], string> = {
  oss: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  commercial: "bg-amber-50 text-amber-700 ring-amber-600/20",
  official: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

const STATUS_STYLES: Record<NonNullable<EcoItem["status"]>, string> = {
  soon: "bg-violet-50 text-violet-700 ring-violet-600/20",
  exploring: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

/** Initials for the fallback tile — most vendors publish no SVG logo. */
function monogram(name: string): string {
  const words = name.split(/[\s-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);
const TOTAL = ALL_ITEMS.length;
const OSS_COUNT = ALL_ITEMS.filter((i) => i.type === "oss").length;
const COMMERCIAL_COUNT = ALL_ITEMS.filter((i) => i.type === "commercial").length;

export function Ecosystem() {
  useRouteMeta();
  const c = useCopy(ECOSYSTEM_COPY);
  const categories = useCopy(CATEGORIES_BY_LOCALE);
  const [activeId, setActiveId] = useState<string>(CATEGORIES[0]?.id ?? "");
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = CATEGORIES.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const pill = nav.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (pill) pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
          {c.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          {c.lead}
        </p>
      </div>

      {/* Stats */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <p className="font-display text-4xl font-light text-blue-600">{TOTAL}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {c.stats.projects}
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-emerald-600">{OSS_COUNT}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {c.stats.openSource}
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-amber-600">{COMMERCIAL_COUNT}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {c.stats.commercial}
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-slate-900">{CATEGORIES.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {c.stats.categories}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-0 z-40 border-y border-slate-200 bg-white/90 backdrop-blur">
        <nav ref={navRef} className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {categories.map((cat) => {
            const active = cat.id === activeId;
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                aria-current={active ? "true" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <cat.icon className="h-3.5 w-3.5" strokeWidth={2} />
                {cat.name}
                <span className={`text-xs ${active ? "text-blue-500" : "text-slate-400"}`}>{cat.items.length}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {categories.map((category) => {
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
                        {c.youAreHere}
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
                      <div className="flex min-w-0 items-center gap-3">
                        {item.logo ? (
                          // Vendor logos are wordmarks, so the logo carries the
                          // name and the heading stays for screen readers only.
                          <>
                            <img
                              src={item.logo}
                              alt={item.name}
                              loading="lazy"
                              className="h-6 w-auto max-w-[10rem] object-contain object-left"
                            />
                            <h3 className="sr-only">{item.name}</h3>
                          </>
                        ) : (
                          <>
                            <span
                              aria-hidden="true"
                              className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-slate-100 text-[11px] font-semibold tracking-tight text-slate-500 ring-1 ring-slate-900/5"
                            >
                              {monogram(item.name)}
                            </span>
                            <h3
                              className={`truncate font-display text-lg text-slate-900 transition-colors ${cardHover.split(" ")[1]}`}
                            >
                              {item.name}
                            </h3>
                          </>
                        )}
                      </div>
                      <ExternalLink
                        className={`h-4 w-4 flex-none text-slate-300 transition-colors ${category.featured ? "group-hover:text-rose-600" : "group-hover:text-blue-600"}`}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TYPE_STYLES[item.type]}`}
                      >
                        {c.typeLabels[item.type]}
                      </span>
                      {item.status && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[item.status]}`}
                        >
                          {c.statusLabels[item.status]}
                        </span>
                      )}
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
            {c.ctaTitle}
          </h2>
          <p className="mt-3 text-slate-700">
            {c.ctaBody}
          </p>
          <a
            href="https://github.com/ficosta/ograf/issues/new?title=Ecosystem+listing:+&body=Name:%0AURL:%0AWhat+it+does+with+OGraf:"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {c.ctaButton}
          </a>
        </div>
      </section>
    </>
  );
}
