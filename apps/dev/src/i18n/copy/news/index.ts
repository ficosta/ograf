import type { Locale } from "../../locales";
import { en, type NewsCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const NEWS_COPY: Readonly<Record<Locale, NewsCopy>> = { en, pt, es };
