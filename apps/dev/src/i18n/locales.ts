/**
 * The languages ograf.dev is published in, and how a URL maps to one.
 *
 * English lives at the root ("/tutorials") so every link shared before the
 * translations existed keeps working. The others sit under a prefix
 * ("/pt/tutorials", "/es/tutorials"), which gives each language its own
 * prerendered, indexable page instead of a client-side toggle crawlers
 * never see.
 */

export const LOCALES = ["en", "pt", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** BCP 47 tags for <html lang>, hreflang and og:locale. */
export const LOCALE_TAGS: Readonly<Record<Locale, string>> = {
  en: "en",
  pt: "pt-BR",
  es: "es-ES",
};

export const OG_LOCALES: Readonly<Record<Locale, string>> = {
  en: "en_US",
  pt: "pt_BR",
  es: "es_ES",
};

/** Each language named in itself, for the switcher. */
export const LOCALE_NAMES: Readonly<Record<Locale, string>> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** "/pt/spec" → "pt"; "/spec" → "en". */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/** "/pt/spec" → "/spec"; "/pt" → "/". */
export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (locale === DEFAULT_LOCALE) return pathname;
  const rest = pathname.slice(locale.length + 1);
  return rest === "" ? "/" : rest;
}

/**
 * Put an unprefixed, absolute site path into `locale`: ("/spec", "pt") →
 * "/pt/spec". Anything that is not a site path — "#anchor", "https://…",
 * "mailto:", relative paths — comes back untouched, as do static files
 * (templates, downloads, docs), which are the same in every language.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (isStaticAsset(path)) return path;
  const bare = stripLocale(path);
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

const STATIC_PREFIXES = ["/templates/", "/downloads/", "/docs/", "/logos/"];

function isStaticAsset(path: string): boolean {
  if (STATIC_PREFIXES.some((p) => path.startsWith(p))) return true;
  const lastSegment = path.split(/[?#]/)[0]?.split("/").pop() ?? "";
  return lastSegment.includes(".");
}
