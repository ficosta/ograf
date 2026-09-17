import type { Locale } from "../../locales";
import { en, type GetStartedCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const GET_STARTED_COPY: Readonly<Record<Locale, GetStartedCopy>> = { en, pt, es };
