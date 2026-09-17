import type { CountdownCopy } from "./en";
import { CODE, CODE_AMBER, STRONG } from "../styles";

export const pt: CountdownCopy = {
  title: "Crie uma contagem regressiva.",
  intro: (
    <>
      Contagens regressivas estão por toda parte na TV — antes do programa começar, para cronometrar blocos, em leilões e em eventos. Este grafismo é especial porque <strong className={STRONG}>conta o tempo sozinho</strong> usando <code className={CODE}>setInterval</code> — depois que começa, não precisa de nenhuma chamada de update externa.
    </>
  ),
  demoTitle: "Contagem regressiva — template OGraf",
  fields: { label: "Rótulo", seconds: "Segundos" },
  differentTitle: "O que muda em relação a outros grafismos?",
  cards: [
    {
      title: "Conta sozinho",
      body: (
        <>
          Usa <code className={CODE}>setInterval</code> internamente. Depois de entrar, faz a contagem regressiva por conta própria. O renderizador não precisa fazer nenhuma chamada de <code className={CODE}>updateAction</code>.
        </>
      ),
    },
    {
      title: "Estado de urgência",
      body: <>Quando faltam 10 segundos ou menos, os dígitos ficam vermelhos e pulsam, sinalizando urgência ao espectador sem nenhuma intervenção do operador.</>,
    },
    {
      title: "Encerramento limpo",
      body: (
        <>
          O intervalo <strong>precisa</strong> ser limpo tanto em <code className={CODE}>stopAction()</code> quanto em <code className={CODE}>dispose()</code>. Esquecer qualquer um deles deixa um timer fantasma rodando em segundo plano.
        </>
      ),
    },
  ],
  tickTitle: "O motor da contagem",
  tickBody: (
    <>
      <code className={CODE}>_startTicking</code> limpa qualquer intervalo anterior e inicia um novo, de 1 segundo. A cada tique, decrementa <code className={CODE}>_remaining</code>, redesenha o relógio e alterna a classe <code className={CODE}>urgent</code> aos 10 segundos. Ao chegar a zero, para sozinho e deixa 00:00 na tela. <code className={CODE}>_paintTime</code> só mexe no span de minutos ou de segundos cujo texto realmente mudou, e <code className={CODE}>_swap</code> reinicia a animação <code className={CODE}>tick</code> desse span com um reflow forçado.
    </>
  ),
  playTitle: "Começando depois da entrada",
  playBody: (
    <>
      <code className={CODE}>load</code> mostra o tempo inicial a partir do campo <code className={CODE}>seconds</code>; o relógio só começa a andar no play. <code className={CODE}>playAction</code> segue o modelo de passos da especificação (<code className={CODE}>goto</code>, senão o passo atual mais <code className={CODE}>delta</code>). Com <code className={CODE}>stepCount: 1</code>, um segundo play passa do último passo, então ele para o grafismo e retorna <code className={CODE}>currentStep: undefined</code>. O intervalo só começa depois da entrada de 800 ms, e só se <code className={CODE}>this._rev</code> não tiver avançado: um stop enviado durante a entrada não pode ser seguido de um relógio que começa a contar mesmo assim. <code className={CODE}>updateAction</code> aceita dados parciais; se o relógio estava rodando, ele recomeça a partir do novo valor.
    </>
  ),
  cleanupTitle: "Limpando tudo",
  cleanupBody: (
    <>
      <code className={CODE}>stopAction</code> limpa o intervalo antes da saída de 500 ms, e <code className={CODE}>dispose</code> limpa de novo e incrementa a revisão, para que nada pendente mexa no elemento já esvaziado.
    </>
  ),
  tipTitle: "Dica de design",
  tipBody: (
    <>
      Sempre limpe os intervalos em <code className={CODE_AMBER}>stopAction()</code> e <code className={CODE_AMBER}>dispose()</code>. Num ambiente de broadcast, grafismos são carregados e descarregados o tempo todo. Um intervalo esquecido é um timer rodando em segundo plano, consumindo CPU e podendo causar comportamentos inesperados quando o grafismo é recarregado.
    </>
  ),
  cssTitle: "O CSS: animação do tique e urgência",
  cssBody: (
    <>
      Cada par de dígitos que muda desliza para cima até o lugar em 0.36 s com a classe <code className={CODE}>tick</code>. Quando entra a urgência, o tempo fica vermelho e pulsa suavemente de tamanho uma vez por segundo.
    </>
  ),
  manifestTitle: "Contagem regressiva",
  doneTitle: "Contagem regressiva concluída.",
  doneBody: "Contagem própria com setInterval, um estado de urgência e limpeza correta em stopAction() e dispose(): um grafismo de timer autossuficiente.",
  codeLabels: {
    ticking: "contagem",
    keyParts: "trechos principais",
  },
  next: "Próximo: Plantão",
};
