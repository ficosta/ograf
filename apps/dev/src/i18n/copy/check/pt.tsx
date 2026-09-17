import { Link } from "../../Link";
import type { CheckCopy } from "./en";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const pt: CheckCopy = {
  findingsNote: "Os resultados da verificação (títulos e mensagens das regras) são exibidos em inglês.",
  categories: {
    manifest: "Manifesto",
    gdd: "Schema de dados (GDD)",
    structure: "Estrutura do pacote",
    module: "Módulo do grafismo",
    styling: "Estilos",
    assets: "Assets",
    runtime: "Execução",
  },
  rules: (n) => plural(n, "regra", "regras"),

  page: {
    failedPackage: "Não foi possível verificar o pacote.",
    failedFolder: "Não foi possível verificar a pasta.",
    consentTitle: "Rodar o grafismo numa sandbox?",
    consentConfirm: "Rodar",
    consentCancel: "Agora não",
    consentBody: [
      "Isso executa o JavaScript que está dentro do .zip que você soltou, num iframe isolado (sandbox) nesta página. Só faça isso com um pacote em que você confia.",
      "Nada é enviado — o código roda no seu navegador e os resultados ficam nele. Vamos lembrar dessa escolha neste dispositivo.",
    ],
    allTools: "Todas as ferramentas",
    eyebrow: "Ferramenta",
    title: "Verificador de pacotes OGraf.",
    intro: (
      <>
        Solte qualquer <code className="font-mono text-base">.zip</code> OGraf e receba um relatório estruturado. As regras estáticas rodam na hora; sob demanda, uma sandbox de execução monta o grafismo e exercita o ciclo de vida dele. Tudo fica no seu navegador.
      </>
    ),
    runTitle: "Rodar na sandbox",
    runDesc:
      "Monta o grafismo num iframe isolado e exercita load / play / update / stop / customAction / dispose — além de goToTime e setActionsSchedule quando o manifesto declara suporte a não tempo real. Acrescenta resultados de execução ao relatório.",
    checkedTitle: "O que é verificado",
    allRules: (n) => `Todas as ${n} regras por id →`,
    checked: {
      manifest: {
        label: "Manifesto",
        desc: "Validado contra o schema da EBU publicado online (draft-2020-12), formato de customActions, ponteiro `main`, atualidade do $schema, semver — além de verificações entre campos que um schema campo a campo não consegue fazer: durações que citam uma customAction não declarada, requisitos de renderização impossíveis de atender, miniaturas ausentes.",
      },
      gdd: {
        label: "Schema de dados (GDD)",
        desc: "Tipos de campo e restrições de gddType, gddOptions obrigatórias, os padrões que a especificação fixa para cores, rótulos cobrindo todas as opções de um select, e valores padrão compatíveis com o tipo, enum, limites e padrão do próprio campo.",
      },
      structure: {
        label: "Estrutura do pacote",
        desc: "Uma única pasta de nível superior, README / LICENSE / preview presentes, assets referenciados incluídos, nada de lixo do sistema operacional, avisos de arquivos grandes.",
      },
      module: {
        label: "Módulo do grafismo",
        desc: "Classe HTMLElement como export default, seis métodos de ciclo de vida, o par de não tempo real quando o manifesto o declara, sem `customElements.define` feito pelo próprio módulo, sem `document` no nível superior, URLs relativas seguras para Shadow DOM.",
      },
      styling: {
        label: "Estilos",
        desc: "Detecção de `position: fixed`, `@import` / `@font-face` remotos, alerta para seletor `body`, fallback de font-family, dicas de portabilidade para Shadow DOM.",
      },
      assets: {
        label: "Assets",
        desc: "Imagem de preview em 16:9 (decodificada a partir dos bytes), fontes incluídas com licença, imagens grandes demais, extensões desconhecidas.",
      },
      runtime: {
        label: "Execução (opcional)",
        desc: "Monta o grafismo num iframe isolado, percorre todo o ciclo de vida OGraf, incluindo goToTime e setActionsSchedule quando declarados, e registra tempos, valores de retorno, console e erros não tratados.",
      },
    },
    noUpload: "Nada é enviado — tudo roda no seu navegador.",
    optIn: "A sandbox de execução roda o código do pacote; é preciso clicar para autorizar.",
  },

  rulesPage: {
    back: "Verificador de pacotes",
    eyebrow: "Referência",
    title: "Regras do verificador.",
    intro: (total, categories) =>
      `Todas as ${total} regras, em ${categories} categorias. Os relatórios citam esses ids, então é aqui que você consulta cada um. A lista é gerada a partir do próprio código do verificador a cada build — não tem como ficar desatualizada em relação ao que de fato roda.`,
    prefix: {
      manifest: "M — o próprio .ograf.json, validado contra o schema da EBU e depois entre os seus campos.",
      gdd: "G — o schema de dados a partir do qual os controladores montam os formulários do operador.",
      structure: "S — o que o pacote contém e como ele está organizado.",
      module: "C — o código do módulo do grafismo: exports, ciclo de vida, portabilidade.",
      styling: "X — regras de CSS que decidem se um grafismo sobrevive a outro renderizador.",
      assets: "A — imagens, fontes e as licenças que precisam acompanhá-las.",
      runtime: "R — verificações feitas enquanto o grafismo realmente roda na sandbox.",
    },
    footer: (
      <>
        Uma regra sem descrição gera mais de um tipo de resultado, e a mensagem diz qual.
        Passe um pacote pelo{" "}
        <Link to="/check" className="text-blue-600 hover:underline">
          verificador
        </Link>{" "}
        para vê-las em contexto.
      </>
    ),
  },

  summary: {
    meta: (kb, ms) => `${kb} KB · verificado em ${ms} ms`,
    shareHint:
      "Copia um link que carrega o relatório inteiro. Nada é enviado — o relatório viaja dentro do fragmento da URL.",
    copied: "Link copiado",
    tooLarge: "Grande demais para um link",
    copyLink: "Copiar link",
    download: "Relatório.md",
    tryAnother: "Verificar outro",
    errors: "Erros",
    warnings: "Avisos",
    info: "Info",
    passed: "Aprovados",
  },

  results: {
    checks: (n) => plural(n, "verificação", "verificações"),
  },

  finding: {
    spec: "especificação",
  },

  schema: {
    live: "Validado contra o schema da EBU publicado online",
    bundled: "Validado contra a cópia do schema incluída no site",
    bundledNote: () => "Schema online inacessível; foi usada a cópia incluída.",
    fetched: (time) => `· obtido em ${time}`,
    dateLocale: "pt-BR",
  },

  dropZone: {
    busyTitle: "Verificando...",
    idleTitle: "Solte aqui o seu .zip OGraf",
    busyHint: "Leva só um instante.",
    idleHint: "ou clique em qualquer lugar desta caixa para escolher um arquivo",
    local: "fica no seu navegador · nada é enviado",
    folder: "ou verifique uma pasta descompactada",
  },

  runtime: {
    title: "Sandbox de execução",
    desc: "O grafismo roda num iframe isolado, com o pacote servido por um service worker dentro do navegador. Nada é enviado.",
    booting: "iniciando a sandbox...",
    running: "executando...",
    iframeTitle: "Sandbox de execução OGraf",
    preparing: "Preparando a sandbox...",
    failedTitle: "A sandbox não iniciou",
    noMain: "Este pacote não declara um módulo `main` no manifesto.",
    initFailed: "a sandbox não conseguiu inicializar",
    timeline: "Linha do tempo do ciclo de vida",
    controls: {
      load: "carregar",
      play: "reproduzir",
      update: "atualizar",
      stop: "parar",
      dispose: "descartar",
    },
  },

  timeline: {
    running: "Executando...",
    empty: "Nenhuma chamada de ciclo de vida ainda. O teste automático começa assim que a sandbox fica pronta, ou use os controles para chamar os métodos manualmente.",
  },

  console: {
    title: "Console da sandbox",
    empty: "Nenhuma saída de console ou erro capturado ainda.",
  },

  dataForm: {
    noSchema: "Este grafismo não declara um schema de dados, então não há nada para o operador preencher.",
    heading: "Dados — o que um operador digitaria",
    reset: "Restaurar padrões",
    asJson: (type) => `· ${type}, editado como JSON`,
  },
};
