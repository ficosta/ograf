import type { BreakingNewsCopy } from "./en";
import { CODE, CODE_BLUE } from "../styles";

export const es: BreakingNewsCopy = {
  title: "Crea una alerta de última hora.",
  intro: (
    <>
      La alerta de última hora es una interrupción a pantalla completa — una capa roja y llamativa que exige atención. A diferencia de otros grafismos, usa <code className={CODE}>stepCount: 0</code>, es decir, es de tipo "lanzar y olvidar": un play la pone en antena, se mantiene y se retira sola sin que el operador tenga que sacarla.
    </>
  ),
  demoTitle: "Última hora — plantilla OGraf",
  fields: { headline: "Titular" },
  differentTitle: "¿Qué cambia respecto a otros grafismos?",
  cards: [
    {
      title: "Lanzar y olvidar",
      body: (
        <>
          <code className={CODE}>stepCount: 0</code> en el manifiesto. El grafismo entra, se mantiene 3.5 s y se retira solo. No hace falta que ningún operador lo saque, aunque un stop puede cortarlo antes.
        </>
      ),
    },
    {
      title: "Capa a pantalla completa",
      body: <>Llena toda la caja del grafismo con un fondo negro al 85% y desenfocado. La etiqueta roja "Breaking News" y el titular quedan centrados encima.</>,
    },
    {
      title: "Aparición escalonada",
      body: (
        <>
          Una sola clase <code className={CODE}>visible</code> controla tres elementos con distintos retardos de transición: la etiqueta, luego el titular y luego la línea de acento.
        </>
      ),
    },
  ],
  dismissTitle: "El patrón de retirada automática",
  timingBody: "Los tiempos están en tres constantes: 1.2 s para que termine la entrada, 3.5 s en antena y 0.6 s para la salida.",
  playBody: (
    <>
      <code className={CODE}>playAction</code> añade la clase <code className={CODE}>visible</code> y solo espera a la entrada. Después arranca <code className={CODE}>_autoDismiss</code> sin esperarlo y devuelve <code className={CODE}>currentStep: undefined</code>. La permanencia y la salida siguen en segundo plano, y el renderizador puede enviar su siguiente acción en cuanto la alerta está en pantalla.
    </>
  ),
  insightTitle: "Clave: stepCount: 0",
  insightBody: (
    <>
      <code className={CODE_BLUE}>stepCount: 0</code> le dice al renderizador que el grafismo no tiene pasos propios: entra y termina solo. El renderizador sigue llamando a <code className={CODE_BLUE}>playAction</code>, que debe devolver <code className={CODE_BLUE}>currentStep: undefined</code>. La especificación dice que la promesa debe resolverse cuando el grafismo esté listo para la siguiente acción, así que se resuelve tras la entrada (<code className={CODE_BLUE}>IN_MS</code>), no tras toda la permanencia y la salida.
    </>
  ),
  stopTitle: "Retirarla antes de tiempo",
  stopBody: (
    <>
      "Lanzar y olvidar" no significa que no se pueda parar. El renderizador puede llamar a <code className={CODE}>stopAction</code> para retirar la alerta antes de que acabe la permanencia, y <code className={CODE}>updateAction</code> puede cambiar el titular mientras está en antena. Cada acción toma el siguiente <code className={CODE}>this._rev</code>. El <code className={CODE}>_autoDismiss</code> en segundo plano comprueba ese número tras la permanencia y otra vez tras la salida, así que una retirada pendiente de un play anterior nunca oculta uno más reciente: play → stop → play enviados sin esperar terminan en antena. <code className={CODE}>customAction</code> tiene que existir aunque el manifiesto no declare ninguna, y responde a cualquier id con 404.
    </>
  ),
  cssTitle: "El CSS: diseño de urgencia",
  cssBody: (
    <>
      Toda la capa aparece con un fundido de 0.4 s. Dentro, la etiqueta crece desde el centro tras 0.2 s, el titular sube a su sitio tras 0.4 s y la línea de acento se dibuja tras 0.6 s: todo lo arranca la misma clase <code className={CODE}>visible</code>, escalonado solo con <code className={CODE}>transition-delay</code>. La línea de acento es la última en terminar, a los 1.2 s, y de ahí sale <code className={CODE}>IN_MS</code>. Al salir, las reglas de <code className={CODE}>out</code> pliegan la etiqueta y la línea y lo desvanecen todo en 0.6 s.
    </>
  ),
  tipTitle: "Consejo de diseño",
  tipBody: "El punto blanco que late en la etiqueta roja transmite urgencia sin distraer. Es una convención televisiva sutil pero eficaz: el espectador asocia ese punto parpadeante con contenido importante y en directo. La animación es lenta (un ciclo de 1.5 s) para que no resulte frenética.",
  manifestTitle: "Última hora",
  manifestIntro: "Fíjate en stepCount: 0: así declara OGraf un grafismo que entra y termina por sí solo. El renderizador sigue llamando a playAction, que devuelve currentStep: undefined en cuanto termina la entrada.",
  doneTitle: "Alerta de última hora terminada.",
  doneBody: "Lanzar y olvidar con stepCount: 0, una aparición escalonada y una retirada automática en segundo plano que un stop todavía puede adelantar.",
  codeLabels: {
    timing: "tiempos",
    staggeredReveal: "aparición escalonada",
    pulsingDot: "punto que late",
  },
  next: "Siguiente: Previsión meteorológica",
};
