import type { SchemaLanguageText } from "../../../content/schema-language";

export const es: SchemaLanguageText = {
  clusters: {
    identity: {
      title: "Identidad",
      subtitle: "¿Quién es este grafismo? Un nombre, una versión, un crédito.",
    },
    behaviour: {
      title: "Comportamiento",
      subtitle: "¿Cómo funciona? Páginas, modos, dónde puede emitirse.",
    },
    "operator-data": {
      title: "Datos del operador",
      subtitle: "Lo que escribe el operador — como un formulario: nombre, cargo, marcador.",
    },
    "custom-buttons": {
      title: "Botones personalizados",
      subtitle: "Acciones especiales que el operador puede pulsar durante la emisión.",
    },
    "render-needs": {
      title: "Lo que necesita para renderizarse",
      subtitle: "El mínimo que el renderizador debe garantizar — tamaño, transparencia, audio.",
    },
  },
  fields: {
    $schema: {
      friendlyName: "Enlace al schema",
      description:
        "Indica a controladores y validadores con qué versión del formato de manifiesto OGraf has trabajado. Siempre es la URL canónica de la EBU — la mayoría de los editores la rellenan por ti.",
      exampleLabels: ["Siempre este valor"],
    },
    id: {
      friendlyName: "ID único",
      description:
        "Un nombre que ningún otro grafismo del mundo debería compartir. Usa un patrón de dominio invertido para que las colisiones sean prácticamente imposibles.",
      exampleLabels: ["Dominio invertido (recomendado)", "Con espacio de nombres del proyecto", "Con fecha, para lotes"],
    },
    name: {
      friendlyName: "Nombre visible",
      description:
        "Lo que ven los operadores al elegir este grafismo en una lista. Que sea corto — tiene que caber en la interfaz del controlador.",
      exampleLabels: ["Simple", "Con sufijo de variante", "Marcado para uso en directo"],
    },
    version: {
      friendlyName: "Versión",
      description:
        "Cuando cambies algo importante, súbela. Usa major.minor.patch — sube el número major cuando rompas algo de lo que dependen los operadores.",
      exampleLabels: ["Semver estable", "Versión preliminar", "Basada en fecha"],
    },
    description: {
      friendlyName: "Descripción",
      description:
        "Una frase sobre lo que hace este grafismo. Ayuda a los operadores a elegir el correcto cuando hay decenas de plantillas.",
      exampleLabels: ["Simple", "Destacando la función principal", "Indicando el público"],
    },
    main: {
      friendlyName: "Archivo de entrada",
      description:
        "El archivo que el renderizador carga primero. Normalmente graphic.mjs o index.html. La ruta es relativa al manifiesto.",
      exampleLabels: ["Módulo ES", "Entrada HTML", "Dentro de una subcarpeta"],
    },
    author: {
      friendlyName: "Autor",
      description:
        "Quién lo ha hecho. Es opcional, pero un nombre + correo electrónico ayuda a los operadores a saber a quién avisar cuando algo no cuadra.",
      exampleLabels: ["Diseñador independiente", "Organización", "Solo el nombre de la comunidad"],
    },
    thumbnails: {
      friendlyName: "Miniaturas",
      description:
        "Imágenes de vista previa del grafismo para que los operadores lo reconozcan a simple vista. PNG, JPG, GIF o WebP. Se admiten varios tamaños — los controladores eligen el que mejor encaja.",
      exampleLabels: ["Una miniatura", "Varios tamaños", "Varias relaciones de aspecto"],
    },
    stepCount: {
      friendlyName: "Páginas o fases",
      description:
        "Cuántas vistas distintas tiene tu grafismo. -1 significa dinámico (el grafismo decide en tiempo de ejecución), 0 es una cortinilla que se reproduce sola hasta el final, 1 es un único estado que se queda en pantalla hasta que se detiene (un rótulo inferior), 2+ es un grafismo de varias páginas que el operador va pasando con clics. El valor por defecto es 1.",
      exampleValue: "por defecto 1   ·   mín. -1   ·   -1 = dinámico",
      exampleLabels: [
        "Rótulo inferior (por defecto — un único estado)",
        "Cortinilla (se reproduce una vez, sin paso del operador)",
        "Varias páginas (3 pantallas de resultados)",
        "Dinámico (el grafismo decide en tiempo de ejecución)",
      ],
    },
    supportsRealTime: {
      friendlyName: "¿Emisión en directo?",
      description:
        "True si tu grafismo puede funcionar en antena en directo — el caso más habitual. Tienes que declararlo explícitamente, aunque sea true.",
      exampleLabels: ["Solo en directo", "Directo + postproducción"],
    },
    supportsNonRealTime: {
      friendlyName: "¿Postproducción?",
      description:
        "True si tu grafismo puede ejecutarse más rápido o más lento que el tiempo real — útil para flujos de renderizado offline (fotograma a fotograma, por lotes). Si es true, tienes que implementar goToTime() y setActionsSchedule().",
      exampleLabels: ["Solo en directo", "Permitir renderizado offline"],
    },
    schema: {
      friendlyName: "Campos de datos del operador",
      description:
        "Lo que escribe el operador. Como un formulario: un campo Nombre, un campo Cargo, un selector de color. El controlador lo lee y construye el formulario automáticamente — nunca tienes que diseñar la interfaz del operador.",
      exampleLabels: ["Solo campos de texto", "Con selector de color y desplegable", "Imagen + array de strings"],
    },
    customActions: {
      friendlyName: "Botones personalizados",
      description:
        "Acciones especiales que el operador puede lanzar durante la emisión — celebrar un gol, hacer parpadear un aviso, cambiar un color. Cada botón tiene un ID, un nombre y un formulario de datos opcional (pon schema a null si la acción no recibe parámetros).",
      exampleLabels: ["Un botón, sin payload", "Botón con schema de payload", "Varios botones"],
    },
    renderRequirements: {
      friendlyName: "Requisitos de renderizado",
      description:
        "Una lista de entornos de renderizado aceptables — al menos una entrada debe cumplirse. Cada entrada puede restringir la resolución, la frecuencia de fotogramas, el acceso a internet y el motor de renderizado + versión. Las restricciones usan min/max/exact/ideal para que el renderizador pueda negociar la mejor opción.",
      exampleLabels: [
        "HD a 60 fps como mínimo",
        "Necesita acceso a internet (datos en directo)",
        "Restricción de motor (CEF 139+)",
        "UHD con frecuencia de fotogramas ideal",
      ],
    },
  },
  gddTypes: {
    "single-line": {
      friendlyName: "Texto corto",
      description: "Un campo de texto de una línea. Nombres, cargos, marcadores, hashtags.",
      exampleLabels: ["Campo de nombre", "Con un valor por defecto de ejemplo", "Campo obligatorio"],
    },
    "multi-line": {
      friendlyName: "Texto largo",
      description: "Un área de texto de varias líneas. Citas, descripciones, textos más largos.",
      exampleLabels: ["Cita", "Descripción con valor por defecto"],
    },
    "file-path": {
      friendlyName: "Ruta de archivo",
      description:
        "Un selector de archivos genérico. Úsalo cuando un grafismo necesite un recurso a partir de una ruta. Restringe las extensiones permitidas con gddOptions.",
      exampleLabels: ["Archivo de audio", "Clip de vídeo", "Sin restricción de extensión"],
    },
    "file-path/image-path": {
      friendlyName: "Imagen",
      description:
        "Un selector de imágenes. El controlador sabe que debe mostrar una miniatura de vista previa. Logotipos, fotos de cara, avatares de redes sociales.",
      exampleLabels: ["Logotipo", "Foto de cara"],
    },
    select: {
      friendlyName: "Opciones",
      description:
        "Un desplegable con un conjunto fijo de opciones. Usa enum para enumerar los valores y gddOptions.labels para dar a cada valor una etiqueta visible más clara.",
      exampleLabels: ["Opciones de texto con etiquetas", "Niveles enteros", "Velocidades numéricas"],
    },
    "color-rrggbb": {
      friendlyName: "Color (sólido)",
      description:
        "Un selector de color que devuelve una cadena hexadecimal de 6 caracteres, como #2563eb. Solo hex en minúsculas — los operadores ven una muestra y un campo hex.",
      exampleLabels: ["Color de acento de marca", "Fondo"],
    },
    "color-rrggbbaa": {
      friendlyName: "Color (con transparencia)",
      description:
        "Un selector de color que incluye canal alfa — hex de 8 caracteres, como #2563ebcc. Úsalo para superposiciones, fondos con efecto cristal o donde quieras transparencia parcial.",
      exampleLabels: ["Superposición translúcida", "Tinte con efecto cristal"],
    },
    percentage: {
      friendlyName: "Porcentaje",
      description:
        "Un número que representa un porcentaje. Los operadores suelen ver un control deslizante y un campo numérico de 0 a 100 — ideal para opacidad, progreso, escala, volumen.",
      exampleLabels: ["Opacidad", "Barra de progreso"],
    },
    "duration-ms": {
      friendlyName: "Duración (milisegundos)",
      description:
        "Un entero medido en milisegundos. Duración de una animación, tiempo en pantalla, duración de un fundido de salida. El controlador puede mostrarlo en segundos para que sea más cómodo.",
      exampleLabels: ["Duración de la animación", "Tiempo en pantalla", "Fundido de salida"],
    },
  },
};
