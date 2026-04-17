import { Link } from "react-router";
import {
  ArrowRight,
  Code2,
  PenTool,
  Radio,
  type LucideIcon,
} from "lucide-react";
import roles from "../content/roles.json";
import type { Role, RoleAccent } from "../content/roles.types";

const ROLES = roles as readonly Role[];

const ICON_MAP: Readonly<Record<string, LucideIcon>> = {
  Code2,
  PenTool,
  Radio,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Code2;
}

const ACCENT: Record<RoleAccent, {
  readonly iconBg: string;
  readonly iconText: string;
  readonly ring: string;
  readonly hoverBorder: string;
  readonly titleHover: string;
  readonly chip: string;
  readonly lineFrom: string;
  readonly lineTo: string;
}> = {
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    ring: "ring-slate-200",
    hoverBorder: "group-hover:ring-blue-300/60",
    titleHover: "group-hover:text-blue-600",
    chip: "bg-blue-50 text-blue-700",
    lineFrom: "from-blue-400",
    lineTo: "to-blue-600",
  },
  cyan: {
    iconBg: "bg-cyan-50",
    iconText: "text-cyan-600",
    ring: "ring-slate-200",
    hoverBorder: "group-hover:ring-cyan-300/60",
    titleHover: "group-hover:text-cyan-600",
    chip: "bg-cyan-50 text-cyan-700",
    lineFrom: "from-cyan-400",
    lineTo: "to-cyan-600",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    ring: "ring-slate-200",
    hoverBorder: "group-hover:ring-emerald-300/60",
    titleHover: "group-hover:text-emerald-600",
    chip: "bg-emerald-50 text-emerald-700",
    lineFrom: "from-emerald-400",
    lineTo: "to-emerald-600",
  },
};

interface RoleCardsProps {
  readonly heading?: string;
  readonly subheading?: string;
}

export function RoleCards({
  heading = "Where should you start?",
  subheading = "Pick the lane that sounds most like you. Each path links to the page that gets you productive fastest.",
}: RoleCardsProps) {
  return (
    <section aria-label="Role-based entry points" className="mx-auto w-full">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">Start here</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 text-base text-slate-600">{subheading}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-3">
        {ROLES.map((role) => {
          const Icon = resolveIcon(role.icon);
          const accent = ACCENT[role.accent];
          return (
            <Link
              key={role.id}
              to={role.ctaLink}
              className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 transition-all hover:-translate-y-1 hover:shadow-lg ${accent.ring} ${accent.hoverBorder}`}
            >
              {/* Subtle neon top-border that reveals on hover */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-6 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r ${accent.lineFrom} ${accent.lineTo} transition-transform duration-500 group-hover:scale-x-100`}
              />

              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.iconBg} ${accent.iconText}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${accent.chip}`}>
                  {role.title}
                </span>
              </div>

              <h3 className={`mt-5 font-display text-xl tracking-tight text-slate-900 transition-colors ${accent.titleHover}`}>
                {role.tagline}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {role.description}
              </p>

              <span
                className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors ${accent.titleHover}`}
              >
                {role.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
