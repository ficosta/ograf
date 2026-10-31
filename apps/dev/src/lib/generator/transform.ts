import { darkShade, hexToRgbTriple, lightShade, normalizeHex } from "./color";
import { kebab } from "./defaults";
import { fontChoice, fontFamilyValue } from "./fonts";
import { presetDef } from "./presets";
import type {
  GeneratedFile,
  GeneratedPackage,
  GeneratorConfig,
  ManifestJson,
  PresetDef,
  PresetSources,
} from "./types";

/**
 * The pure transform: base template + configuration → package files.
 *
 * Nothing here touches the DOM or the network, so the node self-test can run
 * it over every preset and hand the result to the Package Checker.
 */

export interface BuildInput {
  readonly sources: PresetSources;
  readonly config: GeneratorConfig;
  /** Files of the chosen body font (path → bytes), from loadFontFiles(). */
  readonly fontFiles: ReadonlyMap<string, Uint8Array>;
  /** Injected so the self-test output is reproducible. */
  readonly generatedAt?: Date;
}

const encoder = new TextEncoder();

function textFile(path: string, text: string): GeneratedFile {
  return { path, bytes: encoder.encode(text), text };
}

export function packageSlug(config: GeneratorConfig): string {
  return kebab(config.name) || config.preset;
}

export function buildPackage({ sources, config, fontFiles, generatedAt = new Date() }: BuildInput): GeneratedPackage {
  const def = presetDef(config.preset);
  const slug = packageSlug(config);
  const manifestPath = `${slug}.ograf.json`;
  const manifest = buildManifest(sources.manifest, config);

  const fonts = new Map<string, Uint8Array>();
  for (const [path, bytes] of sources.fonts) fonts.set(path, bytes);
  for (const [path, bytes] of fontFiles) fonts.set(path, bytes);

  const files: GeneratedFile[] = [
    textFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`),
    textFile("graphic.mjs", transformModule(sources.module, config, slug, generatedAt)),
    textFile("style.css", transformCss(sources.css, def, config)),
    { path: "thumbnail.webp", bytes: sources.thumbnail },
    textFile("README.md", renderReadme(def, config, manifest, manifestPath, fonts.size > 0)),
    textFile("LICENSE", sources.license),
    ...[...fonts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([path, bytes]) => ({ path, bytes })),
  ];

  return { slug, manifestPath, manifest, files };
}

/** The package as the sandbox service worker wants it: path → bytes, no root folder. */
export function packageFileMap(pkg: GeneratedPackage): ReadonlyMap<string, Uint8Array> {
  return new Map(pkg.files.map((f) => [f.path, f.bytes] as const));
}

// --- manifest ---------------------------------------------------------------

export function buildManifest(base: ManifestJson, config: GeneratorConfig): ManifestJson {
  const description = config.description.trim();
  const authorName = config.authorName.trim();
  const authorUrl = config.authorUrl.trim();
  const author = authorName ? { name: authorName, ...(authorUrl ? { url: authorUrl } : {}) } : undefined;

  const out: Record<string, unknown> = {};
  let placedDescription = false;
  let placedAuthor = false;

  for (const [key, value] of Object.entries(base)) {
    switch (key) {
      case "id":
        out.id = config.id.trim();
        break;
      case "version":
        out.version = config.version.trim();
        break;
      case "name":
        out.name = config.name.trim();
        break;
      case "description":
        placedDescription = true;
        if (description) out.description = description;
        break;
      case "author":
        placedAuthor = true;
        if (author) out.author = author;
        break;
      case "schema":
        out.schema = withDefaults(value, config.data);
        break;
      default:
        out[key] = value;
    }
  }
  if (!placedDescription && description) out.description = description;
  if (!placedAuthor && author) out.author = author;
  return out;
}

/** A copy of the GDD schema with `default` rewritten from the configured data. */
function withDefaults(schema: unknown, data: Readonly<Record<string, unknown>>): unknown {
  if (!schema || typeof schema !== "object") return schema;
  const s = schema as Record<string, unknown>;
  const props = s.properties;
  if (!props || typeof props !== "object") return schema;
  const nextProps: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(props as Record<string, unknown>)) {
    if (!(key in data) || !def || typeof def !== "object") {
      nextProps[key] = def;
      continue;
    }
    const value = data[key];
    const { default: _old, ...rest } = def as Record<string, unknown>;
    nextProps[key] = value === undefined ? rest : { ...rest, default: value };
  }
  return { ...s, properties: nextProps };
}

// --- stylesheet -------------------------------------------------------------

const INTER_FACE_BLOCK = /@font-face\s*\{[^}]*?font-family:\s*'Inter'[^}]*\}\n*/g;
const INTER_FAMILY_DECL = /font-family:\s*'Inter'\s*(?:,[^;]*)?;/g;
const FACE_PLACEHOLDER = "/*__OG_FONT_FACE__*/";

export function transformCss(css: string, def: PresetDef, config: GeneratorConfig): string {
  const tokens: string[] = [];
  let out = css;

  for (const knob of def.colors) {
    const value = normalizeHex(config.colors[knob.id] ?? knob.default);
    const changed = value !== knob.default;
    const name = `--og-${knob.id}`;
    tokens.push(`${name}: ${value};`);

    for (const literal of knob.literals) out = replaceRequired(out, literal, `var(${name})`);

    if (knob.rgbaPrefixes?.length) {
      tokens.push(`${name}-rgb: ${hexToRgbTriple(value)};`);
      for (const prefix of knob.rgbaPrefixes) out = replaceRequired(out, prefix, `rgba(var(${name}-rgb),`);
    }
    if (knob.shades?.dark) {
      tokens.push(`${name}-dark: ${changed ? darkShade(value) : knob.shades.dark};`);
      out = replaceRequired(out, knob.shades.dark, `var(${name}-dark)`);
    }
    if (knob.shades?.light) {
      tokens.push(`${name}-light: ${changed ? lightShade(value) : knob.shades.light};`);
      out = replaceRequired(out, knob.shades.light, `var(${name}-light)`);
    }
    for (const decl of knob.declarations ?? []) out = replaceRequired(out, decl.from, decl.to);
  }

  // Body font: the Inter @font-face gives way to the chosen face, every
  // `font-family: 'Inter', …` reads the token, and generic fallbacks stay so a
  // missing font file degrades instead of disappearing.
  const choice = fontChoice(config.font);
  tokens.push(`--og-font: ${fontFamilyValue(choice)};`);
  let placed = false;
  out = out.replace(INTER_FACE_BLOCK, () => {
    if (placed) return "";
    placed = true;
    return `${FACE_PLACEHOLDER}\n`;
  });
  if (!placed) throw new Error(`${def.slug}: no Inter @font-face block to replace`);
  const alreadyDeclared = choice.family !== null && out.includes(`font-family: '${choice.family}'`);
  out = out.replace(`${FACE_PLACEHOLDER}\n`, alreadyDeclared || !choice.faceCss ? "" : `${choice.faceCss}\n`);
  if (!INTER_FAMILY_DECL.test(out)) throw new Error(`${def.slug}: no font-family: 'Inter' declaration`);
  out = out.replace(INTER_FAMILY_DECL, "font-family: var(--og-font), system-ui, sans-serif;");

  for (const knob of def.offsets) {
    const value = config.offsets[knob.id] ?? knob.default;
    const name = knob.id === "offsetX" ? "--og-offset-x" : "--og-offset-y";
    tokens.push(`${name}: ${value}px;`);
    for (const prop of knob.props) {
      out = replaceInRule(out, knob.selector, prop, `${knob.default}px`, `var(${name})`);
    }
  }

  const header =
    `/* Theme tokens — generated by the ograf.dev Template Generator from the "${def.slug}" preset.\n` +
    ` * Change these to re-skin the graphic; the rules below read them. */\n` +
    `${def.rootSelector} {\n  ${tokens.join("\n  ")}\n}\n\n`;

  return header + out;
}

function replaceRequired(haystack: string, from: string, to: string): string {
  if (!haystack.includes(from)) throw new Error(`expected "${from}" in the base stylesheet`);
  return haystack.split(from).join(to);
}

/** Swap one declaration inside the rule for `selector` (the one that starts a line). */
function replaceInRule(css: string, selector: string, prop: string, from: string, to: string): string {
  const open = css.indexOf(`\n${selector} {`);
  if (open === -1) throw new Error(`rule "${selector}" not found in the base stylesheet`);
  const close = css.indexOf("}", open);
  const block = css.slice(open, close);
  const decl = `${prop}: ${from};`;
  if (!block.includes(decl)) throw new Error(`"${decl}" not found in rule "${selector}"`);
  return css.slice(0, open) + block.replace(decl, `${prop}: ${to};`) + css.slice(close);
}

// --- module -----------------------------------------------------------------

const DEFAULT_CLASS = /export default class (\w+) extends HTMLElement/;

export function transformModule(source: string, config: GeneratorConfig, slug: string, generatedAt: Date): string {
  const name = commentSafe(config.name.trim());
  const banner =
    `/**\n` +
    ` * ${name} — generated by the ograf.dev Template Generator from the "${config.preset}" preset.\n` +
    ` * Package id: ${commentSafe(config.id.trim())} · ${generatedAt.toISOString().slice(0, 10)}\n` +
    ` *\n` +
    ` * Colours, font and position are CSS custom properties at the top of style.css;\n` +
    ` * edit those first. The lifecycle code below needs no changes to re-skin.\n` +
    ` */\n\n`;

  const match = DEFAULT_CLASS.exec(source);
  if (!match) return banner + source;
  const oldName = match[1];
  const newName = pascal(slug).replace(/Graphic$/, "") + "Graphic";
  // Only rename when the identifier occurs exactly once: a class that is
  // referenced elsewhere (or a name that is also a word in a comment) stays.
  const occurrences = source.split(new RegExp(`\\b${oldName}\\b`)).length - 1;
  const renamed = occurrences === 1 ? source.replace(match[0], `export default class ${newName} extends HTMLElement`) : source;
  return banner + renamed;
}

// User text inside a block comment: a stray "*" + "/" would end it early and break the module.
function commentSafe(text: string): string {
  return text.replace(/\*\//g, "*\\/").replace(/[\r\n]+/g, " ");
}

function pascal(slug: string): string {
  const words = slug.split("-").filter(Boolean);
  const joined = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  return /^[A-Za-z_$]/.test(joined) ? joined : `G${joined}`;
}

// --- readme -----------------------------------------------------------------

function renderReadme(def: PresetDef, config: GeneratorConfig, manifest: ManifestJson, manifestPath: string, hasFonts: boolean): string {
  const name = config.name.trim();
  const description = config.description.trim() || "An OGraf graphic.";
  const tokens = [
    ...def.colors.map((k) => `\`--og-${k.id}\``),
    "`--og-font`",
    ...def.offsets.map((k) => (k.id === "offsetX" ? "`--og-offset-x`" : "`--og-offset-y`")),
  ];
  const stepCount = typeof manifest.stepCount === "number" ? manifest.stepCount : 1;
  const customActions = Array.isArray(manifest.customActions)
    ? manifest.customActions
        .map((a) => (a && typeof a === "object" ? (a as { id?: unknown }).id : undefined))
        .filter((id): id is string => typeof id === "string")
    : [];

  return `# ${name}

${description}

- **Package id:** \`${config.id.trim()}\`
- **Version:** ${config.version.trim()}
- **License:** MIT
- **Base preset:** ${def.slug} ([tutorial](https://ograf.dev${def.tutorialSlug}))

Generated with the [ograf.dev Template Generator](https://ograf.dev/tools/generator).

## What's inside

| File | Purpose |
| --- | --- |
| \`${manifestPath}\` | Manifest — what a renderer reads. |
| \`graphic.mjs\` | Web Component with the full OGraf lifecycle. |
| \`style.css\` | Stylesheet, loaded via a \`<link>\` injected by graphic.mjs. Theme tokens at the top. |
| \`thumbnail.webp\` | 1920×1080 preview, declared in the manifest's \`thumbnails\`. |
| \`LICENSE\` | MIT licence for the package. |
${hasFonts ? "| `fonts/` | Local font files, with the font's licence alongside. |\n" : ""}| \`README.md\` | This file. |

## Re-skinning

The top of \`style.css\` declares the theme as CSS custom properties on the
graphic's root element: ${tokens.join(", ")}. Change a value there and every rule
that uses it follows. The lifecycle code in \`graphic.mjs\` does not need to change.

## Behaviour

- \`stepCount\`: ${stepCount}${stepCount === 0 ? " — one play runs the whole in → hold → out lifecycle." : stepCount === 1 ? " — play brings it on air, a second play (or stop) takes it off." : ""}
- Real-time rendering: ${manifest.supportsRealTime === true ? "yes" : "no"}; non-real-time: ${manifest.supportsNonRealTime === true ? "yes" : "no"}.
${customActions.length ? `- Custom actions: ${customActions.map((id) => `\`${id}\``).join(", ")}.\n` : ""}
## Deploy to a compliant OGraf renderer

Point any OGraf-compliant system at the manifest, or check the package first at
<https://ograf.dev/check>:

- **ograf-server** — reference renderer, self-host. <https://github.com/SuperFlyTV/ograf-server>
- **SPX-GC** — professional OGraf controller. <https://github.com/TuomoKu/SPX-GC>
- **CasparCG** — open-source playout server. <https://github.com/CasparCG/server>

## License

MIT. Based on the ograf.dev tutorial templates.
`;
}
