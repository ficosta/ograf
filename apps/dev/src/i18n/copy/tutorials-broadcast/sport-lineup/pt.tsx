import type { SportLineupCopy } from "./en";
import { CODE, CODE_AMBER } from "../styles";

export const pt: SportLineupCopy = {
  title: "Crie um cartão de escalação.",
  intro: "O grafismo de escalação antes do jogo é presença garantida nas transmissões esportivas — da Premier League à Copa do Mundo. Uma grade de cartões de jogadores aparece um a um, mostrando número, nome e posição, com o esquema tático e o técnico no rodapé.",
  demoTitle: "Escalação — template OGraf",
  fields: { team: "Time", meta: "Informações da partida", formation: "Esquema tático", coach: "Técnico", players: "Jogadores" },
  differentTitle: "O que muda em relação a outros grafismos?",
  cards: [
    {
      title: "Layout em grade",
      body: (
        <>
          Usa CSS Grid com colunas <code className={CODE}>auto-fill</code> de pelo menos 120px de largura. Os cartões se reorganizam naturalmente, seja com 11 titulares ou com 5 reservas.
        </>
      ),
    },
    {
      title: "Cartões escalonados",
      body: (
        <>
          Cada cartão de jogador recebe um <code className={CODE}>transition-delay</code> inline de 300 ms + 60 ms por cartão, criando uma onda de cartões que aparecem pela grade.
        </>
      ),
    },
    {
      title: "Estrutura em três partes",
      body: <>Cabeçalho com gradiente escuro, nome do time e informações da partida; depois a grade de jogadores; e um rodapé com esquema tático e técnico — três zonas visuais bem distintas.</>,
    },
  ],
  renderTitle: "Renderizando os jogadores",
  renderBody: (
    <>
      <code className={CODE}>_renderPlayers</code> monta um <code className={CODE}>.lineup-card</code> para cada jogador: o número num círculo escuro, o nome e a posição logo abaixo. Todo valor passa por <code className={CODE}>escapeHtml</code> antes de entrar no markup, e o <code className={CODE}>transition-delay</code> de cada cartão é calculado a partir do seu índice. <code className={CODE}>load</code> e <code className={CODE}>updateAction</code> chamam <code className={CODE}>_applyData</code>, que só mexe nos campos que não são <code className={CODE}>undefined</code> — assim, um update parcial muda apenas o que envia, uma string vazia apaga o campo (no esquema tático e no técnico, o rótulo "Formation:" / "Coach:" some junto) e um array <code className={CODE}>players</code> renderiza a grade de novo.
    </>
  ),
  playTitle: "Colocando no ar",
  playBody: (
    <>
      <code className={CODE}>resolveTargetStep</code> implementa o modelo de passos do OGraf: <code className={CODE}>goto</code>, se informado; senão, o passo atual (-1 antes do primeiro play) mais <code className={CODE}>delta</code>, 1 por padrão. Com um passo só, o primeiro play cai no passo 0 e um segundo play passa do fim, então o grafismo para e retorna <code className={CODE}>currentStep: undefined</code>. No passo 0, <code className={CODE}>playAction</code> adiciona <code className={CODE}>visible</code> e espera até o último cartão terminar: 300 ms + 60 ms por cartão + 500 ms da transição do próprio cartão. <code className={CODE}>stopAction</code> faz fade out em 400 ms e só limpa as classes se nenhuma ação mais nova (um <code className={CODE}>this._rev</code> maior) tiver começado nesse meio-tempo.
    </>
  ),
  cssTitle: "O CSS — grade e revelação dos cartões",
  cssBody: (
    <>
      A grade de jogadores usa <code className={CODE}>grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))</code> para se adaptar à largura do contêiner; um gap de 2px sobre um fundo cinza-claro desenha as divisórias entre os cartões. Cada cartão aparece com fade e sobe 12px quando o elemento pai recebe a classe <code className={CODE}>visible</code>. O reset tem escopo em <code className={CODE}>:where(.sport-lineup-root, …)</code>, então nunca altera o estilo da página do renderizador.
    </>
  ),
  tipTitle: "Dica de design",
  tipBody: (
    <>
      Use <code className={CODE_AMBER}>auto-fill</code> em vez de um número fixo de colunas. Assim a grade lida bem com 11 titulares, 5 reservas ou qualquer outro tamanho de elenco, sem mudar o layout no código do template.
    </>
  ),
  manifestTitle: "Escalação esportiva",
  manifestIntro: "O campo players é um array tipado — items.type é object, com number, name e position obrigatórios. Um controlador pode adicionar, remover e reordenar as linhas automaticamente.",
  doneTitle: "Escalação concluída.",
  doneBody: "CSS Grid, cartões revelados de forma escalonada e uma estrutura limpa de cabeçalho e rodapé — pronto para as transmissões em dia de jogo.",
  codeLabels: {
    rendering: "renderização",
    stepModel: "modelo de passos",
    keyParts: "trechos principais",
  },
  next: "Próximo: Placar",
};
