import { useEffect, useMemo, useState } from "react";
import { Link } from "../i18n/Link";
import type { ReactNode } from "react";
import { ArrowLeftRight, Check, Code2, Minus, Unlock, X } from "lucide-react";
import { TutorialCards } from "../components/TutorialCards";
import { RoleCards } from "../components/RoleCards";
import { AdopterLogos } from "../components/AdopterLogos";
import { useRouteMeta } from "../hooks/useMeta";
import { useCopy } from "../i18n/useLocale";
import { FAQ } from "../content/localized/faq";
import { HOME_COPY } from "../i18n/copy/home";
import type { HomeCopy } from "../i18n/copy/home/en";

type HomeFeatures = HomeCopy["features"];

function TypewriterWord({ words }: { readonly words: readonly string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  // Start fully typed: the prerendered HTML (what crawlers and link previews
  // read) then says "The missing community for OGraf." instead of leaving a
  // hole, and the animation takes over from there after hydration.
  const [displayed, setDisplayed] = useState(words[0] ?? "");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex] ?? "";

    if (!isDeleting && displayed === word) {
      // Word fully typed — hold, then start deleting
      const hold = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(hold);
    }

    if (isDeleting && displayed === "") {
      // Word fully deleted — move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const speed = isDeleting ? 50 : 80;
    const timeout = setTimeout(() => {
      setDisplayed(
        isDeleting
          ? word.slice(0, displayed.length - 1)
          : word.slice(0, displayed.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words]);

  return (
    <span className="relative whitespace-nowrap text-blue-600">
      {displayed.length > 0 && (
        <svg
          aria-hidden="true"
          viewBox="0 0 418 42"
          className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
          preserveAspectRatio="none"
          style={{
            opacity: displayed.length > 0 ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}
        >
          <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
        </svg>
      )}
      <span className="relative">{displayed}</span>
      <span
        className="relative inline-block w-[3px] h-[0.75em] bg-blue-600 ml-0.5 align-baseline rounded-full"
        style={{ animation: "blink 0.8s step-end infinite" }}
      />
    </span>
  );
}

const ECOSYSTEM_TOOLS: ReadonlyArray<{
  readonly name: keyof HomeCopy["tools"];
  readonly stars?: string;
  readonly url: string;
  readonly logo: string;
  readonly logoClass: string;
}> = [
  {
    name: "SPX-GC",
    stars: "409",
    url: "https://github.com/TuomoKu/SPX-GC",
    logo: "/img/logos/spx.svg",
    logoClass: "h-7",
  },
  {
    name: "CasparCG",
    stars: "1000+",
    url: "https://casparcg.com",
    logo: "/img/logos/casparcg.svg",
    logoClass: "h-8",
  },
  {
    name: "Ferryman",
    stars: "30",
    url: "https://ferryman.streamshapers.com",
    logo: "/img/logos/streamshapers.svg",
    logoClass: "h-5",
  },
  {
    name: "ograf-server",
    stars: "24",
    url: "https://github.com/SuperFlyTV/ograf-server",
    logo: "/img/logos/superflytv.svg",
    logoClass: "h-5",
  },
  {
    name: "Loopic",
    url: "https://www.loopic.io",
    logo: "/img/logos/loopic.svg",
    logoClass: "h-7",
  },
];

const FEATURES: ReadonlyArray<{ readonly id: keyof HomeFeatures; readonly icon: ReactNode }> = [
  {
    id: "open",
    icon: <Unlock className="h-8 w-8 text-white" strokeWidth={1.5} />,
  },
  {
    id: "web",
    icon: <Code2 className="h-8 w-8 text-white" strokeWidth={1.5} />,
  },
  {
    id: "interop",
    icon: <ArrowLeftRight className="h-8 w-8 text-white" strokeWidth={1.5} />,
  },
];

type CellState = "yes" | "no" | "partial";

const COMPARISON_SYSTEMS = [
  { name: "OGraf", highlight: true },
  { name: "Vizrt" },
  { name: "Chyron" },
  { name: "Ross" },
  { name: "Avid" },
  { name: "Flowics" },
  { name: "Singular.live" },
];

/** Labels for each row are in HOME_COPY.rows, in the same order. */
const COMPARISON_ROWS: { values: CellState[] }[] = [
  // OGraf, Vizrt, Chyron, Ross, Avid, Flowics, Singular
  { values: ["yes", "no", "no", "no", "no", "no", "no"] },
  { values: ["yes", "partial", "partial", "partial", "partial", "yes", "yes"] },
  { values: ["yes", "no", "no", "no", "no", "no", "no"] },
  { values: ["yes", "yes", "yes", "yes", "yes", "no", "no"] },
  { values: ["yes", "no", "no", "no", "no", "no", "partial"] },
  { values: ["partial", "partial", "partial", "no", "partial", "yes", "yes"] },
];

function ComparisonCell({ state }: { state: CellState }) {
  if (state === "yes") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }
  if (state === "partial") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <X className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}

interface FaqEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

function splitIntoColumns<T>(items: readonly T[], columns: number): T[][] {
  const result: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => {
    result[i % columns].push(item);
  });
  return result;
}

export function Home() {
  useRouteMeta();
  const c = useCopy(HOME_COPY);
  const faq = useCopy(FAQ);
  const faqColumns = useMemo(() => splitIntoColumns<FaqEntry>(faq, 3), [faq]);
  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl min-h-[7rem] sm:min-h-[10rem]">
          {c.heroBefore}{" "}
          <TypewriterWord key={c.rotatingWords.join()} words={c.rotatingWords} />{" "}
          {c.heroAfter}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          {c.heroLead}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            to="/get-started"
            className="group inline-flex items-center justify-center rounded-full bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {c.startTutorial}
          </Link>
          <Link
            to="/tools"
            className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 focus-visible:outline-blue-600"
          >
            <svg aria-hidden="true" className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current">
              <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
            </svg>
            <span className="ml-3">{c.exploreTools}</span>
          </Link>
        </div>

        {/* Vendors and broadcasters listed as adopters by the EBU */}
        <AdopterLogos
          heading={c.adopters.heading}
          vendorsLabel={c.adopters.vendorsLabel}
          organisationsLabel={c.adopters.organisationsLabel}
          sourcePrefix={c.adopters.sourcePrefix}
        />
      </div>

      {/* Role-based onboarding */}
      <section className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RoleCards />
        </div>
      </section>

      {/* Features — Why OGraf */}
      <section id="features" className="bg-blue-600 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              {c.featuresTitle}
            </h2>
            <p className="mt-4 text-lg tracking-tight text-blue-100">
              {c.featuresLead}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.id} className="rounded-2xl bg-white/10 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  {f.icon}
                </div>
                <h3 className="mt-6 font-display text-lg font-medium text-white">{c.features[f.id].title}</h3>
                <p className="mt-2 text-sm text-blue-100">{c.features[f.id].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison chart */}
      <section id="compare" className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              {c.compareTitle}
            </h2>
            <p className="mt-4 text-lg tracking-tight text-slate-700">
              {c.compareLead}
            </p>
          </div>

          <div className="mx-auto mt-16 overflow-x-auto rounded-2xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 bg-white px-6 py-5 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {c.featureColumn}
                  </th>
                  {COMPARISON_SYSTEMS.map((sys, sysIdx) => (
                    <th
                      key={sys.name}
                      scope="col"
                      className={`px-4 py-5 text-center ${sys.highlight ? "bg-blue-50" : ""}`}
                    >
                      <div className={`font-display text-sm font-semibold ${sys.highlight ? "text-blue-700" : "text-slate-900"}`}>
                        {sys.name}
                      </div>
                      <div className="mt-0.5 text-[11px] font-normal text-slate-500">{c.systemNotes[sysIdx]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_ROWS.map((row, rowIdx) => {
                  const label = c.rows[rowIdx];
                  return (
                  <tr key={rowIdx}>
                    <th scope="row" className="sticky left-0 bg-white px-6 py-4 align-top text-sm font-medium text-slate-900">
                      {label?.feature}
                      {label?.note && (
                        <div className="mt-0.5 text-xs font-normal text-slate-500">{label.note}</div>
                      )}
                    </th>
                    {row.values.map((state, idx) => (
                      <td
                        key={`${rowIdx}-${idx}`}
                        className={`px-4 py-4 text-center ${COMPARISON_SYSTEMS[idx].highlight ? "bg-blue-50/60" : ""}`}
                      >
                        <ComparisonCell state={state} />
                      </td>
                    ))}
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <ComparisonCell state="yes" /> {c.legend.yes}
            </span>
            <span className="inline-flex items-center gap-2">
              <ComparisonCell state="partial" /> {c.legend.partial}
            </span>
            <span className="inline-flex items-center gap-2">
              <ComparisonCell state="no" /> {c.legend.no}
            </span>
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-slate-500">
            {c.compareFootnote}
          </p>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              {c.ecosystemTitle}
            </h2>
            <p className="mt-4 text-lg tracking-tight text-slate-700">
              {c.ecosystemLead}
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
            {ECOSYSTEM_TOOLS.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 hover:shadow-slate-900/20 transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <img src={tool.logo} alt={tool.name} loading="lazy" decoding="async" className={`${tool.logoClass} w-auto grayscale opacity-70`} />
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {c.tools[tool.name].cat}
                    {tool.stars && (
                      <>
                        <span className="text-slate-300">·</span>
                        <svg className="h-3 w-3 fill-slate-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        <span className="text-slate-400">{tool.stars}</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm text-slate-700">{c.tools[tool.name].desc}</p>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/ecosystem"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-blue-600"
            >
              {c.viewEcosystem}
              <svg width={13} height={7} viewBox="0 0 13 7" fill="none" strokeWidth={1} className="inline-block"><path d="M12.5 3.5H0.5" stroke="currentColor" strokeLinecap="round" /><path d="M9.5 6.5L12.5 3.5L9.5 0.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              {c.statsTitle}
            </h2>
            <p className="mt-4 text-lg tracking-tight text-slate-700">
              {c.statsLead}
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            {c.stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-4xl font-light tracking-tight text-blue-600">{s.stat}</p>
                <p className="mt-2 text-sm text-slate-700">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TutorialCards
            title={c.tutorialsTitle}
            subtitle={c.tutorialsSubtitle}
            max={4}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              {c.faqTitle}
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {faqColumns.map((column, i) => (
              <div key={i} className="space-y-8">
                {column.map((faq) => (
                  <div key={faq.id}>
                    <h3 className="font-display text-lg/7 text-slate-900">{faq.question}</h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
