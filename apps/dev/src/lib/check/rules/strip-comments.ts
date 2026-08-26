/**
 * Blank out comments in JS/TS source so the C-* rules scan code, not prose.
 *
 * Why this exists: the module rules are regex-based, and a doc comment that
 * mentions a lifecycle method (`* load() is always called first`) used to be
 * indistinguishable from a real declaration. That produced false positives in
 * C-04 (method reported as non-async because the comment mention has no
 * `async` in front of it) and false negatives in C-02 (a method that is only
 * ever named in a comment counted as present).
 *
 * Comments are replaced with spaces rather than removed, and newlines inside
 * them are kept, so every character index and line number in the returned
 * string still matches the original source. Callers can therefore keep using
 * the stripped text for matching and the raw text for reporting positions.
 *
 * String, template-literal and regex-literal contents are left untouched —
 * `'https://…'` must not lose its `//`.
 */

/** Characters after which a `/` begins a regex literal rather than division. */
const REGEX_ALLOWED_BEFORE = new Set("(,=:[!&|?{};+-*%^~<>".split(""));
const REGEX_ALLOWED_KEYWORDS = ["return", "typeof", "instanceof", "in", "of", "new", "delete", "void", "case", "do", "else", "yield", "await"];

function regexCanStartHere(src: string, i: number): boolean {
  let j = i - 1;
  while (j >= 0 && /\s/.test(src[j])) j--;
  if (j < 0) return true;
  const ch = src[j];
  if (REGEX_ALLOWED_BEFORE.has(ch)) return true;
  if (/[A-Za-z0-9_$]/.test(ch)) {
    let k = j;
    while (k >= 0 && /[A-Za-z0-9_$]/.test(src[k])) k--;
    return REGEX_ALLOWED_KEYWORDS.includes(src.slice(k + 1, j + 1));
  }
  return false;
}

export function stripComments(source: string): string {
  const out = source.split("");
  const n = source.length;
  let i = 0;

  /** Blank [from, to) but keep newlines so line numbers survive. */
  const blank = (from: number, to: number) => {
    for (let k = from; k < to && k < n; k++) {
      if (out[k] !== "\n") out[k] = " ";
    }
  };

  while (i < n) {
    const c = source[i];
    const next = source[i + 1];

    if (c === "/" && next === "/") {
      let j = i + 2;
      while (j < n && source[j] !== "\n") j++;
      blank(i, j);
      i = j;
      continue;
    }

    if (c === "/" && next === "*") {
      let j = i + 2;
      while (j < n && !(source[j] === "*" && source[j + 1] === "/")) j++;
      const end = Math.min(j + 2, n);
      blank(i, end);
      i = end;
      continue;
    }

    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && source[j] !== c) {
        if (source[j] === "\\") j++;
        else if (source[j] === "\n") break; // unterminated — bail out
        j++;
      }
      i = j + 1;
      continue;
    }

    if (c === "`") {
      // Template literal: skip to the closing backtick, stepping over ${…}
      // so a comment inside an interpolation is still handled by the loop.
      let j = i + 1;
      let depth = 0;
      while (j < n) {
        const d = source[j];
        if (d === "\\") { j += 2; continue; }
        if (d === "$" && source[j + 1] === "{") { depth++; j += 2; continue; }
        if (d === "}" && depth > 0) { depth--; j++; continue; }
        if (d === "`" && depth === 0) break;
        j++;
      }
      i = j + 1;
      continue;
    }

    if (c === "/" && regexCanStartHere(source, i)) {
      let j = i + 1;
      let inClass = false;
      while (j < n) {
        const d = source[j];
        if (d === "\\") { j += 2; continue; }
        if (d === "[") inClass = true;
        else if (d === "]") inClass = false;
        else if (d === "/" && !inClass) break;
        else if (d === "\n") { j = i; break; } // not a regex after all
        j++;
      }
      i = j + 1;
      continue;
    }

    i++;
  }

  return out.join("");
}

/**
 * Blank out CSS comments, preserving offsets and newlines like stripComments().
 *
 * CSS has only block comments, and they cannot nest. Strings are skipped so a
 * `content: "/*"` declaration or a url() containing `/*` survives intact.
 */
export function stripCssComments(source: string): string {
  const out = source.split("");
  const n = source.length;
  let i = 0;

  while (i < n) {
    const c = source[i];

    if (c === "/" && source[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(source[j] === "*" && source[j + 1] === "/")) j++;
      const end = Math.min(j + 2, n);
      for (let k = i; k < end; k++) if (out[k] !== "\n") out[k] = " ";
      i = end;
      continue;
    }

    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && source[j] !== c) {
        if (source[j] === "\\") j++;
        else if (source[j] === "\n") break;
        j++;
      }
      i = j + 1;
      continue;
    }

    i++;
  }

  return out.join("");
}
