import { Link } from "../../Link";
import type { AboutCopy } from "./en";
import { LINK } from "./styles";

export const pt: AboutCopy = {
  eyebrow: "Sobre",
  title: "O ponto de encontro da comunidade de grafismo aberto para TV.",
  intro: (
    <>
      O <strong className="text-slate-900 font-medium">ograf.dev</strong> é o ponto de encontro da comunidade em torno do OGraf, o padrão aberto de grafismo para broadcast. Não somos o site oficial da especificação — esse é o{" "}
      <a href="https://ograf.ebu.io" className={LINK} target="_blank" rel="noopener noreferrer">
        ograf.ebu.io
      </a>
      . Somos o lugar onde desenvolvedores, designers, emissoras e operadores técnicos vêm aprender, construir, testar e trocar experiências.
    </>
  ),
  tools: (
    <>
      As ferramentas de desenvolvimento no navegador ficam em{" "}
      <Link to="/tools" className={LINK}>
        /tools
      </Link>
      : um verificador de pacotes que também roda o seu grafismo numa sandbox, e um explorador de schema — tudo no navegador, sem instalar nada.
    </>
  ),
  sitesTitle: "Dois sites, dois papéis.",
  sites: [
    { name: "ograf.ebu.io", role: "O padrão", desc: "Especificação normativa, JSON schemas, governança e grupo de trabalho." },
    { name: "ograf.dev", role: "A comunidade e a bancada", desc: "Tutoriais, mapa do ecossistema, um guia da especificação em linguagem simples, além do verificador de pacotes e outras ferramentas de desenvolvimento." },
  ],
  missionTitle: "Nossa missão.",
  mission: [
    "A indústria de grafismo para broadcast sempre dependeu de soluções proprietárias. Sistemas da Vizrt, da Ross Video e da Chyron costumam exigir investimentos altos em licenças e hardware. O OGraf, apoiado pela European Broadcasting Union, acrescenta uma camada aberta construída sobre tecnologias web que todo mundo já conhece.",
    "Acreditamos que esse ecossistema precisa de uma comunidade forte para acelerar a adoção. Documentação melhor. Ferramentas melhores. Um lugar central para descobrir o que já existe. É isso que estamos construindo.",
  ],
  licenseTitle: "Código disponível.",
  license: (
    <>
      O projeto usa um modelo de licenciamento em camadas: os templates e tutoriais OGraf são MIT — use em produção como quiser. O código do site é PolyForm Internal Use 1.0.0, então empresas podem fazer um fork e usá-lo internamente, mas não revendê-lo. Os textos editoriais são CC BY 4.0 (com atribuição). Veja o{" "}
      <a href="https://github.com/ficosta/ograf/blob/main/LICENSING.md" target="_blank" rel="noopener noreferrer" className={LINK}>
        LICENSING.md
      </a>
      {" "}para o detalhamento por diretório. Contribuições em qualquer área — documentação, templates, ferramentas, traduções, feedback — são bem-vindas.
    </>
  ),
};
