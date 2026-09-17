import type { Locale } from "../../locales";
import { en, type SpecCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const SPEC_COPY: Readonly<Record<Locale, SpecCopy>> = { en, pt, es };
export type { SpecCopy };
