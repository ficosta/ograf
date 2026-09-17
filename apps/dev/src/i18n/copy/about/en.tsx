import { Link } from "../../Link";
import { LINK } from "./styles";

export const en = {
  eyebrow: "About",
  title: "The community hub for open broadcast graphics.",
  intro: (
    <>
      <strong className="text-slate-900 font-medium">ograf.dev</strong> is the community-driven hub for the OGraf open broadcast graphics ecosystem. We are not the official specification site — that is{" "}
      <a href="https://ograf.ebu.io" className={LINK} target="_blank" rel="noopener noreferrer">
        ograf.ebu.io
      </a>
      . We are the place where developers, designers, broadcasters, and technical operators come to learn, build, test, and connect.
    </>
  ),
  tools: (
    <>
      Browser-based developer tools live at{" "}
      <Link to="/tools" className={LINK}>
        /tools
      </Link>
      : a package checker that also runs your graphic in a sandbox, and a schema explorer — all running in your browser with zero install.
    </>
  ),
  sitesTitle: "Two sites, two roles.",
  sites: [
    { name: "ograf.ebu.io", role: "The Standard", desc: "Normative specification, JSON schemas, governance, working group." },
    { name: "ograf.dev", role: "The Community & Workbench", desc: "Tutorials, ecosystem map, a plain-language spec guide, plus the Package Checker and other developer tools." },
  ],
  missionTitle: "Our mission.",
  mission: [
    "The broadcast graphics industry has long relied on proprietary solutions. Systems from Vizrt, Ross Video, and Chyron typically require significant licensing and hardware investment. OGraf, backed by the European Broadcasting Union, adds an open layer built on web technologies that everyone already knows.",
    "We believe this ecosystem needs a strong community layer to accelerate adoption. Better documentation. Better tooling. A central place to discover what exists. That is what we are building.",
  ],
  licenseTitle: "Source available.",
  license: (
    <>
      This project uses a layered licensing model: the OGraf templates and tutorials are MIT — use them in production however you want. The site code itself is PolyForm Internal Use 1.0.0, so companies can fork and run it internally but not resell it. Editorial text is CC BY 4.0 (attribute us). See{" "}
      <a href="https://github.com/ficosta/ograf/blob/main/LICENSING.md" target="_blank" rel="noopener noreferrer" className={LINK}>
        LICENSING.md
      </a>
      {" "}for the per-directory breakdown. Contributions in any area — documentation, templates, tools, translations, feedback — are welcome.
    </>
  ),
};

export type AboutCopy = typeof en;
