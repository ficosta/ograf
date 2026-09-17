import { Link } from "../i18n/Link";
import { Compass, ArrowRight } from "lucide-react";
import { useRouteMeta } from "../hooks/useMeta";
import { NOT_FOUND_COPY } from "../i18n/copy/not-found";
import { useCopy } from "../i18n/useLocale";

export function NotFound() {
  useRouteMeta();
  const c = useCopy(NOT_FOUND_COPY);
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Compass className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <p className="mt-6 text-sm font-semibold text-blue-600">{c.eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight text-slate-900 sm:text-5xl">
        {c.title}
      </h1>
      <p className="mt-6 text-lg text-slate-600">
        {c.lead}
      </p>
      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {c.links.map((link) => (
          <QuickLink key={link.to} to={link.to} title={link.title} desc={link.desc} />
        ))}
      </div>
      <p className="mt-10 text-sm text-slate-500">
        {c.stuck}{" "}
        <a
          href="https://github.com/ficosta/ograf/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400"
        >
          {c.openIssue}
        </a>
        {c.stuckEnd}
      </p>
    </section>
  );
}

interface QuickLinkProps {
  readonly to: string;
  readonly title: string;
  readonly desc: string;
}

function QuickLink({ to, title, desc }: QuickLinkProps) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-sm"
    >
      <div className="flex-1">
        <p className="font-display text-base text-slate-900 group-hover:text-blue-600">
          {title}
        </p>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </div>
      <ArrowRight
        className="mt-1 h-4 w-4 flex-none text-slate-300 transition-colors group-hover:text-blue-600"
        strokeWidth={2}
      />
    </Link>
  );
}
