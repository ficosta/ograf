import type { Locale } from "../../i18n/locales";
import type { FaqEntry } from "../faq.types";
import en from "../faq.json";
import es from "../i18n/es/faq.json";
import pt from "../i18n/pt/faq.json";

/** Homepage FAQ per language. Shape parity is enforced by scripts/check-i18n.mjs. */
export const FAQ: Readonly<Record<Locale, readonly FaqEntry[]>> = { en, pt, es };
