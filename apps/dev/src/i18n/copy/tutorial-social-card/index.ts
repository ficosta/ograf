import type { Locale } from "../../locales";
import { en, type TutorialSocialCardCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const TUTORIAL_SOCIAL_CARD_COPY: Readonly<Record<Locale, TutorialSocialCardCopy>> = { en, pt, es };
