import type { SpecCopy } from "./en";
import { CODE, EXTERNAL_LINK, FIELD, MONO, STRONG } from "./styles";

export const es: SpecCopy = {
  eyebrow: "Guía de la especificación",
  title: "Cómo funciona OGraf — explicado de forma sencilla.",
  intro: (
    <>
      Tanto si eres diseñador, desarrollador o trabajas en una cadena, esta guía explica el formato OGraf en lenguaje claro y con ejemplos reales. No hace falta experiencia previa. Para la especificación técnica completa, consulta la{" "}
      <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className={EXTERNAL_LINK}>
        documentación oficial de la EBU
      </a>.
    </>
  ),
  onThisPage: "En esta página",
  analogyLabel: "Piénsalo así",
  nav: {
    "big-picture": "La visión general",
    "whats-inside": "Qué contiene un paquete",
    manifest: "El archivo de manifiesto",
    lifecycle: "Cómo cobra vida un grafismo",
    steps: "Pasos (grafismos de varias páginas)",
    data: "Datos y formularios",
    "real-world": "Ejemplos reales",
    advanced: "Temas avanzados",
    next: "Próximos pasos",
  },

  bigPicture: {
    title: "La visión general",
    p1: "Imagina que diseñas un rótulo inferior en After Effects. Hoy tendrías que exportarlo de forma distinta para cada sistema — una versión para CasparCG, otra para SPX, otra para Vizrt. Cada una con su propio formato, sus manías y sus limitaciones.",
    p2: (
      <>
        <strong className={STRONG}>OGraf acaba con eso.</strong> Creas tu grafismo una sola vez como una pequeña página web (HTML + CSS + JavaScript), lo empaquetas en un formato estándar y se reproduce en <em>cualquier</em> sistema compatible con OGraf. El mismo archivo, en todas partes.
      </>
    ),
    rolesCaption: "Los tres papeles en el ecosistema OGraf",
    roles: [
      { title: "Tú creas", desc: "Diseña el grafismo con HTML, CSS y JavaScript — las mismas herramientas con las que se construyen las webs." },
      { title: "Tú empaquetas", desc: "Añade un archivo de manifiesto que describe tu grafismo — su nombre, sus campos de datos y su comportamiento." },
      { title: "Se reproduce", desc: "Cualquier sistema de playout compatible con OGraf (SPX, CasparCG, ograf-server…) puede cargarlo y ejecutarlo." },
    ],
    analogy: "Piensa en OGraf como en un PDF. Un PDF se ve igual lo abras en Adobe Reader, en Chrome o en Vista Previa. Un grafismo OGraf funciona igual se ejecute en SPX, en CasparCG o en cualquier otro sistema compatible. El formato es el contrato.",
  },

  inside: {
    title: "Qué contiene un paquete",
    intro: "Un paquete OGraf no es más que una carpeta con unos pocos archivos. No necesitas ningún software especial para crearlo — puedes montarlo con cualquier editor de texto.",
    caption: "Un paquete OGraf típico para un rótulo inferior",
    tree: {
      manifest: "← El manifiesto (obligatorio)",
      code: "← El código de tu grafismo",
      styles: "← Tus estilos",
      thumbnail: "← Imagen de vista previa",
      font: "← Fuente personalizada",
      logo: "← Logotipo o imágenes",
    },
    required: (
      <>
        Hay dos archivos obligatorios: el manifiesto (<code className={CODE}>.ograf.json</code>) y el módulo JavaScript al que apunta su campo <code className={CODE}>main</code>. Todo lo demás depende de ti — incluye en el paquete las fuentes, imágenes, CSS o bibliotecas JavaScript que necesite el grafismo.
      </>
    ),
    calloutTitle: "Para diseñadores de After Effects",
    callout: (
      <>
        Si usas herramientas como <strong>Ferryman</strong> o <strong>Loopic</strong>, generan este paquete por ti automáticamente. Diseñas de forma visual y la herramienta exporta una carpeta lista para OGraf. Sin programar.
      </>
    ),
  },

  manifest: {
    title: "El archivo de manifiesto",
    p1: (
      <>
        El manifiesto es un pequeño archivo JSON que <strong className={STRONG}>presenta tu grafismo al mundo</strong>. Responde a preguntas como: ¿cómo se llama este grafismo? ¿Qué datos necesita? ¿Cómo se comporta?
      </>
    ),
    p2: (
      <>
        Cuando alguien carga tu grafismo en SPX o en cualquier otro controlador, <strong className={STRONG}>el controlador lee primero este archivo</strong>. Usa esa información para mostrar el nombre del grafismo en la lista de plantillas, generar formularios de introducción de datos para el operador y saber cómo controlar la reproducción.
      </>
    ),
    breakdown: "Veamos cada parte:",
    identity: {
      title: "Identidad — ¿quién es este grafismo?",
      subtitle: "id, version, name, description, author",
      body: (
        <>
          <p><code className={FIELD}>id</code> — Un identificador único, como el código de barras de un producto. Usa el dominio de tu empresa al revés: <code className={MONO}>com.mystation.lower-third</code></p>
          <p><code className={FIELD}>name</code> — El nombre legible que ven los operadores en la lista de plantillas: <em>"News Lower Third"</em></p>
          <p><code className={FIELD}>version</code> — Para que los sistemas sepan qué versión están ejecutando: <em>"1.0.0"</em>, <em>"2.3.1"</em></p>
          <p><code className={FIELD}>description</code> — Una frase breve que explica qué hace el grafismo</p>
          <p><code className={FIELD}>author</code> — Tu nombre y tus datos de contacto</p>
        </>
      ),
    },
    code: {
      title: "Código — ¿dónde está el grafismo?",
      subtitle: "main",
      body: (
        <>
          <p><code className={FIELD}>main</code> — La ruta al archivo JavaScript que contiene la lógica de tu grafismo. Ahí es donde viven la animación, el tratamiento de los datos y el código de renderizado.</p>
          <p>Ejemplo: <code className={MONO}>"graphic.mjs"</code> — un archivo en la misma carpeta que el manifiesto.</p>
        </>
      ),
    },
    behavior: {
      title: "Comportamiento — ¿cómo funciona?",
      subtitle: "stepCount, supportsRealTime, supportsNonRealTime",
      body: (
        <>
          <p><code className={FIELD}>stepCount</code> — ¿Cuántas "páginas" o estados tiene este grafismo? Un rótulo inferior sencillo tiene <strong>1 paso</strong> (aparece y luego desaparece). Unos resultados electorales con varias páginas podrían tener <strong>5 pasos</strong>. Más sobre esto a continuación.</p>
          <p><code className={FIELD}>supportsRealTime</code> — ¿Puede este grafismo ejecutarse en directo, en antena? (Casi siempre <code className={MONO}>true</code>)</p>
          <p><code className={FIELD}>supportsNonRealTime</code> — ¿Puede renderizarse este grafismo fotograma a fotograma para posproducción? (Función avanzada, normalmente <code className={MONO}>false</code>)</p>
        </>
      ),
    },
    data: {
      title: "Datos — ¿qué información muestra?",
      subtitle: "schema",
      body: (
        <>
          <p>El <code className={FIELD}>schema</code> indica a los controladores <strong>qué campos tiene que rellenar el operador</strong>. El controlador lo lee y genera automáticamente un formulario — cuadros de texto, selectores de color, menús desplegables — para que el operador nunca toque código.</p>
          <p>En el ejemplo anterior, el schema dice: <em>"Este grafismo necesita un Name (texto) y un Title (texto)."</em> El controlador muestra dos campos de texto. El operador escribe "Jane Smith" y "Senior Reporter", pulsa Play y el rótulo inferior aparece en pantalla con esos datos.</p>
        </>
      ),
    },
    analogy: "El manifiesto es como la parte trasera de la caja de un juego de mesa. Te dice el nombre del juego, cuántos jugadores admite, qué incluye y las reglas básicas — antes incluso de abrirla. Los controladores leen el manifiesto para saber cómo presentar y manejar tu grafismo.",
  },

  lifecycle: {
    title: "Cómo cobra vida un grafismo",
    intro: 'Cuando un operador pulsa "Play" en su controlador (como SPX), entre bastidores ocurre una secuencia precisa: el renderizador llama a estos métodos del grafismo, en este orden. Entender esta secuencia es la clave para entender OGraf. Los grafismos también pueden declarar acciones personalizadas — un destello de gol en un marcador, por ejemplo —, que los controladores muestran como botones adicionales y entregan mediante customAction().',
    caption: "El ciclo de vida de un grafismo OGraf durante una emisión en directo",
    steps: [
      { action: "load()", what: "El grafismo recibe los datos del operador (nombre, cargo, colores…) y se prepara.", example: 'El operador introduce "Jane Smith" y "Reporter" en el formulario.' },
      { action: "playAction()", what: "El grafismo entra en pantalla con una animación. El rótulo inferior se desliza desde la izquierda.", example: "El realizador pulsa Play. El rótulo con el nombre entra con una animación suave." },
      { action: "updateAction()", what: "Los datos cambian mientras el grafismo está en antena. El texto se actualiza en directo.", example: 'El cargo cambia de "Reporter" a "Senior Correspondent" en mitad del programa.' },
      { action: "stopAction()", what: "El grafismo sale de pantalla con una animación. El rótulo inferior vuelve a deslizarse hacia fuera.", example: "El realizador pulsa Stop. El grafismo sale con una animación limpia." },
      { action: "dispose()", what: "Se limpia todo. Se libera la memoria. Listo para el siguiente grafismo.", example: "El sistema elimina el grafismo de la memoria del renderizador." },
    ],
    body: (
      <>
        Cada una de estas etapas es un <strong className={STRONG}>método en tu código</strong>. El renderizador los llama en orden y <strong className={STRONG}>espera a que cada uno termine</strong> antes de llamar al siguiente. Es decir: cuando le dices al renderizador "mi animación dura 500ms", lo respeta y no la interrumpe.
      </>
    ),
    calloutTitle: "La idea clave",
    callout: (
      <>
        A OGraf no le importa <em>cómo</em> animas tu grafismo — transiciones CSS, JavaScript, GSAP, Lottie, canvas, SVG — todo vale. Solo le importa <em>cuándo</em> has terminado. Indica "estoy listo" y el renderizador continúa.
      </>
    ),
  },

  steps: {
    title: "Pasos — para grafismos de varias páginas",
    intro: (
      <>
        No todos los grafismos son un simple rótulo inferior. Unos resultados electorales pueden tener 5 páginas. Un marcador deportivo puede actualizarse dinámicamente. OGraf lo resuelve con <strong className={STRONG}>pasos</strong>.
      </>
    ),
    examples: (list: string) => `Ejemplos: ${list}`,
    models: [
      { label: "Lanzar y olvidar", desc: "Lanzado una vez, va de principio a fin por sí solo — entra, se mantiene y sale. No hay pasos que el operador tenga que avanzar.", examples: "Cortinilla de repetición, transición tipo wipe, animación de bumper", visual: ["▶️ Entra", "✨ Auto", "⏹️ Sale"] },
      { label: "Un solo paso (el más habitual)", desc: "Aparece al reproducirlo, se mantiene visible y desaparece al detenerlo.", examples: "Rótulo inferior, mosca, marca de agua con logotipo, reloj", visual: ["▶️ Entra", "⏸️ Se mantiene", "⏹️ Sale"] },
      { label: "Varios pasos", desc: "Cada Play avanza a la siguiente página. Stop sale desde cualquier página.", examples: "Resultados electorales (3 partidos), grafismo con varias estadísticas, pase de diapositivas", visual: ["▶️ Página 1", "▶️ Página 2", "▶️ Página 3", "⏹️ Sale"] },
      { label: "Pasos dinámicos", desc: "El número de páginas depende de los datos — pueden ser 2 o 20.", examples: "Tablas basadas en datos, clasificaciones en directo, listas con desplazamiento", visual: ["▶️ Página 1", "▶️ ...", "▶️ Página N", "⏹️ Sale"] },
    ],
  },

  data: {
    title: "Datos y formularios",
    p1: (
      <>
        La parte más potente de OGraf para los diseñadores: <strong className={STRONG}>tú defines qué datos necesita tu grafismo y el controlador crea automáticamente un formulario para el operador</strong>. Sin necesidad de una interfaz a medida.
      </>
    ),
    p2: (
      <>
        Esto se hace mediante el <code className={CODE}>schema</code> de tu manifiesto, con un formato llamado <strong className={STRONG}>GDD</strong> (Graphics Data Definition). Que el nombre no te intimide — es solo una forma de decir "este grafismo necesita un campo de texto llamado Nombre y un selector de color llamado Fondo".
      </>
    ),
    caption: "Lo que ve el operador frente a lo que escribes en el manifiesto",
    operatorSees: "Lo que ve el operador",
    youWrite: "Lo que escribes en el manifiesto",
    form: {
      headline: "Titular",
      headlineValue: "Breaking News",
      bgColor: "Color de fondo",
      position: "Posición",
      positionValue: "Izquierda ▾",
      duration: "Duración de la animación",
    },
    fieldTypesTitle: "Tipos de campo disponibles",
    fieldTypesIntro: (
      <>
        El <code className={CODE}>gddType</code> indica al controlador qué tipo de campo mostrar. Estas son las opciones:
      </>
    ),
    fieldTypes: {
      "single-line": "Campo de texto (una línea)",
      "multi-line": "Área de texto (varias líneas)",
      select: "Menú desplegable con opciones",
      "color-rrggbb": "Selector de color",
      "color-rrggbbaa": "Selector de color con transparencia",
      "file-path": "Selector de archivos",
      "file-path/image-path": "Selector de archivos de imagen",
      percentage: "Control deslizante de porcentaje",
      "duration-ms": "Duración en milisegundos",
    },
  },

  realWorld: {
    intro: "Cada concepto de esta especificación se corresponde con algo real que puedes construir. Cada tutorial te guía por un grafismo OGraf completo — manifiesto, Web Component, animación, datos — en 10 a 25 minutos.",
    cardsTitle: "Ejemplos reales",
    cardsSubtitle: "Elige uno y constrúyelo. Cada ejemplo se entrega como un paquete OGraf que funciona.",
  },

  advanced: {
    title: "Temas avanzados",
    intro: "Estas funciones son menos habituales, pero importantes para flujos de trabajo especializados.",
    customActions: {
      title: "Acciones personalizadas",
      subtitle: "Botones propios del grafismo para los operadores",
      body: (
        <>
          <p>Además de play/stop/update, puedes definir <strong>operaciones personalizadas</strong> con sus propios botones y formularios de datos. Un marcador podría tener un botón "Gol" que lanza una animación de celebración. Un ticker podría tener un botón "Añadir elemento".</p>
          <p className="mt-2">Las defines en el manifiesto y los controladores generan la interfaz automáticamente — el operador solo tiene que pulsar un botón.</p>
        </>
      ),
    },
    renderRequirements: {
      title: "Requisitos de renderizado",
      subtitle: "Lo que debe admitir el sistema de playout",
      body: <p>Si tu grafismo necesita una resolución concreta (por ejemplo, 1920x1080 como mínimo), una frecuencia de fotogramas (por ejemplo, 50fps) o una versión mínima del motor del navegador, puedes declararlo — igual que si necesita acceso a internet pública. renderRequirements es una lista de alternativas: se espera que el grafismo funcione cuando el renderizador cumple al menos una de ellas.</p>,
    },
    nonRealTime: {
      title: "Renderizado en no tiempo real",
      subtitle: "Fotograma a fotograma para posproducción",
      body: <p>Para edición de vídeo y posproducción, los renderizadores pueden recorrer tu grafismo fotograma a fotograma en lugar de reproducirlo en tiempo real. Así se obtiene una salida de calidad perfecta para contenido grabado. Tu grafismo necesita dos métodos adicionales: uno para saltar a un instante concreto y otro para recibir de antemano la línea de tiempo completa de acciones.</p>,
    },
    vendorExtensions: {
      title: "Extensiones de fabricante",
      subtitle: "Campos personalizados para sistemas concretos",
      body: <p>Cualquier campo que empiece por <code className={MONO}>v_</code> está reservado para datos específicos de un fabricante. SPX podría añadir <code className={MONO}>v_spx_category</code>; CasparCG podría añadir <code className={MONO}>v_casparcg_channel</code>. Los demás sistemas ignoran estos campos — no rompen la compatibilidad.</p>,
    },
  },

  next: {
    title: "Próximos pasos",
    build: { title: "Crea tu primera plantilla", desc: "Tutorial práctico. De cero a un rótulo inferior que funciona en 15 minutos.", cta: "Empezar a construir" },
    spec: { title: "Especificación oficial de la EBU", desc: "La especificación técnica completa, con JSON schemas y tipos de TypeScript.", cta: "Leer la especificación" },
    ecosystem: { title: "Explora el ecosistema", desc: "Descubre editores, renderizadores, controladores y herramientas compatibles con OGraf.", cta: "Ver todas las herramientas" },
    check: { title: "Verifica tu paquete", desc: (total: number) => `Suelta un .zip y obtén un informe estructurado frente a ${total} reglas y el schema actual de la EBU.`, cta: "Abrir el verificador" },
  },
};
