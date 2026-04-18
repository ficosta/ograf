import { OGRAF_MANIFEST_SCHEMA } from "@ograf/validator";
import type { SchemaSource } from "../check/types";
import { LIVE_SCHEMA_URL } from "../check/remote-schema";

/**
 * The raw JSON Schema as a permissive object — we don't need a typed view
 * because the Schema Explorer only reads `.properties`, `.required`, and a
 * few other well-known keys, all of which we narrow at the call site.
 */
export type RawSchema = Record<string, unknown>;

export interface LoadedSchema {
  readonly schema: RawSchema;
  readonly source: SchemaSource;
}

const FETCH_TIMEOUT_MS = 4000;

let cached: LoadedSchema | null = null;

/**
 * Fetches the canonical EBU OGraf schema (the raw JSON Schema document, not a
 * compiled validator) for the Schema Explorer page. Falls back to the bundled
 * snapshot in @ograf/validator if the network is slow, offline, or CORS-blocked.
 *
 * Mirrors the strategy used by lib/check/remote-schema.ts so the Explorer and
 * the Package Checker never disagree about which schema is "current".
 */
export async function loadManifestSchema(): Promise<LoadedSchema> {
  if (cached) return cached;
  try {
    cached = await fetchLive();
    return cached;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.info(`[schema-explorer] using bundled snapshot: ${reason}`);
    cached = bundled(`Live schema unreachable (${reason}); using bundled snapshot.`);
    return cached;
  }
}

async function fetchLive(): Promise<LoadedSchema> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(LIVE_SCHEMA_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching live schema`);
    const schema = (await res.json()) as RawSchema;
    return {
      schema,
      source: {
        kind: "live",
        url: LIVE_SCHEMA_URL,
        fetchedAt: new Date().toISOString(),
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

function bundled(note: string): LoadedSchema {
  return {
    schema: OGRAF_MANIFEST_SCHEMA as RawSchema,
    source: {
      kind: "bundled",
      url: "@ograf/validator (bundled snapshot)",
      fetchedAt: new Date().toISOString(),
      note,
    },
  };
}
