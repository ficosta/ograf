import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Play, RefreshCw, Repeat, Square, Zap } from "lucide-react";
import { useCopy } from "../../i18n/useLocale";
import { GENERATOR_COPY } from "../../i18n/copy/generator";
import { Harness } from "../../lib/check/runtime/harness";
import { releaseSession, startSession } from "../../lib/check/runtime/session";
import { runtimeWorkerAvailable } from "../../lib/check/runtime/service-worker";
import type { HarnessRequest } from "../../lib/check/runtime/types";

/**
 * Runs the generated graphic.mjs for real. The package files are registered
 * with the Package Checker's service worker and the sandbox page imports the
 * module from there, so what plays here is byte-for-byte what gets downloaded.
 *
 * `rebootKey` changes whenever the stylesheet, module or manifest structure
 * changed; the iframe is then rebuilt and auto-played. Data changes are sent
 * as updateAction() without a reload, as a controller would.
 */
interface GeneratorPreviewProps {
  readonly files: ReadonlyMap<string, Uint8Array> | null;
  readonly rebootKey: string;
  readonly data: Readonly<Record<string, unknown>>;
  readonly customActions: readonly { readonly id: string; readonly name: string }[];
  readonly facts: readonly string[];
}

type Status = "idle" | "booting" | "ready" | "failed";
/** Omit that keeps the union apart, so each action keeps its own payload shape. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type Request = DistributiveOmit<HarnessRequest, "id">;
type Background = "dark" | "light" | "checker";

const WIDTH = 1920;
const HEIGHT = 1080;
const DATA_DEBOUNCE_MS = 350;

const BACKGROUNDS: Readonly<Record<Background, { className: string; style?: React.CSSProperties }>> = {
  dark: { className: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" },
  light: { className: "bg-gradient-to-br from-slate-100 via-white to-slate-200" },
  checker: {
    className: "bg-slate-200",
    style: {
      backgroundImage:
        "linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)",
      backgroundSize: "24px 24px",
      backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0",
    },
  },
};

export function GeneratorPreview({ files, rebootKey, data, customActions, facts }: GeneratorPreviewProps) {
  const c = useCopy(GENERATOR_COPY);
  const t = c.preview;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const harnessRef = useRef<Harness | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const filesRef = useRef(files);
  const dataRef = useRef(data);
  filesRef.current = files;
  dataRef.current = data;

  const [supported, setSupported] = useState(true);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [busy, setBusy] = useState(false);
  const [fatal, setFatal] = useState<string | null>(null);
  const [lastCall, setLastCall] = useState<string | null>(null);
  const [scale, setScale] = useState(0.3);
  const [background, setBackground] = useState<Background>("dark");

  useEffect(() => {
    setSupported(runtimeWorkerAvailable());
  }, []);

  const call = useCallback(async (req: Request, label: string) => {
    const harness = harnessRef.current;
    if (!harness) return;
    setBusy(true);
    try {
      const reply = await harness.call(req);
      const code =
        reply.result && typeof reply.result === "object" && "statusCode" in reply.result
          ? String((reply.result as { statusCode: unknown }).statusCode)
          : "ok";
      setLastCall(reply.error ? `${label} → ${reply.error}` : `${label} → ${code} · ${reply.durationMs.toFixed(0)} ms`);
    } catch (err) {
      setLastCall(`${label} → ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }, []);

  // Register the package with the service worker and (re)mount the iframe.
  useEffect(() => {
    if (!supported || !filesRef.current) return;
    let cancelled = false;
    setStatus("booting");
    setFatal(null);
    setLastCall(null);
    (async () => {
      try {
        const sessionId = await startSession(filesRef.current ?? new Map());
        if (cancelled) {
          releaseSession(sessionId);
          return;
        }
        if (sessionIdRef.current) releaseSession(sessionIdRef.current);
        sessionIdRef.current = sessionId;
        setIframeSrc(`/check-sandbox.html?session=${encodeURIComponent(sessionId)}&main=graphic.mjs`);
      } catch (err) {
        if (cancelled) return;
        setFatal(err instanceof Error ? err.message : String(err));
        setStatus("failed");
      }
    })();
    return () => {
      cancelled = true;
    };
    // files are read through a ref: a rebuild for a name edit must not reboot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebootKey, supported, files !== null]);

  useEffect(
    () => () => {
      harnessRef.current?.dispose();
      if (sessionIdRef.current) releaseSession(sessionIdRef.current);
    },
    [],
  );

  // Attach a harness to each new iframe, wait for the module, then load + play.
  useEffect(() => {
    if (!iframeSrc) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const harness = new Harness({ iframe, onEvent: () => undefined });
    harnessRef.current?.dispose();
    harnessRef.current = harness;
    let disposed = false;
    harness
      .waitReady()
      .then(async (res) => {
        if (disposed) return;
        if (res.error || !res.tag) {
          setFatal(res.error ?? t.failedTitle);
          setStatus("failed");
          return;
        }
        setStatus("ready");
        await call({ action: "load", data: dataRef.current }, "load");
        if (!disposed) await call({ action: "playAction", payload: {} }, "playAction");
      })
      .catch((err: unknown) => {
        if (disposed) return;
        setFatal(err instanceof Error ? err.message : String(err));
        setStatus("failed");
      });
    return () => {
      disposed = true;
      harness.dispose();
      if (harnessRef.current === harness) harnessRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeSrc]);

  // Live data: push edits as updateAction, debounced so typing does not flood it.
  const firstData = useRef(true);
  useEffect(() => {
    if (firstData.current) {
      firstData.current = false;
      return;
    }
    if (status !== "ready") return;
    const timer = setTimeout(() => {
      void call({ action: "updateAction", data: dataRef.current }, "updateAction");
    }, DATA_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Scale the 1080p stage into whatever width the column gives us.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => {
      if (el.clientWidth > 0) setScale(el.clientWidth / WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const controlsDisabled = status !== "ready" || busy;
  const bg = BACKGROUNDS[background];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {facts.map((f) => (
            <span key={f} className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600">
              {f}
            </span>
          ))}
        </div>
        {(status === "booting" || busy) && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
            {status === "booting" ? t.booting : t.running}
          </span>
        )}
      </div>

      <div
        ref={stageRef}
        className={`relative aspect-video overflow-hidden rounded-xl border border-slate-200 ${bg.className}`}
        style={bg.style}
      >
        {iframeSrc && supported ? (
          <iframe
            ref={iframeRef}
            key={iframeSrc}
            title={t.iframeTitle}
            src={iframeSrc}
            sandbox="allow-scripts allow-same-origin"
            style={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, transform: `scale(${scale})`, transformOrigin: "top left", border: 0 }}
            className="absolute left-0 top-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-slate-400">
            {supported ? t.preparing : t.unsupported}
          </div>
        )}
        <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-slate-500 mix-blend-difference">
          1920 × 1080 · {(scale * 100).toFixed(0)}%
        </div>
      </div>

      {fatal ? (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" strokeWidth={2} />
          <div>
            <p className="font-medium">{t.failedTitle}</p>
            <p className="mt-0.5 font-mono">{fatal}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <ControlButton icon={Play} label={t.controls.play} disabled={controlsDisabled} onClick={() => call({ action: "playAction", payload: {} }, "playAction")} />
            <ControlButton icon={Square} label={t.controls.stop} disabled={controlsDisabled} onClick={() => call({ action: "stopAction", payload: {} }, "stopAction")} />
            <ControlButton icon={RefreshCw} label={t.controls.update} disabled={controlsDisabled} onClick={() => call({ action: "updateAction", data: dataRef.current }, "updateAction")} />
            <ControlButton
              icon={Repeat}
              label={t.controls.replay}
              disabled={controlsDisabled}
              onClick={async () => {
                await call({ action: "stopAction", payload: { skipAnimation: true } }, "stopAction");
                await call({ action: "load", data: dataRef.current }, "load");
                await call({ action: "playAction", payload: {} }, "playAction");
              }}
            />
            {customActions.map((a) => (
              <ControlButton
                key={a.id}
                icon={Zap}
                label={a.id}
                disabled={controlsDisabled}
                onClick={() => call({ action: "customAction", payload: { id: a.id, payload: null } }, `customAction("${a.id}")`)}
              />
            ))}
          </div>
          <fieldset className="flex items-center gap-1 rounded-full bg-slate-100 p-0.5" aria-label={t.background.label}>
            {(["dark", "light", "checker"] as const).map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={background === b}
                onClick={() => setBackground(b)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${background === b ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                {t.background[b]}
              </button>
            ))}
          </fieldset>
        </div>
      )}

      {lastCall && (
        <p className="font-mono text-[11px] text-slate-400" aria-live="polite">
          {lastCall}
        </p>
      )}
    </div>
  );
}

interface ControlButtonProps {
  readonly icon: typeof Play;
  readonly label: string;
  readonly disabled: boolean;
  readonly onClick: () => void | Promise<void>;
}

function ControlButton({ icon: Icon, label, disabled, onClick }: ControlButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => void onClick()}
      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-mono text-xs font-medium text-slate-800 hover:bg-slate-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {label}
    </button>
  );
}
