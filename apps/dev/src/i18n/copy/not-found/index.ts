import type { Locale } from "../../locales";
import { en, type NotFoundCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const NOT_FOUND_COPY: Readonly<Record<Locale, NotFoundCopy>> = { en, pt, es };
