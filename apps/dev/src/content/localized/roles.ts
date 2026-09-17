import type { Locale } from "../../i18n/locales";
import type { Role } from "../roles.types";
import en from "../roles.json";
import es from "../i18n/es/roles.json";
import pt from "../i18n/pt/roles.json";

/** Homepage role cards per language. Shape parity is enforced by scripts/check-i18n.mjs. */
export const ROLES = { en, pt, es } as Readonly<Record<Locale, readonly Role[]>>;
