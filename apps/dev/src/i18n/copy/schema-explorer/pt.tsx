import { Link } from "../../Link";
import type { SchemaExplorerCopy } from "./en";
import { DARK_LINK, EXTRA_CODE, INLINE_CODE } from "./styles";

export const pt: SchemaExplorerCopy = {
  hero: {
    eyebrow: "Explorador de schema",
    title: "Cada campo de um manifesto OGraf, em linguagem simples.",
    intro:
      "Um catálogo pensado para designers do schema canônico de manifesto da EBU. Navegue pelos campos de nível superior, veja cada tipo de entrada do operador com uma simulação visual real e esqueça de vez o jargão do JSON Schema.",
  },
  stats: {
    fields: "Campos do manifesto",
    required: "Obrigatórios",
    clusters: "Grupos",
    types: "Tipos de entrada do operador",
  },
  mindMap: {
    title: "A estrutura completa, num relance",
    intro: (
      <>
        Tudo o que um manifesto OGraf pode conter — campos obrigatórios em rosa, opcionais em
        cinza. Clique em qualquer ramo abaixo para ir direto ao cartão detalhado.
      </>
    ),
    legendRequired: "obrigatório",
    legendOptional: "opcional",
    legendClick: "clique em qualquer ramo para ir ao cartão completo abaixo",
    rootLabel: "Manifesto OGraf",
    hints: {
      schema: "string · URL constante",
      main: "string · arquivo de entrada",
      version: "string · ordenável",
      stepCount: "number · padrão 1 · -1 = dinâmico",
      actionSchema: "object | null  (null = sem parâmetros)",
      operatorForm: "gdd/object.json — formulário de dados do operador",
      gddType: "1 dos 9 abaixo ↓",
      gddOptions: "object — extensões, rótulos…",
      default: "depende do tipo",
      hidden: "boolean — omitir no rótulo de exibição",
      order: "number — dica de ordem na interface, menor primeiro",
      items: "(se type=array)  → object.json recursivo",
      properties: "(se type=object) → object.json recursivo",
      gddTypes: "9 tipos canônicos",
      renderRequirements: "array de objetos de requisito",
      engineType: "string — CEF, Gecko, …",
      engineVersion: "string — específica do motor",
      vendorLabel: "v_*  (extensões de fabricante)",
      vendor: "campos customizados com prefixo v_ são permitidos em qualquer nível",
    },
  },
  fields: {
    title: "Campos do manifesto",
    intro: (
      <>
        Tudo o que pode ficar no nível superior de um manifesto <code className={INLINE_CODE}>.ograf.json</code>, agrupado nas cinco coisas que realmente importam para designers: quem é este grafismo, como ele se comporta, que dados ele pede ao operador, que botões customizados o operador pode apertar e do que ele precisa do renderizador.
      </>
    ),
  },
  gdd: {
    title: "Tipos de entrada do operador",
    intro: (
      <>
        Dentro do campo <code className={INLINE_CODE}>schema</code> — é o formulário que o controlador monta para o operador. Estes são os tipos de entrada que você pode usar, cada um com uma simulação do que o operador realmente vê no controlador. Combine-os para pedir o que o seu grafismo precisar: nome, placar, foto, cor, posição…
      </>
    ),
    extrasTitle: "Dois extras que qualquer campo pode ter",
    hidden: (
      <>
        <code className={EXTRA_CODE}>hidden: true</code> — quando presente, o valor do
        campo é{" "}
        <strong>excluído do rótulo de exibição do grafismo</strong> nas interfaces de
        playout/automação. Use em campos técnicos ou que só poluem.
      </>
    ),
    order: (
      <>
        <code className={EXTRA_CODE}>order: 0</code> — dica de ordenação na interface. Números
        menores vêm primeiro. Permite controlar onde cada campo aparece no formulário do
        operador.
      </>
    ),
  },
  cta: {
    title: "Pronto para juntar as peças?",
    body: "A página da especificação percorre o manifesto completo, de ponta a ponta, com um exemplo prático. Os tutoriais mostram 11 grafismos construídos do início ao fim. O verificador de pacotes valida um pacote pronto contra este mesmo schema.",
    spec: "Ler a especificação",
    tutorials: "Ver os tutoriais",
    check: "Validar um pacote",
    source: "Fonte:",
  },
  cards: {
    example: "Exemplo:",
    required: "Obrigatório",
    optional: "Opcional",
    toggleExamples: (open: boolean, count: number) =>
      `${open ? "Ocultar" : "Mostrar"} ${count === 1 ? "exemplo" : `${count} exemplos`}`,
    examplesAria: "Exemplos",
    directLink: (name: string) => `Link direto para ${name}`,
    copyFieldLink: "Copiar o link deste campo",
    copyTypeLink: "Copiar o link deste tipo",
    operatorSees: "O que o operador vê",
  },
  mocks: {
    name: "Nome",
    quote: "Citação",
    quoteValue: "Grafismo aberto, broadcast aberto, padrões abertos. Esse é o futuro.",
    themeMusic: "Música tema",
    browse: "Procurar…",
    logo: "Logo",
    dropOrBrowse: "Solte ou procure",
    position: "Posição",
    bottomRight: "Inferior direito",
    overlay: "Sobreposição",
    accent: "Destaque",
    opacity: "Opacidade",
    animationDuration: "Duração da animação",
  },
  source: {
    fetching: "Buscando o schema ao vivo em ograf.ebu.io…",
    synced: "Sincronizado com a EBU",
    fetched: (ago: string) => `· obtido ${ago}`,
    justNow: "agora mesmo",
    secondsAgo: (n: number) => `há ${n} s`,
    minutesAgo: (n: number) => `há ${n} min`,
    hoursAgo: (n: number) => `há ${n} h`,
    daysAgo: (n: number) => `há ${n} d`,
    bundledSnapshot: "Cópia local incluída no site",
    offline: "Offline · usando cópia local",
  },
  ai: {
    badge: "Assistente de IA",
    title: "Peça a uma IA para verificar ou montar o seu manifesto.",
    intro:
      "Copie o prompt abaixo em qualquer chat de IA. Ele ensina ao modelo as regras do OGraf num nível em que um designer pode confiar — campos obrigatórios, os gddTypes canônicos, extensões de fabricante, tudo.",
    whereToPaste: "Onde colar",
    tipsTitle: "Dicas para respostas melhores",
    copied: "Copiado",
    copyPrompt: "Copiar prompt",
    platformNotes: {
      ChatGPT:
        "O carro-chefe da OpenAI. A maioria dos designers já tem conta. Modelos da classe GPT-4 / 5 dão conta do prompt com folga.",
      Claude:
        "Da Anthropic. Especialmente bom em tarefas com dados estruturados, como validação de JSON Schema. O plano gratuito é generoso.",
      Gemini:
        "Do Google. Tem acesso à web em tempo real — consegue buscar o schema canônico em ograf.ebu.io enquanto responde.",
      Perplexity:
        "Baseado em buscas na web. Útil quando você também quer descobrir ferramentas do ecossistema ou notícias recentes do OGraf na mesma conversa.",
    },
    tips: [
      "Cole o seu .ograf.json completo junto com o prompt. A IA encontra campos obrigatórios faltando e erros de digitação em segundos.",
      "Descreva o grafismo em linguagem simples e deixe a IA rascunhar o manifesto para você. \"Lower third com nome, cargo e seletor de cor do time, 1 passo, só tempo real.\"",
      "Sempre passe o resultado pelo verificador de pacotes (ograf.dev/check) antes de publicar. A saída da IA é um ótimo rascunho, não uma resposta final.",
      "Diga qual gddType você quer para cada campo do operador. Sem isso, a IA muitas vezes usa strings simples de JSON Schema, que os controladores não conseguem exibir tão bem.",
      "Se você usa um recurso específico de um fabricante, adicione um v_suaEmpresa_campo — a especificação rejeita chaves desconhecidas no nível superior, mas permite prefixos v_ em qualquer lugar.",
      "Quando a IA devolver o JSON, peça \"validate this against https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json\" — modelos com navegação vão buscar a versão canônica e conferir o próprio trabalho.",
    ],
    headsUp: (
      <>
        Um aviso: a saída da IA é um ótimo <em>rascunho</em>, nunca uma resposta final. Sempre passe o resultado pelo{" "}
        <Link to="/check" className={DARK_LINK}>
          verificador de pacotes
        </Link>{" "}
        antes de publicar.
      </>
    ),
    cites: (
      <>
        O prompt cita{" "}
        <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className={DARK_LINK}>
          ograf.ebu.io
        </a>{" "}
        para que modelos com navegação possam buscar o schema canônico enquanto respondem.
      </>
    ),
  },
};
