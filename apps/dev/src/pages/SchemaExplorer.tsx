import { useEffect, useState } from "react";
import { Link } from "../i18n/Link";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  ExternalLink,
  FileSearch,
  MousePointerClick,
  Tag,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { useRouteMeta } from "../hooks/useMeta";
import { loadManifestSchema, type LoadedSchema } from "../lib/schema/loader";
import type { ClusterGuide, FieldGuide } from "../content/schema-language";
import { useCopy } from "../i18n/useLocale";
import { SCHEMA_LANGUAGE } from "../i18n/copy/schema-language";
import { SCHEMA_EXPLORER_COPY, type SchemaExplorerCopy } from "../i18n/copy/schema-explorer";
import { FieldCard } from "../components/schema/FieldCard";
import { GddTypeCard } from "../components/schema/GddTypeCard";
import { SchemaSourceBadge } from "../components/schema/SchemaSourceBadge";
import { AiHelperSection } from "../components/schema/AiHelperSection";

const CLUSTER_ICONS: Record<ClusterGuide["icon"], LucideIcon> = {
  Tag,
  Activity,
  ClipboardList,
  MousePointerClick,
  Tv,
};

const TONE_BADGE: Record<ClusterGuide["tone"], string> = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

interface SchemaShape {
  readonly required: readonly string[];
  readonly properties: Record<string, { description?: string }>;
}

function readShape(schema: Record<string, unknown> | undefined): SchemaShape {
  const required = Array.isArray(schema?.required)
    ? (schema!.required as string[])
    : [];
  const properties =
    schema && typeof schema.properties === "object" && schema.properties !== null
      ? (schema.properties as Record<string, { description?: string }>)
      : {};
  return { required, properties };
}

export function SchemaExplorer() {
  useRouteMeta();
  const c = useCopy(SCHEMA_EXPLORER_COPY);
  const { CLUSTERS, FIELD_GUIDES, GDD_TYPES } = useCopy(SCHEMA_LANGUAGE);

  const [loaded, setLoaded] = useState<LoadedSchema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadManifestSchema().then((result) => {
      if (cancelled) return;
      setLoaded(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const shape = readShape(loaded?.schema);
  const fieldsByCluster: Record<string, FieldGuide[]> = {};
  for (const guide of FIELD_GUIDES) {
    if (!fieldsByCluster[guide.cluster]) fieldsByCluster[guide.cluster] = [];
    fieldsByCluster[guide.cluster].push(guide);
  }

  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10 text-center lg:pt-32">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <FileSearch className="h-6 w-6 text-blue-600" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
          {c.hero.eyebrow}
        </p>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
          {c.hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          {c.hero.intro}
        </p>
        <div className="mt-6 flex justify-center">
          <SchemaSourceBadge source={loaded?.source ?? null} loading={loading} />
        </div>
      </div>

      {/* Stats strip */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value={Object.keys(shape.properties).length || FIELD_GUIDES.length} label={c.stats.fields} />
            <Stat value={shape.required.length || 6} label={c.stats.required} />
            <Stat value={CLUSTERS.length} label={c.stats.clusters} />
            <Stat value={GDD_TYPES.length} label={c.stats.types} />
          </div>
        </div>
      </section>

      {/* Mind map */}
      <section id="mindmap" className="py-16 sm:py-20 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              {c.mindMap.title}
            </h2>
            <p className="mt-3 text-base text-slate-700">
              {c.mindMap.intro}
            </p>
          </div>
          <SchemaMindMap copy={c.mindMap} />
        </div>
      </section>

      {/* Manifest fields, grouped by cluster */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              {c.fields.title}
            </h2>
            <p className="mt-3 text-base text-slate-700">
              {c.fields.intro}
            </p>
          </div>

          {CLUSTERS.map((cluster) => {
            const items = fieldsByCluster[cluster.id] ?? [];
            if (items.length === 0) return null;
            const Icon = CLUSTER_ICONS[cluster.icon];
            return (
              <div
                key={cluster.id}
                id={`cluster-${cluster.id}`}
                className="mb-14 scroll-mt-24 last:mb-0"
              >
                <div className="mb-6 flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${TONE_BADGE[cluster.tone]}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl tracking-tight text-slate-900 sm:text-2xl">
                      {cluster.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 sm:text-base">{cluster.subtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.map((guide) => {
                    const required = shape.required.includes(guide.key);
                    const schemaDescription = shape.properties[guide.key]?.description;
                    return (
                      <FieldCard
                        key={guide.key}
                        guide={guide}
                        required={required}
                        schemaDescription={schemaDescription}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GDD types */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              {c.gdd.title}
            </h2>
            <p className="mt-3 text-base text-slate-700">
              {c.gdd.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GDD_TYPES.map((guide) => (
              <GddTypeCard key={guide.gddType} guide={guide} />
            ))}
          </div>

          {/* Modifiers that any GDD field can carry */}
          <div className="mt-12 rounded-2xl bg-blue-50 ring-1 ring-blue-100 p-6">
            <p className="text-sm font-semibold text-blue-900">
              {c.gdd.extrasTitle}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-blue-900">
              <div>{c.gdd.hidden}</div>
              <div>{c.gdd.order}</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI helper */}
      <AiHelperSection />

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
            {c.cta.title}
          </h2>
          <p className="mt-3 text-slate-700">
            {c.cta.body}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/spec"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              {c.cta.spec}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
            <Link
              to="/tutorials"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
            >
              {c.cta.tutorials}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
            <Link
              to="/check"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
            >
              {c.cta.check}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>
          {loaded?.source.kind === "live" && (
            <p className="mt-8 text-xs text-slate-400">
              {c.cta.source}{" "}
              <a
                href={loaded.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400"
              >
                {loaded.source.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { readonly value: number; readonly label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-4xl font-light text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Mind map — visual tree of the entire OGraf manifest schema graph.
 *  Required leaves are pink, optional are slate. Field-card leaves are
 *  clickable — they jump to the matching #field-{key} or #gdd-{type} anchor.
 * ──────────────────────────────────────────────────────────────────────────── */

interface NodeBase {
  readonly label: string;
  readonly required?: boolean;
  /** Anchor target if this leaf maps to a card. */
  readonly anchor?: string;
  /** Tiny grey hint shown after the label — type, default, etc. */
  readonly hint?: string;
}

interface BranchNode extends NodeBase {
  readonly children: readonly TreeNode[];
}

type TreeNode = NodeBase | BranchNode;

function isBranch(n: TreeNode): n is BranchNode {
  return Array.isArray((n as BranchNode).children);
}

type MindMapCopy = SchemaExplorerCopy["mindMap"];

function buildMindMap(m: MindMapCopy): BranchNode {
  const h = m.hints;
  return {
    label: m.rootLabel,
    hint: "root.json",
    children: [
      { label: "$schema", required: true, anchor: "field-$schema", hint: h.schema },
      { label: "id", required: true, anchor: "field-id", hint: "string" },
      { label: "name", required: true, anchor: "field-name", hint: "string" },
      { label: "main", required: true, anchor: "field-main", hint: h.main },
      { label: "supportsRealTime", required: true, anchor: "field-supportsRealTime", hint: "boolean" },
      {
        label: "supportsNonRealTime",
        required: true,
        anchor: "field-supportsNonRealTime",
        hint: "boolean",
      },
      { label: "version", anchor: "field-version", hint: h.version },
      { label: "description", anchor: "field-description", hint: "string" },
      { label: "stepCount", anchor: "field-stepCount", hint: h.stepCount },
      {
        label: "author",
        anchor: "field-author",
        hint: "object",
        children: [
          { label: "name", required: true, hint: "string" },
          { label: "email", hint: "string" },
          { label: "url", hint: "string" },
        ],
      },
      {
        label: "customActions",
        anchor: "field-customActions",
        hint: "array · lib/action.json",
        children: [
          { label: "id", required: true, hint: "string" },
          { label: "name", required: true, hint: "string" },
          { label: "description", hint: "string" },
          { label: "schema", hint: h.actionSchema },
        ],
      },
      {
        label: "schema",
        anchor: "field-schema",
        hint: h.operatorForm,
        children: [
          {
            label: "type",
            required: true,
            hint: "boolean · string · number · integer · array · object",
          },
          { label: "gddType", hint: h.gddType },
          { label: "gddOptions", hint: h.gddOptions },
          { label: "default", hint: h.default },
          { label: "hidden", hint: h.hidden },
          { label: "order", hint: h.order },
          { label: "items", hint: h.items },
          { label: "properties", hint: h.properties },
          {
            label: "→ gddTypes",
            hint: h.gddTypes,
            children: [
              { label: "single-line", anchor: "gdd-single-line", hint: "string" },
              { label: "multi-line", anchor: "gdd-multi-line", hint: "string" },
              { label: "file-path", anchor: "gdd-file-path", hint: "string + extensions[]" },
              {
                label: "file-path/image-path",
                anchor: "gdd-file-path-image-path",
                hint: "string + extensions[]",
              },
              { label: "select", anchor: "gdd-select", hint: "string|number|integer + enum + labels" },
              { label: "color-rrggbb", anchor: "gdd-color-rrggbb", hint: "string · #rrggbb" },
              { label: "color-rrggbbaa", anchor: "gdd-color-rrggbbaa", hint: "string · #rrggbbaa" },
              { label: "percentage", anchor: "gdd-percentage", hint: "number" },
              { label: "duration-ms", anchor: "gdd-duration-ms", hint: "integer" },
            ],
          },
        ],
      },
      {
        label: "renderRequirements",
        anchor: "field-renderRequirements",
        hint: h.renderRequirements,
        children: [
          {
            label: "resolution",
            hint: "object",
            children: [
              { label: "width", hint: "constraints/number · {min,max,exact,ideal}" },
              { label: "height", hint: "constraints/number" },
            ],
          },
          { label: "frameRate", hint: "constraints/number" },
          { label: "accessToPublicInternet", hint: "constraints/boolean · {exact, ideal}" },
          {
            label: "engine",
            hint: "array",
            children: [
              { label: "type", required: true, hint: h.engineType },
              { label: "version.min", required: true, hint: h.engineVersion },
            ],
          },
        ],
      },
      {
        label: "thumbnails",
        anchor: "field-thumbnails",
        hint: "array",
        children: [
          { label: "file", required: true, hint: "string — PNG, JPG, GIF, WebP" },
          {
            label: "resolution",
            hint: "object",
            children: [
              { label: "width", required: true, hint: "integer ≥ 1" },
              { label: "height", required: true, hint: "integer ≥ 1" },
            ],
          },
        ],
      },
      {
        label: h.vendorLabel,
        hint: h.vendor,
      },
    ],
  };
}

function SchemaMindMap({ copy }: { readonly copy: MindMapCopy }) {
  const root = buildMindMap(copy);
  return (
    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-6 sm:p-8 overflow-x-auto">
      <ul className="font-mono text-sm leading-7">
        <RenderNode node={root} depth={0} />
      </ul>
      <p className="mt-6 text-xs text-slate-500">
        <span className="inline-block h-2 w-2 rounded-full bg-rose-500 align-middle" />{" "}
        <span className="font-mono">{copy.legendRequired}</span> &nbsp;·&nbsp;{" "}
        <span className="inline-block h-2 w-2 rounded-full bg-slate-400 align-middle" />{" "}
        <span className="font-mono">{copy.legendOptional}</span> &nbsp;·&nbsp; {copy.legendClick}
      </p>
    </div>
  );
}

function RenderNode({
  node,
  depth,
}: {
  readonly node: TreeNode;
  readonly depth: number;
}) {
  const dotColour = node.required ? "bg-rose-500" : "bg-slate-400";
  const labelClass = node.anchor
    ? "font-medium text-slate-900 hover:text-blue-600 hover:underline underline-offset-2 decoration-blue-300"
    : "font-medium text-slate-900";

  const labelContent = (
    <>
      <span className={`inline-block h-1.5 w-1.5 rounded-full align-middle ${dotColour}`} />{" "}
      <span className={labelClass}>{node.label}</span>
      {node.hint && <span className="ml-2 text-slate-500">{node.hint}</span>}
    </>
  );

  return (
    <li>
      {node.anchor ? <a href={`#${node.anchor}`}>{labelContent}</a> : labelContent}
      {isBranch(node) && node.children.length > 0 && (
        <ul className="ml-3 border-l border-slate-300/60 pl-4">
          {node.children.map((child, i) => (
            <RenderNode
              key={`${depth}-${i}-${child.label}`}
              node={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
