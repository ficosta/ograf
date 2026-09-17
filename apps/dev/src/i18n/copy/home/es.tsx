import type { HomeCopy } from "./en";
import { BRAND } from "./styles";

export const es: HomeCopy = {
  heroBefore: "La",
  heroAfter: "que le faltaba a OGraf.",
  rotatingWords: ["comunidad", "guía", "referencia", "plataforma", "casa", "web"],
  heroLead:
    "OGraf es un nuevo formato abierto para grafismo de televisión. Sin atarte a un fabricante, sin runtimes propietarios: un único paquete que funciona en cualquier sistema compatible.",
  startTutorial: "Empezar el tutorial",
  exploreTools: "Ver las herramientas",
  adopters: {
    heading: "Fabricantes y adoptantes",
    vendorsLabel: "Fabricantes",
    organisationsLabel: "Organizaciones de radiodifusión",
    sourcePrefix: "Empresas y cadenas que figuran como fabricantes y adoptantes de OGraf en",
  },
  featuresTitle: "Por qué importa OGraf.",
  featuresLead:
    "El mercado del grafismo para broadcast siempre ha dependido de sistemas cerrados y propios de cada fabricante. OGraf añade una capa abierta y nativa de la web que cualquiera puede renderizar, controlar y poner en antena.",
  features: {
    open: {
      title: "Estándar abierto",
      desc: "Sin ataduras. Sin licencias. Sin intermediarios. Licencia MIT y respaldo de la EBU: tus grafismos son tuyos, no de la factura de un fabricante.",
    },
    web: {
      title: "Nativo de la web",
      desc: "Si sabes hacer una web, sabes hacer grafismo para televisión. HTML, CSS, JavaScript: las habilidades que ya tienes, en antena y en directo.",
    },
    interop: {
      title: "Interoperable",
      desc: "Constrúyelo una vez. Úsalo en cualquier parte. El mismo paquete OGraf funciona en SPX, CasparCG, Loopic y cualquier sistema compatible, sin rehacer nada ni convertir.",
    },
  },
  compareTitle: "Dónde encaja OGraf.",
  compareLead:
    "El grafismo para broadcast es un sector profundo y maduro: Vizrt, Chyron, Ross, Avid, Singular, Flowics y muchos otros mueven las mayores producciones del mundo. OGraf no viene a sustituirlos. Añade una capa abierta y portable para que el mismo grafismo pueda pasar de un sistema a otro.",
  featureColumn: "Característica",
  systemNotes: ["Especificación abierta", "Viz Engine", "PRIME / LyricX", "XPression", "Maestro", "Nube", "Nube"],
  rows: [
    { feature: "Especificación abierta" },
    { feature: "Nativo de la web (HTML/CSS/JS)" },
    { feature: "Portable entre renderizadores", note: "El mismo paquete funciona en cualquier sistema compatible" },
    { feature: "Opción de alojamiento propio" },
    { feature: "Implementación de referencia de código abierto" },
    { feature: "Renderizado en la nube disponible" },
  ],
  legend: {
    yes: "Compatible",
    partial: "Parcial / mediante complemento",
    no: "No compatible",
  },
  compareFootnote: (
    <>
      Esta tabla se centra en un solo eje: si un grafismo creado en un sistema se puede renderizar en otro. Cada plataforma de la lista se ha ganado su sitio resolviendo problemas reales de producción; la aportación de OGraf es el formato compartido, no un sustituto de los runtimes en los que los equipos ya confían. Plataformas especializadas como <span className={BRAND}>Brainstorm</span>, <span className={BRAND}>Aximmetry</span>, <span className={BRAND}>WASP3D</span> y <span className={BRAND}>Zero Density</span> lideran en platós virtuales, AR y XR; stacks abiertos como <span className={BRAND}>CasparCG</span>, <span className={BRAND}>SPX-GC</span> y <span className={BRAND}>ograf-server</span> ya renderizan paquetes OGraf de forma nativa.
    </>
  ),
  ecosystemTitle: "Un ecosistema de herramientas en crecimiento.",
  ecosystemLead:
    "De renderizadores de referencia a editores sin código, el ecosistema OGraf tiene todo lo que necesitas para crear, probar y desplegar grafismo para televisión.",
  tools: {
    "SPX-GC": {
      cat: "Controlador",
      desc: "Controlador de grafismo profesional en el navegador para producciones en directo. Compatible con CasparCG, OBS y vMix.",
    },
    CasparCG: {
      cat: "Renderizador",
      desc: "Servidor profesional de código abierto de playout de grafismo y vídeo, con salida SDI y NDI.",
    },
    Ferryman: {
      cat: "Conversor",
      desc: "Convierte animaciones de After Effects y Lottie en plantillas HTML compatibles con OGraf.",
    },
    "ograf-server": {
      cat: "Servidor",
      desc: "Renderizador OGraf de referencia con API de subida, API de control y renderizado en el navegador.",
    },
    Loopic: {
      cat: "Editor",
      desc: "Creador de plantillas de grafismo para televisión en el navegador, sin código, con exportación a OGraf en un clic.",
    },
  },
  viewEcosystem: "Ver el mapa completo del ecosistema",
  statsTitle: "OGraf en cifras.",
  statsLead: "El estándar respaldado por la EBU se usa activamente en toda la industria del grafismo para broadcast.",
  stats: [
    { stat: "EBU", label: "Un grupo de trabajo mantiene la especificación en GitHub" },
    { stat: "v1 estable", label: "Graphics Definition estable desde septiembre de 2025" },
    { stat: "10+", label: "Herramientas y renderizadores compatibles con el estándar OGraf" },
  ],
  tutorialsTitle: "Aprende creando grafismos reales.",
  tutorialsSubtitle:
    "Cada tutorial construye desde cero un grafismo para televisión con calidad de producción, con demos interactivas en directo.",
  faqTitle: "Preguntas frecuentes.",
};
