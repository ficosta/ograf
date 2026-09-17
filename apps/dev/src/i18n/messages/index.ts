import type { Locale } from "../locales";
import { en, type Messages } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export type { Messages };

export const messages: Readonly<Record<Locale, Messages>> = { en, pt, es };
