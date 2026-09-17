import type { HistoryCopy } from "./en";

export const es: HistoryCopy = {
  title: "Cómo ha llegado OGraf hasta aquí.",
  lead: "Cada decisión, propuesta y corrección importante que dio forma a la especificación — directamente de las discusiones cerradas del grupo de trabajo en GitHub. Despliega cualquier entrada para leer el hilo original.",
  viewSource: "Ver la fuente original en GitHub",
  stats: {
    resolved: "Resueltas",
    shipped: "Publicadas",
    window: "Periodo",
  },
  categories: {
    graphics: "Grafismos",
    manifest: "Manifiesto",
    gddData: "GDD / Datos",
    bugFixes: "Correcciones",
    other: "Otros",
  },
  ctaTitle: "¿Quieres ayudar a decidir lo que viene?",
  ctaBody:
    "Las discusiones abiertas, las propuestas y el trabajo en curso están en el repositorio OGraf de la EBU. Cualquiera puede leer, comentar y contribuir.",
  ctaButton: "Únete a la discusión en GitHub",
  card: {
    merged: (pr: number) => `Fusionado en #${pr}`,
    toggle: (expanded: boolean) => `${expanded ? "Ocultar" : "Leer"} discusión`,
    comments: (n: number) => `(${n} ${n === 1 ? "comentario" : "comentarios"})`,
    opened: "abrió esta discusión",
  },
};
