import type { Locale } from "../../locales";
import { en, type GeneratorCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

/** Template Generator page and its forms, preview, check and download panels. */
export const GENERATOR_COPY: Readonly<Record<Locale, GeneratorCopy>> = { en, pt, es };
export type { GeneratorCopy } from "./en";
