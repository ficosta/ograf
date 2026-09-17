import type { ElectionBarsCopy } from "./en";
import { CODE, CODE_AMBER, CODE_BLUE_LIGHT, STRONG } from "../styles";

export const pt: ElectionBarsCopy = {
  title: "Crie barras de resultado de eleição.",
  intro: "As barras de eleição são a espinha dorsal da cobertura da noite de apuração — pense na noite eleitoral da CNN ou na cobertura das eleições gerais da BBC. Cada linha representa um partido, com uma barra na cor dele que cresce até o percentual de votos, criando uma comparação visceral dos resultados, que se entende num relance.",
  demoTitle: "Barras de eleição — template OGraf",
  fields: { title: "Título", subtitle: "Subtítulo", parties: "Partidos" },
  differentTitle: "O que muda em relação a uma lower third?",
  cards: [
    {
      title: "Larguras guiadas por dados",
      body: (
        <>
          Cada preenchimento guarda seu percentual em <code className={CODE}>data-pct</code>, e <code className={CODE}>_animateBars</code> define <code className={CODE}>fill.style.width = pct + '%'</code> inline. Quem controla o visual são os dados, não uma classe CSS.
        </>
      ),
    },
    {
      title: "Revelação escalonada",
      body: (
        <>
          As linhas recebem a classe <code className={CODE}>show</code> com 120 ms de intervalo, somados a um <code className={CODE}>transition-delay</code> inline de 100 ms por linha, então elas entram em cascata de cima para baixo.
        </>
      ),
    },
    {
      title: "Identidade por cor",
      body: (
        <>
          A <code className={CODE}>color</code> de cada partido vem dos dados e vira o fundo inline do preenchimento — nenhuma paleta fixa no código. Funciona para qualquer eleição, qualquer país, qualquer sistema partidário.
        </>
      ),
    },
  ],
  renderTitle: "Renderizando as barras",
  renderBody: (
    <>
      <code className={CODE}>_renderBars</code> monta uma <code className={CODE}>.election-row</code> por partido: nome e número de votos à esquerda, uma trilha com preenchimento colorido à direita e um rótulo de percentual que começa em <code className={CODE}>0%</code>. Nome e cor passam por <code className={CODE}>escapeHtml</code>, e <code className={CODE}>pct</code> e <code className={CODE}>votes</code> por <code className={CODE}>Number()</code>, para que os dados do operador não consigam injetar markup. O truque principal: <strong className={STRONG}>nada cresce ainda</strong>. Todo preenchimento começa em <code className={CODE}>width: 0</code>, e o valor-alvo espera em <code className={CODE}>data-pct</code> até <code className={CODE}>_animateBars</code> rodar.
    </>
  ),
  animateBody: (
    <>
      <code className={CODE}>_animateBars</code> mostra as linhas com 120 ms de intervalo; depois de 200 ms, escreve a largura de cada preenchimento e leva cada rótulo até a ponta da barra; 150 ms depois, o rótulo conta de 0 para cima ao longo de 900 ms com uma curva ease-out. Um <code className={CODE}>updateAction</code> posterior que inclua <code className={CODE}>parties</code> renderiza as linhas de novo; no ar, roda <code className={CODE}>_animateBars</code> outra vez para as barras crescerem até os novos resultados, e fora do ar as deixa prontas para o próximo play. Cada timer dentro de <code className={CODE}>_animateBars</code> confere a revisão em que começou, então um stop que chega no meio da revelação nunca é sobrescrito, e <code className={CODE}>stopAction</code> chama <code className={CODE}>_resetBars</code> quando o painel some, para que um novo play faça as barras crescerem do zero outra vez.
    </>
  ),
  playTitle: "Colocando no ar",
  playBody: (
    <>
      <code className={CODE}>playAction</code> segue o modelo de passos do OGraf. <code className={CODE}>resolveTargetStep</code> escolhe o destino: <code className={CODE}>goto</code>, se informado; senão, o passo atual (-1 antes do primeiro play) mais <code className={CODE}>delta</code>, que por padrão é 1. Este grafismo tem um passo, então o primeiro play cai no passo 0 e um segundo play passa do fim — o grafismo roda <code className={CODE}>stopAction</code> e retorna <code className={CODE}>currentStep: undefined</code>. No passo 0, ele adiciona <code className={CODE}>visible</code> para o painel subir, espera 400 ms, inicia as barras e resolve 1400 ms depois. Com <code className={CODE}>skipAnimation</code>, adiciona <code className={CODE}>instant</code> à raiz — uma classe que desliga todas as transições — e <code className={CODE}>_showBarsInstantly</code> aplica de uma vez as larguras e os rótulos finais.
    </>
  ),
  revTitle: "Por que o contador de revisão?",
  revBody: (
    <>
      Cada play e stop pega o próximo <code className={CODE_BLUE_LIGHT}>this._rev</code>. Se uma ação mais nova chegar durante a espera de 400 ms, <code className={CODE_BLUE_LIGHT}>playAction</code> pula <code className={CODE_BLUE_LIGHT}>_animateBars</code>, e um <code className={CODE_BLUE_LIGHT}>stopAction</code> desatualizado não esconde o painel — então play → stop → play enviados sem esperar terminam no ar.
    </>
  ),
  cssTitle: "O CSS — animação das barras",
  cssBody: (
    <>
      As linhas deslizam 20px da esquerda quando recebem <code className={CODE}>show</code>. O preenchimento faz a transição de <code className={CODE}>width</code> em 1.2 s, e o rótulo de percentual faz a transição de <code className={CODE}>left</code> com a mesma duração e curva, acompanhando a ponta da barra enquanto ela cresce. O reset no topo tem escopo em <code className={CODE}>:where(.election-bars-root, …)</code>, então nunca altera o estilo da página do renderizador.
    </>
  ),
  tipTitle: "Dica de design",
  tipBody: (
    <>
      Use rótulos de percentual assimétricos. <code className={CODE_AMBER}>_renderBars</code> dá ao rótulo a classe <strong>inside</strong> quando o partido tem 15% ou mais (texto branco, recuado para dentro da barra) e <strong>outside</strong> abaixo disso (texto escuro logo depois do fim da barra). Barras minúsculas nunca precisam acomodar um rótulo que não cabe nelas — uma armadilha comum em grafismos de eleição.
    </>
  ),
  formatTitle: "Formatação de números",
  formatBody: (
    <>
      Totais grandes de votos são difíceis de ler sem separadores. <code className={CODE}>_renderBars</code> escreve <code className={CODE}>{"(Number(p.votes) || 0).toLocaleString()"}</code>, que adiciona separadores de milhar conforme o locale do renderizador — <strong className={STRONG}>1.284.000</strong> é muito mais legível que 1284000. <code className={CODE}>votes</code> é opcional no schema, então um valor ausente aparece como 0. O rótulo de percentual é formatado à parte: <code className={CODE}>_countUp</code> arredonda cada quadro da animação para um número inteiro.
    </>
  ),
  manifestTitle: "Barras de eleição",
  manifestIntro: "O campo parties é um array tipado — items.type é object, com name, pct e color obrigatórios. É assim que o OGraf declara dados estruturados que se repetem.",
  doneTitle: "Barras de eleição concluídas.",
  doneBody: "Larguras guiadas por dados, revelações escalonadas, partidos identificados por cor e um modelo de passos fiel à especificação — tudo o que você precisa para a cobertura da noite de apuração.",
  codeLabels: {
    rendering: "renderização",
    animation: "animação",
    stepModel: "modelo de passos",
    keyParts: "trechos principais",
    countUp: "contagem crescente",
  },
  next: "Próximo: Escalação esportiva",
};
