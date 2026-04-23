import { Link } from "react-router";
import { useMeta } from "../hooks/useMeta";

export function About() {
  useMeta({
    title: "About",
    description: "About ograf.dev — a community-driven portal for the OGraf open broadcast graphics standard.",
  });
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-4xl lg:px-10">
        <div className="flex flex-col gap-6 mb-16">
          <div className="text-sm/7 font-semibold text-mist-400">About</div>
          <h1 className="font-display text-5xl/12 tracking-tight text-white sm:text-[4rem]/18">
            The community hub for open broadcast graphics.
          </h1>
        </div>

        <div className="space-y-8 text-base/7 text-mist-400">
          <p>
            <strong className="text-white font-medium">ograf.dev</strong> is the community-driven hub for the OGraf open broadcast graphics ecosystem. We are not the official specification site — that is{" "}
            <a href="https://ograf.ebu.io" className="text-white font-medium underline underline-offset-4 decoration-mist-600 hover:decoration-white" target="_blank" rel="noopener noreferrer">
              ograf.ebu.io
            </a>
            . We are the place where developers, designers, broadcasters, and technical operators come to learn, build, test, and connect.
          </p>

          <p>
            Browser-based developer tools live at{" "}
            <Link to="/tools" className="text-white font-medium underline underline-offset-4 decoration-mist-600 hover:decoration-white">
              /tools
            </Link>
            : a package checker today, a runtime harness and schema explorer next — all running in your browser with zero install.
          </p>

          <div className="flex flex-col gap-4 py-8">
            <h2 className="font-display text-[2rem]/10 tracking-tight text-white">Two sites, two roles.</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-4">
              {[
                { name: "ograf.ebu.io", role: "The Standard", desc: "Normative specification, JSON schemas, governance, working group." },
                { name: "ograf.dev", role: "The Community & Workbench", desc: "Tutorials, ecosystem map, migration guides, plus the Package Checker and other developer tools." },
              ].map((site) => (
                <div key={site.name} className="rounded-md bg-white/5 p-5">
                  <p className="font-mono text-sm font-semibold text-white">{site.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-mist-500">{site.role}</p>
                  <p className="mt-3 text-sm/7 text-mist-400">{site.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 py-8">
            <h2 className="font-display text-[2rem]/10 tracking-tight text-white">Our mission.</h2>
            <p>
              The broadcast graphics industry has long relied on proprietary solutions. Systems from Vizrt, Ross Video, and Chyron typically require significant licensing and hardware investment. OGraf, backed by the European Broadcasting Union, adds an open layer built on web technologies that everyone already knows.
            </p>
            <p>
              We believe this ecosystem needs a strong community layer to accelerate adoption. Better documentation. Better tooling. A central place to discover what exists. That is what we are building.
            </p>
          </div>

          <div className="flex flex-col gap-4 py-8">
            <h2 className="font-display text-[2rem]/10 tracking-tight text-white">Source available.</h2>
            <p>
              This project uses a layered licensing model: the OGraf templates and tutorials are MIT — use them in production however you want. The site code itself is PolyForm Internal Use 1.0.0, so companies can fork and run it internally but not resell it. Editorial text is CC BY 4.0 (attribute us). See{" "}
              <a href="https://github.com/ficosta/ograf/blob/main/LICENSING.md" target="_blank" rel="noopener noreferrer" className="text-white font-medium underline underline-offset-4 decoration-mist-600 hover:decoration-white">
                LICENSING.md
              </a>
              {" "}for the per-directory breakdown. Contributions in any area — documentation, templates, tools, translations, feedback — are welcome.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
