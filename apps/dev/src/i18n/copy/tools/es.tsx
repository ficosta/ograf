import type { ToolsCopy } from "./en";
import { LINK } from "./styles";

export const es: ToolsCopy = {
  eyebrow: "Herramientas",
  title: "Crea, verifica y publica paquetes OGraf.",
  intro:
    "Un conjunto creciente de herramientas en el navegador para todos los que crean grafismos OGraf. Todo se ejecuta en tu navegador — sin registro, sin subir nada.",
  comingSoon: "Próximamente",
  tools: {
    check: {
      name: "Verificador de paquetes",
      tagline: "Valida un .zip antes de publicarlo.",
      description: (rules: number) =>
        `Suelta cualquier paquete OGraf y obtén un informe estructurado con ${rules} reglas sobre manifiesto, schema de datos (GDD), estructura, módulo, estilos, recursos y ejecución. Valida con el schema oficial de la EBU — en directo, con una copia offline fijada como respaldo. Se ejecuta por completo en tu navegador — sin subir nada.`,
      badge: "Nuevo",
      open: "Abrir el verificador de paquetes",
    },
    schema: {
      name: "Explorador de schema",
      tagline: "Recorre el schema de manifiesto OGraf en lenguaje claro.",
      description: () =>
        "Todos los campos de nivel superior de un manifiesto .ograf.json, agrupados en cinco bloques pensados para diseñadores, además de un catálogo visual de cada tipo de entrada del operador. Obtenido en directo del schema de la EBU, con una copia local como respaldo.",
      badge: undefined,
      open: "Abrir el explorador de schema",
    },
    generator: {
      name: "Generador de plantillas",
      tagline: "Crea la base de un nuevo paquete OGraf a partir de un preajuste.",
      description: () =>
        "Elige una base (rótulo inferior, mosca, ticker, …), ajusta unos cuantos campos y descarga un paquete listo para editar, con manifiesto, módulo, hoja de estilos y fuentes locales ya bien conectados.",
      badge: undefined,
      open: "Abrir el generador de plantillas",
    },
  },
  idea: (
    <>
      ¿Tienes una idea para una herramienta? Abre una issue en{" "}
      <a href="https://github.com/ficosta/ograf/issues" target="_blank" rel="noopener noreferrer" className={LINK}>
        GitHub
      </a>
      .
    </>
  ),
};
