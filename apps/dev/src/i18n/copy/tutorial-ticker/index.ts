import type { Locale } from "../../locales";
import { en, type TutorialTickerCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const TUTORIAL_TICKER_COPY: Readonly<Record<Locale, TutorialTickerCopy>> = { en, pt, es };
