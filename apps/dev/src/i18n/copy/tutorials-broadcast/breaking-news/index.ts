import type { Locale } from "../../../locales";
import { en, type BreakingNewsCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const BREAKING_NEWS_COPY: Readonly<Record<Locale, BreakingNewsCopy>> = { en, pt, es };
