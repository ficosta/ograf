import { CODE_BLUE, CODE_SLATE, STRONG } from "../tutorial-ui/styles";
import type { TutorialTickerCopy } from "./en";

export const es: TutorialTickerCopy = {
  title: "Crea un ticker de noticias.",
  lead: "El rótulo de texto que se desplaza por la parte inferior de la pantalla — CNN, BBC News, Bloomberg. Los titulares avanzan sin parar de derecha a izquierda. Este tutorial trata las animaciones CSS infinitas, los arrays de datos dinámicos y los bucles sin cortes.",
  demo: {
    badge: "Texto de la etiqueta",
    items: "Titulares",
    heading: "Ticker de noticias — plantilla OGraf",
  },
  diffTitle: "¿Qué hace diferente a un ticker?",
  diffs: [
    { title: "Desplazamiento infinito", body: <>Usa <code className={CODE_SLATE}>@keyframes</code> de CSS con repetición <code className={CODE_SLATE}>infinite</code> en <code className={CODE_SLATE}>.ticker-content</code> (20s por ciclo). El contenido se duplica para que el bucle no tenga cortes.</> },
    { title: "Datos en array", body: <>En lugar de campos sueltos, el schema acepta un <strong>array de titulares</strong>. Cada elemento pasa uno tras otro.</> },
    { title: "Barra a todo lo ancho", body: <>Ocupa todo el borde inferior en una barra de 48px. La etiqueta azul (el campo <code className={CODE_SLATE}>badge</code>) va a la izquierda y el texto se desplaza a su derecha.</> },
  ],
  loopTitle: "El truco del bucle sin cortes",
  loopBody: (
    <>
      El ticker <strong className={STRONG}>duplica todos los titulares</strong> para que el desplazamiento parezca infinito. Cuando el primer bloque sale por completo de la pantalla, el segundo ya ha ocupado su lugar — la animación se reinicia sin que se note. Cada titular pasa por <code className={CODE_SLATE}>escapeHtml()</code> antes de llegar a <code className={CODE_SLATE}>innerHTML</code>, así que un titular que contenga <code className={CODE_SLATE}>&lt;</code> o <code className={CODE_SLATE}>&amp;</code> se muestra como texto. <code className={CODE_SLATE}>_applyData()</code> solo vuelve a renderizar cuando <code className={CODE_SLATE}>items</code> es un array, y un <code className={CODE_SLATE}>loop: false</code> opcional (lo usa el selector de modo de reproducción de la demo; no está en el schema del manifiesto) hace que el rótulo pase una sola vez y se quede quieto en lugar de repetirse.
    </>
  ),
  renderFile: "graphic.mjs (renderizado de los datos)",
  cssTitle: "La animación de desplazamiento en CSS",
  keyParts: "style.css (partes clave)",
  whyTitle: "¿Por qué -50%?",
  why: (
    <>
      <code className={CODE_BLUE}>_renderItems</code> escribe los titulares dos veces, cada uno seguido de su separador, y todos los hijos de <code className={CODE_BLUE}>.ticker-content</code> llevan el mismo margen final de 40px. Por eso las dos mitades miden exactamente lo mismo, y desplazar un -50% lleva la copia justo al punto donde empezaba el original — cuando la animación se reinicia, no hay ningún salto. También por eso el espaciado es un margen y no <code className={CODE_BLUE}>gap</code> ni <code className={CODE_BLUE}>padding-left</code>: cualquiera de los dos haría que las mitades fueran distintas. <code className={CODE_BLUE}>.ticker-track</code> lo recorta todo con <code className={CODE_BLUE}>overflow: hidden</code>.
    </>
  ),
  promiseTitle: "Una animación infinita, una promise inmediata",
  promiseBody: (
    <>
      El rótulo no termina nunca, pero <code className={CODE_SLATE}>playAction()</code> se resuelve tras los 500ms en que sube la barra. La especificación dice que las animaciones largas o infinitas no deben retrasar la promise — el renderizador necesita saber que el grafismo está en antena, no cuándo termina el rótulo. El modelo de pasos es el de la especificación: el primer play cae en el paso 0 y un segundo play saca de antena el ticker de un solo paso y devuelve <code className={CODE_SLATE}>currentStep: undefined</code>. <code className={CODE_SLATE}>stopAction()</code> baja la barra en 400ms y comprueba <code className={CODE_SLATE}>this._rev</code> antes de ocultarla, así que un play enviado durante ese stop tiene prioridad.
    </>
  ),
  playFile: "graphic.mjs (play y stop)",
  downloadTitle: "Ticker de noticias",
  manifestIntro: "Fíjate en que el schema usa un array de strings para los titulares, no un único campo de texto. Los controladores lo muestran como una lista en la que el operador puede añadir, quitar y reordenar elementos.",
  done: {
    title: "Ticker terminado.",
    body: "Has aprendido animaciones CSS infinitas, schemas con arrays de datos, el truco de duplicar el contenido para un bucle sin cortes y por qué un rótulo interminable resuelve igualmente playAction al momento.",
    next: "Siguiente: cita a pantalla completa",
  },
};
