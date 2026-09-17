import { CODE_SLATE } from "../tutorial-ui/styles";
import type { TutorialSocialCardCopy } from "./en";

export const pt: TutorialSocialCardCopy = {
  title: "Crie um card de rede social.",
  lead: "Telejornais mostram posts de redes sociais na tela com frequência — um tweet de uma figura pública, uma nota oficial ou um post viral. Este card mostra o nome do usuário, o @ e o texto do post, com um avatar gerado automaticamente. Ele fica do lado direito da tela, deixando o apresentador visível à esquerda.",
  demo: {
    user: "Nome do usuário",
    handle: "Usuário (@)",
    text: "Texto do post",
    heading: "Card de rede social — template OGraf",
  },
  diffTitle: "O que muda em relação a outros grafismos?",
  diffs: [
    { title: "Posição à direita", body: <>Usa <code className={CODE_SLATE}>right: 48px; bottom: 80px</code> em vez de <code className={CODE_SLATE}>left</code>. Assim o apresentador continua visível no lado esquerdo do quadro — uma convenção comum em broadcast para conteúdo exibido.</> },
    { title: "Avatar gerado automaticamente", body: <>Nenhuma imagem necessária. O círculo do avatar mostra as iniciais do usuário, extraídas do nome com <code className={CODE_SLATE}>_getInitials()</code>. Nada para hospedar, nada para quebrar.</> },
    { title: "Entrada em dois tempos", body: <>O card entra deslizando pela direita, de fora da tela, com um leve blur em 0.7s, e o avatar surge 0.35s depois numa curva que passa do ponto e volta — tudo em CSS, disparado por uma única classe <code className={CODE_SLATE}>.visible</code>.</> },
  ],
  initialsTitle: "O método das iniciais",
  initialsBody: (
    <>
      Em vez de exigir a URL de uma foto de perfil (que pode quebrar, ter baixa resolução ou problemas de direitos), o card gera um avatar a partir do nome do usuário. <code className={CODE_SLATE}>_getInitials</code> divide o nome nos espaços, pega a primeira letra de cada palavra, coloca em maiúscula e fica com as duas primeiras: "Jane Smith" → "JS", "Dr. Martin King" → "DM", "Madonna" → "M", e um nome vazio → um avatar vazio. <code className={CODE_SLATE}>_applyData</code> é compartilhado por <code className={CODE_SLATE}>load()</code> e <code className={CODE_SLATE}>updateAction()</code>; ele aplica cada campo que for <code className={CODE_SLATE}>!== undefined</code>, então uma atualização parcial mexe só nos campos que você envia, e uma string vazia limpa um campo. Ele também aceita uma string opcional <code className={CODE_SLATE}>platform</code> para o selo escuro no cabeçalho. O schema do manifesto não a declara, então por padrão o selo fica vazio — e <code className={CODE_SLATE}>.social-platform:empty</code> o esconde em vez de deixar uma cápsula em branco.
    </>
  ),
  dataFile: "graphic.mjs (trechos principais)",
  playBody: (
    <>
      Play e stop seguem o modelo de passos do OGraf. O primeiro play coloca o card no ar no passo 0 e resolve depois de 700ms; um segundo play passa do único passo, executa o stop e retorna <code className={CODE_SLATE}>currentStep: undefined</code>. Toda ação incrementa <code className={CODE_SLATE}>this._rev</code>, e o stop só remove <code className={CODE_SLATE}>.visible</code> depois dos seus 500ms se nada mais novo tiver começado — então play → stop → play enviados sem esperar terminam com o card no ar.
    </>
  ),
  playFile: "graphic.mjs (play e stop)",
  cssTitle: "O CSS — card à direita com destaque azul",
  cssBody: (
    <>
      O card entra deslizando pela borda direita: <code className={CODE_SLATE}>.social</code> começa em <code className={CODE_SLATE}>translateX(120%)</code>, transparente e com blur, e <code className={CODE_SLATE}>.social.out</code> o manda de volta em 0.5s. Uma barra em degradê de 4px desenhada com <code className={CODE_SLATE}>::before</code> dá ao card branco o destaque azul à esquerda, e o avatar é um círculo azul sólido que cresce a partir de 40%. O reset é limitado com <code className={CODE_SLATE}>:where(.social-card-root, …)</code>, então nunca altera o estilo da página do renderizador.
    </>
  ),
  cssFile: "style.css (trechos principais)",
  tipTitle: "Dica de design",
  tip: (
    <>
      O círculo do avatar usa a primeira letra de cada palavra do nome do usuário — "Jane Smith" vira "JS". Isso dispensa totalmente imagens externas. O preenchimento sólido no azul da marca e a entrada atrasada fazem o círculo parecer proposital, e não um substituto para uma imagem que faltou.
    </>
  ),
  downloadTitle: "Card de rede social",
  done: {
    title: "Card de rede social concluído.",
    body: "Posição à direita, avatar com iniciais gerado automaticamente e um destaque azul limpo — pronto para exibir posts de redes sociais no ar.",
  },
};
