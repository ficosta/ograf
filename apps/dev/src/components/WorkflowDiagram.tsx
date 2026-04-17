import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Cpu,
  Package,
  PenTool,
  Radio,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import workflow from "../content/workflow.json";
import type { Workflow, WorkflowNode } from "../content/workflow.types";

const ICON_MAP: Readonly<Record<string, LucideIcon>> = {
  Code2,
  Cpu,
  Package,
  PenTool,
  Radio,
  ShieldCheck,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Code2;
}

const WORKFLOW = workflow as Workflow;
const NODE_COUNT = WORKFLOW.nodes.length;

// Geometry tuned for a 1200x360 SVG viewBox.
const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 360;
const NODE_Y = 180;
const NODE_RADIUS_X = 68;
const NODE_RADIUS_Y = 44;
const NODE_XS = Array.from({ length: NODE_COUNT }, (_, i) => {
  const margin = 120;
  if (NODE_COUNT === 1) return VIEWBOX_WIDTH / 2;
  return margin + (i * (VIEWBOX_WIDTH - margin * 2)) / (NODE_COUNT - 1);
});

/**
 * Build a gentle S-curve between two points so the connection line feels
 * kinetic rather than mechanical. The control points offset vertically to
 * create a wave-like signal path between nodes.
 */
function pathBetween(x1: number, x2: number, direction: number): string {
  const midX = (x1 + x2) / 2;
  const amp = 36 * direction;
  return `M ${x1} ${NODE_Y} C ${midX} ${NODE_Y + amp}, ${midX} ${NODE_Y - amp}, ${x2} ${NODE_Y}`;
}

const CONNECTIONS = NODE_XS.slice(0, -1).map((x, i) => {
  const x1 = x + NODE_RADIUS_X;
  const x2 = NODE_XS[i + 1] - NODE_RADIUS_X;
  const direction = i % 2 === 0 ? 1 : -1;
  return { id: `conn-${i}`, d: pathBetween(x1, x2, direction), delay: 300 + i * 220 };
});

export function WorkflowDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 shadow-2xl ring-1 ring-slate-900/50 sm:p-10"
      aria-label="How an OGraf graphic flows on-air"
    >
      {/* Subtle grid background for the technical feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow pooling behind the middle of the diagram */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, rgba(59, 130, 246, 0.18), transparent 55%)",
        }}
      />

      <figcaption className="relative mb-8 flex flex-col gap-2 sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          The OGraf workflow
        </p>
        <h3 className="font-display text-2xl tracking-tight text-white sm:text-3xl">
          {WORKFLOW.title}
        </h3>
        <p className="max-w-2xl text-sm text-slate-400">{WORKFLOW.description}</p>
      </figcaption>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="relative block w-full"
          role="presentation"
        >
          <defs>
            <linearGradient id="wf-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="wf-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines — static track + animated stroke draw + travelling pulse */}
          {CONNECTIONS.map((conn) => (
            <g key={conn.id}>
              {/* Dim base track */}
              <path
                d={conn.d}
                fill="none"
                stroke="#1e293b"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              {/* Animated stroke revealing once visible */}
              <path
                d={conn.d}
                fill="none"
                stroke="url(#wf-stroke)"
                strokeWidth={1.5}
                strokeLinecap="round"
                filter="url(#wf-glow)"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: visible ? 0 : 600,
                  transition: `stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1) ${conn.delay}ms`,
                  opacity: visible ? 1 : 0,
                }}
              />
              {/* Travelling pulse dot */}
              {visible && (
                <circle
                  r="4"
                  fill="#a5f3fc"
                  filter="url(#wf-glow)"
                  style={{
                    offsetPath: `path('${conn.d}')`,
                    animation: `workflow-pulse 2400ms cubic-bezier(0.45, 0.05, 0.55, 0.95) ${conn.delay + 400}ms infinite`,
                    opacity: 0,
                  }}
                />
              )}
            </g>
          ))}

          {/* Nodes */}
          {WORKFLOW.nodes.map((node, i) => (
            <WorkflowSvgNode
              key={node.id}
              node={node}
              cx={NODE_XS[i]}
              cy={NODE_Y}
              index={i}
              visible={visible}
              active={activeNode === node.id}
            />
          ))}
        </svg>
      </div>

      {/* Node captions below the SVG, clickable to reveal description */}
      <div className="relative mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 md:grid-cols-5">
        {WORKFLOW.nodes.map((node, i) => {
          const Icon = resolveIcon(node.icon);
          const isActive = activeNode === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNode((current) => (current === node.id ? null : node.id))}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              aria-expanded={isActive}
              aria-label={`${node.label}: ${node.description}`}
              className={`group flex flex-col items-start rounded-xl border px-3 py-3 text-left transition-all ${
                isActive
                  ? "border-blue-400/60 bg-blue-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
              style={{
                transitionDelay: visible ? `${400 + i * 140}ms` : "0ms",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transitionProperty: "opacity, transform, background-color, border-color",
                transitionDuration: "520ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                    isActive ? "bg-blue-500/30 text-blue-200" : "bg-slate-800 text-slate-300 group-hover:text-blue-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Step {i + 1}
                </span>
              </div>
              <p className="mt-2 font-display text-base text-white">{node.label}</p>
              <p
                className={`mt-1 text-xs leading-relaxed transition-colors ${
                  isActive ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {node.description}
              </p>
            </button>
          );
        })}
      </div>
    </figure>
  );
}

interface WorkflowSvgNodeProps {
  readonly node: WorkflowNode;
  readonly cx: number;
  readonly cy: number;
  readonly index: number;
  readonly visible: boolean;
  readonly active: boolean;
}

function WorkflowSvgNode({ node, cx, cy, index, visible, active }: WorkflowSvgNodeProps) {
  const delay = 200 + index * 220;
  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.92)",
        transformOrigin: `${cx}px ${cy}px`,
        transition: `opacity 520ms ease ${delay}ms, transform 520ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <rect
        x={cx - NODE_RADIUS_X}
        y={cy - NODE_RADIUS_Y}
        width={NODE_RADIUS_X * 2}
        height={NODE_RADIUS_Y * 2}
        rx={14}
        ry={14}
        fill="#020617"
        stroke={active ? "#60a5fa" : "#1e3a8a"}
        strokeWidth={active ? 2 : 1.5}
        filter="url(#wf-glow)"
        style={{ transition: "stroke 260ms ease, stroke-width 260ms ease" }}
      />
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fontSize={15}
        fontWeight={600}
        fill={active ? "#e2e8f0" : "#94a3b8"}
        fontFamily="Lexend, system-ui, sans-serif"
        style={{ transition: "fill 260ms ease" }}
      >
        {node.label}
      </text>
    </g>
  );
}
