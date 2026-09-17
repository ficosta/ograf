import { CODE_AMBER, CODE_SLATE_SM, STRONG } from "../tutorial-ui/styles";
import type { TutorialQuoteCopy } from "./en";

export const pt: TutorialQuoteCopy = {
  title: "Crie uma citação em tela cheia.",
  lead: "Um card de citação elegante em tela cheia — do tipo usado para trechos de entrevista, quadros motivacionais ou aberturas editoriais. O texto, o divisor e a atribuição aparecem numa sequência escalonada, com impacto cinematográfico.",
  demo: {
    text: "Citação",
    author: "Autor",
    role: "Função",
    heading: "Citação em tela cheia — template OGraf",
  },
  staggerTitle: "A técnica da revelação escalonada",
  staggerBody: (
    <>
      A mágica aqui são os <strong className={STRONG}>delays de transição do CSS</strong>. O texto e a atribuição começam transparentes e um pouco abaixo da posição final; o divisor começa com largura zero. Quando a classe <code className={CODE_SLATE_SM}>.visible</code> é adicionada, eles animam em sequência:
    </>
  ),
  stagger: [
    { delay: "0.3s", element: "Texto da citação", desc: "Sobe surgindo de baixo" },
    { delay: "0.4s", element: "Linha divisória", desc: "Cresce a partir do centro" },
    { delay: "0.5s", element: "Atribuição", desc: "Sobe surgindo por último" },
  ],
  cssTitle: "O CSS — transições escalonadas",
  cssBody: (
    <>
      Tudo fica dentro de <code className={CODE_SLATE_SM}>.quote-root</code>. O reset é limitado com <code className={CODE_SLATE_SM}>:where(.quote-root, …)</code>, então nunca altera o estilo da página do renderizador, e a raiz ocupa a caixa que o renderizador fornecer com <code className={CODE_SLATE_SM}>position: absolute; inset: 0</code>. O estado oculto de cada filho (como <code className={CODE_SLATE_SM}>.quote-text</code> abaixo) fica 20px mais baixo e com opacidade zero; as regras de <code className={CODE_SLATE_SM}>.visible</code> trazem os delays.
    </>
  ),
  cssFile: "style.css (trechos principais)",
  tipTitle: "Dica de design",
  tip: (
    <>
      O fundo começa em <code className={CODE_AMBER}>scale(1.1)</code> e faz a transição para <code className={CODE_AMBER}>scale(1)</code>. Isso cria um efeito sutil de "câmera assentando" — o fundo se ajusta suavemente enquanto a citação aparece. Clima de cinema com uma linha de CSS.
    </>
  ),
  typeTitle: "Escolhas tipográficas",
  typeBody: (
    <>
      Este template usa <strong className={STRONG}>duas fontes</strong> para criar contraste:
    </>
  ),
  serifSample: "\"A citação\"",
  serifDesc: "Instrument Serif — itálico, grande (48px). A voz editorial e elegante.",
  sansSample: "A atribuição",
  sansRole: "FUNÇÃO / CARGO",
  sansDesc: "Inter — sans-serif limpa e moderna. A voz factual.",
  timingTitle: "O tempo do playAction",
  timing: [
    <>Como a animação escalonada demora mais que um simples deslize, a promise de <code className={CODE_SLATE_SM}>playAction()</code> espera <strong className={STRONG}>1300ms</strong> antes de resolver — a duração da revelação mais lenta. A essa altura o fundo (1s), o texto da citação (0.3s de delay + 0.8s), o divisor (0.4s + 0.6s) e a atribuição (0.5s + 0.8s) já chegaram ao lugar. <code className={CODE_SLATE_SM}>stopAction()</code> faz o card inteiro sumir em 500ms.</>,
    <>O resto segue o modelo de passos do OGraf. <code className={CODE_SLATE_SM}>resolveTargetStep()</code> usa <code className={CODE_SLATE_SM}>goto</code> se informado; senão, o passo atual mais <code className={CODE_SLATE_SM}>delta</code> (padrão 1). O primeiro play coloca a citação no ar no passo 0; um segundo play passa do único passo, então executa o stop e retorna <code className={CODE_SLATE_SM}>currentStep: undefined</code>. Cada ação incrementa <code className={CODE_SLATE_SM}>this._rev</code>, e um stop só remove <code className={CODE_SLATE_SM}>.visible</code> se nada mais novo tiver começado — play → stop → play sem esperar termina com a citação no ar.</>,
  ],
  playFile: "graphic.mjs (trechos principais)",
  downloadTitle: "Citação em tela cheia",
  done: {
    title: "Citação concluída.",
    body: "Você aprendeu transições CSS escalonadas, layouts em tela cheia, contraste tipográfico e como coordenar o tempo entre CSS e JavaScript.",
    spec: "Leia o guia da especificação",
  },
};
