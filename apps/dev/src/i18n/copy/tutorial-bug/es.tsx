import { CODE_AMBER, CODE_SLATE, STRONG } from "../tutorial-ui/styles";
import type { TutorialBugCopy } from "./en";

export const es: TutorialBugCopy = {
  title: "Crea una mosca / marca de agua.",
  lead: "Una mosca es un pequeño elemento de marca — indicador EN DIRECTO, logo del canal, distintivo de un evento — que se coloca en una esquina de la pantalla. Aparece con una animación de escala y se desvanece limpiamente.",
  demo: {
    label: "Etiqueta",
    sublabel: "Subetiqueta",
    heading: "Mosca — plantilla OGraf",
  },
  diffTitle: "¿Qué cambia respecto a un rótulo inferior?",
  diffs: [
    { title: "Posición", body: <>Esquina superior derecha. <code className={CODE_SLATE}>position: absolute; top: 40px; right: 40px</code> — nunca <code className={CODE_SLATE}>fixed</code>, que se escaparía al viewport en lugar de quedarse en el área de render de 1920×1080.</> },
    { title: "Animación", body: <>Escala desde el 50% + desenfoque en lugar de deslizamiento. Un efecto de "materialización" — menos intrusivo que un deslizamiento para algo que se queda en pantalla.</> },
    { title: "Punto EN DIRECTO pulsante", body: <>Un pulso con <code className={CODE_SLATE}>@keyframes</code> de CSS sobre un elemento hermano con posición absoluta crea el aviso EN DIRECTO al estilo broadcast sin nada de JavaScript.</> },
  ],
  downloadTitle: "Mosca de esquina",
  cssTitle: "El CSS clave — animación de escala + desenfoque",
  cssBody: (
    <>
      En lugar de entrar deslizándose, la mosca <strong className={STRONG}>crece desde el 50% con un desenfoque de 8px</strong>. El estado de reposo vive en <code className={CODE_SLATE}>.bug</code>; el JavaScript solo alterna las clases <code className={CODE_SLATE}>visible</code> y <code className={CODE_SLATE}>out</code>. Así se consigue un sutil efecto de "materialización", menos intrusivo que un deslizamiento — perfecto para algo que se queda en la esquina.
    </>
  ),
  keyParts: "style.css (partes clave)",
  tipTitle: "Consejo de diseño",
  tip: (
    <>
      La animación de entrada es un ease-out de 0.6s que se asienta con suavidad; la de salida (<code className={CODE_AMBER}>.bug.out</code>) solo encoge hasta el 80% (no el 50%) en un ease-in-out más corto, de 0.4s, y la opacidad y el desenfoque desaparecen en 0.3s. Esta asimetría — entrada suave, salida rápida — resulta natural. El ojo se fija en la entrada, pero apenas registra la salida.
    </>
  ),
  componentTitle: "El Web Component",
  componentBody: (
    <>
      La misma estructura que el rótulo inferior: un <code className={CODE_SLATE}>&lt;link&gt;</code> a la hoja de estilos (URL absoluta mediante <code className={CODE_SLATE}>import.meta.url</code>), un <code className={CODE_SLATE}>_initDom()</code> diferido y los seis métodos del ciclo de vida. Sin <code className={CODE_SLATE}>customElements.define()</code> a nivel de módulo — la etiqueta la elige el renderizador. Este es el archivo completo de la descarga:
    </>
  ),
  notes: [
    { title: "Pasos.", body: <><code className={CODE_SLATE}>resolveTargetStep()</code> sigue la especificación: <code className={CODE_SLATE}>goto</code> si se indica; si no, el paso actual (-1 antes del primer play) más <code className={CODE_SLATE}>delta</code> (1 por defecto). La mosca tiene un solo paso, así que el primer play la pone en antena en el paso 0 y un segundo play la saca de antena y devuelve <code className={CODE_SLATE}>currentStep: undefined</code>.</> },
    { title: "Acciones desordenadas.", body: <>Cada acción incrementa <code className={CODE_SLATE}>this._rev</code>. <code className={CODE_SLATE}>stopAction()</code> solo quita <code className={CODE_SLATE}>.visible</code> tras sus 400ms si no ha empezado ninguna acción más reciente, así que play → stop → play enviados sin esperar terminan en antena.</> },
    { title: "Actualizaciones parciales.", body: <><code className={CODE_SLATE}>load()</code> y <code className={CODE_SLATE}>updateAction()</code> aplican cada campo que sea <code className={CODE_SLATE}>!== undefined</code>: envía solo <code className={CODE_SLATE}>sublabel</code> para cambiar únicamente ese campo, o una cadena vacía para borrarlo.</> },
    { title: "Acciones personalizadas.", body: <>El renderizador llama a <code className={CODE_SLATE}>customAction(&#123; id, payload, skipAnimation &#125;)</code> con un <code className={CODE_SLATE}>id</code> tomado de <code className={CODE_SLATE}>customActions</code> en el manifiesto. La mosca no declara ninguna, así que cualquier id recibe <code className={CODE_SLATE}>&#123; statusCode: 404, statusMessage &#125;</code> — 4xx es el rango de error de la especificación.</> },
  ],
  done: {
    title: "Mosca terminada.",
    body: "El mismo patrón de paquete OGraf — manifiesto, CSS, Web Component. Otro aspecto, la misma interoperabilidad.",
    next: "Siguiente: ticker de noticias",
  },
};
