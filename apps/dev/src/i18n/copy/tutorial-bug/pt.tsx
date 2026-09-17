import { CODE_AMBER, CODE_SLATE, STRONG } from "../tutorial-ui/styles";
import type { TutorialBugCopy } from "./en";

export const pt: TutorialBugCopy = {
  title: "Crie um bug / marca-d'água.",
  lead: "Um bug (selo de canto) é um elemento pequeno com a marca — indicador AO VIVO, logo do canal, selo de evento — que fica num canto da tela. Ele surge com uma animação de escala e some suavemente.",
  demo: {
    label: "Rótulo",
    sublabel: "Sub-rótulo",
    heading: "Bug — template OGraf",
  },
  diffTitle: "O que muda em relação a um lower third?",
  diffs: [
    { title: "Posição", body: <>Canto superior direito. <code className={CODE_SLATE}>position: absolute; top: 40px; right: 40px</code> — nunca <code className={CODE_SLATE}>fixed</code>, que escaparia para a viewport em vez de ficar na área de render de 1920×1080.</> },
    { title: "Animação", body: <>Escala a partir de 50% + blur em vez de deslizar. Um efeito de "materialização" — menos invasivo que um deslize para algo que fica na tela.</> },
    { title: "Ponto AO VIVO pulsante", body: <>Um pulso com <code className={CODE_SLATE}>@keyframes</code> em CSS, num elemento irmão com posição absoluta, cria o sinal AO VIVO no estilo de broadcast sem nenhum JavaScript.</> },
  ],
  downloadTitle: "Bug de canto",
  cssTitle: "O CSS principal — animação de escala + blur",
  cssBody: (
    <>
      Em vez de deslizar, o bug <strong className={STRONG}>cresce a partir de 50% com um blur de 8px</strong>. O estado de repouso fica em <code className={CODE_SLATE}>.bug</code>; o JavaScript só alterna as classes <code className={CODE_SLATE}>visible</code> e <code className={CODE_SLATE}>out</code>. Isso cria um efeito sutil de "materialização", menos invasivo que um deslize — perfeito para algo que fica no canto.
    </>
  ),
  keyParts: "style.css (trechos principais)",
  tipTitle: "Dica de design",
  tip: (
    <>
      A animação de entrada é um ease-out de 0.6s que assenta suavemente; a de saída (<code className={CODE_AMBER}>.bug.out</code>) só encolhe até 80% (não 50%) num ease-in-out mais curto, de 0.4s, com a opacidade e o blur sumindo em 0.3s. Essa assimetria — entrada suave, saída rápida — parece natural. O olho percebe a entrada, mas mal registra a saída.
    </>
  ),
  componentTitle: "O Web Component",
  componentBody: (
    <>
      Mesma estrutura do lower third: um <code className={CODE_SLATE}>&lt;link&gt;</code> para a folha de estilo (URL absoluta via <code className={CODE_SLATE}>import.meta.url</code>), um <code className={CODE_SLATE}>_initDom()</code> preguiçoso e os seis métodos do ciclo de vida. Nada de <code className={CODE_SLATE}>customElements.define()</code> no nível do módulo — quem escolhe a tag é o renderizador. Este é o arquivo completo do download:
    </>
  ),
  notes: [
    { title: "Passos.", body: <><code className={CODE_SLATE}>resolveTargetStep()</code> segue a especificação: <code className={CODE_SLATE}>goto</code> se informado; senão, o passo atual (-1 antes do primeiro play) mais <code className={CODE_SLATE}>delta</code> (padrão 1). O bug tem um passo só, então o primeiro play o coloca no ar no passo 0, e um segundo play o tira do ar e retorna <code className={CODE_SLATE}>currentStep: undefined</code>.</> },
    { title: "Ações fora de ordem.", body: <>Toda ação incrementa <code className={CODE_SLATE}>this._rev</code>. O <code className={CODE_SLATE}>stopAction()</code> só remove <code className={CODE_SLATE}>.visible</code> depois dos seus 400ms se nenhuma ação mais nova tiver começado, então play → stop → play enviados sem esperar terminam com o grafismo no ar.</> },
    { title: "Atualizações parciais.", body: <><code className={CODE_SLATE}>load()</code> e <code className={CODE_SLATE}>updateAction()</code> aplicam cada campo que for <code className={CODE_SLATE}>!== undefined</code>: envie só <code className={CODE_SLATE}>sublabel</code> para mudar apenas ele, ou uma string vazia para limpá-lo.</> },
    { title: "Ações customizadas.", body: <>O renderizador chama <code className={CODE_SLATE}>customAction(&#123; id, payload, skipAnimation &#125;)</code> com um <code className={CODE_SLATE}>id</code> vindo de <code className={CODE_SLATE}>customActions</code> no manifesto. O bug não declara nenhuma, então qualquer id recebe <code className={CODE_SLATE}>&#123; statusCode: 404, statusMessage &#125;</code> — 4xx é a faixa de erro da especificação.</> },
  ],
  done: {
    title: "Bug concluído.",
    body: "O mesmo padrão de pacote OGraf — manifesto, CSS, Web Component. Visual diferente, mesma interoperabilidade.",
    next: "Próximo: ticker de notícias",
  },
};
