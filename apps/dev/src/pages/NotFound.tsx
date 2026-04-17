import { Link } from "react-router";
import { Compass, ArrowRight } from "lucide-react";
import { useMeta } from "../hooks/useMeta";

export function NotFound() {
  useMeta({
    title: "Page not found",
    description: "This page doesn't exist at ograf.dev. Try the tutorials, specification, or ecosystem instead.",
  });
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Compass className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <p className="mt-6 text-sm font-semibold text-blue-600">404 &middot; Page not found</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight text-slate-900 sm:text-5xl">
        That page isn't here.
      </h1>
      <p className="mt-6 text-lg text-slate-600">
        It might have moved, been renamed, or never existed. Try one of these entry points:
      </p>
      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <QuickLink to="/" title="Home" desc="The short pitch and the ecosystem at a glance." />
        <QuickLink to="/tutorials" title="Tutorials" desc="Eleven broadcast graphics you can build today." />
        <QuickLink to="/spec" title="Specification" desc="How OGraf works, explained plainly." />
        <QuickLink to="/ecosystem" title="Ecosystem" desc="Every tool, editor, and renderer worth knowing." />
      </div>
      <p className="mt-10 text-sm text-slate-500">
        Still stuck?{" "}
        <a
          href="https://github.com/ficosta/ograf/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400"
        >
          open an issue on GitHub
        </a>
        .
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
