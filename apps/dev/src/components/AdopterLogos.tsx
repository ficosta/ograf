import adopters from "../content/adopters.json";

interface Adopter {
  readonly name: string;
  readonly url: string;
  readonly logo: string;
}

interface AdopterLogosProps {
  readonly heading: string;
  readonly vendorsLabel: string;
  readonly organisationsLabel: string;
  /** Rendered after the source link, e.g. "as listed on" → "… ograf.ebu.io". */
  readonly sourcePrefix: string;
}

/**
 * The vendors and broadcasters the EBU lists as OGraf adopters, mirrored from
 * ograf.ebu.io (see content/adopters.json for the date it was copied). The
 * list is the EBU's, so the section says so and links back — ograf.dev is not
 * affiliated with any of these companies.
 */
export function AdopterLogos({ heading, vendorsLabel, organisationsLabel, sourcePrefix }: AdopterLogosProps) {
  return (
    <div className="mt-36 lg:mt-44">
      <p className="font-display text-base text-slate-900">{heading}</p>
      <LogoGroup label={vendorsLabel} items={adopters.vendors} />
      <LogoGroup label={organisationsLabel} items={adopters.organisations} />
      <p className="mt-10 text-xs text-slate-500">
        {sourcePrefix}{" "}
        <a
          href={adopters.source}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400"
        >
          ograf.ebu.io
        </a>
      </p>
    </div>
  );
}

function LogoGroup({ label, items }: { readonly label: string; readonly items: readonly Adopter[] }) {
  return (
    <div className="mt-10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</h3>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-6 sm:gap-x-10 sm:gap-y-8">
        {items.map((item) => (
          <li key={item.name}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.name}
              className="block opacity-80 transition hover:opacity-100 focus-visible:opacity-100"
            >
              <img
                src={item.logo}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="h-7 w-auto max-w-[7.5rem] object-contain sm:h-8 sm:max-w-[9rem]"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
