import { Link } from "../../Link";
import type { SchemaExplorerCopy } from "./en";
import { DARK_LINK, EXTRA_CODE, INLINE_CODE } from "./styles";

export const es: SchemaExplorerCopy = {
  hero: {
    eyebrow: "Explorador de schema",
    title: "Cada campo de un manifiesto OGraf, en lenguaje claro.",
    intro:
      "Un catálogo pensado para diseñadores del schema canónico de manifiesto de la EBU. Recorre los campos de nivel superior, mira cada tipo de entrada del operador con una maqueta visual real y olvídate por completo de la jerga de JSON Schema.",
  },
  stats: {
    fields: "Campos del manifiesto",
    required: "Obligatorios",
    clusters: "Grupos",
    types: "Tipos de entrada del operador",
  },
  mindMap: {
    title: "La estructura completa, de un vistazo",
    intro: (
      <>
        Todo lo que puede contener un manifiesto OGraf — los campos obligatorios en rosa, los opcionales en
        gris. Haz clic en cualquier rama para saltar a su ficha detallada.
      </>
    ),
    legendRequired: "obligatorio",
    legendOptional: "opcional",
    legendClick: "haz clic en cualquier rama para saltar a su ficha completa más abajo",
    rootLabel: "Manifiesto OGraf",
    hints: {
      schema: "string · URL constante",
      main: "string · archivo de entrada",
      version: "string · ordenable",
      stepCount: "number · por defecto 1 · -1 = dinámico",
      actionSchema: "object | null  (null = sin parámetros)",
      operatorForm: "gdd/object.json — formulario de datos del operador",
      gddType: "1 de los 9 de abajo ↓",
      gddOptions: "object — extensiones, etiquetas…",
      default: "depende del tipo",
      hidden: "boolean — se omite en la etiqueta visible",
      order: "number — pista de orden en la interfaz, menor primero",
      items: "(si type=array)  → object.json recursivo",
      properties: "(si type=object) → object.json recursivo",
      gddTypes: "9 tipos canónicos",
      renderRequirements: "array de objetos de requisito",
      engineType: "string — CEF, Gecko, …",
      engineVersion: "string — específica del motor",
      vendorLabel: "v_*  (extensiones de fabricante)",
      vendor: "los campos personalizados con prefijo v_ se permiten en cualquier nivel",
    },
  },
  fields: {
    title: "Campos del manifiesto",
    intro: (
      <>
        Todo lo que puede ir en el nivel superior de un manifiesto <code className={INLINE_CODE}>.ograf.json</code>, agrupado en las cinco cosas que de verdad importan a los diseñadores: quién es este grafismo, cómo se comporta, qué datos pide al operador, qué botones personalizados puede pulsar el operador y qué necesita del renderizador.
      </>
    ),
  },
  gdd: {
    title: "Tipos de entrada del operador",
    intro: (
      <>
        Dentro del campo <code className={INLINE_CODE}>schema</code> — es el formulario que el controlador construye para el operador. Estos son los tipos de entrada que puedes usar, cada uno con una maqueta de lo que el operador ve realmente en el controlador. Combínalos para pedir lo que necesite tu grafismo: nombre, marcador, foto, color, posición…
      </>
    ),
    extrasTitle: "Dos extras que puede llevar cualquier campo",
    hidden: (
      <>
        <code className={EXTRA_CODE}>hidden: true</code> — si está presente, el valor del
        campo se{" "}
        <strong>excluye de la etiqueta visible del grafismo</strong> en las interfaces de
        playout/automatización. Úsalo para campos técnicos o que solo meten ruido.
      </>
    ),
    order: (
      <>
        <code className={EXTRA_CODE}>order: 0</code> — pista de orden en la interfaz. Los números
        menores van primero. Te permite controlar dónde aparece cada campo en el formulario del
        operador.
      </>
    ),
  },
  cta: {
    title: "¿Listo para juntar las piezas?",
    body: "La página de la especificación recorre el manifiesto completo de principio a fin con un ejemplo práctico. Los tutoriales muestran 11 grafismos construidos de principio a fin. El verificador de paquetes valida un paquete terminado con este mismo schema.",
    spec: "Leer la especificación",
    tutorials: "Ver los tutoriales",
    check: "Validar un paquete",
    source: "Fuente:",
  },
  cards: {
    example: "Ejemplo:",
    required: "Obligatorio",
    optional: "Opcional",
    toggleExamples: (open: boolean, count: number) =>
      `${open ? "Ocultar" : "Mostrar"} ${count === 1 ? "ejemplo" : `${count} ejemplos`}`,
    examplesAria: "Ejemplos",
    directLink: (name: string) => `Enlace directo a ${name}`,
    copyFieldLink: "Copiar el enlace a este campo",
    copyTypeLink: "Copiar el enlace a este tipo",
    operatorSees: "Lo que ve el operador",
  },
  mocks: {
    name: "Nombre",
    quote: "Cita",
    quoteValue: "Grafismo abierto, televisión abierta, estándares abiertos. Ese es el futuro.",
    themeMusic: "Sintonía",
    browse: "Examinar…",
    logo: "Logotipo",
    dropOrBrowse: "Suelta o examina",
    position: "Posición",
    bottomRight: "Abajo a la derecha",
    overlay: "Superposición",
    accent: "Acento",
    opacity: "Opacidad",
    animationDuration: "Duración de la animación",
  },
  source: {
    fetching: "Obteniendo el schema en directo de ograf.ebu.io…",
    synced: "Sincronizado con la EBU",
    fetched: (ago: string) => `· obtenido ${ago}`,
    justNow: "ahora mismo",
    secondsAgo: (n: number) => `hace ${n} s`,
    minutesAgo: (n: number) => `hace ${n} min`,
    hoursAgo: (n: number) => `hace ${n} h`,
    daysAgo: (n: number) => `hace ${n} d`,
    bundledSnapshot: "Copia local incluida en la web",
    offline: "Sin conexión · usando copia local",
  },
  ai: {
    badge: "Asistente de IA",
    title: "Pide a una IA que revise o redacte tu manifiesto.",
    intro:
      "Copia el prompt de abajo en cualquier chat de IA. Enseña al modelo las reglas de OGraf a un nivel en el que un diseñador puede confiar — campos obligatorios, los gddTypes canónicos, extensiones de fabricante, todo.",
    whereToPaste: "Dónde pegarlo",
    tipsTitle: "Consejos para obtener mejores respuestas",
    copied: "Copiado",
    copyPrompt: "Copiar prompt",
    platformNotes: {
      ChatGPT:
        "El buque insignia de OpenAI. La mayoría de los diseñadores ya tiene cuenta. Los modelos de la clase GPT-4 / 5 manejan el prompt sin problema.",
      Claude:
        "De Anthropic. Especialmente bueno en tareas con datos estructurados, como la validación de JSON Schema. El plan gratuito es generoso.",
      Gemini:
        "De Google. Tiene acceso a la web en tiempo real — puede consultar el schema canónico en ograf.ebu.io mientras responde.",
      Perplexity:
        "Basado en búsquedas web. Útil cuando además quieres descubrir herramientas del ecosistema o noticias recientes de OGraf en la misma conversación.",
    },
    tips: [
      "Pega tu .ograf.json completo junto con el prompt. La IA detecta en segundos campos obligatorios que faltan y erratas.",
      "Describe el grafismo en lenguaje llano y deja que la IA redacte el manifiesto por ti. \"Rótulo inferior con nombre, cargo y selector del color del equipo, 1 paso, solo tiempo real.\"",
      "Pasa siempre el resultado por el verificador de paquetes (ograf.dev/check) antes de publicar. La salida de la IA es un gran borrador, no una respuesta final.",
      "Indica qué gddType quieres para cada campo del operador. Si no, la IA suele recurrir a strings simples de JSON Schema, que los controladores no pueden mostrar igual de bien.",
      "Si usas una función específica de un fabricante, añade un v_tuEmpresa_campo — la especificación rechaza claves desconocidas en el nivel superior, pero permite prefijos v_ en todas partes.",
      "Cuando la IA te devuelva JSON, pídele \"validate this against https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json\" — los modelos con navegación consultarán la versión canónica y revisarán su propio trabajo.",
    ],
    headsUp: (
      <>
        Un aviso: la salida de la IA es un gran <em>borrador</em>, nunca una respuesta final. Pasa siempre lo que obtengas por el{" "}
        <Link to="/check" className={DARK_LINK}>
          verificador de paquetes
        </Link>{" "}
        antes de publicar.
      </>
    ),
    cites: (
      <>
        El prompt cita{" "}
        <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className={DARK_LINK}>
          ograf.ebu.io
        </a>{" "}
        para que los modelos con navegación puedan consultar el schema canónico mientras responden.
      </>
    ),
  },
};
