import type { WeatherCopy } from "./en";
import { CODE, CODE_AMBER, STRONG } from "../styles";

export const pt: WeatherCopy = {
  title: "Crie um cartão de previsão do tempo.",
  intro: (
    <>
      Grafismos de previsão do tempo são presença garantida na TV — de boletins locais a previsões nacionais. Este cartão mostra as condições atuais com a temperatura em destaque, além de uma linha com a previsão para os próximos dias. Ele mostra como lidar com <strong className={STRONG}>schemas de dados aninhados</strong> — campos escalares mais um array de objetos — num único grafismo.
    </>
  ),
  demoTitle: "Previsão do tempo — template OGraf",
  fields: { location: "Local", temp: "Temperatura", condition: "Condição", icon: "Ícone (emoji)", forecast: "Previsão" },
  differentTitle: "O que muda em relação a outros grafismos?",
  cards: [
    {
      title: "Schema de dados aninhado",
      body: <>Quatro campos escalares (location, temp, condition, icon) ficam ao lado de um array de objetos de previsão, cada um com day, temp e icon. As temperaturas são strings simples, então a unidade vai junto com o valor.</>,
    },
    {
      title: "Emoji como ícones",
      body: <>Os ícones são emojis Unicode digitados direto nos dados e escritos como texto. Nada de SVGs nem fontes de ícones — zero dependências, e o espectador os reconhece na hora.</>,
    },
    {
      title: "Layout em várias seções",
      body: <>Duas zonas visuais: as condições atuais (ícone grande + temperatura) e, abaixo, uma linha compacta de previsão, cujos dias aparecem com fade depois que o cartão desliza para o lugar.</>,
    },
  ],
  renderTitle: "Renderizando a linha de previsão",
  renderBody: (
    <>
      <code className={CODE}>_renderForecast</code> transforma o array de previsão em um <code className={CODE}>.weather-forecast-day</code> por item, mostrando o dia, o emoji e a temperatura. Todo valor passa por <code className={CODE}>escapeHtml</code>, e o <code className={CODE}>transition-delay</code> de cada dia é 500 ms + 60 ms por dia, criando uma revelação da esquerda para a direita. <code className={CODE}>load</code> e <code className={CODE}>updateAction</code> compartilham <code className={CODE}>_applyData</code>: os campos escalares são aplicados quando não são <code className={CODE}>undefined</code> (então uma string vazia limpa o campo), e um array de previsão renderiza a linha de novo.
    </>
  ),
  playTitle: "Colocando no ar",
  playBody: (
    <>
      <code className={CODE}>resolveTargetStep</code> segue o modelo de passos do OGraf: <code className={CODE}>goto</code>, se informado; senão, o passo atual (-1 antes do primeiro play) mais <code className={CODE}>delta</code>, 1 por padrão. Com um passo só, o primeiro play coloca o cartão no ar no passo 0; um segundo play passa do fim, então o grafismo para e retorna <code className={CODE}>currentStep: undefined</code>. <code className={CODE}>playAction</code> adiciona <code className={CODE}>visible</code> e resolve depois de 1000 ms; <code className={CODE}>stopAction</code> adiciona <code className={CODE}>out</code>, espera 500 ms e só limpa as classes se nenhuma ação mais nova tiver incrementado <code className={CODE}>this._rev</code> — então play → stop → play enviados sem esperar terminam no ar.
    </>
  ),
  cssTitle: "O CSS — cartão que desliza para dentro",
  cssBody: (
    <>
      O wrapper <code className={CODE}>.weather</code> começa fora da tela, à esquerda, transparente e desfocado. Adicionar <code className={CODE}>visible</code> faz ele deslizar para dentro em 0.7 s enquanto ganha nitidez; <code className={CODE}>out</code> o leva de volta em 0.5 s. Os dias da previsão sobem 8px e aparecem com fade quando o wrapper fica visível, cada um com seu próprio atraso. O reset tem escopo em <code className={CODE}>:where(.weather-root, …)</code>, então nunca altera o estilo da página do renderizador.
    </>
  ),
  tipTitle: "Dica de design",
  tipBody: (
    <>
      Se as temperaturas forem atualizadas com o cartão no ar, considere adicionar <code className={CODE_AMBER}>font-variant-numeric: tabular-nums</code> a <code className={CODE_AMBER}>.weather-temp</code> (o template não define isso). Dígitos tabulares têm todos a mesma largura, então uma mudança de "8°C" para "9°C" não empurra o layout.
    </>
  ),
  manifestTitle: "Previsão do tempo",
  manifestIntro: "O campo forecast mistura propriedades escalares com um array tipado — é assim que o OGraf lida com dados de várias seções num único schema.",
  doneTitle: "Cartão de previsão do tempo concluído.",
  doneBody: "Dados aninhados, ícones em emoji, um cartão que desliza para dentro e uma revelação escalonada da previsão — pronto para qualquer boletim do tempo.",
  codeLabels: {
    rendering: "renderização",
    stepModel: "modelo de passos",
    keyParts: "trechos principais",
  },
  next: "Próximo: Card de rede social",
};
