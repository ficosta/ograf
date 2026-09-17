import type { Locale } from "../../../locales";
import { en, type ScoreBugCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const SCORE_BUG_COPY: Readonly<Record<Locale, ScoreBugCopy>> = { en, pt, es };
