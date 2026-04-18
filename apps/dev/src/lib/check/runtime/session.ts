import { ensureRuntimeWorker } from "./service-worker";

/**
 * Registers a session with the check-sw.js service worker. The worker keeps
 * the bytes in its own memory (Map<sessionId, Map<path, Uint8Array>>) and
 * serves them under /check/sandbox/<sessionId>/<path> until we release.
 */
export async function startSession(files: ReadonlyMap<string, Uint8Array>): Promise<string> {
  await ensureRuntimeWorker();
  const controller = navigator.serviceWorker.controller;
  if (!controller) throw new Error("service worker is not controlling this page yet");

  const sessionId = cryptoRandomId();
  const filesClone = new Map<string, Uint8Array>();
  for (const [path, bytes] of files) filesClone.set(path, bytes);

  await new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error("service worker did not acknowledge register")), 3000);
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      if (e.data?.ok) resolve();
      else reject(new Error("service worker rejected register"));
    };
    controller.postMessage(
      { type: "register", sessionId, files: filesClone },
      [channel.port2]
    );
  });

  return sessionId;
}

export function releaseSession(sessionId: string): void {
  navigator.serviceWorker?.controller?.postMessage({ type: "release", sessionId });
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
