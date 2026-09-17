import type { Locale } from "../../locales";
import { en, type CheckCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const CHECK_COPY: Readonly<Record<Locale, CheckCopy>> = { en, pt, es };
export type { CheckCopy } from "./en";
