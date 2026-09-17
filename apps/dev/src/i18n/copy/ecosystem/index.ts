import type { Locale } from "../../locales";
import { en, type EcosystemCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const ECOSYSTEM_COPY: Readonly<Record<Locale, EcosystemCopy>> = { en, pt, es };
