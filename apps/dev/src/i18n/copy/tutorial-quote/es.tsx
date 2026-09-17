import { CODE_AMBER, CODE_SLATE_SM, STRONG } from "../tutorial-ui/styles";
import type { TutorialQuoteCopy } from "./en";

export const es: TutorialQuoteCopy = {
  title: "Crea una cita a pantalla completa.",
  lead: "Una elegante tarjeta de cita a pantalla completa — como las que se usan para frases de entrevistas, secciones motivacionales o entradillas editoriales. El texto, el separador y la atribución aparecen en una secuencia escalonada con impacto cinematográfico.",
  demo: {
    text: "Cita",
    author: "Autor",
    role: "Cargo",
    heading: "Cita a pantalla completa — plantilla OGraf",
  },
  staggerTitle: "La técnica de aparición escalonada",
  staggerBody: (
    <>
      La magia está en los <strong className={STRONG}>retardos de las transiciones CSS</strong>. El texto y la atribución empiezan transparentes y un poco por debajo de su posición final; el separador empieza con ancho cero. Al añadir la clase <code className={CODE_SLATE_SM}>.visible</code>, se animan en secuencia:
    </>
  ),
  stagger: [
    { delay: "0.3s", element: "Texto de la cita", desc: "Aparece subiendo desde abajo" },
    { delay: "0.4s", element: "Línea separadora", desc: "Crece desde el centro" },
    { delay: "0.5s", element: "Atribución", desc: "Aparece subiendo al final" },
  ],
  cssTitle: "El CSS — transiciones escalonadas",
  cssBody: (
    <>
      Todo vive dentro de <code className={CODE_SLATE_SM}>.quote-root</code>. El reset se limita con <code className={CODE_SLATE_SM}>:where(.quote-root, …)</code>, así que nunca cambia los estilos de la página del renderizador, y la raíz ocupa la caja que proporcione el renderizador con <code className={CODE_SLATE_SM}>position: absolute; inset: 0</code>. El estado oculto de cada hijo (como <code className={CODE_SLATE_SM}>.quote-text</code> a continuación) está 20px más abajo y con opacidad cero; las reglas de <code className={CODE_SLATE_SM}>.visible</code> llevan los retardos.
    </>
  ),
  cssFile: "style.css (partes clave)",
  tipTitle: "Consejo de diseño",
  tip: (
    <>
      El fondo parte de <code className={CODE_AMBER}>scale(1.1)</code> y hace la transición a <code className={CODE_AMBER}>scale(1)</code>. Así se crea un sutil efecto de "cámara que se asienta" — el fondo se ajusta suavemente mientras aparece la cita. Aire cinematográfico con una sola línea de CSS.
    </>
  ),
  typeTitle: "Decisiones tipográficas",
  typeBody: (
    <>
      Esta plantilla usa <strong className={STRONG}>dos fuentes</strong> para crear contraste:
    </>
  ),
  serifSample: "\"La cita\"",
  serifDesc: "Instrument Serif — cursiva, grande (48px). La voz editorial y elegante.",
  sansSample: "La atribución",
  sansRole: "CARGO / TÍTULO",
  sansDesc: "Inter — sans-serif limpia y moderna. La voz informativa.",
  timingTitle: "Los tiempos de playAction",
  timing: [
    <>Como la animación escalonada dura más que un simple deslizamiento, la promise de <code className={CODE_SLATE_SM}>playAction()</code> espera <strong className={STRONG}>1300ms</strong> antes de resolverse — lo que dura la aparición más lenta. Para entonces el fondo (1s), el texto de la cita (0.3s de retardo + 0.8s), el separador (0.4s + 0.6s) y la atribución (0.5s + 0.8s) ya están en su sitio. <code className={CODE_SLATE_SM}>stopAction()</code> desvanece la tarjeta entera en 500ms.</>,
    <>El resto sigue el modelo de pasos de OGraf. <code className={CODE_SLATE_SM}>resolveTargetStep()</code> toma <code className={CODE_SLATE_SM}>goto</code> si se indica; si no, el paso actual más <code className={CODE_SLATE_SM}>delta</code> (1 por defecto). El primer play pone la cita en antena en el paso 0; un segundo play se pasa del único paso, así que ejecuta el stop y devuelve <code className={CODE_SLATE_SM}>currentStep: undefined</code>. Cada acción incrementa <code className={CODE_SLATE_SM}>this._rev</code>, y un stop solo quita <code className={CODE_SLATE_SM}>.visible</code> si no ha empezado nada más reciente — play → stop → play sin esperar termina en antena.</>,
  ],
  playFile: "graphic.mjs (partes clave)",
  downloadTitle: "Cita a pantalla completa",
  done: {
    title: "Cita terminada.",
    body: "Has aprendido transiciones CSS escalonadas, composiciones a pantalla completa, contraste tipográfico y cómo coordinar los tiempos entre CSS y JavaScript.",
    spec: "Lee la guía de la especificación",
  },
};
