import type { ScoreBugCopy } from "./en";
import { CODE, CODE_AMBER, CODE_BLUE, STRONG } from "../styles";

export const es: ScoreBugCopy = {
  title: "Crea un marcador en directo.",
  intro: (
    <>
      El marcador es el grafismo fijo en la esquina de toda retransmisión deportiva en directo — muestra los equipos, el resultado, el tiempo y el periodo. Este tutorial cubre el ciclo de vida completo, incluidas las <strong className={STRONG}>customActions</strong>, el mecanismo de OGraf para lanzar eventos visuales puntuales, como el destello de un gol, sin cambiar el paso del grafismo.
    </>
  ),
  demoTitle: "Marcador — plantilla OGraf",
  fields: {
    home: "Equipo local",
    away: "Equipo visitante",
    homeScore: "Goles locales",
    awayScore: "Goles visitantes",
    time: "Tiempo de juego",
    period: "Periodo",
  },
  differentTitle: "¿Qué cambia respecto a otros grafismos?",
  cards: [
    {
      title: "customActions",
      body: (
        <>
          El manifiesto declara una acción personalizada, <code className={CODE}>goal</code>. El renderizador la lanza mediante <code className={CODE}>customAction</code> para que el marcador destelle sin cambiar sus datos ni su paso.
        </>
      ),
    },
    {
      title: "Posición fija",
      body: (
        <>
          A diferencia de los rótulos inferiores, que entran y salen, el marcador se queda en pantalla todo el partido. Entra una vez y después recibe llamadas parciales a <code className={CODE}>updateAction</code> para el resultado, el reloj y el periodo.
        </>
      ),
    },
    {
      title: "Diseño oscuro y compacto",
      body: <>Una tarjeta pequeña arriba a la izquierda, sobre un fondo oscuro casi opaco con una barra de acento azul. Se lee bien sobre cualquier vídeo: césped iluminado, planos de la grada, repeticiones.</>,
    },
  ],
  customTitle: "La customAction: destello de gol",
  customBody: (
    <>
      Cuando se marca un gol, el renderizador llama a <code className={CODE}>{"customAction({ id, payload, skipAnimation })"}</code> con <code className={CODE}>id: "goal"</code>, uno de los ids declarados en <code className={CODE}>customActions</code> del manifiesto. El grafismo añade la clase <code className={CODE}>goal</code> durante 800 ms y luego la quita. Nada más cambia: el resultado llega por separado mediante <code className={CODE}>updateAction</code>. Un id que el grafismo no conoce recibe un 404, y así es como el renderizador sabe que la acción no está soportada.
    </>
  ),
  insightTitle: "Clave: customAction frente a updateAction",
  insightBody: (
    <>
      <code className={CODE_BLUE}>updateAction</code> cambia los datos persistentes del grafismo (resultado, tiempo, nombres de los equipos). <code className={CODE_BLUE}>customAction</code> lanza un evento visual pasajero: reproduce una animación y después el grafismo vuelve a su estado visual anterior. Con <code className={CODE_BLUE}>skipAnimation</code>, como el destello es pura animación, no queda nada que hacer y simplemente retorna.
    </>
  ),
  playTitle: "Entrar, y volver a dar play",
  playBody: (
    <>
      El manifiesto dice <code className={CODE}>stepCount: 1</code>. <code className={CODE}>resolveTargetStep</code> aplica la regla de la especificación: <code className={CODE}>goto</code> si se indica; si no, el paso actual (-1 antes del primer play) más <code className={CODE}>delta</code>, que por defecto vale 1. El primer play cae en el paso 0 y ejecuta la entrada de 600 ms. Un segundo play apunta al paso 1, que está más allá del último paso, así que el grafismo va a su final: ejecuta <code className={CODE}>stopAction</code> y devuelve <code className={CODE}>currentStep: undefined</code>.
    </>
  ),
  playRev: (
    <>
      Cada acción toma el siguiente <code className={CODE}>this._rev</code>. <code className={CODE}>stopAction</code> solo quita la clase <code className={CODE}>visible</code> si no ha empezado ninguna acción más reciente durante su salida de 400 ms, así que play → stop → play enviados sin esperar terminan en antena.
    </>
  ),
  cssTitle: "El CSS: efecto de destello de gol",
  cssBody: "El destello es una única animación de keyframes sobre la tarjeta interior. Mantiene la sombra normal de la tarjeta y hace crecer un resplandor azul a su alrededor, que alcanza su máximo a mitad de camino y luego se desvanece. Su duración de 0.8 s coincide con los 800 ms que espera el grafismo antes de quitar la clase.",
  leaderTitle: "Resaltar al que va ganando",
  leaderBody: (
    <>
      Tras cada load y update, el equipo con más goles recibe la clase <code className={CODE}>active</code>; en caso de empate, ninguno. Las actualizaciones pueden ser parciales, así que una que solo toca el reloj no trae resultado: el grafismo usa entonces el resultado que ya está en pantalla en lugar de quitar el resaltado.
    </>
  ),
  tipTitle: "Consejo de diseño",
  tipBody: (
    <>
      El resultado del equipo que va ganando pasa a azul claro y su nombre a blanco puro. Es una señal pequeña, habitual en las retransmisiones deportivas premium, que le dice al espectador quién va por delante de un vistazo sin añadir nada al diseño. Cuando el resultado cambia, <code className={CODE_AMBER}>updateAction</code> además le da al número un salto de 350 ms con la clase <code className={CODE_AMBER}>updating</code>.
    </>
  ),
  manifestTitle: "Marcador",
  manifestIntro: "Fíjate en el array customActions: así declara OGraf operaciones propias del grafismo más allá de play, update y stop. El renderizador solo envía ids que figuren ahí, y el grafismo responde a cualquier otro con un 4xx (este usa 404).",
  doneTitle: "Marcador terminado.",
  doneBody: "Posición fija, actualizaciones en directo con updateAction y destellos de gol pasajeros con customAction — todo lo necesario para deporte en directo.",
  codeLabels: {
    stepModel: "modelo de pasos",
    goalFlash: "destello de gol",
    activeTeam: "equipo que va ganando",
  },
  next: "Siguiente: Cuenta atrás",
};
