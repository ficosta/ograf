/**
 * Server entry used only at build time, by scripts/prerender.mjs.
 *
 * The site is a client-rendered SPA, which meant every URL served the same
 * shell: the homepage title, the homepage description, and — worst — a
 * canonical pointing at the homepage on all 21 routes. Social scrapers and AI
 * crawlers do not execute JavaScript, so a shared link to /tutorials showed the
 * homepage card, and an AI crawler saw 590 bytes of nothing.
 *
 * Rendering each route to static HTML at build time fixes both. The client
 * still hydrates and takes over; this only changes what arrives before it does.
 *
 * Excluded from the app tsconfig: this is the one file that runs in Node, and
 * pulling @types/node into a browser app to satisfy it would be the wrong
 * trade. Vite compiles it separately for the SSR build.
 *
 * Most pages are React.lazy, and renderToString cannot resolve Suspense — it
 * would emit the fallback and nothing else. renderToPipeableStream with
 * onAllReady waits for every boundary to settle, so the HTML carries the real
 * page.
 */

import { StaticRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { StrictMode } from "react";
import { Writable } from "node:stream";
import { App } from "./App";

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
    });
    sink.on("finish", () => resolve(Buffer.concat(chunks).toString("utf8")));

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          pipe(sink);
        },
        onError(error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        },
      },
    );

    // A route that never settles must not hang the whole build.
    setTimeout(() => {
      abort();
      reject(new Error(`prerender timed out for ${url}`));
    }, 20_000).unref?.();
  });
}
