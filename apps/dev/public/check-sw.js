// @ts-check
/**
 * OGraf Package Checker — runtime sandbox service worker.
 *
 * Intercepts requests to /check/sandbox/<sessionId>/<filePath> and
 * serves them from an in-memory map registered via postMessage by the
 * /check page. This turns an unpacked zip into a real origin so that
 *   - dynamic `import("...graphic.mjs")`
 *   - `new URL('./style.css', import.meta.url).href`
 *   - `<link rel="stylesheet" href="./...">` inside graphic.mjs
 * all resolve the same way they would on a real playout server.
 *
 * Sessions are kept per-tab in the worker's memory, with a 15-minute
 * idle TTL. The client calls { type: "release", sessionId } on reset
 * or navigation.
 */

const SESSIONS = new Map();
const TTL_MS = 15 * 60 * 1000;

const MIME = {
  mjs: "text/javascript",
  js: "text/javascript",
  cjs: "text/javascript",
  css: "text/css",
  json: "application/json",
  html: "text/html",
  htm: "text/html",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  woff2: "font/woff2",
  woff: "font/woff",
  ttf: "font/ttf",
  otf: "font/otf",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  mp4: "video/mp4",
  webm: "video/webm",
  txt: "text/plain",
  md: "text/markdown",
  xml: "application/xml",
};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "register" && typeof msg.sessionId === "string" && msg.files instanceof Map) {
    SESSIONS.set(msg.sessionId, { files: msg.files, lastSeen: Date.now() });
    event.ports[0]?.postMessage({ ok: true });
  } else if (msg.type === "release" && typeof msg.sessionId === "string") {
    SESSIONS.delete(msg.sessionId);
  } else if (msg.type === "ping") {
    event.ports[0]?.postMessage({ ok: true, sessions: SESSIONS.size });
  }
  sweep();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const match = url.pathname.match(/^\/check\/sandbox\/([^/]+)\/(.+)$/);
  if (!match) return; // let the network handle it

  const [, sessionId, encodedPath] = match;
  const session = SESSIONS.get(sessionId);
  if (!session) {
    event.respondWith(new Response("session not found", { status: 404 }));
    return;
  }
  session.lastSeen = Date.now();
  const path = decodeURIComponent(encodedPath);
  const bytes = session.files.get(path);
  if (!bytes) {
    event.respondWith(
      new Response(`not found: ${path}`, { status: 404, headers: { "content-type": "text/plain" } })
    );
    return;
  }
  const dot = path.lastIndexOf(".");
  const ext = dot >= 0 ? path.slice(dot + 1).toLowerCase() : "";
  const contentType = MIME[ext] ?? "application/octet-stream";
  event.respondWith(
    new Response(bytes, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
      },
    })
  );
});

function sweep() {
  const now = Date.now();
  for (const [id, s] of SESSIONS) {
    if (now - s.lastSeen > TTL_MS) SESSIONS.delete(id);
  }
}
