import type { HistoryCopy } from "./en";

export const pt: HistoryCopy = {
  title: "Como o OGraf chegou até aqui.",
  lead: "Cada decisão, proposta e correção importante que moldou a especificação — direto das discussões encerradas do grupo de trabalho no GitHub. Expanda qualquer item para ler a discussão original.",
  viewSource: "Ver a fonte original no GitHub",
  stats: {
    resolved: "Resolvidas",
    shipped: "Entregues",
    window: "Período",
  },
  categories: {
    graphics: "Grafismos",
    manifest: "Manifesto",
    gddData: "GDD / Dados",
    bugFixes: "Correções",
    other: "Outros",
  },
  ctaTitle: "Quer ajudar a definir o que vem a seguir?",
  ctaBody:
    "Discussões abertas, propostas e trabalho em andamento ficam no repositório OGraf da EBU. Qualquer pessoa pode ler, comentar e contribuir.",
  ctaButton: "Participe da discussão no GitHub",
  card: {
    merged: (pr: number) => `Merge via #${pr}`,
    toggle: (expanded: boolean) => `${expanded ? "Ocultar" : "Ler"} discussão`,
    comments: (n: number) => `(${n} ${n === 1 ? "comentário" : "comentários"})`,
    opened: "abriu esta discussão",
  },
};
