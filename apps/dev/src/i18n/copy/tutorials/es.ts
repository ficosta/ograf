import type { TutorialsCopy } from "./en";

export const es: TutorialsCopy = {
  eyebrow: "Tutoriales",
  title: "Aprende creando grafismos reales.",
  intro:
    "Cada tutorial construye desde cero un grafismo para televisión con calidad de producción. Demos en directo con las que puedes interactuar, código fuente completo y explicaciones paso a paso. Empieza por el rótulo inferior y luego explora patrones más complejos.",
  demoTitle: (tutorial) => `${tutorial} — plantilla OGraf`,
  startThis: "Empezar este tutorial",
  ideaTitle: "¿Tienes una idea para un tutorial?",
  ideaBody:
    "Siempre buscamos nuevos tipos de grafismo que cubrir: marcadores, tickers, visualizaciones de datos, overlays de AR o cualquier cosa que hayas visto en antena y quieras aprender a construir.",
  suggest: "Sugerir un tutorial en GitHub",
  cards: {
    moreTutorials: "Más tutoriales",
    viewAll: (n) => `Ver los ${n}`,
    previewAlt: (tutorial) => `Vista previa: ${tutorial}`,
  },
};
