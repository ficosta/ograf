import type { Locale } from "../../locales";
import { en, type HistoryCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export type { HistoryCategory } from "./en";
export const HISTORY_COPY: Readonly<Record<Locale, HistoryCopy>> = { en, pt, es };
