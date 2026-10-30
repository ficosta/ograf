import type { Locale } from "../../i18n/locales";
import en from "../ecosystem.json";
import es from "../i18n/es/ecosystem.json";
import pt from "../i18n/pt/ecosystem.json";

export interface EcoItem {
  readonly name: string;
  readonly desc: string;
  readonly url: string;
  readonly type: "oss" | "commercial" | "official";
  readonly stars?: string;
  /** Path under /logos/. Falls back to a monogram tile when absent. */
  readonly logo?: string;
  /**
   * Support announced or being evaluated, but not shipping yet; or, for
   * "notYet", an HTML graphics platform with no OGraf support at all.
   */
  readonly status?: "soon" | "exploring" | "notYet";
}

export interface EcoCategoryJson {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly items: readonly EcoItem[];
  readonly featured?: boolean;
  /** Listed for context, not as OGraf tools: left out of the counts. */
  readonly outsideOGraf?: boolean;
}

/**
 * Ecosystem map per language: category names and descriptions and item
 * descriptions are translated; names, urls, logos, types and statuses are not.
 * Shape parity is enforced by scripts/check-i18n.mjs.
 */
export const ECOSYSTEM: Readonly<Record<Locale, readonly EcoCategoryJson[]>> = {
  en: en as readonly EcoCategoryJson[],
  pt: pt as readonly EcoCategoryJson[],
  es: es as readonly EcoCategoryJson[],
};
