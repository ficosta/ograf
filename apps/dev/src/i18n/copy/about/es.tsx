import { Link } from "../../Link";
import type { AboutCopy } from "./en";
import { LINK } from "./styles";

export const es: AboutCopy = {
  eyebrow: "Acerca de",
  title: "El punto de encuentro de la comunidad del grafismo abierto para televisión.",
  intro: (
    <>
      <strong className="text-slate-900 font-medium">ograf.dev</strong> es el punto de encuentro de la comunidad en torno a OGraf, el estándar abierto de grafismo para broadcast. No somos la web oficial de la especificación — esa es{" "}
      <a href="https://ograf.ebu.io" className={LINK} target="_blank" rel="noopener noreferrer">
        ograf.ebu.io
      </a>
      . Somos el lugar al que acuden desarrolladores, diseñadores, cadenas de televisión y operadores técnicos para aprender, construir, probar y conectar.
    </>
  ),
  tools: (
    <>
      Las herramientas de desarrollo en el navegador están en{" "}
      <Link to="/tools" className={LINK}>
        /tools
      </Link>
      : un verificador de paquetes que además ejecuta tu grafismo en una sandbox, y un explorador de schema — todo en el navegador, sin instalar nada.
    </>
  ),
  sitesTitle: "Dos webs, dos papeles.",
  sites: [
    { name: "ograf.ebu.io", role: "El estándar", desc: "Especificación normativa, JSON schemas, gobernanza y grupo de trabajo." },
    { name: "ograf.dev", role: "La comunidad y el banco de trabajo", desc: "Tutoriales, mapa del ecosistema, una guía de la especificación en lenguaje claro, además del verificador de paquetes y otras herramientas de desarrollo." },
  ],
  missionTitle: "Nuestra misión.",
  mission: [
    "La industria del grafismo para broadcast siempre ha dependido de soluciones propietarias. Los sistemas de Vizrt, Ross Video y Chyron suelen exigir una inversión considerable en licencias y hardware. OGraf, respaldado por la Unión Europea de Radiodifusión, añade una capa abierta construida sobre tecnologías web que todo el mundo ya conoce.",
    "Creemos que este ecosistema necesita una comunidad fuerte para acelerar su adopción. Mejor documentación. Mejores herramientas. Un lugar central donde descubrir lo que existe. Eso es lo que estamos construyendo.",
  ],
  licenseTitle: "Código disponible.",
  license: (
    <>
      Este proyecto usa un modelo de licencias por capas: las plantillas y los tutoriales OGraf son MIT — úsalos en producción como quieras. El código de la web es PolyForm Internal Use 1.0.0, así que las empresas pueden hacer un fork y usarlo internamente, pero no revenderlo. Los textos editoriales son CC BY 4.0 (con atribución). Consulta{" "}
      <a href="https://github.com/ficosta/ograf/blob/main/LICENSING.md" target="_blank" rel="noopener noreferrer" className={LINK}>
        LICENSING.md
      </a>
      {" "}para el desglose por directorio. Las contribuciones en cualquier área — documentación, plantillas, herramientas, traducciones, comentarios — son bienvenidas.
    </>
  ),
};
