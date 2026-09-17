import type { Locale } from "../../i18n/locales";
import { SPEC_HISTORY, mergeSpecHistory, type SpecHistoryEntry, type SpecSummary } from "../specHistory";
import es from "../i18n/es/specSummaries.json";
import pt from "../i18n/pt/specSummaries.json";

/**
 * Spec history per language. GitHub titles, bodies and comments stay as
 * written; only our summaries are translated (specSummaries.json).
 */
export const SPEC_HISTORY_LOCALIZED: Readonly<Record<Locale, readonly SpecHistoryEntry[]>> = {
  en: SPEC_HISTORY,
  pt: mergeSpecHistory(pt as Record<string, SpecSummary>),
  es: mergeSpecHistory(es as Record<string, SpecSummary>),
};
