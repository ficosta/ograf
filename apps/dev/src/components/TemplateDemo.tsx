import { useRef, useState, useCallback, useMemo } from "react";
import { Play, Square, RefreshCw, Plus, X, Repeat, SkipForward, AlertCircle } from "lucide-react";

type Field =
  | {
      readonly key: string;
      readonly label: string;
      readonly type?: "text";
      readonly defaultValue: string;
    }
  | {
      readonly key: string;
      readonly label: string;
      readonly type: "list";
      readonly defaultValue: readonly string[];
    }
  | {
      readonly key: string;
      readonly label: string;
      readonly type: "json";
      readonly defaultValue: unknown;
    };

type FieldValue = string | string[] | unknown;

type PlayMode = "once" | "loop";

interface TemplateDemoProps {
  readonly src: string;
  readonly fields: readonly Field[];
  readonly title: string;
  readonly showPlayMode?: boolean;
  readonly defaultPlayMode?: PlayMode;
  readonly defaultData?: Record<string, unknown>;
}

function isListField(f: Field): f is Extract<Field, { type: "list" }> {
  return f.type === "list";
}

function isJsonField(f: Field): f is Extract<Field, { type: "json" }> {
  return f.type === "json";
}

function initialValue(field: Field): FieldValue {
  if (isListField(field)) return [...field.defaultValue];
  if (isJsonField(field)) return JSON.stringify(field.defaultValue, null, 2);
  return field.defaultValue;
}

export function TemplateDemo({
  src,
  fields,
  title,
  showPlayMode = false,
  defaultPlayMode = "loop",
  defaultData,
}: TemplateDemoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>(defaultPlayMode);
  const [values, setValues] = useState<Record<string, FieldValue>>(
    Object.fromEntries(fields.map((f) => [f.key, initialValue(f)])),
  );

  const jsonErrors = useMemo(() => {
    const errors: Record<string, string | null> = {};
    for (const field of fields) {
      if (!isJsonField(field)) continue;
      const raw = values[field.key];
      if (typeof raw !== "string") continue;
      if (raw.trim() === "") {
        errors[field.key] = null;
        continue;
      }
      try {
        JSON.parse(raw);
        errors[field.key] = null;
      } catch (err) {
        errors[field.key] = err instanceof Error ? err.message : "Invalid JSON";
      }
    }
    return errors;
  }, [fields, values]);

  const hasJsonError = Object.values(jsonErrors).some((e) => e !== null);

  const buildPayload = useCallback(
    (currentValues: Record<string, FieldValue>, currentMode: PlayMode) => {
      const resolved: Record<string, unknown> = { ...(defaultData ?? {}) };
      for (const field of fields) {
        const val = currentValues[field.key];
        if (isJsonField(field) && typeof val === "string") {
          try { resolved[field.key] = JSON.parse(val); } catch { /* keep string */ }
        } else {
          resolved[field.key] = val;
        }
      }
      resolved.loop = currentMode === "loop";
      return resolved;
    },
    [defaultData, fields],
  );

  const send = useCallback((action: string, data?: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage({ action, data }, "*");
  }, []);

  const handlePlay = () => {
    if (!isPlaying && !hasJsonError) {
      const payload = buildPayload(values, playMode);
      send("load", payload);
      setTimeout(() => send("play"), 100);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    send("stop");
    setIsPlaying(false);
  };

  const handleUpdate = () => {
    if (hasJsonError) return;
    send("update", buildPayload(values, playMode));
  };

  const updateText = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const updateListItem = (key: string, index: number, value: string) =>
    setValues((prev) => {
      const current = (prev[key] as string[]) ?? [];
      const next = [...current];
      next[index] = value;
      return { ...prev, [key]: next };
    });

  const addListItem = (key: string) =>
    setValues((prev) => {
      const current = (prev[key] as string[]) ?? [];
      return { ...prev, [key]: [...current, ""] };
    });

  const removeListItem = (key: string, index: number) =>
    setValues((prev) => {
      const current = (prev[key] as string[]) ?? [];
      if (current.length <= 1) return prev;
      return { ...prev, [key]: current.filter((_, i) => i !== index) };
    });

  return (
    <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden shadow-xl shadow-slate-900/10">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-3 left-4 flex items-center gap-1.5 z-10">
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="text-[10px] font-mono text-white/30">{title}</span>
        </div>
        <div className="absolute top-3 right-4 flex items-center gap-2 z-10">
          <span className="text-[10px] font-mono text-white/30">1920 x 1080</span>
          <div
            className={`h-2 w-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`}
          />
        </div>
        <div className="relative w-full aspect-video">
          {!iframeLoaded && (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-slate-900"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                <span className="text-xs font-mono text-white/40">Loading preview…</span>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={src}
            onLoad={() => setIframeLoaded(true)}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title={title}
            aria-label={`${title} — interactive preview`}
            role="region"
          />
        </div>
      </div>

      <div className="bg-white p-4 border-t border-slate-200">
        <div className="grid gap-4">
          {fields.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map((field) => {
                if (isListField(field)) {
                  const list = (values[field.key] as string[]) ?? [];
                  return (
                    <div key={field.key} className="sm:col-span-2">
                      <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>
                          {field.label}
                          <span className="ml-1.5 rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] font-normal text-slate-500">
                            array
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {list.length} {list.length === 1 ? "item" : "items"}
                        </span>
                      </label>
                      <div className="space-y-1.5">
                        {list.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-5 flex-none text-right font-mono text-[10px] text-slate-400">
                              {i + 1}
                            </span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateListItem(field.key, i, e.target.value)}
                              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeListItem(field.key, i)}
                              disabled={list.length <= 1}
                              aria-label={`Remove item ${i + 1}`}
                              className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addListItem(field.key)}
                          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          <Plus className="h-3 w-3" /> Add item
                        </button>
                      </div>
                    </div>
                  );
                }
                if (isJsonField(field)) {
                  const error = jsonErrors[field.key];
                  return (
                    <div key={field.key} className="sm:col-span-2">
                      <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>
                          {field.label}
                          <span className="ml-1.5 rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] font-normal text-slate-500">
                            JSON
                          </span>
                        </span>
                        {error && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600">
                            <AlertCircle className="h-3 w-3" /> Invalid JSON
                          </span>
                        )}
                      </label>
                      <textarea
                        value={(values[field.key] as string) ?? ""}
                        onChange={(e) => updateText(field.key, e.target.value)}
                        rows={Math.min(12, ((values[field.key] as string) ?? "").split("\n").length + 1)}
                        aria-invalid={error ? true : undefined}
                        className={`w-full rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-transparent focus:outline-none focus:ring-2 resize-y ${
                          error
                            ? "border-rose-300 focus:ring-rose-500"
                            : "border-slate-200 focus:ring-blue-500"
                        }`}
                      />
                      {error && (
                        <p className="mt-1 text-[11px] text-rose-600 font-mono">{error}</p>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={(values[field.key] as string) ?? ""}
                      onChange={(e) => updateText(field.key, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            {showPlayMode ? (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Play mode</label>
                <div
                  role="radiogroup"
                  aria-label="Play mode"
                  className="inline-flex rounded-lg bg-slate-100 p-0.5"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={playMode === "once"}
                    onClick={() => setPlayMode("once")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      playMode === "once"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <SkipForward className="h-3 w-3" /> Run once
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={playMode === "loop"}
                    onClick={() => setPlayMode("loop")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      playMode === "loop"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Repeat className="h-3 w-3" /> Loop
                  </button>
                </div>
              </div>
            ) : (
              <div />
            )}
            <div className="flex items-end gap-2">
              <button
                onClick={handlePlay}
                disabled={isPlaying || hasJsonError}
                title={hasJsonError ? "Fix the JSON field before playing" : undefined}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 active:scale-[0.97] active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed transition-[colors,transform]"
              >
                <Play className="h-3.5 w-3.5" /> Play
              </button>
              <button
                onClick={handleUpdate}
                disabled={!isPlaying || hasJsonError}
                title={hasJsonError ? "Fix the JSON field before updating" : undefined}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 active:scale-[0.97] active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed transition-[colors,transform]"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Update
              </button>
              <button
                onClick={handleStop}
                disabled={!isPlaying}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 active:scale-[0.97] active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed transition-[colors,transform]"
              >
                <Square className="h-3.5 w-3.5" /> Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
