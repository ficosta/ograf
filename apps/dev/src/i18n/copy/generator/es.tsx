import type { GeneratorCopy } from "./en";

export const es: GeneratorCopy = {
  page: {
    allTools: "Todas las herramientas",
    eyebrow: "Generador de plantillas",
    title: "Crea un nuevo paquete OGraf a partir de un preset.",
    intro:
      "Elige una base, ponle nombre y tus colores, mírala funcionar en directo y descarga un paquete válido según la especificación, con manifiesto, módulo, hoja de estilos y fuentes locales ya conectados. Cada descarga pasa antes por el verificador de paquetes.",
    noUpload: "Todo se ejecuta en tu navegador. No se sube nada.",
    loading: "Cargando la plantilla base…",
    loadFailed: "No se pudo cargar la plantilla base. Comprueba la conexión y recarga la página.",
    buildFailed: "No se pudo construir el paquete con esta configuración.",
  },

  steps: {
    preset: "Preset",
    identity: "Identidad",
    look: "Aspecto",
    data: "Datos por defecto",
    output: "Vista previa, comprobación y descarga",
  },

  gallery: {
    title: "Elige una base",
    intro:
      "Cada preset es una de las plantillas hechas a mano para los tutoriales: un Web Component con el ciclo de vida completo, fuentes locales y una miniatura en 1080p. Tus elecciones se aplican a los archivos reales.",
    selected: "Seleccionado",
    tutorial: "Tutorial",
  },

  identity: {
    title: "Identidad del paquete",
    intro: "Lo que ven un renderizador y un operador cuando buscan este grafismo.",
    name: "Nombre",
    nameHint: "Se muestra en las interfaces de los controladores. También da nombre a la carpeta y al archivo del manifiesto.",
    id: "Id del paquete",
    idHint:
      "Debe ser único. Se permite cualquier carácter salvo “/”; la especificación recomienda la notación de dominio inverso, como com.mi-empresa.mi-rotulo.",
    idDerived: "Derivado de la URL del autor y del nombre hasta que lo edites.",
    idDerive: "Derivar del nombre otra vez",
    version: "Versión",
    versionHint: "Versión semántica, p. ej. 1.0.0. Los renderizadores ordenan las versiones alfabéticamente.",
    description: "Descripción",
    descriptionHint: "Opcional, pero los controladores la muestran en las galerías.",
    authorName: "Autor",
    authorNameHint: "Opcional. Obligatorio si indicas una URL.",
    authorUrl: "URL del autor",
    authorUrlHint: "Opcional. También define el prefijo del id: https://acme.tv → tv.acme.",
    files: (slug: string, manifest: string) => `Descarga: ${slug}/ con ${manifest}`,
    issues: {
      nameRequired: "Dale un nombre al paquete.",
      nameTooLong: "Mantén el nombre por debajo de 120 caracteres.",
      idRequired: "El id es obligatorio.",
      idSlash: "La especificación prohíbe “/” en un id.",
      idWhitespace: "Quita los espacios del id.",
      idNotReverseDns: "Es válido, pero se recomienda la notación de dominio inverso (com.empresa.grafismo).",
      versionRequired: "La versión es obligatoria.",
      versionNotSemver: "Usa una versión semántica, como 1.0.0 o 2.1.0-beta.1.",
      authorUrlInvalid: "Usa una URL http(s) completa.",
      authorNameRequiredWithUrl: "Un autor con URL también necesita nombre; el schema lo exige.",
      colorInvalid: "Usa un color hexadecimal de seis dígitos, como #2563eb.",
      offsetRange: "Usa un número entero entre 0 y 600.",
    },
  },

  look: {
    title: "Aspecto",
    intro:
      "Los colores, la fuente del texto y la posición se convierten en propiedades personalizadas de CSS al principio de style.css, así que la descarga es un paquete con tema que puedes seguir retocando a mano.",
    colors: {
      accent: "Acento",
      ink: "Texto",
      surface: "Panel",
      live: "Punto EN DIRECTO",
      alert: "Alerta",
      urgent: "Urgente",
      backdrop: "Fondo",
      overlay: "Superposición",
    },
    colorsHint: "Los extremos de los degradados y los tonos claros se derivan del acento automáticamente.",
    font: "Fuente del texto",
    fontOptions: {
      inter: "Inter — peso variable, incluida",
      "instrument-serif": "Instrument Serif — editorial, incluida",
      system: "Fuente del sistema — sin archivos de fuente",
    },
    fontNotes: {
      inter: "Un único archivo variable cubre todos los pesos. La licencia viaja en fonts/.",
      "instrument-serif": "Regular y cursiva en un solo peso; la negrita la sintetiza el renderizador. La licencia viaja en fonts/.",
      system: "Cada renderizador usa su propia fuente de interfaz, así que el aspecto varía entre máquinas.",
    },
    offsets: {
      offsetX: "Margen horizontal",
      offsetY: "Margen vertical",
    },
    offsetsHint: "Distancia al borde de la pantalla en píxeles, a 1920 × 1080. El área segura de broadcast empieza en torno a los 48 px.",
    offsetsNone: "Este preset ocupa todo el cuadro, así que no hay posición que ajustar.",
    reset: "Restablecer aspecto",
  },

  data: {
    title: "Datos por defecto",
    intro:
      "Con qué viene rellenado el formulario del operador. Se escribe en el schema del manifiesto como el default de cada campo, para que los controladores y la vista previa partan de los mismos valores.",
  },

  preview: {
    title: "Vista previa en directo",
    desc: "El graphic.mjs generado se ejecuta a 1920 × 1080 dentro de un iframe aislado, servido por un service worker en el navegador, exactamente como lo haría un renderizador.",
    booting: "iniciando…",
    running: "ejecutando…",
    iframeTitle: "Vista previa del grafismo generado",
    preparing: "Preparando la vista previa…",
    failedTitle: "La vista previa no arrancó",
    unsupported: "La vista previa en directo necesita un navegador con service workers. La descarga sigue funcionando.",
    controls: {
      play: "play",
      stop: "stop",
      update: "update",
      replay: "repetir",
    },
    background: {
      label: "Fondo",
      dark: "Oscuro",
      light: "Claro",
      checker: "Damero",
    },
    facts: {
      stepCount: (n: number) => (n === 0 ? "sale solo (stepCount 0)" : n === 1 ? "play / stop (stepCount 1)" : `${n} pasos`),
      customActions: (n: number) => `${n} ${n === 1 ? "acción personalizada" : "acciones personalizadas"}`,
      realTime: "tiempo real",
    },
  },

  validation: {
    title: "Comprobación del paquete",
    desc: "Las mismas reglas del verificador de paquetes, aplicadas al zip exacto que vas a descargar.",
    running: "comprobando…",
    clean: "Sin errores ni avisos. Listo para entregar.",
    counts: {
      errors: "errores",
      warnings: "avisos",
      infos: "notas",
      passes: "superadas",
    },
    showPasses: "Mostrar comprobaciones superadas",
    hidePasses: "Ocultar comprobaciones superadas",
    openChecker: "Abrir el verificador de paquetes completo",
    waiting: "La comprobación se ejecuta en cuanto se construye el paquete.",
  },

  download: {
    title: "Descarga",
    button: "Descargar .zip",
    preparing: "Preparando…",
    contents: "Contenido del paquete",
    size: (kb: string) => `${kb} KB`,
    blockedForm: "Corrige primero los campos resaltados.",
    blockedErrors: "La comprobación del paquete encontró errores; mira arriba.",
    blockedBuild: "No se pudo construir el paquete.",
    next: "Siguientes pasos",
    nextSteps: [
      "Descomprime y apunta un renderizador OGraf al manifiesto, o suelta el zip en el verificador de paquetes.",
      "Edita los tokens de tema al principio de style.css para seguir cambiando el aspecto a mano.",
      "Cambia el marcado en graphic.mjs y el schema de datos del manifiesto a la vez: load() y updateAction() leen los mismos campos.",
    ],
    license: "El paquete generado tiene licencia MIT, como las plantillas de los tutoriales en las que se basa.",
  },
};
