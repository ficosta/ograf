import { Check } from "lucide-react";
import { useCopy } from "../../i18n/useLocale";
import { Link } from "../../i18n/Link";
import { TUTORIALS } from "../../content/localized/tutorials";
import { GENERATOR_COPY } from "../../i18n/copy/generator";
import { PRESETS } from "../../lib/generator/presets";
import type { PresetSlug } from "../../lib/generator/types";

interface PresetGalleryProps {
  readonly selected: PresetSlug;
  readonly onSelect: (slug: PresetSlug) => void;
}

/**
 * The eleven tutorial templates as a picker. Titles and subtitles come from
 * the localized tutorial list, so the gallery reads in the page's language.
 */
export function PresetGallery({ selected, onSelect }: PresetGalleryProps) {
  const c = useCopy(GENERATOR_COPY);
  const tutorials = useCopy(TUTORIALS);
  const bySlug = new Map(tutorials.map((t) => [t.slug, t] as const));

  return (
    <div role="radiogroup" aria-label={c.gallery.title} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {PRESETS.map((preset) => {
        const tutorial = bySlug.get(preset.tutorialSlug);
        const active = preset.slug === selected;
        return (
          <div key={preset.slug} className="flex flex-col">
            <button
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(preset.slug)}
              className={`group flex flex-1 flex-col overflow-hidden rounded-xl border bg-white text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                active ? "border-blue-500 shadow-md ring-2 ring-blue-100" : "border-slate-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={`/templates/previews/${preset.slug}.webp`}
                  alt=""
                  width={1920}
                  height={1080}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {active && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    <Check className="h-3 w-3" strokeWidth={3} /> {c.gallery.selected}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-slate-900">{tutorial?.title ?? preset.slug}</p>
                {tutorial && <p className="mt-0.5 text-xs text-slate-500">{tutorial.subtitle}</p>}
              </div>
            </button>
            <Link
              to={preset.tutorialSlug}
              className="mt-1 self-start px-1 text-[11px] text-slate-400 hover:text-blue-600"
            >
              {c.gallery.tutorial} →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
