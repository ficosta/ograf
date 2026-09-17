import { Link } from "../../Link";
import type { CheckCopy } from "./en";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const es: CheckCopy = {
  findingsNote: "Los resultados de la verificación (títulos y mensajes de las reglas) se muestran en inglés.",
  categories: {
    manifest: "Manifiesto",
    gdd: "Schema de datos (GDD)",
    structure: "Estructura del paquete",
    module: "Módulo del grafismo",
    styling: "Estilos",
    assets: "Recursos",
    runtime: "Ejecución",
  },
  rules: (n) => plural(n, "regla", "reglas"),

  page: {
    failedPackage: "No se ha podido verificar el paquete.",
    failedFolder: "No se ha podido verificar la carpeta.",
    consentTitle: "¿Ejecutar el grafismo en una sandbox?",
    consentConfirm: "Ejecutar",
    consentCancel: "Ahora no",
    consentBody: [
      "Esto ejecuta el JavaScript que contiene el .zip que has soltado, en un iframe aislado (sandbox) dentro de esta página. Hazlo solo con un paquete de confianza.",
      "No se sube nada: el código se ejecuta en tu navegador y los resultados se quedan ahí. Recordaremos tu elección en este dispositivo.",
    ],
    allTools: "Todas las herramientas",
    eyebrow: "Herramienta",
    title: "Verificador de paquetes OGraf.",
    intro: (
      <>
        Suelta cualquier <code className="font-mono text-base">.zip</code> de OGraf y obtén un informe estructurado. Las reglas estáticas se ejecutan al instante; cuando lo pidas, una sandbox de ejecución monta el grafismo y pone a prueba su ciclo de vida. Todo se queda en tu navegador.
      </>
    ),
    runTitle: "Ejecutar en la sandbox",
    runDesc:
      "Monta el grafismo en un iframe aislado y prueba load / play / update / stop / customAction / dispose, además de goToTime y setActionsSchedule cuando el manifiesto declara soporte para no tiempo real. Añade resultados de ejecución al informe.",
    checkedTitle: "Qué se verifica",
    allRules: (n) => `Las ${n} reglas por id →`,
    checked: {
      manifest: {
        label: "Manifiesto",
        desc: "Validado contra el schema de la EBU publicado en línea (draft-2020-12), forma de customActions, puntero `main`, vigencia del $schema, semver; además de comprobaciones entre campos que un schema campo a campo no puede hacer: duraciones que nombran una customAction no declarada, requisitos de renderizado imposibles de cumplir, miniaturas que faltan.",
      },
      gdd: {
        label: "Schema de datos (GDD)",
        desc: "Tipos de campo y restricciones de gddType, gddOptions obligatorias, los patrones que fija la especificación para los colores, etiquetas para todas las opciones de un select y valores por defecto que encajan con el tipo, enum, límites y patrón de su propio campo.",
      },
      structure: {
        label: "Estructura del paquete",
        desc: "Una sola carpeta de nivel superior, README / LICENSE / preview presentes, recursos referenciados incluidos, sin basura del sistema operativo, avisos de archivos grandes.",
      },
      module: {
        label: "Módulo del grafismo",
        desc: "Clase HTMLElement como export por defecto, seis métodos del ciclo de vida, el par de no tiempo real cuando el manifiesto lo declara, sin `customElements.define` hecho por el propio módulo, sin `document` en el nivel superior, URL relativas compatibles con Shadow DOM.",
      },
      styling: {
        label: "Estilos",
        desc: "Detección de `position: fixed`, `@import` / `@font-face` remotos, aviso de selector `body`, fuente alternativa en font-family, consejos de portabilidad para Shadow DOM.",
      },
      assets: {
        label: "Recursos",
        desc: "Imagen de preview en 16:9 (decodificada a partir de los bytes), fuentes incluidas con su licencia, imágenes demasiado grandes, extensiones desconocidas.",
      },
      runtime: {
        label: "Ejecución (opcional)",
        desc: "Monta el grafismo en un iframe aislado, recorre todo el ciclo de vida de OGraf, incluidos goToTime y setActionsSchedule cuando están declarados, y registra tiempos, valores devueltos, consola y errores no capturados.",
      },
    },
    noUpload: "No se sube nada: todo se ejecuta en tu navegador.",
    optIn: "La sandbox de ejecución ejecuta el código del paquete; hace falta hacer clic para autorizarlo.",
  },

  rulesPage: {
    back: "Verificador de paquetes",
    eyebrow: "Referencia",
    title: "Reglas del verificador.",
    intro: (total, categories) =>
      `Las ${total} reglas, en ${categories} categorías. Los informes citan estos ids, así que aquí es donde puedes consultarlos. La lista se genera a partir del propio código del verificador en cada build, así que no puede desfasarse respecto a lo que realmente se ejecuta.`,
    prefix: {
      manifest: "M — el propio .ograf.json, validado contra el schema de la EBU y después entre sus propios campos.",
      gdd: "G — el schema de datos con el que los controladores construyen los formularios del operador.",
      structure: "S — qué contiene el paquete y cómo está organizado.",
      module: "C — el código del módulo del grafismo: exports, ciclo de vida, portabilidad.",
      styling: "X — reglas de CSS que deciden si un grafismo sobrevive a otro renderizador.",
      assets: "A — imágenes, fuentes y las licencias que deben acompañarlas.",
      runtime: "R — comprobaciones hechas mientras el grafismo se ejecuta de verdad en la sandbox.",
    },
    footer: (
      <>
        Una regla sin descripción genera más de un tipo de resultado, y su mensaje indica cuál.
        Pasa un paquete por el{" "}
        <Link to="/check" className="text-blue-600 hover:underline">
          verificador
        </Link>{" "}
        para verlas en contexto.
      </>
    ),
  },

  summary: {
    meta: (kb, ms) => `${kb} KB · verificado en ${ms} ms`,
    shareHint:
      "Copia un enlace que contiene el informe completo. No se sube nada: el informe viaja dentro del fragmento de la URL.",
    copied: "Enlace copiado",
    tooLarge: "Demasiado grande para un enlace",
    copyLink: "Copiar enlace",
    download: "Informe.md",
    tryAnother: "Probar otro",
    errors: "Errores",
    warnings: "Avisos",
    info: "Info",
    passed: "Superadas",
  },

  results: {
    checks: (n) => plural(n, "comprobación", "comprobaciones"),
  },

  finding: {
    spec: "especificación",
  },

  schema: {
    live: "Validado contra el schema de la EBU publicado en línea",
    bundled: "Validado contra la copia del schema incluida en la web",
    bundledNote: () => "No se ha podido acceder al schema en línea; se ha usado la copia incluida.",
    fetched: (time) => `· obtenido el ${time}`,
    dateLocale: "es-ES",
  },

  dropZone: {
    busyTitle: "Verificando...",
    idleTitle: "Suelta aquí tu .zip de OGraf",
    busyHint: "Solo tarda un momento.",
    idleHint: "o haz clic en cualquier parte de este recuadro para elegir un archivo",
    local: "se queda en tu navegador · no se sube nada",
    folder: "o verifica una carpeta descomprimida",
  },

  runtime: {
    title: "Sandbox de ejecución",
    desc: "El grafismo se ejecuta en un iframe aislado, con el paquete servido por un service worker dentro del navegador. No se sube nada.",
    booting: "arrancando la sandbox...",
    running: "ejecutando...",
    iframeTitle: "Sandbox de ejecución de OGraf",
    preparing: "Preparando la sandbox...",
    failedTitle: "La sandbox no ha arrancado",
    noMain: "Este paquete no declara un módulo `main` en el manifiesto.",
    initFailed: "la sandbox no se ha podido inicializar",
    timeline: "Cronología del ciclo de vida",
    controls: {
      load: "cargar",
      play: "reproducir",
      update: "actualizar",
      stop: "detener",
      dispose: "descartar",
    },
  },

  timeline: {
    running: "Ejecutando...",
    empty: "Aún no hay llamadas del ciclo de vida. La prueba automática empieza en cuanto la sandbox está lista, o usa los controles para llamar a los métodos a mano.",
  },

  console: {
    title: "Consola de la sandbox",
    empty: "Aún no se ha capturado salida de consola ni errores.",
  },

  dataForm: {
    noSchema: "Este grafismo no declara un schema de datos, así que el operador no tiene nada que rellenar.",
    heading: "Datos — lo que escribiría un operador",
    reset: "Restablecer valores por defecto",
    asJson: (type) => `· ${type}, editado como JSON`,
  },
};
