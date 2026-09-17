import type { BreakingNewsCopy } from "./en";
import { CODE, CODE_BLUE } from "../styles";

export const pt: BreakingNewsCopy = {
  title: "Crie um alerta de plantão.",
  intro: (
    <>
      O alerta de plantão é uma interrupção em tela cheia — uma sobreposição vermelha e chamativa que exige atenção. Diferente de outros grafismos, ele usa <code className={CODE}>stepCount: 0</code>, ou seja, é do tipo "dispara e esquece": um play o coloca no ar, ele se mantém e depois sai sozinho, sem que o operador precise tirá-lo.
    </>
  ),
  demoTitle: "Plantão — template OGraf",
  fields: { headline: "Manchete" },
  differentTitle: "O que muda em relação a outros grafismos?",
  cards: [
    {
      title: "Dispara e esquece",
      body: (
        <>
          <code className={CODE}>stepCount: 0</code> no manifesto. O grafismo entra, fica 3.5 s no ar e sai sozinho. Nenhum operador precisa tirá-lo, embora um stop ainda possa encerrá-lo antes.
        </>
      ),
    },
    {
      title: "Sobreposição em tela cheia",
      body: <>Preenche toda a área do grafismo com um fundo preto a 85% e desfocado. O selo vermelho "Breaking News" e a manchete ficam centralizados por cima.</>,
    },
    {
      title: "Revelação escalonada",
      body: (
        <>
          Uma única classe <code className={CODE}>visible</code> controla três elementos com atrasos de transição diferentes: o selo, depois a manchete, depois a linha de destaque.
        </>
      ),
    },
  ],
  dismissTitle: "O padrão de saída automática",
  timingBody: "O tempo fica em três constantes: 1.2 s para a entrada se completar, 3.5 s no ar, 0.6 s para a saída.",
  playBody: (
    <>
      <code className={CODE}>playAction</code> adiciona a classe <code className={CODE}>visible</code> e espera só a entrada. Em seguida inicia <code className={CODE}>_autoDismiss</code> sem aguardá-lo e retorna <code className={CODE}>currentStep: undefined</code>. A permanência e a saída continuam em segundo plano, e o renderizador fica livre para enviar a próxima ação assim que o alerta estiver na tela.
    </>
  ),
  insightTitle: "Ponto-chave: stepCount: 0",
  insightBody: (
    <>
      <code className={CODE_BLUE}>stepCount: 0</code> diz ao renderizador que o grafismo não tem passos próprios: ele entra e termina sozinho. O renderizador ainda chama <code className={CODE_BLUE}>playAction</code>, que precisa retornar <code className={CODE_BLUE}>currentStep: undefined</code>. A especificação diz que a promise deve resolver quando o grafismo estiver pronto para a próxima ação, então ela resolve depois da entrada (<code className={CODE_BLUE}>IN_MS</code>), e não depois de toda a permanência e a saída.
    </>
  ),
  stopTitle: "Tirando do ar antes da hora",
  stopBody: (
    <>
      "Dispara e esquece" não quer dizer impossível de parar. O renderizador ainda pode chamar <code className={CODE}>stopAction</code> para tirar o alerta antes do fim da permanência, e <code className={CODE}>updateAction</code> pode trocar a manchete enquanto ele está no ar. Cada ação pega o próximo <code className={CODE}>this._rev</code>. O <code className={CODE}>_autoDismiss</code> em segundo plano confere esse número depois da permanência e de novo depois da saída, então uma saída pendente de um play anterior nunca esconde um mais novo: play → stop → play enviados sem esperar terminam no ar. <code className={CODE}>customAction</code> precisa existir mesmo que o manifesto não declare nenhuma, e responde a qualquer id com 404.
    </>
  ),
  cssTitle: "O CSS: design de urgência",
  cssBody: (
    <>
      A sobreposição inteira aparece com fade em 0.4 s. Dentro dela, o selo cresce a partir do centro após 0.2 s, a manchete sobe para o lugar após 0.4 s e a linha de destaque é desenhada após 0.6 s: tudo disparado pela mesma classe <code className={CODE}>visible</code>, escalonado apenas por <code className={CODE}>transition-delay</code>. A linha de destaque é a última a terminar, em 1.2 s, e é daí que vem <code className={CODE}>IN_MS</code>. Na saída, as regras de <code className={CODE}>out</code> recolhem o selo e a linha e fazem tudo sumir em 0.6 s.
    </>
  ),
  tipTitle: "Dica de design",
  tipBody: "O ponto branco pulsante no selo vermelho transmite urgência sem distrair. É uma convenção sutil, mas eficaz, da TV: o espectador associa esse ponto piscando a conteúdo ao vivo e importante. A animação é lenta (um ciclo de 1.5 s) para não parecer frenética.",
  manifestTitle: "Plantão",
  manifestIntro: "Repare em stepCount: 0: é assim que o OGraf declara um grafismo que entra e termina sozinho. O renderizador ainda chama playAction, que retorna currentStep: undefined assim que a entrada se completa.",
  doneTitle: "Plantão concluído.",
  doneBody: "Dispara e esquece com stepCount: 0, uma revelação escalonada e uma saída automática em segundo plano que um stop ainda pode antecipar.",
  codeLabels: {
    timing: "tempos",
    staggeredReveal: "revelação escalonada",
    pulsingDot: "ponto pulsante",
  },
  next: "Próximo: Previsão do tempo",
};
