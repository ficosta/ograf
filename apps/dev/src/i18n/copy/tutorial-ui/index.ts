import type { Locale } from "../../locales";
import { en, type TutorialUiCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const TUTORIAL_UI_COPY: Readonly<Record<Locale, TutorialUiCopy>> = { en, pt, es };
