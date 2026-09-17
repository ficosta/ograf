import type { Locale } from "../../locales";
import { en, type TutorialQuoteCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const TUTORIAL_QUOTE_COPY: Readonly<Record<Locale, TutorialQuoteCopy>> = { en, pt, es };
