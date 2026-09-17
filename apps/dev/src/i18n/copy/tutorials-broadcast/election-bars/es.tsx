import type { ElectionBarsCopy } from "./en";
import { CODE, CODE_AMBER, CODE_BLUE_LIGHT, STRONG } from "../styles";

export const es: ElectionBarsCopy = {
  title: "Crea barras de resultados electorales.",
  intro: "Las barras electorales son la columna vertebral de la cobertura de una noche electoral — piensa en la noche electoral de la CNN o en la retransmisión de las elecciones generales de la BBC. Cada fila representa a un partido con una barra de su color que crece hasta su porcentaje de voto, lo que da una comparación de resultados contundente y que se entiende de un vistazo.",
  demoTitle: "Barras electorales — plantilla OGraf",
  fields: { title: "Título", subtitle: "Subtítulo", parties: "Partidos" },
  differentTitle: "¿Qué cambia respecto a un rótulo inferior?",
  cards: [
    {
      title: "Anchos guiados por datos",
      body: (
        <>
          Cada relleno lleva su porcentaje en <code className={CODE}>data-pct</code>, y <code className={CODE}>_animateBars</code> fija <code className={CODE}>fill.style.width = pct + '%'</code> en línea. Lo visual lo controlan los datos, no una clase CSS.
        </>
      ),
    },
    {
      title: "Aparición escalonada",
      body: (
        <>
          Las filas reciben la clase <code className={CODE}>show</code> con 120 ms de diferencia, sumados a un <code className={CODE}>transition-delay</code> en línea de 100 ms por fila, así que entran en cascada de arriba abajo.
        </>
      ),
    },
    {
      title: "Identidad por color",
      body: (
        <>
          El <code className={CODE}>color</code> de cada partido viene de los datos y se convierte en el fondo en línea del relleno — sin paleta fija en el código. Sirve para cualquier elección, cualquier país y cualquier sistema de partidos.
        </>
      ),
    },
  ],
  renderTitle: "Renderizar las barras",
  renderBody: (
    <>
      <code className={CODE}>_renderBars</code> construye una <code className={CODE}>.election-row</code> por partido: nombre y número de votos a la izquierda, una pista con un relleno de color a la derecha y una etiqueta de porcentaje que empieza en <code className={CODE}>0%</code>. El nombre y el color pasan por <code className={CODE}>escapeHtml</code>, y <code className={CODE}>pct</code> y <code className={CODE}>votes</code> por <code className={CODE}>Number()</code>, para que los datos del operador no puedan inyectar marcado. El truque clave: <strong className={STRONG}>todavía no crece nada</strong>. Cada relleno empieza en <code className={CODE}>width: 0</code>, y su valor objetivo espera en <code className={CODE}>data-pct</code> hasta que se ejecuta <code className={CODE}>_animateBars</code>.
    </>
  ),
  animateBody: (
    <>
      <code className={CODE}>_animateBars</code> muestra las filas con 120 ms de diferencia; a los 200 ms escribe el ancho de cada relleno y lleva cada etiqueta al extremo de la barra; 150 ms después, la etiqueta cuenta desde 0 hacia arriba durante 900 ms con una curva ease-out. Un <code className={CODE}>updateAction</code> posterior que incluya <code className={CODE}>parties</code> vuelve a renderizar las filas; en antena ejecuta <code className={CODE}>_animateBars</code> otra vez para que las barras crezcan hasta los nuevos resultados, y fuera de antena las deja preparadas para el siguiente play. Cada temporizador dentro de <code className={CODE}>_animateBars</code> comprueba la revisión con la que empezó, así que un stop que llega a mitad de la aparición nunca se sobrescribe, y <code className={CODE}>stopAction</code> llama a <code className={CODE}>_resetBars</code> cuando el panel ya ha desaparecido para que al volver a dar play las barras crezcan de nuevo desde cero.
    </>
  ),
  playTitle: "Ponerlo en antena",
  playBody: (
    <>
      <code className={CODE}>playAction</code> sigue el modelo de pasos de OGraf. <code className={CODE}>resolveTargetStep</code> elige el destino: <code className={CODE}>goto</code> si se indica; si no, el paso actual (-1 antes del primer play) más <code className={CODE}>delta</code>, que por defecto vale 1. Este grafismo tiene un paso, así que el primer play cae en el paso 0 y un segundo play va más allá del final — el grafismo ejecuta <code className={CODE}>stopAction</code> y devuelve <code className={CODE}>currentStep: undefined</code>. En el paso 0 añade <code className={CODE}>visible</code> para que el panel suba, espera 400 ms, arranca las barras y se resuelve 1400 ms después. Con <code className={CODE}>skipAnimation</code> añade <code className={CODE}>instant</code> a la raíz — una clase que desactiva todas las transiciones — y <code className={CODE}>_showBarsInstantly</code> fija de golpe los anchos y las etiquetas finales.
    </>
  ),
  revTitle: "¿Por qué el contador de revisiones?",
  revBody: (
    <>
      Cada play y cada stop toman el siguiente <code className={CODE_BLUE_LIGHT}>this._rev</code>. Si llega una acción más reciente durante la espera de 400 ms, <code className={CODE_BLUE_LIGHT}>playAction</code> se salta <code className={CODE_BLUE_LIGHT}>_animateBars</code>, y un <code className={CODE_BLUE_LIGHT}>stopAction</code> obsoleto no oculta el panel — así que play → stop → play enviados sin esperar terminan en antena.
    </>
  ),
  cssTitle: "El CSS — animación de las barras",
  cssBody: (
    <>
      Las filas entran deslizándose 20px desde la izquierda cuando reciben <code className={CODE}>show</code>. El relleno hace la transición de <code className={CODE}>width</code> en 1.2 s, y la etiqueta de porcentaje hace la de <code className={CODE}>left</code> con la misma duración y curva, de modo que acompaña al extremo de la barra mientras crece. El reset del principio está acotado con <code className={CODE}>:where(.election-bars-root, …)</code>, así que nunca cambia los estilos de la página del renderizador.
    </>
  ),
  tipTitle: "Consejo de diseño",
  tipBody: (
    <>
      Usa etiquetas de porcentaje asimétricas. <code className={CODE_AMBER}>_renderBars</code> le da a la etiqueta la clase <strong>inside</strong> cuando el partido tiene un 15% o más (texto blanco, metido dentro de la barra) y <strong>outside</strong> por debajo de eso (texto oscuro justo después del final de la barra). Las barras diminutas nunca tienen que albergar una etiqueta que no les cabe — un error habitual en los grafismos electorales.
    </>
  ),
  formatTitle: "Formato de los números",
  formatBody: (
    <>
      Los recuentos de votos grandes cuestan de leer sin separadores. <code className={CODE}>_renderBars</code> escribe <code className={CODE}>{"(Number(p.votes) || 0).toLocaleString()"}</code>, que añade separadores de millares según la configuración regional del renderizador — <strong className={STRONG}>1.284.000</strong> se lee mucho mejor que 1284000. <code className={CODE}>votes</code> es opcional en el schema, así que un valor ausente se muestra como 0. La etiqueta de porcentaje se formatea aparte: <code className={CODE}>_countUp</code> redondea cada fotograma de la animación a un número entero.
    </>
  ),
  manifestTitle: "Barras electorales",
  manifestIntro: "El campo parties es un array tipado — items.type es object, con name, pct y color obligatorios. Así declara OGraf datos estructurados que se repiten.",
  doneTitle: "Barras electorales terminadas.",
  doneBody: "Anchos guiados por datos, apariciones escalonadas, partidos identificados por color y un modelo de pasos conforme a la especificación — todo lo que necesitas para cubrir una noche electoral.",
  codeLabels: {
    rendering: "renderizado",
    animation: "animación",
    stepModel: "modelo de pasos",
    keyParts: "partes clave",
    countUp: "conteo ascendente",
  },
  next: "Siguiente: Alineación deportiva",
};
