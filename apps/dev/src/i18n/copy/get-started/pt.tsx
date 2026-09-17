import { CODE_AMBER, CODE_BLUE, CODE_ID, CODE_SLATE_LIGHT, STRONG } from "../tutorial-ui/styles";
import type { GetStartedCopy } from "./en";

export const pt: GetStartedCopy = {
  title: "Crie seu primeiro template OGraf.",
  lead: "Neste tutorial você vai criar do zero um lower third (tarja) com qualidade de produção — do mesmo tipo que você vê na CBS, na BBC ou em qualquer telejornal. Ele entra deslizando, mostra um nome e um cargo, é atualizado ao vivo e sai deslizando.",
  demo: {
    name: "Nome",
    title: "Cargo",
    heading: "Lower third — template OGraf",
  },
  prereqTitle: "Antes de começar",
  prereqs: [
    "Conhecimento básico de HTML e CSS (JavaScript ajuda, mas não é obrigatório para acompanhar)",
    "Um editor de texto — VS Code, Sublime Text ou o que você preferir",
    "Um navegador (Chrome, Firefox, Edge, Safari)",
  ],
  step1: {
    title: "Crie a pasta do projeto",
    body: "Crie uma pasta nova com estes quatro arquivos. Esse é o seu pacote OGraf inteiro — sem ferramentas de build, sem npm, sem framework.",
    notes: { manifest: "manifesto", logic: "lógica", design: "visual", preview: "prévia (opcional)" },
    callout: (
      <>
        <strong className="text-blue-900">Só isso.</strong> Quatro arquivos. Sem <code className={CODE_BLUE}>node_modules</code>, sem <code className={CODE_BLUE}>package.json</code>, sem etapa de build. Pacotes OGraf são arquivos web comuns.
      </>
    ),
  },
  step2: {
    title: "Escreva o manifesto — a carteira de identidade do seu grafismo",
    body: (
      <>
        O manifesto diz a qualquer sistema OGraf quem é o seu grafismo e do que ele precisa. Quando um operador carrega o grafismo no SPX ou em qualquer controlador, <strong className={STRONG}>este arquivo é a primeira coisa que ele lê</strong>. É dele que sai, automaticamente, o formulário de dados que você viu na demo acima.
      </>
    ),
    cards: [
      { label: "Identidade", body: <><code className={CODE_ID}>id</code> e <code className={CODE_ID}>name</code> — como os controladores identificam e exibem o seu grafismo.</> },
      { label: "Comportamento", body: <><code className={CODE_ID}>stepCount: 1</code> — um passo: ele aparece, fica na tela e some quando é parado.</> },
      { label: "Ponto de entrada", body: <><code className={CODE_ID}>main</code> — aponta para o arquivo JavaScript com a classe do Web Component.</> },
      { label: "Schema de dados", body: <><code className={CODE_ID}>schema</code> — define os campos do formulário. Os controladores geram a interface de entrada automaticamente a partir dele.</> },
    ],
  },
  step3: {
    title: "Monte a pasta do pacote",
    body: (
      <>
        Um pacote OGraf é uma pasta pequena com um manifesto, um módulo JavaScript, uma folha de estilo e os assets estáticos de que o grafismo precisar. Não existe ponto de entrada HTML — o renderizador monta a classe exportada por padrão sob uma tag própria, então o módulo só precisa exportar uma classe que estende <code className={CODE_SLATE_LIGHT}>HTMLElement</code>.
      </>
    ),
    language: "Texto",
    note: (
      <>
        A pasta <code className={CODE_SLATE_LIGHT}>fonts/</code> traz os pesos da Inter que este grafismo usa, junto com a licença (SIL OFL) — máquinas de playout muitas vezes ficam offline, então embutir as fontes evita chamadas a CDN que falhariam sem aviso.
      </>
    ),
  },
  step4: {
    title: "Desenhe o visual — CSS",
    body: (
      <>
        É aqui que mora o design visual. Vamos criar um visual limpo inspirado na CBS: fundo branco, barra de destaque azul à esquerda, cargo em azul e caixa alta. A entrada usa transições CSS com <strong className={STRONG}>easing cubic-bezier</strong> para dar aquela sensação de qualidade de broadcast.
      </>
    ),
    tipTitle: "Dica de design",
    tip: (
      <>
        O easing <code className={CODE_AMBER}>cubic-bezier(0.16, 1, 0.3, 1)</code> é o segredo — começa rápido e desacelera suavemente, dando aquele movimento ágil típico de broadcast. A animação de saída usa <code className={CODE_AMBER}>cubic-bezier(0.76, 0, 0.24, 1)</code> para uma saída rápida e marcante.
      </>
    ),
  },
  step5: {
    title: "Escreva a lógica — o Web Component",
    body: (
      <>
        Este é o coração do seu grafismo OGraf. É um Web Component padrão que o renderizador controla chamando seis métodos — cinco passos lineares do ciclo de vida, mais <code className={CODE_SLATE_LIGHT}>customAction</code> para extras específicos do grafismo. Cada um retorna uma Promise: <strong className={STRONG}>o renderizador espera a sua animação terminar antes de fazer qualquer outra coisa.</strong>
      </>
    ),
    lifecycle: {
      load: "Recebe os dados",
      play: "Anima a entrada",
      update: "Troca os dados",
      stop: "Anima a saída",
      dispose: "Faz a limpeza",
    },
    howTitle: "Como funciona",
    how: [
      <><strong>_initDom()</strong> — Um helper privado e idempotente. O primeiro método público a rodar o chama para definir o <code className={CODE_BLUE}>innerHTML</code> e pegar as referências dos elementos. Assim o grafismo funciona tanto se o renderizador inserir o elemento antes quanto depois de chamar <code className={CODE_BLUE}>load()</code>.</>,
      <><strong>load()</strong> — Recebe os dados do operador (nome + cargo) e os coloca no DOM. Ainda sem animação.</>,
      <><strong>playAction()</strong> — Calcula para qual passo ir a partir de <code className={CODE_BLUE}>goto</code> / <code className={CODE_BLUE}>delta</code>, exatamente como a especificação define. Um lower third tem um passo só, então o primeiro play cai no passo 0: adiciona a classe <code className={CODE_BLUE}>.visible</code>, espera 700ms pela entrada e informa <code className={CODE_BLUE}>currentStep: 0</code>. Um segundo play passa do último passo, então o grafismo sai do ar e informa <code className={CODE_BLUE}>currentStep: undefined</code> — é disso que depende o botão "próximo" de um controlador.</>,
      <><strong>updateAction()</strong> — Troca o conteúdo do texto. A verificação é <code className={CODE_BLUE}>!== undefined</code>, e não por valor truthy, para que um operador que esvazia um campo de fato o limpe. Em produção, você adicionaria uma animação suave de troca de texto.</>,
      <><strong>stopAction()</strong> — Adiciona a classe <code className={CODE_BLUE}>.out</code> para a animação de saída e espera 500ms. Toda ação incrementa <code className={CODE_BLUE}>_rev</code>, e o stop só esconde o grafismo se nada mais novo tiver começado — senão um operador que apertasse play de novo no meio da saída acabaria com a tela vazia.</>,
      <><strong>customAction()</strong> — O OGraf exige que todo grafismo exponha este método, mesmo sem nenhuma ação declarada no manifesto. Ele recebe <code className={CODE_BLUE}>{"{ id, payload, skipAnimation }"}</code>; sem nada declarado, responder a qualquer <code className={CODE_BLUE}>id</code> com um 4xx como <code className={CODE_BLUE}>statusCode: 404</code> é o comportamento padrão correto.</>,
      <><strong>dispose()</strong> — Limpa o DOM e redefine <code className={CODE_BLUE}>_initialized</code> para que um novo load reconstrua tudo do zero. É chamado quando o grafismo é removido do renderizador de vez.</>,
    ],
  },
  step6: {
    title: "Teste",
    body: "Seu grafismo está pronto. Veja como testar:",
    optionA: {
      title: "Opção A: use a demo ao vivo acima",
      desc: "Role para cima — a prévia interativa no topo desta página roda exatamente o mesmo código. Clique em Reproduzir, mude o texto, clique em Atualizar, clique em Parar.",
    },
    optionB: {
      title: "Opção B: verifique o seu pacote",
      desc: (rules: number) => `Compacte a pasta num .zip e solte em /check. Você recebe um relatório estruturado com ${rules} regras e o schema da EBU em vigor.`,
      link: "Abrir o verificador",
    },
    optionC: {
      title: "Opção C: carregue num renderizador OGraf",
      desc: "Publique num renderizador compatível: ograf-server (referência auto-hospedada), SPX-GC (controlador no navegador) ou CasparCG (pelo HTML producer). Os links estão no card de download abaixo.",
    },
  },
  downloadTitle: "Lower third no estilo CBS",
  done: {
    title: "Você criou um grafismo OGraf.",
    body: "Este pacote funciona em qualquer sistema compatível com OGraf — SPX, ograf-server, CasparCG (pelo HTML producer) e outros. Os mesmos arquivos, em qualquer lugar.",
    spec: "Leia a especificação completa",
    more: "Veja mais templates",
  },
};
