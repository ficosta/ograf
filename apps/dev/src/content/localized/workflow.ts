import type { Locale } from "../../i18n/locales";
import type { Workflow } from "../workflow.types";
import en from "../workflow.json";
import es from "../i18n/es/workflow.json";
import pt from "../i18n/pt/workflow.json";

/** Spec-page workflow diagram per language. Shape parity is enforced by scripts/check-i18n.mjs. */
export const WORKFLOW: Readonly<Record<Locale, Workflow>> = { en, pt, es };
