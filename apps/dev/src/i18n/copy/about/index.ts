import type { Locale } from "../../locales";
import { en, type AboutCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const ABOUT_COPY: Readonly<Record<Locale, AboutCopy>> = { en, pt, es };
