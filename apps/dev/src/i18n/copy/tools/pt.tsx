import type { ToolsCopy } from "./en";
import { LINK } from "./styles";

export const pt: ToolsCopy = {
  eyebrow: "Ferramentas",
  title: "Crie, verifique e publique pacotes OGraf.",
  intro:
    "Um conjunto crescente de ferramentas no navegador para quem cria grafismos OGraf. Tudo roda no seu navegador — sem cadastro, sem upload.",
  comingSoon: "Em breve",
  tools: {
    check: {
      name: "Verificador de pacotes",
      tagline: "Valide um .zip antes de publicar.",
      description: (rules: number) =>
        `Solte qualquer pacote OGraf e receba um relatório estruturado com ${rules} regras sobre manifesto, schema de dados (GDD), estrutura, módulo, estilos, recursos e execução. Valida contra o schema oficial da EBU — ao vivo, com uma cópia offline fixada como alternativa. Roda inteiramente no seu navegador — sem upload.`,
      badge: "Novo",
      open: "Abrir o verificador de pacotes",
    },
    schema: {
      name: "Explorador de schema",
      tagline: "Navegue pelo schema de manifesto OGraf em linguagem simples.",
      description: () =>
        "Todos os campos de nível superior de um manifesto .ograf.json, agrupados em cinco blocos pensados para designers, além de um catálogo visual de cada tipo de entrada do operador. Obtido ao vivo do schema da EBU, com uma cópia local como alternativa.",
      badge: undefined,
      open: "Abrir o explorador de schema",
    },
    generator: {
      name: "Gerador de templates",
      tagline: "Crie a base de um novo pacote OGraf a partir de um modelo.",
      description: () =>
        "Escolha uma base (lower third, bug, ticker, …), ajuste alguns campos e baixe um pacote pronto para editar, com manifesto, módulo, folha de estilos e fontes locais já conectados corretamente.",
      badge: undefined,
      open: "Abrir o gerador de templates",
    },
  },
  idea: (
    <>
      Tem uma ideia de ferramenta? Abra uma issue no{" "}
      <a href="https://github.com/ficosta/ograf/issues" target="_blank" rel="noopener noreferrer" className={LINK}>
        GitHub
      </a>
      .
    </>
  ),
};
