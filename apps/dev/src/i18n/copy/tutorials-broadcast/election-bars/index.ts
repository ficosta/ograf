import type { Locale } from "../../../locales";
import { en, type ElectionBarsCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const ELECTION_BARS_COPY: Readonly<Record<Locale, ElectionBarsCopy>> = { en, pt, es };
