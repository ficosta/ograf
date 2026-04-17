import { Card, Badge } from "@ograf/ui";

const TOOLS = [
  {
    name: "Validator",
    description: "Check your .ograf.json manifest against the specification. Get instant feedback with errors, warnings, and spec references.",
    href: "/validate",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    status: "available" as const,
  },
  {
    name: "Playground",
    description: "Load and test OGraf graphics with full lifecycle controls. Play, stop, update, and dispatch custom actions.",
    href: "/preview",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    name: "Schema Explorer",
    description: "Browse OGraf GDD types visually. Build data schemas with drag-and-drop. Export as JSON.",
    href: "/explore",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    name: "Template Generator",
    description: "Scaffold a new OGraf template in seconds. Pick a type, configure options, download a working package.",
    href: "/generate",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    name: "Package Inspector",
    description: "Deep analysis of OGraf packages: file tree, manifest parsing, Web Component detection, render requirements.",
    href: "/inspect",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    name: "CasparCG Converter",
    description: "Assess and start migrating CasparCG HTML templates to OGraf. Get a migration scorecard and partial conversion.",
    href: "/convert/casparcg",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    status: "coming-soon" as const,
  },
];

export function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white">OGraf Developer Tools</h1>
        <p className="mt-4 text-lg text-surface-300">
          Validate, preview, explore, and convert OGraf graphics packages. All
          tools run in your browser -- no install, no signup.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.name} hoverable>
            <a
              href={tool.status === "available" ? tool.href : undefined}
              className={`block ${tool.status !== "available" ? "cursor-default" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-brand-950 flex items-center justify-center text-brand-400">
                  {tool.icon}
                </div>
                {tool.status === "coming-soon" && (
                  <Badge>Coming Soon</Badge>
                )}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">
                {tool.name}
              </h2>
              <p className="mt-2 text-sm text-surface-400 leading-relaxed">
                {tool.description}
              </p>
            </a>
          </Card>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-surface-800 bg-surface-900/30 p-8 text-center">
        <p className="text-surface-400">
          Built by the community. Open source.{" "}
          <a
            href="https://ograf.dev"
            className="text-brand-400 hover:text-brand-300 underline underline-offset-4"
          >
            Learn more at ograf.dev
          </a>
        </p>
      </div>
    </div>
  );
}
