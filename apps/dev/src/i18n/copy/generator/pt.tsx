import type { GeneratorCopy } from "./en";

export const pt: GeneratorCopy = {
  page: {
    allTools: "Todas as ferramentas",
    eyebrow: "Gerador de templates",
    title: "Crie um novo pacote OGraf a partir de um preset.",
    intro:
      "Escolha uma base, dê um nome e as suas cores, veja o grafismo rodando ao vivo e baixe um pacote válido segundo a especificação, com manifesto, módulo, folha de estilo e fontes locais já conectados. Todo download passa antes pelo verificador de pacotes.",
    noUpload: "Tudo roda no seu navegador. Nada é enviado.",
    loading: "Carregando o template base…",
    loadFailed: "Não foi possível carregar o template base. Verifique a conexão e recarregue a página.",
    buildFailed: "Não foi possível montar o pacote com esta configuração.",
  },

  steps: {
    preset: "Preset",
    identity: "Identidade",
    look: "Aparência",
    data: "Dados padrão",
    output: "Prévia, verificação e download",
  },

  gallery: {
    title: "Escolha uma base",
    intro:
      "Cada preset é um dos templates feitos à mão para os tutoriais: um Web Component com o ciclo de vida completo, fontes locais e uma miniatura em 1080p. Suas escolhas são aplicadas aos arquivos reais.",
    selected: "Selecionado",
    tutorial: "Tutorial",
  },

  identity: {
    title: "Identidade do pacote",
    intro: "O que um renderizador e um operador veem ao procurar este grafismo.",
    name: "Nome",
    nameHint: "Aparece nas interfaces dos controladores. Também dá nome à pasta e ao arquivo do manifesto.",
    id: "Id do pacote",
    idHint:
      "Precisa ser único. Qualquer caractere é permitido, exceto “/”; a especificação recomenda a notação de domínio reverso, como com.minha-empresa.meu-lowerthird.",
    idDerived: "Derivado da URL do autor e do nome até você editá-lo.",
    idDerive: "Derivar do nome novamente",
    version: "Versão",
    versionHint: "Versionamento semântico, ex.: 1.0.0. Renderizadores ordenam versões alfabeticamente.",
    description: "Descrição",
    descriptionHint: "Opcional, mas os controladores a exibem nas galerias.",
    authorName: "Autor",
    authorNameHint: "Opcional. Obrigatório se você informar uma URL.",
    authorUrl: "URL do autor",
    authorUrlHint: "Opcional. Também define o prefixo do id: https://acme.tv → tv.acme.",
    files: (slug: string, manifest: string) => `Download: ${slug}/ com ${manifest}`,
    issues: {
      nameRequired: "Dê um nome ao pacote.",
      nameTooLong: "Mantenha o nome com menos de 120 caracteres.",
      idRequired: "O id é obrigatório.",
      idSlash: "A especificação proíbe “/” no id.",
      idWhitespace: "Remova os espaços do id.",
      idNotReverseDns: "Válido, mas a notação de domínio reverso (com.empresa.grafismo) é recomendada.",
      versionRequired: "A versão é obrigatória.",
      versionNotSemver: "Use uma versão semântica, como 1.0.0 ou 2.1.0-beta.1.",
      authorUrlInvalid: "Use uma URL http(s) completa.",
      authorNameRequiredWithUrl: "Um autor com URL também precisa de nome; o schema exige.",
      colorInvalid: "Use uma cor hexadecimal de seis dígitos, como #2563eb.",
      offsetRange: "Use um número inteiro entre 0 e 600.",
    },
  },

  look: {
    title: "Aparência",
    intro:
      "Cores, fonte do texto e posição viram propriedades customizadas de CSS no topo do style.css, então o download é um pacote com tema que você pode continuar ajustando à mão.",
    colors: {
      accent: "Destaque",
      ink: "Texto",
      surface: "Painel",
      live: "Ponto AO VIVO",
      alert: "Alerta",
      urgent: "Urgente",
      backdrop: "Fundo",
      overlay: "Sobreposição",
    },
    colorsHint: "Os extremos dos gradientes e os tons claros são derivados da cor de destaque automaticamente.",
    font: "Fonte do texto",
    fontOptions: {
      inter: "Inter — peso variável, incluída",
      "instrument-serif": "Instrument Serif — editorial, incluída",
      system: "Fonte do sistema — sem arquivos de fonte",
    },
    fontNotes: {
      inter: "Um único arquivo variável cobre todos os pesos. A licença vai em fonts/.",
      "instrument-serif": "Regular e itálico em um só peso; o negrito é sintetizado pelo renderizador. A licença vai em fonts/.",
      system: "Cada renderizador usa a própria fonte de interface, então o visual varia entre máquinas.",
    },
    offsets: {
      offsetX: "Margem horizontal",
      offsetY: "Margem vertical",
    },
    offsetsHint: "Distância da borda da tela em pixels, em 1920 × 1080. A área segura de broadcast começa por volta de 48 px.",
    offsetsNone: "Este preset ocupa o quadro inteiro, então não há posição a definir.",
    reset: "Restaurar aparência",
  },

  data: {
    title: "Dados padrão",
    intro:
      "Com o que o formulário do operador vem preenchido. Gravado no schema do manifesto como o default de cada campo, para que controladores e a prévia partam dos mesmos valores.",
  },

  preview: {
    title: "Prévia ao vivo",
    desc: "O graphic.mjs gerado roda em 1920 × 1080 dentro de um iframe isolado, servido por um service worker no navegador, exatamente como um renderizador faria.",
    booting: "iniciando…",
    running: "executando…",
    iframeTitle: "Prévia do grafismo gerado",
    preparing: "Preparando a prévia…",
    failedTitle: "A prévia não iniciou",
    unsupported: "A prévia ao vivo precisa de um navegador com service workers. O download continua funcionando.",
    controls: {
      play: "play",
      stop: "stop",
      update: "update",
      replay: "repetir",
    },
    background: {
      label: "Fundo",
      dark: "Escuro",
      light: "Claro",
      checker: "Xadrez",
    },
    facts: {
      stepCount: (n: number) => (n === 0 ? "sai sozinho (stepCount 0)" : n === 1 ? "play / stop (stepCount 1)" : `${n} passos`),
      customActions: (n: number) => `${n} ${n === 1 ? "ação customizada" : "ações customizadas"}`,
      realTime: "tempo real",
    },
  },

  validation: {
    title: "Verificação do pacote",
    desc: "As mesmas regras do verificador de pacotes, aplicadas ao zip exato que você vai baixar.",
    running: "verificando…",
    clean: "Sem erros e sem avisos. Pronto para entregar.",
    counts: {
      errors: "erros",
      warnings: "avisos",
      infos: "notas",
      passes: "aprovadas",
    },
    showPasses: "Mostrar verificações aprovadas",
    hidePasses: "Ocultar verificações aprovadas",
    openChecker: "Abrir o verificador de pacotes completo",
    waiting: "A verificação roda assim que o pacote é montado.",
  },

  download: {
    title: "Download",
    button: "Baixar .zip",
    preparing: "Preparando…",
    contents: "Conteúdo do pacote",
    size: (kb: string) => `${kb} KB`,
    blockedForm: "Corrija primeiro os campos destacados.",
    blockedErrors: "A verificação do pacote encontrou erros; veja acima.",
    blockedBuild: "Não foi possível montar o pacote.",
    next: "Próximos passos",
    nextSteps: [
      "Descompacte e aponte um renderizador OGraf para o manifesto, ou solte o zip no verificador de pacotes.",
      "Edite os tokens de tema no topo do style.css para continuar mudando o visual à mão.",
      "Altere a marcação no graphic.mjs e o schema de dados no manifesto em conjunto: load() e updateAction() leem os mesmos campos.",
    ],
    license: "O pacote gerado tem licença MIT, como os templates dos tutoriais em que se baseia.",
  },
};
