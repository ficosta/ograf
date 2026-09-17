import type { TutorialUiCopy } from "./en";
import { CHECK_LINK } from "./styles";

export const es: TutorialUiCopy = {
  demo: {
    loadingPreview: "Cargando la vista previa…",
    previewLabel: (title: string) => `${title} — vista previa interactiva`,
    array: "array",
    itemCount: (n: number) => `${n} ${n === 1 ? "elemento" : "elementos"}`,
    removeItem: (n: number) => `Quitar el elemento ${n}`,
    addItem: "Añadir elemento",
    invalidJson: "JSON no válido",
    playMode: "Modo de reproducción",
    runOnce: "Una sola vez",
    loop: "En bucle",
    fixJsonBeforePlaying: "Corrige el campo JSON antes de reproducir",
    fixJsonBeforeUpdating: "Corrige el campo JSON antes de actualizar",
    play: "Reproducir",
    update: "Actualizar",
    stop: "Detener",
  },
  download: {
    heading: (title: string) => `Descarga el paquete completo: ${title}`,
    intro: "Un paquete OGraf Graphics Definition v1 real. Un renderizador compatible lee el manifiesto y gestiona el ciclo de vida. Con licencia MIT; úsalo en cualquier sistema compatible con OGraf.",
    files: {
      manifest: "Manifiesto — lo que lee el renderizador (id, schema, flags del ciclo de vida)",
      graphic: "Web Component con load / play / update / stop / customAction / dispose",
      style: "Hoja de estilos, cargada por graphic.mjs mediante una etiqueta <link>",
      thumbnail: "Vista previa de 1920×1080, declarada en el manifiesto",
      readme: "Notas de uso",
      license: "MIT",
    },
    button: (slug: string) => `Descargar ${slug}.zip`,
    note: (checkHref: string) => (
      <>
        MIT · fuentes incluidas · suéltalo en <a href={checkHref} className={CHECK_LINK}>/check</a> para validarlo
      </>
    ),
    renderersHeading: "Despliégalo en un renderizador OGraf compatible",
    renderers: {
      "ograf-server": "Renderizador de referencia con API de subida y control. Alójalo tú mismo.",
      "SPX-GC": "Controlador de grafismo profesional en el navegador, compatible con OGraf.",
      CasparCG: "Servidor de playout de código abierto — renderiza OGraf mediante el HTML producer.",
    },
  },
  manifestHeading: "El manifiesto",
};
