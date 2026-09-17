import type { Locale } from "../../locales";
import { en, type HomeCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const HOME_COPY: Readonly<Record<Locale, HomeCopy>> = { en, pt, es };
