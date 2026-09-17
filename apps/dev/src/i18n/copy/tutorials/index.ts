import type { Locale } from "../../locales";
import { en, type TutorialsCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const TUTORIALS_COPY: Readonly<Record<Locale, TutorialsCopy>> = { en, pt, es };
