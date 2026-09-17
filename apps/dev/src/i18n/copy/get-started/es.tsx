import { CODE_AMBER, CODE_BLUE, CODE_ID, CODE_SLATE_LIGHT, STRONG } from "../tutorial-ui/styles";
import type { GetStartedCopy } from "./en";

export const es: GetStartedCopy = {
  title: "Crea tu primera plantilla OGraf.",
  lead: "En este tutorial vas a crear desde cero un rótulo inferior con calidad de producción — como los que ves en CBS, en la BBC o en cualquier informativo. Entra deslizándose, muestra un nombre y un cargo, se actualiza en directo y sale deslizándose.",
  demo: {
    name: "Nombre",
    title: "Cargo",
    heading: "Rótulo inferior — plantilla OGraf",
  },
  prereqTitle: "Antes de empezar",
  prereqs: [
    "Conocimientos básicos de HTML y CSS (JavaScript ayuda, pero no hace falta para seguir el tutorial)",
    "Un editor de texto — VS Code, Sublime Text o el que te resulte cómodo",
    "Un navegador web (Chrome, Firefox, Edge, Safari)",
  ],
  step1: {
    title: "Crea la carpeta del proyecto",
    body: "Crea una carpeta nueva con estos cuatro archivos. Ese es todo tu paquete OGraf — sin herramientas de build, sin npm, sin framework.",
    notes: { manifest: "manifiesto", logic: "lógica", design: "diseño", preview: "vista previa (opcional)" },
    callout: (
      <>
        <strong className="text-blue-900">Eso es todo.</strong> Cuatro archivos. Sin <code className={CODE_BLUE}>node_modules</code>, sin <code className={CODE_BLUE}>package.json</code>, sin paso de build. Los paquetes OGraf son archivos web normales.
      </>
    ),
  },
  step2: {
    title: "Escribe el manifiesto — el DNI de tu grafismo",
    body: (
      <>
        El manifiesto le dice a cualquier sistema OGraf quién es tu grafismo y qué necesita. Cuando un operador carga tu grafismo en SPX o en cualquier controlador, <strong className={STRONG}>este archivo es lo primero que lee</strong>. A partir de él se genera automáticamente el formulario de datos que has visto en la demo de arriba.
      </>
    ),
    cards: [
      { label: "Identidad", body: <><code className={CODE_ID}>id</code> y <code className={CODE_ID}>name</code> — cómo identifican y muestran tu grafismo los controladores.</> },
      { label: "Comportamiento", body: <><code className={CODE_ID}>stepCount: 1</code> — un paso: aparece, se mantiene y desaparece al detenerlo.</> },
      { label: "Punto de entrada", body: <><code className={CODE_ID}>main</code> — apunta a tu archivo JavaScript con la clase del Web Component.</> },
      { label: "Schema de datos", body: <><code className={CODE_ID}>schema</code> — define los campos del formulario. Los controladores generan automáticamente la interfaz de entrada a partir de él.</> },
    ],
  },
  step3: {
    title: "Monta la carpeta del paquete",
    body: (
      <>
        Un paquete OGraf es una carpeta pequeña con un manifiesto, un módulo JavaScript, una hoja de estilos y los recursos estáticos que necesite el grafismo. No hay punto de entrada HTML — el renderizador monta la clase exportada por defecto bajo su propia etiqueta, así que al módulo le basta con exportar una clase que extienda <code className={CODE_SLATE_LIGHT}>HTMLElement</code>.
      </>
    ),
    language: "Texto",
    note: (
      <>
        La carpeta <code className={CODE_SLATE_LIGHT}>fonts/</code> incluye los pesos de Inter que usa este grafismo junto con su licencia (SIL OFL) — los equipos de playout suelen estar sin conexión, así que empaquetar las fuentes evita llamadas a una CDN que fallarían sin avisar.
      </>
    ),
  },
  step4: {
    title: "Diseña el aspecto — CSS",
    body: (
      <>
        Aquí vive el diseño visual. Vamos a crear un aspecto limpio inspirado en CBS: fondo blanco, barra de acento azul a la izquierda y cargo en azul y mayúsculas. La entrada usa transiciones CSS con <strong className={STRONG}>easing cubic-bezier</strong> para lograr ese acabado de calidad broadcast.
      </>
    ),
    tipTitle: "Consejo de diseño",
    tip: (
      <>
        El easing <code className={CODE_AMBER}>cubic-bezier(0.16, 1, 0.3, 1)</code> es la clave — arranca rápido y decelera con suavidad, lo que da ese movimiento ágil tan propio del broadcast. La animación de salida usa <code className={CODE_AMBER}>cubic-bezier(0.76, 0, 0.24, 1)</code> para una salida rápida y contundente.
      </>
    ),
  },
  step5: {
    title: "Escribe la lógica — el Web Component",
    body: (
      <>
        Este es el corazón de tu grafismo OGraf. Es un Web Component estándar que el renderizador controla llamando a seis métodos — cinco pasos lineales del ciclo de vida más <code className={CODE_SLATE_LIGHT}>customAction</code> para extras propios del grafismo. Cada uno devuelve una Promise: <strong className={STRONG}>el renderizador espera a que termine tu animación antes de hacer cualquier otra cosa.</strong>
      </>
    ),
    lifecycle: {
      load: "Recibe datos",
      play: "Anima la entrada",
      update: "Cambia datos",
      stop: "Anima la salida",
      dispose: "Limpia",
    },
    howTitle: "Cómo funciona",
    how: [
      <><strong>_initDom()</strong> — Un helper privado e idempotente. El primer método público que se ejecuta lo llama para asignar <code className={CODE_BLUE}>innerHTML</code> y guardar las referencias a los elementos. Así el grafismo funciona tanto si el renderizador inserta el elemento antes de llamar a <code className={CODE_BLUE}>load()</code> como si lo hace después.</>,
      <><strong>load()</strong> — Recibe los datos del operador (nombre + cargo) y los coloca en el DOM. Todavía sin animación.</>,
      <><strong>playAction()</strong> — Calcula a qué paso ir a partir de <code className={CODE_BLUE}>goto</code> / <code className={CODE_BLUE}>delta</code>, exactamente como lo define la especificación. Un rótulo inferior tiene un solo paso, así que el primer play cae en el paso 0: añade la clase <code className={CODE_BLUE}>.visible</code>, espera 700ms a que termine la entrada y devuelve <code className={CODE_BLUE}>currentStep: 0</code>. Un segundo play se pasa del último paso, así que el grafismo sale de antena y devuelve <code className={CODE_BLUE}>currentStep: undefined</code> — en eso se basa el botón "siguiente" de un controlador.</>,
      <><strong>updateAction()</strong> — Cambia el contenido del texto. La comprobación es <code className={CODE_BLUE}>!== undefined</code> y no si el valor es truthy, de modo que si un operador vacía un campo, este se borra de verdad. En producción añadirías una animación suave para el cambio de texto.</>,
      <><strong>stopAction()</strong> — Añade la clase <code className={CODE_BLUE}>.out</code> para la animación de salida y espera 500ms. Cada acción incrementa <code className={CODE_BLUE}>_rev</code>, y el stop solo oculta el grafismo si no ha empezado nada más reciente — si no, un operador que volviera a pulsar play en plena salida acabaría con la pantalla vacía.</>,
      <><strong>customAction()</strong> — OGraf exige que todo grafismo exponga este método, aunque el manifiesto no declare ninguna. Recibe <code className={CODE_BLUE}>{"{ id, payload, skipAnimation }"}</code>; si no hay nada declarado, responder a cualquier <code className={CODE_BLUE}>id</code> con un 4xx como <code className={CODE_BLUE}>statusCode: 404</code> es el comportamiento por defecto correcto.</>,
      <><strong>dispose()</strong> — Vacía el DOM y reinicia <code className={CODE_BLUE}>_initialized</code> para que una nueva carga lo reconstruya todo limpiamente. Se llama cuando el grafismo se elimina del renderizador por completo.</>,
    ],
  },
  step6: {
    title: "Pruébalo",
    body: "Tu grafismo está listo. Así puedes probarlo:",
    optionA: {
      title: "Opción A: usa la demo en directo de arriba",
      desc: "Sube un poco — la vista previa interactiva de la parte superior de esta página ejecuta exactamente el mismo código. Pulsa Reproducir, cambia el texto, pulsa Actualizar y pulsa Detener.",
    },
    optionB: {
      title: "Opción B: verifica tu paquete",
      desc: (rules: number) => `Comprime la carpeta en un .zip y suéltalo en /check. Obtendrás un informe estructurado con ${rules} reglas y el schema vigente de la EBU.`,
      link: "Abrir el verificador",
    },
    optionC: {
      title: "Opción C: cárgalo en un renderizador OGraf",
      desc: "Despliégalo en un renderizador compatible: ograf-server (referencia autoalojada), SPX-GC (controlador en el navegador) o CasparCG (mediante el HTML producer). Tienes los enlaces en la tarjeta de descarga de abajo.",
    },
  },
  downloadTitle: "Rótulo inferior estilo CBS",
  done: {
    title: "Has creado un grafismo OGraf.",
    body: "Este paquete funciona con cualquier sistema compatible con OGraf — SPX, ograf-server, CasparCG (mediante el HTML producer) y más. Los mismos archivos, en todas partes.",
    spec: "Lee la especificación completa",
    more: "Explora más plantillas",
  },
};
