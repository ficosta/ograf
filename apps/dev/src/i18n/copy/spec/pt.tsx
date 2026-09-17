import type { SpecCopy } from "./en";
import { CODE, EXTERNAL_LINK, FIELD, MONO, STRONG } from "./styles";

export const pt: SpecCopy = {
  eyebrow: "Guia da especificação",
  title: "Como o OGraf funciona — explicado de forma simples.",
  intro: (
    <>
      Seja você designer, desenvolvedor ou profissional de emissora, este guia explica o formato OGraf em linguagem simples, com exemplos reais. Não é preciso experiência prévia. Para a especificação técnica completa, veja a{" "}
      <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className={EXTERNAL_LINK}>
        documentação oficial da EBU
      </a>.
    </>
  ),
  onThisPage: "Nesta página",
  analogyLabel: "Pense assim",
  nav: {
    "big-picture": "A visão geral",
    "whats-inside": "O que tem num pacote",
    manifest: "O arquivo de manifesto",
    lifecycle: "Como um grafismo ganha vida",
    steps: "Passos (grafismos de várias páginas)",
    data: "Dados e formulários",
    "real-world": "Exemplos do mundo real",
    advanced: "Tópicos avançados",
    next: "Próximos passos",
  },

  bigPicture: {
    title: "A visão geral",
    p1: "Imagine que você cria um lower third (tarja) no After Effects. Hoje, você teria de exportá-lo de um jeito diferente para cada sistema — uma versão para o CasparCG, outra para o SPX, outra para o Vizrt. Cada uma com seu próprio formato, suas manias e suas limitações.",
    p2: (
      <>
        <strong className={STRONG}>O OGraf acaba com isso.</strong> Você cria o grafismo uma única vez como uma pequena página web (HTML + CSS + JavaScript), empacota num formato padrão, e ele roda em <em>qualquer</em> sistema compatível com OGraf. O mesmo arquivo, em todo lugar.
      </>
    ),
    rolesCaption: "Os três papéis no ecossistema OGraf",
    roles: [
      { title: "Você cria", desc: "Desenhe o grafismo com HTML, CSS e JavaScript — as mesmas ferramentas usadas para construir sites." },
      { title: "Você empacota", desc: "Adicione um arquivo de manifesto que descreve o grafismo — nome, campos de dados e comportamento." },
      { title: "Ele roda", desc: "Qualquer sistema de playout compatível com OGraf (SPX, CasparCG, ograf-server…) consegue carregá-lo e executá-lo." },
    ],
    analogy: "Pense no OGraf como um PDF. Um PDF tem a mesma aparência seja no Adobe Reader, no Chrome ou no Pré-Visualização. Um grafismo OGraf funciona do mesmo jeito seja no SPX, no CasparCG ou em qualquer outro sistema compatível. O formato é o contrato.",
  },

  inside: {
    title: "O que tem num pacote",
    intro: "Um pacote OGraf é só uma pasta com alguns arquivos. Não é preciso nenhum software especial para criar um — dá para montá-lo com qualquer editor de texto.",
    caption: "Um pacote OGraf típico para um lower third",
    tree: {
      manifest: "← O manifesto (obrigatório)",
      code: "← O código do grafismo",
      styles: "← Seus estilos",
      thumbnail: "← Imagem de pré-visualização",
      font: "← Fonte personalizada",
      logo: "← Logo ou imagens",
    },
    required: (
      <>
        Dois arquivos são obrigatórios: o manifesto (<code className={CODE}>.ograf.json</code>) e o módulo JavaScript para o qual aponta o campo <code className={CODE}>main</code>. Todo o resto fica a seu critério — inclua no pacote as fontes, imagens, CSS ou bibliotecas JavaScript de que o grafismo precisar.
      </>
    ),
    calloutTitle: "Para designers de After Effects",
    callout: (
      <>
        Se você usa ferramentas como o <strong>Ferryman</strong> ou o <strong>Loopic</strong>, elas geram esse pacote automaticamente. Você desenha visualmente e a ferramenta exporta uma pasta pronta para OGraf. Sem precisar programar.
      </>
    ),
  },

  manifest: {
    title: "O arquivo de manifesto",
    p1: (
      <>
        O manifesto é um pequeno arquivo JSON que <strong className={STRONG}>apresenta o seu grafismo ao mundo</strong>. Ele responde perguntas como: qual é o nome deste grafismo? De que dados ele precisa? Como ele se comporta?
      </>
    ),
    p2: (
      <>
        Quando alguém carrega o seu grafismo no SPX ou em qualquer outro controlador, <strong className={STRONG}>o controlador lê este arquivo primeiro</strong>. Ele usa essas informações para mostrar o nome do grafismo na lista de templates, gerar formulários de entrada de dados para o operador e saber como controlar a reprodução.
      </>
    ),
    breakdown: "Vamos destrinchar cada parte:",
    identity: {
      title: "Identidade — quem é este grafismo?",
      subtitle: "id, version, name, description, author",
      body: (
        <>
          <p><code className={FIELD}>id</code> — Um identificador único, como o código de barras de um produto. Use o domínio da sua empresa invertido: <code className={MONO}>com.mystation.lower-third</code></p>
          <p><code className={FIELD}>name</code> — O nome amigável que os operadores veem na lista de templates: <em>"News Lower Third"</em></p>
          <p><code className={FIELD}>version</code> — Para os sistemas saberem qual versão estão rodando: <em>"1.0.0"</em>, <em>"2.3.1"</em></p>
          <p><code className={FIELD}>description</code> — Uma frase curta explicando o que o grafismo faz</p>
          <p><code className={FIELD}>author</code> — Seu nome e seus dados de contato</p>
        </>
      ),
    },
    code: {
      title: "Código — onde está o grafismo?",
      subtitle: "main",
      body: (
        <>
          <p><code className={FIELD}>main</code> — O caminho para o arquivo JavaScript com a lógica do grafismo. É ali que ficam a animação, o tratamento dos dados e o código de renderização.</p>
          <p>Exemplo: <code className={MONO}>"graphic.mjs"</code> — um arquivo na mesma pasta do manifesto.</p>
        </>
      ),
    },
    behavior: {
      title: "Comportamento — como ele funciona?",
      subtitle: "stepCount, supportsRealTime, supportsNonRealTime",
      body: (
        <>
          <p><code className={FIELD}>stepCount</code> — Quantas "páginas" ou estados este grafismo tem? Um lower third simples tem <strong>1 passo</strong> (aparece e depois some). Um resultado de eleição com várias páginas pode ter <strong>5 passos</strong>. Mais sobre isso abaixo.</p>
          <p><code className={FIELD}>supportsRealTime</code> — Este grafismo pode rodar ao vivo, no ar? (Quase sempre <code className={MONO}>true</code>)</p>
          <p><code className={FIELD}>supportsNonRealTime</code> — Este grafismo pode ser renderizado quadro a quadro para pós-produção? (Recurso avançado, normalmente <code className={MONO}>false</code>)</p>
        </>
      ),
    },
    data: {
      title: "Dados — que informações ele exibe?",
      subtitle: "schema",
      body: (
        <>
          <p>O <code className={FIELD}>schema</code> diz aos controladores <strong>quais campos o operador precisa preencher</strong>. O controlador lê isso e gera um formulário automaticamente — caixas de texto, seletores de cor, menus suspensos — para que o operador nunca precise mexer em código.</p>
          <p>No exemplo acima, o schema diz: <em>"Este grafismo precisa de um Name (texto) e um Title (texto)."</em> O controlador mostra dois campos de texto. O operador digita "Jane Smith" e "Senior Reporter", clica em Play, e o lower third aparece na tela com esses dados.</p>
        </>
      ),
    },
    analogy: "O manifesto é como o verso da caixa de um jogo de tabuleiro. Ele diz o nome do jogo, quantos jogadores aceita, o que vem na caixa e as regras básicas — antes mesmo de você abri-la. Os controladores leem o manifesto para saber como apresentar e operar o seu grafismo.",
  },

  lifecycle: {
    title: "Como um grafismo ganha vida",
    intro: 'Quando um operador clica em "Play" no controlador (como o SPX), uma sequência precisa acontece nos bastidores: o renderizador chama estes métodos no grafismo, nesta ordem. Entender essa sequência é a chave para entender o OGraf. Os grafismos também podem declarar ações customizadas — um efeito de gol num placar, por exemplo —, que os controladores mostram como botões extras e entregam por meio de customAction().',
    caption: "O ciclo de vida de um grafismo OGraf durante uma transmissão ao vivo",
    steps: [
      { action: "load()", what: "O grafismo recebe os dados do operador (nome, cargo, cores…) e se prepara.", example: 'O operador preenche "Jane Smith" e "Reporter" no formulário.' },
      { action: "playAction()", what: "O grafismo entra na tela com animação. O lower third desliza a partir da esquerda.", example: "O diretor clica em Play. O crédito com o nome entra com uma animação suave." },
      { action: "updateAction()", what: "Os dados mudam enquanto o grafismo está no ar. O texto é atualizado ao vivo.", example: 'O cargo muda de "Reporter" para "Senior Correspondent" no meio do programa.' },
      { action: "stopAction()", what: "O grafismo sai da tela com animação. O lower third desliza de volta para fora.", example: "O diretor clica em Stop. O grafismo sai com uma animação limpa." },
      { action: "dispose()", what: "Tudo é limpo. A memória é liberada. Pronto para o próximo grafismo.", example: "O sistema remove o grafismo da memória do renderizador." },
    ],
    body: (
      <>
        Cada uma dessas etapas é um <strong className={STRONG}>método no seu código</strong>. O renderizador os chama em ordem e <strong className={STRONG}>espera cada um terminar</strong> antes de chamar o próximo. Ou seja: quando você diz ao renderizador "minha animação leva 500ms", ele respeita isso e não interrompe.
      </>
    ),
    calloutTitle: "A sacada principal",
    callout: (
      <>
        O OGraf não se importa com <em>como</em> você anima o grafismo — transições CSS, JavaScript, GSAP, Lottie, canvas, SVG — tudo funciona. Ele só se importa com <em>quando</em> você terminou. Sinalize "estou pronto" e o renderizador segue em frente.
      </>
    ),
  },

  steps: {
    title: "Passos — para grafismos de várias páginas",
    intro: (
      <>
        Nem todo grafismo é um simples lower third. Um resultado de eleição pode ter 5 páginas. Um placar esportivo pode ser atualizado dinamicamente. O OGraf resolve isso com <strong className={STRONG}>passos</strong>.
      </>
    ),
    examples: (list: string) => `Exemplos: ${list}`,
    models: [
      { label: "Dispara e esquece", desc: "Disparado uma vez, vai do início ao fim sozinho — entra, fica e sai. Não há passos para o operador avançar.", examples: "Vinheta de replay, transição de wipe, animação de bumper", visual: ["▶️ Entra", "✨ Auto", "⏹️ Sai"] },
      { label: "Passo único (o mais comum)", desc: "Aparece quando recebe play, fica visível e some quando recebe stop.", examples: "Lower third, bug (selo de canto), marca d'água com logo, relógio", visual: ["▶️ Entra", "⏸️ Fica", "⏹️ Sai"] },
      { label: "Vários passos", desc: "Cada Play avança para a próxima página. Stop sai a partir de qualquer página.", examples: "Resultado de eleição (3 partidos), grafismo com várias estatísticas, apresentação de slides", visual: ["▶️ Página 1", "▶️ Página 2", "▶️ Página 3", "⏹️ Sai"] },
      { label: "Passos dinâmicos", desc: "O número de páginas depende dos dados — podem ser 2 ou 20.", examples: "Tabelas baseadas em dados, classificações ao vivo, listas com rolagem", visual: ["▶️ Página 1", "▶️ ...", "▶️ Página N", "⏹️ Sai"] },
    ],
  },

  data: {
    title: "Dados e formulários",
    p1: (
      <>
        A parte mais poderosa do OGraf para designers: <strong className={STRONG}>você define de que dados o grafismo precisa, e o controlador monta automaticamente um formulário para o operador</strong>. Sem precisar de interface personalizada.
      </>
    ),
    p2: (
      <>
        Isso é feito pelo <code className={CODE}>schema</code> no seu manifesto, usando um formato chamado <strong className={STRONG}>GDD</strong> (Graphics Data Definition). Não se intimide com o nome — é só uma forma de dizer "este grafismo precisa de um campo de texto chamado Nome e de um seletor de cor chamado Fundo".
      </>
    ),
    caption: "O que o operador vê vs. o que você escreve no manifesto",
    operatorSees: "O que o operador vê",
    youWrite: "O que você escreve no manifesto",
    form: {
      headline: "Manchete",
      headlineValue: "Breaking News",
      bgColor: "Cor de fundo",
      position: "Posição",
      positionValue: "Esquerda ▾",
      duration: "Duração da animação",
    },
    fieldTypesTitle: "Tipos de campo disponíveis",
    fieldTypesIntro: (
      <>
        O <code className={CODE}>gddType</code> diz ao controlador que tipo de campo mostrar. Estas são as opções:
      </>
    ),
    fieldTypes: {
      "single-line": "Campo de texto (uma linha)",
      "multi-line": "Área de texto (várias linhas)",
      select: "Menu suspenso com opções",
      "color-rrggbb": "Seletor de cor",
      "color-rrggbbaa": "Seletor de cor com transparência",
      "file-path": "Seletor de arquivo",
      "file-path/image-path": "Seletor de arquivo de imagem",
      percentage: "Controle deslizante de porcentagem",
      "duration-ms": "Duração em milissegundos",
    },
  },

  realWorld: {
    intro: "Cada conceito desta especificação corresponde a algo real que você pode construir. Cada tutorial guia você por um grafismo OGraf completo — manifesto, Web Component, animação, dados — em 10 a 25 minutos.",
    cardsTitle: "Exemplos do mundo real",
    cardsSubtitle: "Escolha um e construa. Cada exemplo vem como um pacote OGraf funcionando.",
  },

  advanced: {
    title: "Tópicos avançados",
    intro: "Estes recursos são menos comuns, mas importantes para fluxos de trabalho especializados.",
    customActions: {
      title: "Ações customizadas",
      subtitle: "Botões específicos do grafismo para os operadores",
      body: (
        <>
          <p>Além de play/stop/update, você pode definir <strong>operações customizadas</strong> com seus próprios botões e formulários de dados. Um placar pode ter um botão "Gol" que dispara uma animação de comemoração. Um ticker pode ter um botão "Adicionar item".</p>
          <p className="mt-2">Você as define no manifesto e os controladores geram a interface automaticamente — o operador só clica num botão.</p>
        </>
      ),
    },
    renderRequirements: {
      title: "Requisitos de renderização",
      subtitle: "O que o sistema de playout precisa suportar",
      body: <p>Se o seu grafismo precisa de uma resolução específica (por exemplo, no mínimo 1920x1080), de uma taxa de quadros (por exemplo, 50fps) ou de uma versão mínima do motor do navegador, você pode declarar isso — assim como se ele precisa de acesso à internet pública. O renderRequirements é uma lista de alternativas: espera-se que o grafismo funcione quando o renderizador atende a pelo menos uma delas.</p>,
    },
    nonRealTime: {
      title: "Renderização em não tempo real",
      subtitle: "Quadro a quadro para pós-produção",
      body: <p>Para edição de vídeo e pós-produção, os renderizadores podem percorrer o grafismo quadro a quadro em vez de reproduzi-lo em tempo real. Isso gera uma saída com qualidade perfeita para conteúdo gravado. O seu grafismo precisa de dois métodos extras: um para saltar para um instante específico e outro para receber de antemão a linha do tempo completa das ações.</p>,
    },
    vendorExtensions: {
      title: "Extensões de fabricante",
      subtitle: "Campos personalizados para sistemas específicos",
      body: <p>Todo campo que começa com <code className={MONO}>v_</code> é reservado para dados específicos de fabricante. O SPX poderia adicionar <code className={MONO}>v_spx_category</code>; o CasparCG poderia adicionar <code className={MONO}>v_casparcg_channel</code>. Esses campos são ignorados pelos outros sistemas — eles não quebram a compatibilidade.</p>,
    },
  },

  next: {
    title: "Próximos passos",
    build: { title: "Crie seu primeiro template", desc: "Tutorial mão na massa. Do zero a um lower third funcionando em 15 minutos.", cta: "Começar a construir" },
    spec: { title: "Especificação oficial da EBU", desc: "A especificação técnica completa, com JSON schemas e tipos TypeScript.", cta: "Ler a especificação" },
    ecosystem: { title: "Explore o ecossistema", desc: "Descubra editores, renderizadores, controladores e ferramentas compatíveis com OGraf.", cta: "Ver todas as ferramentas" },
    check: { title: "Verifique seu pacote", desc: (total: number) => `Solte um .zip e receba um relatório estruturado com base em ${total} regras e no schema da EBU em vigor.`, cta: "Abrir o verificador" },
  },
};
