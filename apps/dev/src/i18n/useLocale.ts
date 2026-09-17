import { useLocation } from "react-router";
import { localeFromPath, localizePath, type Locale } from "./locales";
import { messages, type Messages } from "./messages";

/**
 * The locale comes straight from the URL, so there is no provider to keep in
 * sync and the prerender (StaticRouter) and the client agree by construction.
 */
export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname);
}

/** Shared UI strings (nav, footer, buttons) for the current locale. */
export function useT(): Messages {
  return messages[useLocale()];
}

/**
 * Page copy kept per language: `const c = useCopy({ en, pt, es })`.
 * Requiring all three keys is what makes a missing translation a type error.
 */
export function useCopy<T>(copies: Readonly<Record<Locale, T>>): T {
  return copies[useLocale()];
}

/** Localize an internal path for the current locale. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path) => localizePath(path, locale);
}
