import { useRouteMeta } from "../hooks/useMeta";
import { useCopy } from "../i18n/useLocale";
import { ABOUT_COPY } from "../i18n/copy/about";

export function About() {
  useRouteMeta();
  const c = useCopy(ABOUT_COPY);
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-4xl lg:px-10">
        <div className="flex flex-col gap-6 mb-16">
          <div className="text-sm/7 font-semibold text-blue-600">{c.eyebrow}</div>
          <h1 className="font-display text-5xl/12 tracking-tight text-slate-900 sm:text-[4rem]/18">
            {c.title}
          </h1>
        </div>

        <div className="space-y-8 text-base/7 text-slate-600">
          <p>{c.intro}</p>

          <p>{c.tools}</p>

          <div className="flex flex-col gap-4 py-8">
            <h2 className="font-display text-[2rem]/10 tracking-tight text-slate-900">{c.sitesTitle}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-4">
              {c.sites.map((site) => (
                <div key={site.name} className="rounded-md bg-slate-50 p-5 ring-1 ring-slate-200">
                  <p className="font-mono text-sm font-semibold text-slate-900">{site.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{site.role}</p>
                  <p className="mt-3 text-sm/7 text-slate-600">{site.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 py-8">
            <h2 className="font-display text-[2rem]/10 tracking-tight text-slate-900">{c.missionTitle}</h2>
            {c.mission.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-col gap-4 py-8">
            <h2 className="font-display text-[2rem]/10 tracking-tight text-slate-900">{c.licenseTitle}</h2>
            <p>{c.license}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
