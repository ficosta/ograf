import type { Locale } from "../../locales";
import { en, type UiCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const UI_COPY: Readonly<Record<Locale, UiCopy>> = { en, pt, es };
