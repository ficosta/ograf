import type { TutorialsCopy } from "./en";

export const pt: TutorialsCopy = {
  eyebrow: "Tutoriais",
  title: "Aprenda criando grafismos de verdade.",
  intro:
    "Cada tutorial constrói do zero um grafismo para broadcast com qualidade de produção. Demos ao vivo com as quais você pode interagir, código-fonte completo e explicações passo a passo. Comece pelo lower third e depois explore padrões mais complexos.",
  demoTitle: (tutorial) => `${tutorial} — template OGraf`,
  startThis: "Começar este tutorial",
  ideaTitle: "Tem uma ideia de tutorial?",
  ideaBody:
    "Estamos sempre procurando novos tipos de grafismo para cobrir — placares, tickers, visualizações de dados, overlays de AR ou qualquer coisa que você tenha visto no ar e queira aprender a construir.",
  suggest: "Sugerir um tutorial no GitHub",
  cards: {
    moreTutorials: "Mais tutoriais",
    viewAll: (n) => `Ver todos os ${n}`,
    previewAlt: (tutorial) => `Prévia: ${tutorial}`,
  },
};
