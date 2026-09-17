import type { Locale } from "../../locales";
import { en, type ToolsCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const TOOLS_COPY: Readonly<Record<Locale, ToolsCopy>> = { en, pt, es };
