import type { SportLineupCopy } from "./en";
import { CODE, CODE_AMBER } from "../styles";

export const es: SportLineupCopy = {
  title: "Crea una tarjeta de alineación.",
  intro: "El grafismo de alineación previo al partido es un clásico de las retransmisiones deportivas — de la Premier League al Mundial. Una cuadrícula de tarjetas de jugadores aparece una a una, con dorsal, nombre y posición, y el sistema de juego y el entrenador en el pie.",
  demoTitle: "Alineación — plantilla OGraf",
  fields: { team: "Equipo", meta: "Datos del partido", formation: "Sistema de juego", coach: "Entrenador", players: "Jugadores" },
  differentTitle: "¿Qué cambia respecto a otros grafismos?",
  cards: [
    {
      title: "Diseño en cuadrícula",
      body: (
        <>
          Usa CSS Grid con columnas <code className={CODE}>auto-fill</code> de al menos 120px de ancho. Las tarjetas se recolocan solas tanto si tienes 11 jugadores como 5 suplentes.
        </>
      ),
    },
    {
      title: "Tarjetas escalonadas",
      body: (
        <>
          Cada tarjeta de jugador recibe un <code className={CODE}>transition-delay</code> en línea de 300 ms + 60 ms por tarjeta, lo que crea una ola de tarjetas que aparecen por la cuadrícula.
        </>
      ),
    },
    {
      title: "Estructura en tres partes",
      body: <>Cabecera con degradado oscuro, nombre del equipo y datos del partido; después la cuadrícula de jugadores; y un pie con el sistema de juego y el entrenador — tres zonas visuales bien diferenciadas.</>,
    },
  ],
  renderTitle: "Renderizar los jugadores",
  renderBody: (
    <>
      <code className={CODE}>_renderPlayers</code> construye una <code className={CODE}>.lineup-card</code> por jugador: el dorsal en un círculo oscuro, el nombre y la posición debajo. Cada valor pasa por <code className={CODE}>escapeHtml</code> antes de llegar al marcado, y el <code className={CODE}>transition-delay</code> de cada tarjeta se calcula a partir de su índice. <code className={CODE}>load</code> y <code className={CODE}>updateAction</code> llaman a <code className={CODE}>_applyData</code>, que solo toca los campos que no son <code className={CODE}>undefined</code> — así, una actualización parcial cambia solo lo que envía, una cadena vacía deja un campo en blanco (en el sistema de juego y el entrenador desaparece también la etiqueta "Formation:" / "Coach:") y un array <code className={CODE}>players</code> vuelve a renderizar la cuadrícula.
    </>
  ),
  playTitle: "Ponerlo en antena",
  playBody: (
    <>
      <code className={CODE}>resolveTargetStep</code> implementa el modelo de pasos de OGraf: <code className={CODE}>goto</code> si se indica; si no, el paso actual (-1 antes del primer play) más <code className={CODE}>delta</code>, 1 por defecto. Con un solo paso, el primer play cae en el paso 0 y un segundo play va más allá del final, así que el grafismo se detiene y devuelve <code className={CODE}>currentStep: undefined</code>. En el paso 0, <code className={CODE}>playAction</code> añade <code className={CODE}>visible</code> y espera hasta que termina la última tarjeta: 300 ms + 60 ms por tarjeta + 500 ms de la transición de la propia tarjeta. <code className={CODE}>stopAction</code> se desvanece en 400 ms y solo quita las clases si no ha empezado entretanto ninguna acción más reciente (un <code className={CODE}>this._rev</code> mayor).
    </>
  ),
  cssTitle: "El CSS — cuadrícula y aparición de las tarjetas",
  cssBody: (
    <>
      La cuadrícula de jugadores usa <code className={CODE}>grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))</code> para adaptarse al ancho del contenedor; un gap de 2px sobre un fondo gris claro dibuja las separaciones entre tarjetas. Cada tarjeta aparece con un fundido y sube 12px cuando el elemento padre recibe la clase <code className={CODE}>visible</code>. El reset está acotado con <code className={CODE}>:where(.sport-lineup-root, …)</code>, así que nunca cambia los estilos de la página del renderizador.
    </>
  ),
  tipTitle: "Consejo de diseño",
  tipBody: (
    <>
      Usa <code className={CODE_AMBER}>auto-fill</code> en lugar de un número fijo de columnas. Así la cuadrícula se adapta sin problemas a 11 titulares, 5 suplentes o cualquier otro tamaño de plantilla, sin cambiar el diseño en el código de la plantilla.
    </>
  ),
  manifestTitle: "Alineación deportiva",
  manifestIntro: "El campo players es un array tipado — items.type es object, con number, name y position obligatorios. Un controlador puede añadir, quitar y reordenar filas automáticamente.",
  doneTitle: "Alineación terminada.",
  doneBody: "CSS Grid, tarjetas que aparecen escalonadas y una estructura limpia de cabecera y pie — lista para las retransmisiones de día de partido.",
  codeLabels: {
    rendering: "renderizado",
    stepModel: "modelo de pasos",
    keyParts: "partes clave",
  },
  next: "Siguiente: Marcador",
};
