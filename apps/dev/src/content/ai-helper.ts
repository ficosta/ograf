/**
 * Content for the "AI helper" section of the Schema Explorer.
 *
 * The prompt below is curated to give an LLM enough OGraf context to:
 *   - validate a manifest a designer pastes in
 *   - compose a manifest from a plain-English description
 *   - explain individual fields or gddTypes in beginner-friendly language
 *
 * Keep the prompt in sync with the canonical schema. If EBU adds a new
 * top-level field or gddType, mention it here too.
 */

export interface AiPlatform {
  /** Product name; also the key of its note in the Schema Explorer copy. */
  readonly name: "ChatGPT" | "Claude" | "Gemini" | "Perplexity";
  readonly url: string;
  /** Lucide icon name resolved by the page. */
  readonly icon: "MessageSquare" | "Sparkles" | "Zap" | "Search";
}

/** Platform notes and tips are UI text: see i18n/copy/schema-explorer. */
export const AI_PLATFORMS: readonly AiPlatform[] = [
  { name: "ChatGPT", url: "https://chat.openai.com", icon: "Sparkles" },
  { name: "Claude", url: "https://claude.ai", icon: "MessageSquare" },
  { name: "Gemini", url: "https://gemini.google.com", icon: "Zap" },
  { name: "Perplexity", url: "https://perplexity.ai", icon: "Search" },
];

/**
 * The prompt stays in English in every locale: it is instructions for a
 * model and quotes the English schema verbatim.
 */
export const AI_PROMPT = `You are an OGraf manifest expert helping a broadcast designer create or debug an .ograf.json manifest.

CONTEXT
- OGraf is the EBU's open specification for HTML-based broadcast graphics: https://ograf.ebu.io
- Canonical JSON Schema (root): https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json
- Sub-schemas live under /lib (action.json, constraints/{boolean,number}.json) and /gdd (object.json, basic-types.json, gdd-types.json)
- A manifest is plain JSON.

REQUIRED top-level fields
  $schema, id, name, main, supportsRealTime, supportsNonRealTime

OPTIONAL top-level fields
  version, description, stepCount, author, customActions, schema, renderRequirements, thumbnails

CONSTRAINTS (often missed)
- additionalProperties: false at every level. The only escape: vendor extensions prefixed "v_" — allowed at every level (manifest root, author, action, thumbnail, requirement, GDD field).
- stepCount is a NUMBER with minimum -1 and default 1. Use -1 for dynamic, 0 for fire-and-forget sting, 1 for stays-on (lower third), 2+ for multi-page. (Do NOT use the string "dynamic".)
- thumbnails use { "file": "...", "resolution": { "width": N, "height": N } } — NOT { "src", "width", "height" } flat.
- renderRequirements is an ARRAY of requirement objects (any-of). Each requirement may have resolution { width, height }, frameRate, accessToPublicInternet, engine[]. Constraints use the shape { min?, max?, exact?, ideal? } (number) or { exact?, ideal? } (boolean).
- customActions[].schema can be null when the action takes no parameters.

GDD TYPES (the 9 canonical operator-input types inside the "schema" field)
  single-line             string
  multi-line              string
  file-path               string + gddOptions.extensions[]
  file-path/image-path    string + gddOptions.extensions[]
  select                  string|number|integer + enum[] + gddOptions.labels{}
  color-rrggbb            string · pattern ^#[0-9a-f]{6}$
  color-rrggbbaa          string · pattern ^#[0-9a-f]{8}$
  percentage              number
  duration-ms             integer

Every GDD field can also carry:
  hidden: boolean   (skip in display label)
  order: number     (UI sort hint, lower first)

HOW TO HELP ME
1. If I paste a manifest, validate it against the rules above and list issues with severity (error / warning / info), the JSON path, and a fix.
2. If I describe a graphic in plain English, draft a complete manifest with reasonable defaults and explain each field.
3. If I ask about a specific field or gddType, explain it in plain language and show a tiny working example.
4. Don't invent fields. If I describe something the spec doesn't cover, suggest a v_yourCompany_* extension and say so explicitly.
5. After every answer, remind me to run the Package Checker at https://ograf.dev/check (or the embedded validator) before shipping.

Now wait for me to share the manifest or describe what I want to build.`;
