import type { HarnessEvent, HarnessRequest } from "./types";

const CALL_TIMEOUT_MS = 10_000;
const READY_TIMEOUT_MS = 10_000;

type ReplyEvent = Extract<HarnessEvent, { type: "reply" }>;

export interface HarnessOptions {
  readonly iframe: HTMLIFrameElement;
  readonly onEvent: (event: HarnessEvent) => void;
}

export class Harness {
  private readonly iframe: HTMLIFrameElement;
  private readonly onEvent: (event: HarnessEvent) => void;
  private readonly pending = new Map<string, (reply: ReplyEvent) => void>();
  private disposed = false;
  private readonly handleMessage = (event: MessageEvent) => this.onMessage(event);

  constructor(opts: HarnessOptions) {
    this.iframe = opts.iframe;
    this.onEvent = opts.onEvent;
    window.addEventListener("message", this.handleMessage);
  }

  /** Waits until the sandboxed iframe has imported graphic.mjs and mounted it. */
  waitReady(): Promise<{ tag: string | null; error?: string }> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("sandbox did not become ready")), READY_TIMEOUT_MS);
      const listener = (event: MessageEvent) => {
        if (event.source !== this.iframe.contentWindow) return;
        const data = event.data as HarnessEvent;
        if (data?.type === "ready") {
          clearTimeout(timer);
          window.removeEventListener("message", listener);
          resolve({ tag: data.tag, error: data.error });
        }
      };
      window.addEventListener("message", listener);
    });
  }

  /** Sends a lifecycle request to the iframe and awaits its reply. */
  call(req: Omit<HarnessRequest, "id">): Promise<ReplyEvent> {
    if (this.disposed) return Promise.reject(new Error("harness disposed"));
    const id = cryptoRandomId();
    const payload = { ...req, id } as HarnessRequest;

    return new Promise<ReplyEvent>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${req.action} timed out after ${CALL_TIMEOUT_MS} ms`));
      }, CALL_TIMEOUT_MS);

      this.pending.set(id, (reply) => {
        clearTimeout(timer);
        resolve(reply);
      });

      this.iframe.contentWindow?.postMessage(payload, location.origin);
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener("message", this.handleMessage);
    this.pending.clear();
  }

  private onMessage(event: MessageEvent): void {
    if (event.source !== this.iframe.contentWindow) return;
    const data = event.data as HarnessEvent;
    if (!data || typeof data !== "object" || !("type" in data)) return;

    if (data.type === "reply") {
      const resolver = this.pending.get(data.id);
      if (resolver) {
        this.pending.delete(data.id);
        resolver(data);
      }
      return;
    }
    this.onEvent(data);
  }
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
