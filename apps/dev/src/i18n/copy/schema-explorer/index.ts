import type { Locale } from "../../locales";
import { en, type SchemaExplorerCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export type { SchemaExplorerCopy };

/** Schema Explorer page, its cards, the source badge and the AI helper. */
export const SCHEMA_EXPLORER_COPY: Readonly<Record<Locale, SchemaExplorerCopy>> = { en, pt, es };
