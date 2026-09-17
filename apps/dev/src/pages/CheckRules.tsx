/**
 * /check/rules — every rule the Package Checker applies, by id.
 *
 * A report cites rule ids (G-04, M-16, X-02). Without somewhere to look them
 * up, an id is just a code — you can read the message in front of you but you
 * cannot see what the checker covers, or cite a rule to a colleague. This is
 * the index the reports point at.
 *
 * Generated from check-rules.json, which is rebuilt from the rule modules on
 * every build, so the page cannot describe a checker that no longer exists.
 */

import { Link } from "../i18n/Link";
import { ChevronRight } from "lucide-react";
import CHECK_RULES from "../content/check-rules.json";
import { CATEGORY_LABEL, CATEGORY_ORDER, type Category } from "../lib/check/types";
import { useRouteMeta } from "../hooks/useMeta";

/** What each id prefix stands for, so the numbering is not a private joke. */
const PREFIX_NOTE: Partial<Record<Category, string>> = {
  manifest: "M — the .ograf.json itself, validated against the EBU schema and then across its own fields.",
  gdd: "G — the data schema controllers build operator forms from.",
  structure: "S — what the package contains and how it is laid out.",
  module: "C — the graphic module's source: exports, lifecycle, portability.",
  styling: "X — stylesheet rules that decide whether a graphic survives a different renderer.",
  assets: "A — images, fonts and the licences that must ship beside them.",
  runtime: "R — assertions made while the graphic actually runs in the sandbox.",
};

export function CheckRules() {
  useRouteMeta();

  const categories = CATEGORY_ORDER.filter((c) => c in CHECK_RULES.categories);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/check" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
            <ChevronRight className="h-3 w-3 rotate-180" /> Package Checker
          </Link>
        </div>

        <div className="mb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Reference</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900">
            Checker rules.
          </h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            All {CHECK_RULES.total} rules, across {categories.length} categories. Reports cite these
            ids, so this is where to look one up. The list is generated from the checker's own source
            on every build — it cannot drift from what actually runs.
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => {
            const entry = CHECK_RULES.categories[category as keyof typeof CHECK_RULES.categories];
            if (!entry) return null;
            return (
              <div key={category}>
                <div className="mb-3 flex items-baseline gap-2">
                  <h2 className="font-display text-xl text-slate-900">{CATEGORY_LABEL[category]}</h2>
                  <span className="text-sm text-slate-400">{entry.count} rules</span>
                </div>
                {PREFIX_NOTE[category] && (
                  <p className="mb-4 text-sm text-slate-600">{PREFIX_NOTE[category]}</p>
                )}
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {entry.rules.map((rule) => (
                    <li key={rule.id} className="flex gap-3 px-4 py-2.5">
                      <code className="w-12 flex-none font-mono text-xs text-slate-400">{rule.id}</code>
                      <span className="text-sm text-slate-700">
                        {rule.title ?? <span className="text-slate-400">—</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-sm text-slate-500">
          A rule with no description raises more than one kind of finding, and its message says which.
          Run a package through the{" "}
          <Link to="/check" className="text-blue-600 hover:underline">
            checker
          </Link>{" "}
          to see them in context.
        </p>
      </div>
    </section>
  );
}
