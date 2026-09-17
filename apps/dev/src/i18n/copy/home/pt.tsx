import type { HomeCopy } from "./en";
import { BRAND } from "./styles";

export const pt: HomeCopy = {
  heroBefore: "A",
  heroAfter: "que faltava para o OGraf.",
  rotatingWords: ["comunidade", "referência", "plataforma", "ferramenta", "bancada", "central"],
  heroLead:
    "O OGraf é um novo formato aberto para grafismo de broadcast. Sem ficar preso a um fabricante, sem runtimes proprietários: um único pacote que roda em qualquer sistema compatível.",
  startTutorial: "Começar o tutorial",
  exploreTools: "Conhecer as ferramentas",
  adopters: {
    heading: "Fabricantes e adotantes",
    vendorsLabel: "Fabricantes",
    organisationsLabel: "Organizações de broadcast",
    sourcePrefix: "Empresas e emissoras que, nas palavras da EBU, apoiam a especificação OGraf, conforme a lista em",
  },
  featuresTitle: "Por que o OGraf importa.",
  featuresLead:
    "O mercado de grafismo para broadcast sempre dependeu de sistemas fechados, específicos de cada fabricante. O OGraf acrescenta uma camada aberta e nativa da web que qualquer um pode renderizar, controlar e colocar no ar.",
  features: {
    open: {
      title: "Padrão aberto",
      desc: "Sem aprisionamento. Sem licenças. Sem intermediários. Licença MIT e apoio da EBU — seus grafismos pertencem a você, não à fatura de algum fabricante.",
    },
    web: {
      title: "Nativo da web",
      desc: "Se você sabe fazer um site, sabe fazer grafismo para broadcast. HTML, CSS, JavaScript — as habilidades que você já tem, no ar ao vivo.",
    },
    interop: {
      title: "Interoperável",
      desc: "Construa uma vez. Use em qualquer lugar. O mesmo pacote OGraf roda no SPX, no CasparCG, no Loopic e em qualquer sistema compatível — sem refazer, sem converter.",
    },
  },
  compareTitle: "Onde o OGraf se encaixa.",
  compareLead:
    "Grafismo para broadcast é um mercado profundo e maduro — Vizrt, Chyron, Ross, Avid, Singular, Flowics e muitos outros movem as maiores produções do mundo. O OGraf não veio para substituí-los. Ele acrescenta uma camada aberta e portátil para que o mesmo grafismo possa circular entre sistemas.",
  featureColumn: "Recurso",
  systemNotes: ["Especificação aberta", "Viz Engine", "PRIME / LyricX", "XPression", "Maestro", "Nuvem", "Nuvem"],
  rows: [
    { feature: "Especificação aberta" },
    { feature: "Nativo da web (HTML/CSS/JS)" },
    { feature: "Portável entre renderizadores", note: "O mesmo pacote roda em qualquer sistema compatível" },
    { feature: "Opção de hospedagem própria" },
    { feature: "Implementação de referência open source" },
    { feature: "Renderização na nuvem disponível" },
  ],
  legend: {
    yes: "Suportado",
    partial: "Parcial / via complemento",
    no: "Não suportado",
  },
  compareFootnote: (
    <>
      Este quadro foca em um único eixo: se um grafismo criado em um sistema pode ser renderizado em outro. Cada plataforma acima conquistou seu espaço resolvendo problemas reais de produção — a contribuição do OGraf é o formato compartilhado, não um substituto para os runtimes em que as equipes já confiam. Plataformas especializadas como <span className={BRAND}>Brainstorm</span>, <span className={BRAND}>Aximmetry</span>, <span className={BRAND}>WASP3D</span> e <span className={BRAND}>Zero Density</span> lideram em estúdios virtuais, AR e XR; stacks abertas como <span className={BRAND}>CasparCG</span>, <span className={BRAND}>SPX-GC</span> e <span className={BRAND}>ograf-server</span> já renderizam pacotes OGraf nativamente.
    </>
  ),
  ecosystemTitle: "Um ecossistema de ferramentas em crescimento.",
  ecosystemLead:
    "De renderizadores de referência a editores no-code, o ecossistema OGraf tem tudo o que você precisa para criar, testar e publicar grafismo para broadcast.",
  tools: {
    "SPX-GC": {
      cat: "Controlador",
      desc: "Controlador de grafismo profissional no navegador para produções ao vivo. Suporta CasparCG, OBS e vMix.",
    },
    CasparCG: {
      cat: "Renderizador",
      desc: "Servidor profissional open source de playout de grafismo e vídeo, com saída SDI e NDI.",
    },
    Ferryman: {
      cat: "Conversor",
      desc: "Converte animações do After Effects e do Lottie em templates HTML compatíveis com OGraf.",
    },
    "ograf-server": {
      cat: "Servidor",
      desc: "Renderizador OGraf de referência com API de upload, API de controle e renderização no navegador.",
    },
    Loopic: {
      cat: "Editor",
      desc: "Criador de templates de grafismo para TV no navegador, sem código, com exportação para OGraf em um clique.",
    },
  },
  viewEcosystem: "Ver o mapa completo do ecossistema",
  statsTitle: "O OGraf em números.",
  statsLead: "O padrão apoiado pela EBU está em uso ativo em toda a indústria de grafismo para broadcast.",
  stats: [
    { stat: "EBU", label: "Grupo de trabalho mantém a especificação no GitHub" },
    { stat: "v1 estável", label: "Graphics Definition estável desde setembro de 2025" },
    { stat: "10+", label: "Ferramentas e renderizadores com suporte ao padrão OGraf" },
  ],
  tutorialsTitle: "Aprenda criando grafismos de verdade.",
  tutorialsSubtitle:
    "Cada tutorial constrói do zero um grafismo para broadcast com qualidade de produção — com demos interativas ao vivo.",
  faqTitle: "Perguntas frequentes.",
};
