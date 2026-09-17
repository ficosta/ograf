import type { Locale } from "../../locales";
import { en, type TutorialBugCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const TUTORIAL_BUG_COPY: Readonly<Record<Locale, TutorialBugCopy>> = { en, pt, es };
