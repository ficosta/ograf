import type { Locale } from "../../../locales";
import { en, type SportLineupCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const SPORT_LINEUP_COPY: Readonly<Record<Locale, SportLineupCopy>> = { en, pt, es };
