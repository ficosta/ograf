import type { Locale } from "../../locales";

export interface WorkflowCopy {
  readonly eyebrow: string;
  readonly step: (n: number) => string;
}

export const WORKFLOW_COPY: Readonly<Record<Locale, WorkflowCopy>> = {
  en: { eyebrow: "The OGraf workflow", step: (n) => `Step ${n}` },
  pt: { eyebrow: "O fluxo de trabalho OGraf", step: (n) => `Etapa ${n}` },
  es: { eyebrow: "El flujo de trabajo OGraf", step: (n) => `Etapa ${n}` },
};
