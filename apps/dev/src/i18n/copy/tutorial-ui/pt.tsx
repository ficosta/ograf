import type { TutorialUiCopy } from "./en";
import { CHECK_LINK } from "./styles";

export const pt: TutorialUiCopy = {
  demo: {
    loadingPreview: "Carregando a prévia…",
    previewLabel: (title: string) => `${title} — prévia interativa`,
    array: "array",
    itemCount: (n: number) => `${n} ${n === 1 ? "item" : "itens"}`,
    removeItem: (n: number) => `Remover item ${n}`,
    addItem: "Adicionar item",
    invalidJson: "JSON inválido",
    playMode: "Modo de reprodução",
    runOnce: "Rodar uma vez",
    loop: "Em loop",
    fixJsonBeforePlaying: "Corrija o campo JSON antes de reproduzir",
    fixJsonBeforeUpdating: "Corrija o campo JSON antes de atualizar",
    play: "Reproduzir",
    update: "Atualizar",
    stop: "Parar",
  },
  download: {
    heading: (title: string) => `Baixe o pacote completo: ${title}`,
    intro: "Um pacote OGraf Graphics Definition v1 de verdade. Um renderizador compatível lê o manifesto e conduz o ciclo de vida. Licença MIT; coloque em qualquer sistema compatível com OGraf.",
    files: {
      manifest: "Manifesto — o que o renderizador lê (id, schema, flags de ciclo de vida)",
      graphic: "Web Component com load / play / update / stop / customAction / dispose",
      style: "Folha de estilo, carregada pelo graphic.mjs com uma tag <link>",
      thumbnail: "Prévia em 1920×1080, declarada no manifesto",
      readme: "Instruções de uso",
      license: "MIT",
    },
    button: (slug: string) => `Baixar ${slug}.zip`,
    note: (checkHref: string) => (
      <>
        MIT · fontes incluídas · solte em <a href={checkHref} className={CHECK_LINK}>/check</a> para validar
      </>
    ),
    renderersHeading: "Publique num renderizador OGraf compatível",
    renderers: {
      "ograf-server": "Renderizador de referência com APIs de upload e controle. Hospede você mesmo.",
      "SPX-GC": "Controlador de grafismo profissional no navegador, com suporte a OGraf.",
      CasparCG: "Servidor de playout open source — renderiza OGraf pelo HTML producer.",
    },
  },
  manifestHeading: "O manifesto",
};
