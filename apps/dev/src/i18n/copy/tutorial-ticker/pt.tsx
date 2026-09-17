import { CODE_BLUE, CODE_SLATE, STRONG } from "../tutorial-ui/styles";
import type { TutorialTickerCopy } from "./en";

export const pt: TutorialTickerCopy = {
  title: "Crie um ticker de notícias.",
  lead: "A faixa de texto rolando na parte de baixo da tela — CNN, BBC News, Bloomberg. As manchetes passam sem parar da direita para a esquerda. Este tutorial cobre animações CSS infinitas, arrays de dados dinâmicos e loop contínuo sem emendas.",
  demo: {
    badge: "Texto do selo",
    items: "Manchetes",
    heading: "Ticker de notícias — template OGraf",
  },
  diffTitle: "O que torna um ticker diferente?",
  diffs: [
    { title: "Rolagem infinita", body: <>Usa <code className={CODE_SLATE}>@keyframes</code> de CSS com repetição <code className={CODE_SLATE}>infinite</code> em <code className={CODE_SLATE}>.ticker-content</code> (20s por ciclo). O conteúdo é duplicado para o loop não ter emendas.</> },
    { title: "Dados em array", body: <>Em vez de campos únicos, o schema aceita um <strong>array de manchetes</strong>. Cada item passa em sequência.</> },
    { title: "Barra de largura total", body: <>Ocupa toda a borda inferior numa barra de 48px. O selo azul (o campo <code className={CODE_SLATE}>badge</code>) fica à esquerda, e o texto rola à direita dele.</> },
  ],
  loopTitle: "O truque do loop sem emendas",
  loopBody: (
    <>
      O ticker <strong className={STRONG}>duplica todas as manchetes</strong> para que a rolagem pareça infinita. Quando o primeiro conjunto sai totalmente da tela, o segundo já tomou o lugar dele — a animação reinicia sem que se perceba. Cada manchete passa por <code className={CODE_SLATE}>escapeHtml()</code> antes de chegar ao <code className={CODE_SLATE}>innerHTML</code>, então uma manchete com <code className={CODE_SLATE}>&lt;</code> ou <code className={CODE_SLATE}>&amp;</code> aparece como texto. <code className={CODE_SLATE}>_applyData()</code> só renderiza de novo quando <code className={CODE_SLATE}>items</code> é um array, e um <code className={CODE_SLATE}>loop: false</code> opcional (usado pela chave de modo de reprodução da demo; fora do schema do manifesto) faz a faixa rodar uma vez e parar em vez de repetir.
    </>
  ),
  renderFile: "graphic.mjs (renderizando os dados)",
  cssTitle: "A animação de rolagem em CSS",
  keyParts: "style.css (trechos principais)",
  whyTitle: "Por que -50%?",
  why: (
    <>
      <code className={CODE_BLUE}>_renderItems</code> escreve as manchetes duas vezes, cada uma seguida do seu separador, e todo filho de <code className={CODE_BLUE}>.ticker-content</code> tem a mesma margem final de 40px. Por isso as duas metades têm exatamente a mesma largura, e deslocar em -50% leva a cópia precisamente ao ponto onde o original começou — quando a animação reinicia, nada pula. É também por isso que o espaçamento é uma margem, e não <code className={CODE_BLUE}>gap</code> ou <code className={CODE_BLUE}>padding-left</code>: qualquer um dos dois deixaria as metades diferentes. <code className={CODE_BLUE}>.ticker-track</code> recorta tudo com <code className={CODE_BLUE}>overflow: hidden</code>.
    </>
  ),
  promiseTitle: "Uma animação infinita, uma promise imediata",
  promiseBody: (
    <>
      A faixa nunca termina, mas <code className={CODE_SLATE}>playAction()</code> resolve depois dos 500ms em que a barra sobe. A especificação diz que animações longas ou infinitas não devem atrasar a promise — o renderizador precisa saber que o grafismo está no ar, não quando a faixa termina. O modelo de passos é o da especificação: o primeiro play cai no passo 0, e um segundo play tira do ar o ticker de um passo só e retorna <code className={CODE_SLATE}>currentStep: undefined</code>. <code className={CODE_SLATE}>stopAction()</code> desce a barra em 400ms e confere <code className={CODE_SLATE}>this._rev</code> antes de escondê-la, então um play enviado durante esse stop prevalece.
    </>
  ),
  playFile: "graphic.mjs (play e stop)",
  downloadTitle: "Ticker de notícias",
  manifestIntro: "Repare que o schema usa um array de strings para as manchetes, e não um único campo de texto. Os controladores mostram isso como uma lista em que o operador pode adicionar, remover e reordenar itens.",
  done: {
    title: "Ticker concluído.",
    body: "Você aprendeu animações CSS infinitas, schemas com arrays de dados, o truque de duplicar o conteúdo para um loop sem emendas e por que uma faixa sem fim ainda resolve o playAction na hora.",
    next: "Próximo: citação em tela cheia",
  },
};
