import type { Locale } from "../../../locales";
import { en, type CountdownCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const COUNTDOWN_COPY: Readonly<Record<Locale, CountdownCopy>> = { en, pt, es };
