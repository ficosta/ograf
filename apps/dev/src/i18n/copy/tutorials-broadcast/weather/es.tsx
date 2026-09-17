import type { WeatherCopy } from "./en";
import { CODE, CODE_AMBER, STRONG } from "../styles";

export const es: WeatherCopy = {
  title: "Crea una tarjeta de previsión meteorológica.",
  intro: (
    <>
      Los grafismos del tiempo son un clásico de la televisión — desde los informativos locales hasta las previsiones nacionales. Esta tarjeta muestra el tiempo actual con la temperatura en grande, además de una fila con la previsión para varios días. Enseña a manejar <strong className={STRONG}>schemas de datos anidados</strong> — campos escalares más un array de objetos — en un solo grafismo.
    </>
  ),
  demoTitle: "Previsión meteorológica — plantilla OGraf",
  fields: { location: "Ubicación", temp: "Temperatura", condition: "Estado del cielo", icon: "Icono (emoji)", forecast: "Previsión" },
  differentTitle: "¿Qué cambia respecto a otros grafismos?",
  cards: [
    {
      title: "Schema de datos anidado",
      body: <>Cuatro campos escalares (location, temp, condition, icon) conviven con un array de objetos de previsión, cada uno con day, temp e icon. Las temperaturas son cadenas simples, así que la unidad viaja con el valor.</>,
    },
    {
      title: "Emoji como iconos",
      body: <>Los iconos son emojis Unicode escritos directamente en los datos y pintados como texto. Sin SVG ni fuentes de iconos — cero dependencias, y el espectador los reconoce al instante.</>,
    },
    {
      title: "Diseño en varias secciones",
      body: <>Dos zonas visuales: el tiempo actual (icono grande + temperatura) y, debajo, una fila compacta de previsión cuyos días aparecen con un fundido después de que la tarjeta se haya deslizado a su sitio.</>,
    },
  ],
  renderTitle: "Renderizar la fila de previsión",
  renderBody: (
    <>
      <code className={CODE}>_renderForecast</code> convierte el array de previsión en un <code className={CODE}>.weather-forecast-day</code> por elemento, con el día, el emoji y la temperatura. Cada valor pasa por <code className={CODE}>escapeHtml</code>, y el <code className={CODE}>transition-delay</code> de cada día es de 500 ms + 60 ms por día, lo que crea una aparición de izquierda a derecha. <code className={CODE}>load</code> y <code className={CODE}>updateAction</code> comparten <code className={CODE}>_applyData</code>: los campos escalares se aplican cuando no son <code className={CODE}>undefined</code> (así que una cadena vacía borra uno), y un array de previsión vuelve a renderizar la fila.
    </>
  ),
  playTitle: "Ponerlo en antena",
  playBody: (
    <>
      <code className={CODE}>resolveTargetStep</code> sigue el modelo de pasos de OGraf: <code className={CODE}>goto</code> si se indica; si no, el paso actual (-1 antes del primer play) más <code className={CODE}>delta</code>, 1 por defecto. Con un solo paso, el primer play pone la tarjeta en antena en el paso 0; un segundo play va más allá del final, así que el grafismo se detiene y devuelve <code className={CODE}>currentStep: undefined</code>. <code className={CODE}>playAction</code> añade <code className={CODE}>visible</code> y se resuelve tras 1000 ms; <code className={CODE}>stopAction</code> añade <code className={CODE}>out</code>, espera 500 ms y solo quita las clases si ninguna acción más reciente ha incrementado <code className={CODE}>this._rev</code> — así que play → stop → play enviados sin esperar terminan en antena.
    </>
  ),
  cssTitle: "El CSS — tarjeta que entra deslizándose",
  cssBody: (
    <>
      El contenedor <code className={CODE}>.weather</code> empieza fuera de pantalla por la izquierda, transparente y desenfocado. Al añadir <code className={CODE}>visible</code> entra deslizándose en 0.7 s mientras se enfoca; <code className={CODE}>out</code> lo devuelve en 0.5 s. Los días de la previsión suben 8px y aparecen con un fundido cuando el contenedor es visible, cada uno con su propio retardo. El reset está acotado con <code className={CODE}>:where(.weather-root, …)</code>, así que nunca cambia los estilos de la página del renderizador.
    </>
  ),
  tipTitle: "Consejo de diseño",
  tipBody: (
    <>
      Si las temperaturas se actualizan con la tarjeta en antena, plantéate añadir <code className={CODE_AMBER}>font-variant-numeric: tabular-nums</code> a <code className={CODE_AMBER}>.weather-temp</code> (la plantilla no lo define). Las cifras tabulares ocupan todas el mismo ancho, así que un cambio de "8°C" a "9°C" no desplaza el diseño.
    </>
  ),
  manifestTitle: "Previsión meteorológica",
  manifestIntro: "El campo forecast mezcla propiedades escalares con un array tipado — así gestiona OGraf datos de varias secciones en un único schema.",
  doneTitle: "Tarjeta del tiempo terminada.",
  doneBody: "Datos anidados, iconos emoji, una tarjeta que entra deslizándose y una aparición escalonada de la previsión — lista para cualquier sección del tiempo.",
  codeLabels: {
    rendering: "renderizado",
    stepModel: "modelo de pasos",
    keyParts: "partes clave",
  },
  next: "Siguiente: Tarjeta de redes sociales",
};
