import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Play, Square, RefreshCw, Trash2, Zap, Loader2 } from "lucide-react";
import type { Pkg } from "../../lib/check/types";
import { startSession, releaseSession } from "../../lib/check/runtime/session";
import { Harness } from "../../lib/check/runtime/harness";
import type {
  ConsoleLine,
  HarnessEvent,
  RuntimeCall,
  RuntimeError,
  RuntimeSession,
} from "../../lib/check/runtime/types";
import { LifecycleTimeline } from "./LifecycleTimeline";
import { ConsoleCapture } from "./ConsoleCapture";

interface RuntimePanelProps {
  readonly pkg: Pkg;
  readonly onSessionChange: (session: RuntimeSession) => void;
}

const UNKNOWN_ACTION = "__ograf_unknown__";

const INITIAL_SESSION: RuntimeSession = {
  calls: [],
  consoleLines: [],
  errors: [],
  status: "idle",
  tag: null,
};

const SANDBOX_WIDTH = 1920;
const SANDBOX_HEIGHT = 1080;

export function RuntimePanel({ pkg, onSessionChange }: RuntimePanelProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const harnessRef = useRef<Harness | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [state, setState] = useState<RuntimeSession>(INITIAL_SESSION);
  const [busy, setBusy] = useState<"booting" | "running" | null>("booting");
  const [fatal, setFatal] = useState<string | null>(null);
  const [stageScale, setStageScale] = useState(1);

  const defaultData = useMemo(() => extractDefaultData(pkg.manifest), [pkg.manifest]);
  const customActions = useMemo(() => extractCustomActions(pkg.manifest), [pkg.manifest]);

  // Keep parent in sync whenever our session changes.
  useEffect(() => {
    onSessionChange(state);
  }, [state, onSessionChange]);

  const pushConsole = useCallback((event: Extract<HarnessEvent, { type: "console" }>) => {
    setState((prev) => ({
      ...prev,
      consoleLines: [
        ...prev.consoleLines,
        {
          id: `c-${prev.consoleLines.length}`,
          level: event.level,
          args: event.args,
          ts: event.ts,
        } satisfies ConsoleLine,
      ],
    }));
  }, []);

  const pushError = useCallback((event: Extract<HarnessEvent, { type: "error" }>) => {
    setState((prev) => ({
      ...prev,
      errors: [
        ...prev.errors,
        {
          id: `e-${prev.errors.length}`,
          message: event.message,
          stack: event.stack,
          source: event.source,
          ts: Date.now(),
        } satisfies RuntimeError,
      ],
    }));
  }, []);

  // Register session + mount iframe on mount; clean up on unmount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!pkg.mainPath) {
        setFatal("This package has no `main` module declared in the manifest.");
        setBusy(null);
        return;
      }
      setBusy("booting");
      setFatal(null);
      setState(INITIAL_SESSION);
      try {
        const sessionId = await startSession(pkg.files);
        if (cancelled) {
          releaseSession(sessionId);
          return;
        }
        sessionIdRef.current = sessionId;
        const src = `/check-sandbox.html?session=${encodeURIComponent(sessionId)}&main=${encodeURIComponent(pkg.mainPath)}`;
        setIframeSrc(src);
      } catch (err) {
        if (cancelled) return;
        setFatal(err instanceof Error ? err.message : String(err));
        setBusy(null);
        setState((s) => ({ ...s, status: "failed", failureReason: err instanceof Error ? err.message : String(err) }));
      }
    })();
    return () => {
      cancelled = true;
      harnessRef.current?.dispose();
      harnessRef.current = null;
      if (sessionIdRef.current) {
        releaseSession(sessionIdRef.current);
        sessionIdRef.current = null;
      }
    };
    // We intentionally reboot when `pkg` identity changes.
  }, [pkg]);

  // When the iframe mounts for a given src, attach a harness and wait for ready.
  useEffect(() => {
    if (!iframeSrc) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const harness = new Harness({
      iframe,
      onEvent: (event) => {
        switch (event.type) {
          case "console":
            pushConsole(event);
            break;
          case "error":
            pushError(event);
            break;
        }
      },
    });
    harnessRef.current = harness;

    let disposed = false;
    harness
      .waitReady()
      .then((res) => {
        if (disposed) return;
        if (res.error || !res.tag) {
          setFatal(res.error ?? "sandbox failed to initialise");
          setBusy(null);
          setState((s) => ({ ...s, status: "failed", failureReason: res.error }));
          return;
        }
        setState((s) => ({ ...s, status: "ready", tag: res.tag }));
        setBusy(null);
        // Auto-run smoke sequence.
        void runSmoke(harness);
      })
      .catch((err) => {
        if (disposed) return;
        setFatal(err instanceof Error ? err.message : String(err));
        setBusy(null);
        setState((s) => ({ ...s, status: "failed", failureReason: err instanceof Error ? err.message : String(err) }));
      });

    return () => {
      disposed = true;
      harness.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeSrc, pushConsole, pushError]);

  // Track the container width and derive a CSS scale so the 1920x1080 iframe
  // fits the available space without distorting aspect ratio.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setStageScale(w / SANDBOX_WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const recordCall = useCallback((call: RuntimeCall) => {
    setState((prev) => ({ ...prev, calls: [...prev.calls, call] }));
  }, []);

  const callAction = useCallback(
    async (
      harness: Harness,
      action: RuntimeCall["action"],
      label: string,
      req: { data?: unknown; payload?: unknown }
    ): Promise<RuntimeCall> => {
      const startedAt = Date.now();
      try {
        const reply = await harness.call({ action, ...req } as never);
        const call: RuntimeCall = {
          action,
          label,
          startedAt,
          durationMs: reply.durationMs,
          result: reply.result,
          error: reply.error,
          payloadPreview: req.payload !== undefined ? safeJson(req.payload) : req.data !== undefined ? safeJson(req.data) : undefined,
        };
        recordCall(call);
        return call;
      } catch (err) {
        const call: RuntimeCall = {
          action,
          label,
          startedAt,
          durationMs: Date.now() - startedAt,
          error: err instanceof Error ? err.message : String(err),
          payloadPreview: req.payload !== undefined ? safeJson(req.payload) : req.data !== undefined ? safeJson(req.data) : undefined,
        };
        recordCall(call);
        return call;
      }
    },
    [recordCall]
  );

  const runSmoke = useCallback(
    async (harness: Harness) => {
      setState((s) => ({ ...s, status: "running" }));
      setBusy("running");
      try {
        await callAction(harness, "load", "load({ data })", { data: defaultData });
        await callAction(harness, "playAction", "playAction({})", { payload: {} });
        await new Promise((r) => setTimeout(r, 600));
        await callAction(harness, "updateAction", "updateAction({ data })", { data: defaultData });
        await callAction(harness, "stopAction", "stopAction({})", { payload: {} });
        await callAction(harness, "customAction", `customAction("${UNKNOWN_ACTION}")`, {
          payload: { action: UNKNOWN_ACTION },
        });
        for (const action of customActions) {
          await callAction(harness, "customAction", `customAction("${action.id}")`, {
            payload: { action: action.id, data: action.defaultData },
          });
        }
        await callAction(harness, "dispose", "dispose()", {});
        setState((s) => ({ ...s, status: "done" }));
      } finally {
        setBusy(null);
      }
    },
    [callAction, customActions, defaultData]
  );

  // Manual controls
  const manual = useCallback(
    async (fn: (h: Harness) => Promise<unknown>) => {
      const h = harnessRef.current;
      if (!h) return;
      setBusy("running");
      try {
        await fn(h);
      } finally {
        setBusy(null);
      }
    },
    []
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg tracking-tight text-slate-900">Runtime sandbox</h3>
          <p className="text-xs text-slate-500">
            The graphic runs in a sandboxed iframe with the package served by an in-browser service worker. No upload.
          </p>
        </div>
        {busy && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
            {busy === "booting" ? "booting sandbox..." : "running..."}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Left column: live preview + controls */}
        <div className="space-y-3">
          <div
            ref={stageRef}
            className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          >
            {iframeSrc ? (
              // The iframe renders at the true broadcast resolution (1920x1080)
              // and we CSS-scale it down to fit the preview container. This is
              // the standard pattern for broadcast-graphics previews: the
              // graphic's CSS uses absolute pixel values sized for 1080p, so
              // the preview must render at 1080p and scale visually, not
              // squeeze the iframe's viewport to 480x270.
              <iframe
                ref={iframeRef}
                title="OGraf runtime sandbox"
                src={iframeSrc}
                sandbox="allow-scripts allow-same-origin"
                style={{
                  width: `${SANDBOX_WIDTH}px`,
                  height: `${SANDBOX_HEIGHT}px`,
                  transform: `scale(${stageScale})`,
                  transformOrigin: "top left",
                  border: 0,
                }}
                className="absolute left-0 top-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                Preparing sandbox...
              </div>
            )}
            <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-white/50">
              1920 × 1080 · {(stageScale * 100).toFixed(0)}%
            </div>
          </div>

          {fatal ? (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-none" strokeWidth={2} />
              <div>
                <p className="font-medium">Sandbox did not start</p>
                <p className="mt-0.5 font-mono">{fatal}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <ControlButton
                icon={RefreshCw}
                label="load"
                disabled={state.status === "idle" || state.status === "failed" || busy !== null}
                onClick={() =>
                  manual((h) => callAction(h, "load", "load({ data })", { data: defaultData }))
                }
              />
              <ControlButton
                icon={Play}
                label="play"
                disabled={state.status === "idle" || state.status === "failed" || busy !== null}
                onClick={() =>
                  manual((h) => callAction(h, "playAction", "playAction({})", { payload: {} }))
                }
              />
              <ControlButton
                icon={RefreshCw}
                label="update"
                disabled={state.status === "idle" || state.status === "failed" || busy !== null}
                onClick={() =>
                  manual((h) =>
                    callAction(h, "updateAction", "updateAction({ data })", { data: defaultData })
                  )
                }
              />
              <ControlButton
                icon={Square}
                label="stop"
                disabled={state.status === "idle" || state.status === "failed" || busy !== null}
                onClick={() =>
                  manual((h) => callAction(h, "stopAction", "stopAction({})", { payload: {} }))
                }
              />
              {customActions.map((ca) => (
                <ControlButton
                  key={ca.id}
                  icon={Zap}
                  label={ca.id}
                  disabled={state.status === "idle" || state.status === "failed" || busy !== null}
                  onClick={() =>
                    manual((h) =>
                      callAction(h, "customAction", `customAction("${ca.id}")`, {
                        payload: { action: ca.id, data: ca.defaultData },
                      })
                    )
                  }
                />
              ))}
              <ControlButton
                icon={Trash2}
                label="dispose"
                disabled={state.status === "idle" || state.status === "failed" || busy !== null}
                onClick={() => manual((h) => callAction(h, "dispose", "dispose()", {}))}
              />
            </div>
          )}
        </div>

        {/* Right column: timeline + console */}
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Lifecycle timeline
            </p>
            <LifecycleTimeline calls={state.calls} running={busy === "running"} />
          </div>
          <ConsoleCapture lines={state.consoleLines} errors={state.errors} />
        </div>
      </div>
    </section>
  );
}

interface ControlButtonProps {
  readonly icon: typeof Play;
  readonly label: string;
  readonly disabled: boolean;
  readonly onClick: () => void;
}

function ControlButton({ icon: Icon, label, disabled, onClick }: ControlButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-mono text-xs font-medium text-slate-800 hover:bg-slate-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {label}
    </button>
  );
}

function safeJson(v: unknown): string {
  try {
    const s = JSON.stringify(v);
    return s.length > 200 ? s.slice(0, 197) + "..." : s;
  } catch {
    return String(v);
  }
}

// Walk the manifest schema and return an object populated from `default` values.
function extractDefaultData(manifest: unknown): Record<string, unknown> {
  if (!manifest || typeof manifest !== "object") return {};
  const schema = (manifest as { schema?: unknown }).schema;
  if (!schema || typeof schema !== "object") return {};
  const props = (schema as { properties?: unknown }).properties;
  if (!props || typeof props !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(props as Record<string, unknown>)) {
    if (def && typeof def === "object" && "default" in (def as object)) {
      out[key] = (def as { default: unknown }).default;
    }
  }
  return out;
}

function extractCustomActions(manifest: unknown): { id: string; defaultData?: unknown }[] {
  if (!manifest || typeof manifest !== "object") return [];
  const arr = (manifest as { customActions?: unknown }).customActions;
  if (!Array.isArray(arr)) return [];
  const out: { id: string; defaultData?: unknown }[] = [];
  for (const entry of arr) {
    if (!entry || typeof entry !== "object") continue;
    const id = (entry as { id?: unknown }).id;
    if (typeof id !== "string" || !id) continue;
    const schema = (entry as { schema?: unknown }).schema;
    out.push({ id, defaultData: extractDefaultData({ schema }) });
  }
  return out;
}
