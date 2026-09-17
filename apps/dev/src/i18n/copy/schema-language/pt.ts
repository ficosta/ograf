import type { SchemaLanguageText } from "../../../content/schema-language";

export const pt: SchemaLanguageText = {
  clusters: {
    identity: {
      title: "Identidade",
      subtitle: "Quem é este grafismo? Um nome, uma versão, um crédito.",
    },
    behaviour: {
      title: "Comportamento",
      subtitle: "Como ele roda? Páginas, modos, onde pode ir ao ar.",
    },
    "operator-data": {
      title: "Dados do operador",
      subtitle: "O que o operador preenche — como um formulário: nome, cargo, placar.",
    },
    "custom-buttons": {
      title: "Botões customizados",
      subtitle: "Ações especiais que o operador pode acionar durante a exibição.",
    },
    "render-needs": {
      title: "O que ele precisa para renderizar",
      subtitle: "O mínimo que o renderizador precisa garantir — tamanho, transparência, áudio.",
    },
  },
  fields: {
    $schema: {
      friendlyName: "Link do schema",
      description:
        "Diz a controladores e validadores em qual versão do formato de manifesto OGraf você se baseou. É sempre a URL canônica da EBU — a maioria dos editores preenche isso para você.",
      exampleLabels: ["Sempre este valor"],
    },
    id: {
      friendlyName: "ID único",
      description:
        "Um nome que nenhum outro grafismo no mundo deveria ter. Use o padrão de domínio invertido para que colisões sejam praticamente impossíveis.",
      exampleLabels: ["Domínio invertido (recomendado)", "Com namespace do projeto", "Com data, para lotes"],
    },
    name: {
      friendlyName: "Nome de exibição",
      description:
        "O que os operadores veem ao escolher este grafismo numa lista. Seja breve — o nome precisa caber na interface do controlador.",
      exampleLabels: ["Simples", "Com sufixo de variante", "Marcado para uso ao vivo"],
    },
    version: {
      friendlyName: "Versão",
      description:
        "Sempre que mudar algo importante, incremente este valor. Use major.minor.patch — incremente o número major quando quebrar algo de que os operadores dependem.",
      exampleLabels: ["Semver estável", "Pré-lançamento", "Baseada em data"],
    },
    description: {
      friendlyName: "Descrição",
      description:
        "Uma frase sobre o que este grafismo faz. Ajuda os operadores a escolher o certo quando há dezenas de templates.",
      exampleLabels: ["Simples", "Destacando o recurso principal", "Indicando o público"],
    },
    main: {
      friendlyName: "Arquivo de entrada",
      description:
        "O arquivo que o renderizador carrega primeiro. Normalmente graphic.mjs ou index.html. O caminho é relativo ao manifesto.",
      exampleLabels: ["Módulo ES", "Entrada HTML", "Dentro de uma subpasta"],
    },
    author: {
      friendlyName: "Autor",
      description:
        "Quem fez isto. É opcional, mas um nome + e-mail ajuda os operadores a saber quem chamar quando algo parece errado.",
      exampleLabels: ["Designer independente", "Organização", "Só o nome da comunidade"],
    },
    thumbnails: {
      friendlyName: "Miniaturas",
      description:
        "Imagens de prévia do grafismo para que os operadores o reconheçam visualmente. PNG, JPG, GIF ou WebP. Vários tamanhos são bem-vindos — os controladores escolhem o que encaixa melhor.",
      exampleLabels: ["Uma miniatura", "Vários tamanhos", "Várias proporções"],
    },
    stepCount: {
      friendlyName: "Páginas ou etapas",
      description:
        "Quantas visualizações separadas o seu grafismo tem. -1 significa dinâmico (o grafismo decide em tempo de execução), 0 é uma vinheta que roda sozinha até o fim, 1 é um estado único que fica na tela até ser parado (uma lower third), 2+ é um grafismo de várias páginas que o operador avança clicando. O padrão é 1.",
      exampleValue: "padrão 1   ·   mín. -1   ·   -1 = dinâmico",
      exampleLabels: [
        "Lower third (padrão — estado único)",
        "Vinheta (roda uma vez, sem passo do operador)",
        "Várias páginas (3 telas de resultados)",
        "Dinâmico (o grafismo decide em tempo de execução)",
      ],
    },
    supportsRealTime: {
      friendlyName: "Transmissão ao vivo?",
      description:
        "True se o seu grafismo pode rodar no ar ao vivo — o caso mais comum. Você precisa declarar isso explicitamente, mesmo que seja true.",
      exampleLabels: ["Só ao vivo", "Ao vivo + pós-produção"],
    },
    supportsNonRealTime: {
      friendlyName: "Pós-produção?",
      description:
        "True se o seu grafismo pode rodar mais rápido ou mais devagar que o tempo real — útil para pipelines de renderização offline (quadro a quadro, em lote). Se for true, você precisa implementar goToTime() e setActionsSchedule().",
      exampleLabels: ["Só ao vivo", "Permitir renderização offline"],
    },
    schema: {
      friendlyName: "Campos de dados do operador",
      description:
        "O que o operador preenche. Como um formulário: um campo Nome, um campo Cargo, um seletor de cor. O controlador lê isso e monta o formulário automaticamente — você nunca precisa desenhar a interface do operador.",
      exampleLabels: ["Só campos de texto", "Com seletor de cor e lista de opções", "Imagem + array de strings"],
    },
    customActions: {
      friendlyName: "Botões customizados",
      description:
        "Ações especiais que o operador pode disparar durante a exibição — comemorar um gol, piscar um alerta, trocar uma cor. Cada botão tem um ID, um nome e um formulário de dados opcional (defina schema como null se a ação não recebe parâmetros).",
      exampleLabels: ["Um botão, sem payload", "Botão com schema de payload", "Vários botões"],
    },
    renderRequirements: {
      friendlyName: "Requisitos de renderização",
      description:
        "Uma lista de ambientes de renderização aceitáveis — pelo menos uma entrada precisa ser atendida. Cada entrada pode restringir resolução, taxa de quadros, acesso à internet e o motor de renderização + versão. As restrições usam min/max/exact/ideal para que o renderizador negocie a melhor combinação.",
      exampleLabels: [
        "HD a 60 fps, no mínimo",
        "Precisa de acesso à internet (dados ao vivo)",
        "Restrição de motor (CEF 139+)",
        "UHD com taxa de quadros ideal",
      ],
    },
  },
  gddTypes: {
    "single-line": {
      friendlyName: "Texto curto",
      description: "Um campo de texto de uma linha. Nomes, cargos, placares, hashtags.",
      exampleLabels: ["Campo de nome", "Com um valor padrão de exemplo", "Campo obrigatório"],
    },
    "multi-line": {
      friendlyName: "Texto longo",
      description: "Uma área de texto com várias linhas. Citações, descrições, textos mais longos.",
      exampleLabels: ["Citação", "Descrição com valor padrão"],
    },
    "file-path": {
      friendlyName: "Caminho de arquivo",
      description:
        "Um seletor de arquivos genérico. Use quando um grafismo precisa de um recurso a partir de um caminho. Restrinja as extensões permitidas via gddOptions.",
      exampleLabels: ["Arquivo de áudio", "Clipe de vídeo", "Sem restrição de extensão"],
    },
    "file-path/image-path": {
      friendlyName: "Imagem",
      description:
        "Um seletor de imagens. O controlador sabe que deve mostrar uma miniatura de prévia. Logos, fotos de rosto, avatares de redes sociais.",
      exampleLabels: ["Logo", "Foto de rosto"],
    },
    select: {
      friendlyName: "Opções",
      description:
        "Uma lista suspensa com um conjunto fixo de opções. Use enum para listar os valores e gddOptions.labels para dar a cada valor um rótulo de exibição mais amigável.",
      exampleLabels: ["Opções de string com rótulos", "Níveis inteiros", "Velocidades numéricas"],
    },
    "color-rrggbb": {
      friendlyName: "Cor (sólida)",
      description:
        "Um seletor de cor que retorna uma string hex de 6 caracteres, como #2563eb. Só hex em minúsculas — os operadores veem uma amostra e um campo hex.",
      exampleLabels: ["Cor de destaque da marca", "Fundo"],
    },
    "color-rrggbbaa": {
      friendlyName: "Cor (com transparência)",
      description:
        "Um seletor de cor que inclui canal alfa — hex de 8 caracteres, como #2563ebcc. Use para sobreposições, fundos com efeito de vidro ou onde quiser transparência parcial.",
      exampleLabels: ["Sobreposição translúcida", "Tom com efeito de vidro"],
    },
    percentage: {
      friendlyName: "Porcentagem",
      description:
        "Um número que representa uma porcentagem. Normalmente os operadores veem um controle deslizante e um campo numérico de 0 a 100 — ótimo para opacidade, progresso, escala, volume.",
      exampleLabels: ["Opacidade", "Barra de progresso"],
    },
    "duration-ms": {
      friendlyName: "Duração (milissegundos)",
      description:
        "Um inteiro medido em milissegundos. Duração de animação, tempo de permanência, duração de fade-out. O controlador pode mostrá-lo em segundos para facilitar.",
      exampleLabels: ["Duração da animação", "Tempo na tela", "Fade-out"],
    },
  },
};
