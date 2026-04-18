/**
 * Lazy registration of /check-sw.js. Registered on first demand (the
 * user clicking "Run in sandbox") so we don't pay the cost for users
 * who only ever use static checks.
 */

let registration: ServiceWorkerRegistration | null = null;

export async function ensureRuntimeWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser.");
  }

  if (registration?.active) return registration;

  registration = await navigator.serviceWorker.register("/check-sw.js", {
    scope: "/",
  });

  // Wait for an active worker controlling this page.
  if (!navigator.serviceWorker.controller) {
    await new Promise<void>((resolve) => {
      const onReady = () => {
        if (navigator.serviceWorker.controller) resolve();
      };
      navigator.serviceWorker.addEventListener("controllerchange", onReady, { once: true });
      // In case it is already active by the time we subscribe.
      navigator.serviceWorker.ready.then(onReady);
    });
  }

  return registration;
}

export function runtimeWorkerAvailable(): boolean {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator;
}
