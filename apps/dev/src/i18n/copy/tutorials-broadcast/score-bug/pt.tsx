import type { ScoreBugCopy } from "./en";
import { CODE, CODE_AMBER, CODE_BLUE, STRONG } from "../styles";

export const pt: ScoreBugCopy = {
  title: "Crie um placar ao vivo.",
  intro: (
    <>
      O placar é o grafismo fixo no canto de toda transmissão esportiva ao vivo — mostra os times, o placar, o tempo e o período. Este tutorial cobre o ciclo de vida completo, incluindo as <strong className={STRONG}>customActions</strong>, o mecanismo do OGraf para disparar eventos visuais pontuais, como o destaque de um gol, sem mudar o passo do grafismo.
    </>
  ),
  demoTitle: "Placar — template OGraf",
  fields: {
    home: "Time da casa",
    away: "Time visitante",
    homeScore: "Gols da casa",
    awayScore: "Gols do visitante",
    time: "Tempo de jogo",
    period: "Período",
  },
  differentTitle: "O que muda em relação a outros grafismos?",
  cards: [
    {
      title: "customActions",
      body: (
        <>
          O manifesto declara uma ação customizada, <code className={CODE}>goal</code>. O renderizador a dispara via <code className={CODE}>customAction</code> para fazer o placar piscar sem mudar seus dados nem seu passo.
        </>
      ),
    },
    {
      title: "Posição fixa",
      body: (
        <>
          Diferente das lower thirds (tarjas), que entram e saem, o placar fica na tela durante toda a partida. Ele entra uma vez e depois recebe chamadas parciais de <code className={CODE}>updateAction</code> para o placar, o relógio e o período.
        </>
      ),
    },
    {
      title: "Visual escuro e compacto",
      body: <>Um cartão pequeno no canto superior esquerdo, com fundo escuro quase opaco e uma barra de destaque azul. Continua legível sobre qualquer vídeo: gramado claro, planos da torcida, replays.</>,
    },
  ],
  customTitle: "A customAction: destaque do gol",
  customBody: (
    <>
      Quando sai um gol, o renderizador chama <code className={CODE}>{"customAction({ id, payload, skipAnimation })"}</code> com <code className={CODE}>id: "goal"</code>, um dos ids declarados em <code className={CODE}>customActions</code> no manifesto. O grafismo adiciona a classe <code className={CODE}>goal</code> por 800 ms e depois a remove. Nada mais muda: o placar em si chega separadamente via <code className={CODE}>updateAction</code>. Um id que o grafismo não conhece recebe um 404, e é assim que o renderizador descobre que a ação não é suportada.
    </>
  ),
  insightTitle: "Ponto-chave: customAction vs updateAction",
  insightBody: (
    <>
      <code className={CODE_BLUE}>updateAction</code> altera os dados persistentes do grafismo (placar, tempo, nomes dos times). <code className={CODE_BLUE}>customAction</code> dispara um evento visual passageiro: toca uma animação e depois o grafismo volta ao estado visual anterior. Com <code className={CODE_BLUE}>skipAnimation</code>, como o destaque é pura animação, não sobra nada a fazer e a ação simplesmente retorna.
    </>
  ),
  playTitle: "Entrando, e dando play de novo",
  playBody: (
    <>
      O manifesto diz <code className={CODE}>stepCount: 1</code>. <code className={CODE}>resolveTargetStep</code> aplica a regra da especificação: <code className={CODE}>goto</code>, se informado; senão, o passo atual (-1 antes do primeiro play) mais <code className={CODE}>delta</code>, que por padrão é 1. O primeiro play cai no passo 0 e roda a entrada de 600 ms. Um segundo play mira o passo 1, que fica além do último passo, então o grafismo vai para o fim: roda <code className={CODE}>stopAction</code> e retorna <code className={CODE}>currentStep: undefined</code>.
    </>
  ),
  playRev: (
    <>
      Cada ação pega o próximo <code className={CODE}>this._rev</code>. <code className={CODE}>stopAction</code> só remove a classe <code className={CODE}>visible</code> se nenhuma ação mais nova tiver começado durante a saída de 400 ms, então play → stop → play enviados sem esperar terminam no ar.
    </>
  ),
  cssTitle: "O CSS: efeito de destaque do gol",
  cssBody: "O destaque é uma única animação de keyframes no cartão interno. Ela mantém a sombra normal do cartão e faz crescer um brilho azul ao redor, que atinge o pico na metade e depois some. A duração de 0.8 s bate com os 800 ms que o grafismo espera antes de remover a classe.",
  leaderTitle: "Destacando quem está na frente",
  leaderBody: (
    <>
      Depois de cada load e update, o time com mais gols recebe a classe <code className={CODE}>active</code>; no empate, nenhum recebe. Os updates podem ser parciais, então um update só do relógio não traz placar: nesse caso o grafismo usa o placar que já está na tela em vez de tirar o destaque.
    </>
  ),
  tipTitle: "Dica de design",
  tipBody: (
    <>
      O placar de quem está na frente fica azul-claro e o nome fica branco puro. É um detalhe pequeno, comum em transmissões esportivas premium, que mostra ao espectador quem está ganhando num relance, sem acrescentar nada ao layout. Quando o placar muda, <code className={CODE_AMBER}>updateAction</code> também dá ao número um pulo de 350 ms com a classe <code className={CODE_AMBER}>updating</code>.
    </>
  ),
  manifestTitle: "Placar",
  manifestIntro: "Repare no array customActions: é assim que o OGraf declara operações específicas do grafismo além de play, update e stop. O renderizador só envia ids listados ali, e o grafismo responde a qualquer outro com um 4xx (este usa 404).",
  doneTitle: "Placar concluído.",
  doneBody: "Posição fixa, atualizações ao vivo via updateAction e destaques passageiros de gol via customAction — o kit completo para esporte ao vivo.",
  codeLabels: {
    stepModel: "modelo de passos",
    goalFlash: "destaque do gol",
    activeTeam: "time na frente",
  },
  next: "Próximo: Contagem regressiva",
};
