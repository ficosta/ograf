import { Link as RouterLink, useLocation } from "react-router";
import { LOCALES, LOCALE_NAMES, LOCALE_TAGS, localizePath } from "../i18n/locales";
import { useLocale, useT } from "../i18n/useLocale";

/**
 * Same page, other language. Plain links rather than a select, so crawlers
 * follow them and the choice works without JavaScript on the prerendered HTML.
 */
export function LanguageSwitcher({ onNavigate }: { readonly onNavigate?: () => void }) {
  const { pathname, search, hash } = useLocation();
  const current = useLocale();
  const t = useT();

  return (
    <nav aria-label={t.nav.language} className="flex items-center gap-1 text-sm">
      {LOCALES.map((locale) => {
        const active = locale === current;
        return (
          <RouterLink
            key={locale}
            to={`${localizePath(pathname, locale)}${search}${hash}`}
            hrefLang={LOCALE_TAGS[locale]}
            lang={LOCALE_TAGS[locale]}
            title={LOCALE_NAMES[locale]}
            aria-current={active ? "true" : undefined}
            onClick={onNavigate}
            className={
              active
                ? "rounded-md px-1.5 py-0.5 font-semibold uppercase text-slate-900"
                : "rounded-md px-1.5 py-0.5 uppercase text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }
          >
            {locale}
          </RouterLink>
        );
      })}
    </nav>
  );
}
