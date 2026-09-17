import { CODE_SLATE } from "../tutorial-ui/styles";
import type { TutorialSocialCardCopy } from "./en";

export const es: TutorialSocialCardCopy = {
  title: "Crea una tarjeta de redes sociales.",
  lead: "Los informativos muestran a menudo publicaciones de redes sociales en pantalla — un tuit de una figura pública, un comunicado oficial o una publicación viral. Esta tarjeta muestra el nombre del usuario, su @ y el texto de la publicación, con un avatar generado automáticamente. Se coloca en el lado derecho de la pantalla, de modo que el presentador sigue viéndose a la izquierda.",
  demo: {
    user: "Nombre de usuario",
    handle: "Usuario (@)",
    text: "Texto de la publicación",
    heading: "Tarjeta de redes sociales — plantilla OGraf",
  },
  diffTitle: "¿Qué cambia respecto a otros grafismos?",
  diffs: [
    { title: "Posición a la derecha", body: <>Usa <code className={CODE_SLATE}>right: 48px; bottom: 80px</code> en lugar de <code className={CODE_SLATE}>left</code>. Así el presentador sigue viéndose en el lado izquierdo del encuadre — una convención habitual en televisión para el contenido que se muestra.</> },
    { title: "Avatar generado automáticamente", body: <>No hace falta ninguna imagen. El círculo del avatar muestra las iniciales del usuario, extraídas de su nombre con <code className={CODE_SLATE}>_getInitials()</code>. Nada que alojar, nada que se pueda romper.</> },
    { title: "Entrada en dos tiempos", body: <>La tarjeta entra deslizándose desde fuera de la pantalla por la derecha con un ligero desenfoque en 0.7s, y el avatar aparece 0.35s después con una curva que se pasa de largo y rebota — todo con CSS, a partir de una única clase <code className={CODE_SLATE}>.visible</code>.</> },
  ],
  initialsTitle: "El método de las iniciales",
  initialsBody: (
    <>
      En lugar de exigir la URL de una foto de perfil (que puede romperse, tener poca resolución o dar problemas de derechos), la tarjeta genera un avatar a partir del nombre del usuario. <code className={CODE_SLATE}>_getInitials</code> divide el nombre por los espacios, toma la primera letra de cada palabra, la pasa a mayúscula y se queda con las dos primeras: "Jane Smith" → "JS", "Dr. Martin King" → "DM", "Madonna" → "M", y un nombre vacío → un avatar vacío. <code className={CODE_SLATE}>_applyData</code> lo comparten <code className={CODE_SLATE}>load()</code> y <code className={CODE_SLATE}>updateAction()</code>; aplica cada campo que sea <code className={CODE_SLATE}>!== undefined</code>, así que una actualización parcial solo toca los campos que envías y una cadena vacía borra uno. También acepta una cadena opcional <code className={CODE_SLATE}>platform</code> para la etiqueta oscura de la cabecera. El schema del manifiesto no la declara, así que por defecto la etiqueta está vacía — y <code className={CODE_SLATE}>.social-platform:empty</code> la oculta en lugar de dejar una cápsula en blanco.
    </>
  ),
  dataFile: "graphic.mjs (partes clave)",
  playBody: (
    <>
      La reproducción y la parada siguen el modelo de pasos de OGraf. El primer play pone la tarjeta en antena en el paso 0 y se resuelve a los 700ms; un segundo play se pasa del único paso, ejecuta el stop y devuelve <code className={CODE_SLATE}>currentStep: undefined</code>. Cada acción incrementa <code className={CODE_SLATE}>this._rev</code>, y el stop solo quita <code className={CODE_SLATE}>.visible</code> tras sus 500ms si no ha empezado nada más reciente — así que play → stop → play enviados sin esperar terminan en antena.
    </>
  ),
  playFile: "graphic.mjs (play y stop)",
  cssTitle: "El CSS — tarjeta a la derecha con acento azul",
  cssBody: (
    <>
      La tarjeta entra deslizándose desde el borde derecho: <code className={CODE_SLATE}>.social</code> parte de <code className={CODE_SLATE}>translateX(120%)</code>, transparente y desenfocada, y <code className={CODE_SLATE}>.social.out</code> la devuelve a su sitio en 0.5s. Una barra con degradado de 4px dibujada con <code className={CODE_SLATE}>::before</code> da a la tarjeta blanca su acento azul a la izquierda, y el avatar es un círculo azul sólido que crece desde el 40%. El reset se limita con <code className={CODE_SLATE}>:where(.social-card-root, …)</code>, así que nunca cambia los estilos de la página del renderizador.
    </>
  ),
  cssFile: "style.css (partes clave)",
  tipTitle: "Consejo de diseño",
  tip: (
    <>
      El círculo del avatar usa la primera letra de cada palabra del nombre del usuario — "Jane Smith" se convierte en "JS". Así no hace falta ningún recurso de imagen externo. El relleno sólido en el azul de la marca y la aparición retardada hacen que el círculo parezca intencionado, y no un sustituto de una imagen que falta.
    </>
  ),
  downloadTitle: "Tarjeta de redes sociales",
  done: {
    title: "Tarjeta de redes sociales terminada.",
    body: "Posición a la derecha, avatar con iniciales generado automáticamente y un acento azul limpio — lista para mostrar publicaciones de redes sociales en antena.",
  },
};
