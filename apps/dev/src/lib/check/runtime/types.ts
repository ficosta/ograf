/** Parent → iframe requests. */
export type HarnessRequest =
  | { readonly id: string; readonly action: "load"; readonly data?: unknown }
  | { readonly id: string; readonly action: "playAction"; readonly payload?: unknown }
  | { readonly id: string; readonly action: "updateAction"; readonly data?: unknown }
  | { readonly id: string; readonly action: "stopAction"; readonly payload?: unknown }
  | {
      readonly id: string;
      readonly action: "customAction";
      readonly payload: { readonly action: string; readonly data?: unknown };
    }
  | { readonly id: string; readonly action: "dispose" };

/** Iframe → parent events. */
export type HarnessEvent =
  | { readonly type: "ready"; readonly tag: string | null; readonly error?: string }
  | {
      readonly type: "console";
      readonly level: "log" | "warn" | "error" | "info" | "debug";
      readonly args: readonly string[];
      readonly ts: number;
    }
  | {
      readonly type: "error";
      readonly message: string;
      readonly stack?: string;
      readonly source: "window" | "promise";
    }
  | {
      readonly type: "reply";
      readonly id: string;
      readonly result?: unknown;
      readonly error?: string;
      readonly durationMs: number;
    };

export interface RuntimeCall {
  readonly action: HarnessRequest["action"];
  readonly label: string;
  readonly startedAt: number;
  readonly durationMs: number;
  readonly result?: unknown;
  readonly error?: string;
  readonly payloadPreview?: string;
}

export interface ConsoleLine {
  readonly id: string;
  readonly level: "log" | "warn" | "error" | "info" | "debug";
  readonly args: readonly string[];
  readonly ts: number;
}

export interface RuntimeError {
  readonly id: string;
  readonly message: string;
  readonly stack?: string;
  readonly source: "window" | "promise";
  readonly ts: number;
}

export interface RuntimeSession {
  readonly calls: readonly RuntimeCall[];
  readonly consoleLines: readonly ConsoleLine[];
  readonly errors: readonly RuntimeError[];
  readonly status: "idle" | "ready" | "running" | "done" | "failed";
  readonly tag: string | null;
  readonly failureReason?: string;
}
