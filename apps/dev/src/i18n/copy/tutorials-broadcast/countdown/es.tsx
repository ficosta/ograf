import type { CountdownCopy } from "./en";
import { CODE, CODE_AMBER, STRONG } from "../styles";

export const es: CountdownCopy = {
  title: "Crea una cuenta atrás.",
  intro: (
    <>
      Las cuentas atrás se usan en todas partes en televisión — antes de que empiece un programa, para cronometrar secciones, en subastas y en eventos. Este grafismo es especial porque <strong className={STRONG}>cuenta el tiempo por sí solo</strong> con <code className={CODE}>setInterval</code> — una vez arranca, no necesita ninguna llamada de actualización externa.
    </>
  ),
  demoTitle: "Cuenta atrás — plantilla OGraf",
  fields: { label: "Etiqueta", seconds: "Segundos" },
  differentTitle: "¿Qué cambia respecto a otros grafismos?",
  cards: [
    {
      title: "Cuenta por sí solo",
      body: (
        <>
          Usa <code className={CODE}>setInterval</code> internamente. Una vez ha entrado, descuenta el tiempo por su cuenta. El renderizador no necesita hacer ninguna llamada a <code className={CODE}>updateAction</code>.
        </>
      ),
    },
    {
      title: "Estado de urgencia",
      body: <>Cuando quedan 10 segundos o menos, las cifras se vuelven rojas y laten, señalando urgencia al espectador sin que intervenga el operador.</>,
    },
    {
      title: "Cierre limpio",
      body: (
        <>
          El intervalo <strong>debe</strong> limpiarse tanto en <code className={CODE}>stopAction()</code> como en <code className={CODE}>dispose()</code>. Olvidar cualquiera de los dos deja un temporizador fantasma funcionando en segundo plano.
        </>
      ),
    },
  ],
  tickTitle: "El motor de la cuenta",
  tickBody: (
    <>
      <code className={CODE}>_startTicking</code> limpia cualquier intervalo anterior y arranca uno nuevo de 1 segundo. En cada tic decrementa <code className={CODE}>_remaining</code>, vuelve a pintar el reloj y activa o desactiva la clase <code className={CODE}>urgent</code> a los 10 segundos. Al llegar a cero se detiene solo y deja 00:00 en pantalla. <code className={CODE}>_paintTime</code> solo toca el span de minutos o de segundos cuyo texto ha cambiado de verdad, y <code className={CODE}>_swap</code> reinicia la animación <code className={CODE}>tick</code> de ese span con un reflow forzado.
    </>
  ),
  playTitle: "Arrancar después de la entrada",
  playBody: (
    <>
      <code className={CODE}>load</code> pinta el tiempo inicial a partir del campo <code className={CODE}>seconds</code>; el reloj solo empieza a moverse con el play. <code className={CODE}>playAction</code> sigue el modelo de pasos de la especificación (<code className={CODE}>goto</code>, o si no el paso actual más <code className={CODE}>delta</code>). Con <code className={CODE}>stepCount: 1</code>, un segundo play va más allá del último paso, así que detiene el grafismo y devuelve <code className={CODE}>currentStep: undefined</code>. El intervalo solo arranca tras la entrada de 800 ms, y solo si <code className={CODE}>this._rev</code> no ha avanzado: a un stop enviado durante la entrada no puede seguirle un reloj que empieza a contar de todos modos. <code className={CODE}>updateAction</code> acepta datos parciales; si el reloj estaba en marcha, vuelve a empezar desde el nuevo valor.
    </>
  ),
  cleanupTitle: "Limpieza",
  cleanupBody: (
    <>
      <code className={CODE}>stopAction</code> limpia el intervalo antes de su salida de 500 ms, y <code className={CODE}>dispose</code> lo vuelve a limpiar e incrementa la revisión para que nada pendiente toque el elemento ya vaciado.
    </>
  ),
  tipTitle: "Consejo de diseño",
  tipBody: (
    <>
      Limpia siempre los intervalos en <code className={CODE_AMBER}>stopAction()</code> y <code className={CODE_AMBER}>dispose()</code>. En un entorno de broadcast, los grafismos se cargan y descargan constantemente. Un intervalo olvidado es un temporizador funcionando en segundo plano, que consume CPU y puede provocar comportamientos inesperados cuando se vuelve a cargar el grafismo.
    </>
  ),
  cssTitle: "El CSS: animación del tic y urgencia",
  cssBody: (
    <>
      Cada par de cifras que cambia sube deslizándose hasta su sitio en 0.36 s con la clase <code className={CODE}>tick</code>. Cuando entra la urgencia, el tiempo se vuelve rojo y late suavemente de tamaño una vez por segundo.
    </>
  ),
  manifestTitle: "Cuenta atrás",
  doneTitle: "Cuenta atrás terminada.",
  doneBody: "Cuenta propia con setInterval, un estado de urgencia y una limpieza correcta en stopAction() y dispose(): un grafismo de temporizador autónomo.",
  codeLabels: {
    ticking: "cuenta",
    keyParts: "partes clave",
  },
  next: "Siguiente: Última hora",
};
