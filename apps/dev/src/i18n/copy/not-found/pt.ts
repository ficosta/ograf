import type { NotFoundCopy } from "./en";

export const pt: NotFoundCopy = {
  eyebrow: "404 · Página não encontrada",
  title: "Essa página não está aqui.",
  lead: "Ela pode ter mudado de lugar, sido renomeada ou nunca ter existido. Tente um destes pontos de partida:",
  links: [
    { to: "/", title: "Início", desc: "A apresentação rápida e o ecossistema num relance." },
    { to: "/tutorials", title: "Tutoriais", desc: "Onze grafismos para broadcast que você pode construir hoje." },
    { to: "/spec", title: "Especificação", desc: "Como o OGraf funciona, explicado de forma simples." },
    { to: "/ecosystem", title: "Ecossistema", desc: "Todas as ferramentas, editores e renderizadores que vale a pena conhecer." },
  ],
  stuck: "Ainda perdido?",
  openIssue: "abra uma issue no GitHub",
  stuckEnd: ".",
};
