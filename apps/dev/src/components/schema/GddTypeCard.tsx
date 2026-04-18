import { useState } from "react";
import {
  AlignLeft,
  ChevronDown,
  FolderOpen,
  Hash,
  Image as ImageIcon,
  List,
  Percent,
  Pipette,
  Timer,
  Type,
  type LucideIcon,
} from "lucide-react";
import { CodeBlock } from "../CodeBlock";
import type { GddTypeGuide, GddMockKind } from "../../content/schema-language";

const ICONS: Record<GddTypeGuide["icon"], LucideIcon> = {
  Type,
  AlignLeft,
  Pipette,
  Image: ImageIcon,
  List,
  FolderOpen,
  Percent,
  Timer,
};

/** Slugify a gddType (e.g. "file-path/image-path" -> "file-path-image-path") for use as an anchor id. */
function gddAnchor(gddType: string): string {
  return `gdd-${gddType.replace(/\//g, "-")}`;
}

/**
 * One GDD input type, with a visual mock of what the operator will actually
 * see in the controller. Mocks are pure CSS / SVG — no real interaction.
 */
export function GddTypeCard({ guide }: { readonly guide: GddTypeGuide }) {
  const [open, setOpen] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  const Icon = ICONS[guide.icon];
  const anchorId = gddAnchor(guide.gddType);
  const examples = guide.examples;

  return (
    <div
      id={anchorId}
      className="group/card flex flex-col scroll-mt-24 rounded-2xl bg-white p-5 ring-1 ring-slate-900/5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="font-display text-base font-medium text-slate-900">
              {guide.friendlyName}
            </h3>
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
              {guide.gddType}
            </code>
            <a
              href={`#${anchorId}`}
              aria-label={`Direct link to ${guide.friendlyName}`}
              title="Copy link to this type"
              className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-700 group-hover/card:opacity-100 focus:opacity-100"
            >
              <Hash className="h-3 w-3" strokeWidth={2.5} />
            </a>
          </div>
          <p className="mt-1 text-sm text-slate-700">{guide.description}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          What the operator sees
        </p>
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
          <Mock kind={guide.mock} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        {open
          ? `Hide ${examples.length === 1 ? "example" : `${examples.length} examples`}`
          : `Show ${examples.length === 1 ? "example" : `${examples.length} examples`}`}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>
      {open && (
        <div className="mt-3">
          {examples.length > 1 && (
            <div
              role="tablist"
              aria-label="Examples"
              className="mb-2 flex flex-wrap gap-1"
            >
              {examples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={activeExample === i}
                  onClick={() => setActiveExample(i)}
                  className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    activeExample === i
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          )}
          <CodeBlock
            code={examples[Math.min(activeExample, examples.length - 1)].code}
            language="JSON"
          />
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Mocks — what the operator's controller would render for each GDD type.
 *  All non-interactive: aria-hidden + tabIndex={-1} on inputs to keep the
 *  page keyboard nav clean.
 * ──────────────────────────────────────────────────────────────────────────── */

function Mock({ kind }: { readonly kind: GddMockKind }) {
  if (kind === "single-line") return <SingleLineMock />;
  if (kind === "multi-line") return <MultiLineMock />;
  if (kind === "file-path") return <FilePathMock />;
  if (kind === "image-path") return <ImagePathMock />;
  if (kind === "select") return <SelectMock />;
  if (kind === "color-rrggbb") return <ColorMock alpha={false} />;
  if (kind === "color-rrggbbaa") return <ColorMock alpha={true} />;
  if (kind === "percentage") return <PercentageMock />;
  if (kind === "duration-ms") return <DurationMsMock />;
  return null;
}

function MockLabel({ children }: { readonly children: string }) {
  return (
    <p className="mb-1.5 text-[11px] font-medium text-slate-500">{children}</p>
  );
}

function SingleLineMock() {
  return (
    <div>
      <MockLabel>Name</MockLabel>
      <input
        readOnly
        aria-hidden
        tabIndex={-1}
        value="Jane Smith"
        className="w-full cursor-default rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none"
      />
    </div>
  );
}

function MultiLineMock() {
  return (
    <div>
      <MockLabel>Quote</MockLabel>
      <textarea
        readOnly
        aria-hidden
        tabIndex={-1}
        rows={2}
        value="Open graphics, open broadcast, open standards. That's the future."
        className="w-full resize-none cursor-default rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none"
      />
    </div>
  );
}

function FilePathMock() {
  return (
    <div>
      <MockLabel>Theme music</MockLabel>
      <div className="flex items-center gap-2">
        <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
          Browse…
        </span>
        <code className="truncate font-mono text-xs text-slate-400">/audio/intro.mp3</code>
      </div>
    </div>
  );
}

function ImagePathMock() {
  return (
    <div>
      <MockLabel>Logo</MockLabel>
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded bg-slate-100">
          <ImageIcon className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-700">station-logo.svg</p>
          <p className="text-[10px] text-slate-400">Drop or browse</p>
        </div>
      </div>
    </div>
  );
}

function SelectMock() {
  return (
    <div>
      <MockLabel>Position</MockLabel>
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <span className="text-sm text-slate-700">Bottom right</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
      </div>
    </div>
  );
}

function ColorMock({ alpha }: { readonly alpha: boolean }) {
  const colour = alpha ? "#0f172acc" : "#2563eb";
  const swatchStyle = alpha
    ? {
        backgroundColor: "#0f172a",
        backgroundImage:
          "linear-gradient(45deg, rgba(255,255,255,0.4) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.4) 25%, transparent 25%)",
        backgroundSize: "8px 8px",
        opacity: 0.8,
      }
    : { backgroundColor: "#2563eb" };
  return (
    <div>
      <MockLabel>{alpha ? "Overlay" : "Accent"}</MockLabel>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5">
        <span
          aria-hidden
          className="h-7 w-7 flex-none rounded-md ring-1 ring-slate-300"
          style={swatchStyle}
        />
        <code className="font-mono text-xs text-slate-600">{colour}</code>
        {alpha && (
          <span className="ml-auto text-[10px] text-slate-400">α 0.80</span>
        )}
      </div>
    </div>
  );
}

function PercentageMock() {
  return (
    <div>
      <MockLabel>Opacity</MockLabel>
      <div className="space-y-1.5">
        <div className="relative h-1.5 w-full rounded-full bg-slate-200">
          <div className="absolute inset-y-0 left-0 w-[72%] rounded-full bg-blue-600" />
          <div className="absolute -top-[5px] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-white shadow ring-1 ring-slate-300" style={{ left: "72%" }} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>0%</span>
          <code className="font-mono text-slate-700">72%</code>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

function DurationMsMock() {
  return (
    <div>
      <MockLabel>Animation duration</MockLabel>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <Timer className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
        <span className="text-sm text-slate-700">600</span>
        <span className="text-xs text-slate-400">ms</span>
        <span className="ml-auto text-[10px] text-slate-400">≈ 0.6 s</span>
      </div>
    </div>
  );
}
