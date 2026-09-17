/**
 * Pull named members out of a template's real source, so a tutorial's "key
 * parts" block is the code that ships in the download rather than a
 * hand-kept copy. The copies drifted: tutorials taught a customAction
 * signature and a step model the templates had long stopped using, which is
 * exactly how non-compliant code gets copied into production graphics.
 *
 * A name matches a class method (`  async playAction(`), a top-level
 * function (`function resolveTargetStep(`) or a top-level const
 * (`const IN_MS = …;`). The comment block directly above it comes along, and
 * the whole thing is dedented. A name that is not found throws, which fails
 * the prerender — a renamed method breaks the build instead of the page.
 */
export function excerpt(source: string, names: readonly string[]): string {
  const lines = source.split("\n");
  return names.map((name) => extractOne(lines, name)).join("\n\n");
}

function extractOne(lines: readonly string[], name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const declaration = new RegExp(
    `^(\\s*)(?:async\\s+)?(?:function\\s+)?${escaped}\\s*\\(|^()(?:export\\s+)?const\\s+${escaped}\\b`,
  );

  const start = lines.findIndex((line) => declaration.test(line));
  if (start === -1) throw new Error(`excerpt: "${name}" not found in template source`);
  const indent = (declaration.exec(lines[start]!)?.[1] ?? "").length;

  let end = start;
  if (/^\s*(?:export\s+)?const\s/.test(lines[start]!)) {
    while (end < lines.length - 1 && !lines[end]!.trimEnd().endsWith(";")) end++;
  } else {
    const closing = `${" ".repeat(indent)}}`;
    while (end < lines.length - 1 && lines[end]!.trimEnd() !== closing) end++;
  }

  let first = start;
  while (first > 0 && isCommentLine(lines[first - 1]!)) first--;

  return lines
    .slice(first, end + 1)
    .map((line) => line.slice(Math.min(indent, line.length - line.trimStart().length)))
    .join("\n");
}

function isCommentLine(line: string): boolean {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("/*") || t.startsWith("*");
}

/**
 * The CSS counterpart: each entry is the start of a rule's prelude as written
 * in the stylesheet (".score-bug.goal .score-bug-inner", "@keyframes goalFlash").
 * The rule runs until its braces balance, so nested blocks like keyframes come
 * out whole, along with the comment directly above it.
 */
export function cssExcerpt(source: string, preludes: readonly string[]): string {
  const lines = source.split("\n");
  return preludes.map((prelude) => extractRule(lines, prelude)).join("\n\n");
}

function extractRule(lines: readonly string[], prelude: string): string {
  const start = lines.findIndex((line) => {
    const t = line.trim();
    return t.startsWith(prelude) && /^(?:[\s,{]|$)/.test(t.slice(prelude.length));
  });
  if (start === -1) throw new Error(`cssExcerpt: rule "${prelude}" not found in stylesheet`);

  let depth = 0;
  let opened = false;
  let end = start;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]!) {
      if (ch === "{") { depth++; opened = true; }
      else if (ch === "}") depth--;
    }
    end = i;
    if (opened && depth === 0) break;
  }

  let first = start;
  if (lines[first - 1]?.trim().endsWith("*/")) {
    while (first > 0 && !lines[first - 1]!.trim().startsWith("/*")) first--;
    first--;
  }
  return lines.slice(first, end + 1).join("\n");
}
