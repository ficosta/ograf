import { LOCALE_TAGS, type Locale } from "../../locales";

/**
 * Dates in content are ISO strings ("2026-08-13" or full timestamps). They are
 * formatted in UTC so a date-only value never slips to the previous day west
 * of Greenwich, and with an explicit locale so the prerender and the browser
 * render the same text.
 */
const SHORT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

function fmt(locale: Locale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { ...options, timeZone: "UTC" });
}

/** "Aug 13, 2026" · "13 de ago. de 2026" · "13 ago 2026" */
export function formatDate(iso: string, locale: Locale): string {
  return fmt(locale, SHORT).format(new Date(iso));
}

/** A single day, or a start–end range, in the locale's own range style. */
export function formatEventDate(start: string, end: string | undefined, locale: Locale): string {
  const s = new Date(start);
  if (!end) return formatDate(start, locale);
  const e = new Date(end);
  if (locale === "en") {
    const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
    if (sameMonth) {
      // A bare { day, year } request is not idiomatic: Chrome emits
      // "2026 (day: 14)" for it. Ask only for combinations it renders well.
      const startPart = fmt(locale, { month: "short", day: "numeric" }).format(s);
      const endDay = fmt(locale, { day: "numeric" }).format(e);
      const year = fmt(locale, { year: "numeric" }).format(e);
      return `${startPart} – ${endDay}, ${year}`;
    }
    return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
  }
  // formatRange collapses the shared month/year ("11–14 sept 2026"); ICU pads
  // the dash with thin spaces, which we normalise to regular ones.
  return fmt(locale, SHORT).formatRange(s, e).replace(/ /g, " ");
}
