import type { Locale } from "../../i18n/locales";
import type { Tutorial } from "../tutorials.types";
import en from "../tutorials.json";
import es from "../i18n/es/tutorials.json";
import pt from "../i18n/pt/tutorials.json";

/**
 * Tutorial cards and the /tutorials list per language. Slugs, previews and
 * demo `defaultValue`s are identical in every language (demo data stays as
 * the template ships it); shape parity is enforced by scripts/check-i18n.mjs.
 */
export const TUTORIALS = { en, pt, es } as Readonly<Record<Locale, readonly Tutorial[]>>;
