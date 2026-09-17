import { buildSchemaLanguage, type SchemaLanguage } from "../../../content/schema-language";
import type { Locale } from "../../locales";
import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";

/** Manifest fields and GDD types, merged with each locale's prose. */
export const SCHEMA_LANGUAGE: Readonly<Record<Locale, SchemaLanguage>> = {
  en: buildSchemaLanguage(en),
  pt: buildSchemaLanguage(pt),
  es: buildSchemaLanguage(es),
};
