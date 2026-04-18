import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { OGRAF_MANIFEST_SCHEMA } from "@ograf/validator";
import type { SchemaSource } from "./types";

export const LIVE_SCHEMA_URL =
  "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json";

export interface CompiledSchema {
  readonly validate: ValidateFunction;
  readonly source: SchemaSource;
}

let cached: CompiledSchema | null = null;

/**
 * Fetches the canonical EBU OGraf schema and all its $refs, compiles it
 * with Ajv, and caches the validator for the rest of the session.
 * Falls back to the bundled snapshot in @ograf/validator if the fetch
 * fails (CORS, offline, 404). Either way returns a working validator.
 */
export async function getSchemaValidator(): Promise<CompiledSchema> {
  if (cached) return cached;

  // Try the live schema first.
  try {
    const compiled = await compileLive();
    cached = compiled;
    return compiled;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
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
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    loadSchema: async (uri: string) => {
      const res = await fetch(uri, { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${uri}`);
      return (await res.json()) as Record<string, unknown>;
    },
  });
  addFormats(ajv);

  const res = await fetch(LIVE_SCHEMA_URL, { cache: "force-cache" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const schema = (await res.json()) as Record<string, unknown>;

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
  const ajv = new Ajv({ allErrors: true, strict: false });
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
