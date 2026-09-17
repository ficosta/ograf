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
import { CATEGORY_ORDER } from "../lib/check/types";
import { useRouteMeta } from "../hooks/useMeta";
import { useCopy } from "../i18n/useLocale";
import { CHECK_COPY } from "../i18n/copy/check";

export function CheckRules() {
  useRouteMeta();
  const c = useCopy(CHECK_COPY);

  const categories = CATEGORY_ORDER.filter((c) => c in CHECK_RULES.categories);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/check" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
            <ChevronRight className="h-3 w-3 rotate-180" /> {c.rulesPage.back}
          </Link>
        </div>

        <div className="mb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">{c.rulesPage.eyebrow}</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900">
            {c.rulesPage.title}
          </h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            {c.rulesPage.intro(CHECK_RULES.total, categories.length)}
          </p>
          {c.findingsNote && <p className="mt-4 text-xs text-slate-500">{c.findingsNote}</p>}
        </div>

        <div className="space-y-10">
          {categories.map((category) => {
            const entry = CHECK_RULES.categories[category as keyof typeof CHECK_RULES.categories];
            if (!entry) return null;
            return (
              <div key={category}>
                <div className="mb-3 flex items-baseline gap-2">
                  <h2 className="font-display text-xl text-slate-900">{c.categories[category]}</h2>
                  <span className="text-sm text-slate-400">{c.rules(entry.count)}</span>
                </div>
                {c.rulesPage.prefix[category] && (
                  <p className="mb-4 text-sm text-slate-600">{c.rulesPage.prefix[category]}</p>
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
          {c.rulesPage.footer}
        </p>
      </div>
    </section>
  );
}
