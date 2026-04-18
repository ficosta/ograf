import Ajv2020 from "ajv/dist/2020";
import AjvDraft07 from "ajv";
import type { ErrorObject, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { OGRAF_MANIFEST_SCHEMA } from "@ograf/validator";
import type { SchemaSource } from "./types";

export const LIVE_SCHEMA_URL =
  "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json";

const FETCH_TIMEOUT_MS = 4000;
const TOTAL_TIMEOUT_MS = 8000;

export interface CompiledSchema {
  readonly validate: ValidateFunction;
  readonly source: SchemaSource;
}

let cached: CompiledSchema | null = null;

/**
 * Fetches the canonical EBU OGraf schema and all its $refs, compiles it
 * with Ajv, and caches the validator for the rest of the session.
 * Falls back to the bundled snapshot in @ograf/validator if the fetch
 * fails or hangs (CORS, offline, slow network). Either way returns a
 * working validator within ~8 seconds.
 */
export async function getSchemaValidator(): Promise<CompiledSchema> {
  if (cached) return cached;

  try {
    const compiled = await withTimeout(compileLive(), TOTAL_TIMEOUT_MS, "live-schema compile");
    cached = compiled;
    return compiled;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    // Surface it once in the console so developers can tell why fallback kicked in.
    // eslint-disable-next-line no-console
    console.info(`[check] falling back to bundled schema: ${reason}`);
    cached = compileBundled(`Live schema unreachable (${reason}); used bundled snapshot.`);
    return cached;
  }
}

/** Error-object shape accepted by the rest of the checker. */
export interface SchemaError {
  readonly path: string;
  readonly message: string;
  readonly keyword?: string;
  readonly params?: Record<string, unknown>;
}

export function normaliseErrors(errors: readonly ErrorObject[] | null | undefined): SchemaError[] {
  if (!errors) return [];
  return errors.map((e) => ({
    path: e.instancePath || "/",
    message: e.message ?? "Schema validation error",
    keyword: e.keyword,
    params: e.params as Record<string, unknown> | undefined,
  }));
}

async function compileLive(): Promise<CompiledSchema> {
  // The live EBU schema declares $schema: draft/2020-12 — use the 2020 Ajv variant.
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    loadSchema: (uri: string) => fetchJson(uri),
  });
  addFormats(ajv);

  const schema = await fetchJson(LIVE_SCHEMA_URL);

  // compileAsync resolves $refs by calling loadSchema; wrap it too so a stuck
  // sub-request cannot hang the promise.
  const validate = await ajv.compileAsync(schema);

  return {
    validate,
    source: {
      kind: "live",
      url: LIVE_SCHEMA_URL,
      fetchedAt: new Date().toISOString(),
    },
  };
}

function compileBundled(note: string): CompiledSchema {
  // Bundled snapshot is draft-07.
  const ajv = new AjvDraft07({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(OGRAF_MANIFEST_SCHEMA as object);
  return {
    validate,
    source: {
      kind: "bundled",
      url: "@ograf/validator (bundled snapshot)",
      fetchedAt: new Date().toISOString(),
      note,
    },
  };
}

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    return (await res.json()) as Record<string, unknown>;
  } finally {
    clearTimeout(timer);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise
      .then((v) => { clearTimeout(timer); resolve(v); })
      .catch((e) => { clearTimeout(timer); reject(e); });
  });
}
