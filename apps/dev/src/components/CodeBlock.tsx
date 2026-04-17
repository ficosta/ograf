interface CodeBlockProps {
  readonly code: string;
  readonly filename?: string;
  readonly language?: string;
}

/**
 * Dark-themed code block with an optional filename/language header.
 * Shared by tutorial pages, the Get Started guide, and the Spec page.
 */
export function CodeBlock({ code, filename, language }: CodeBlockProps) {
  return (
    <div className="rounded-xl bg-slate-900 overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50">
          <span className="text-xs text-slate-400 font-mono">{filename}</span>
          {language && <span className="text-xs text-slate-500">{language}</span>}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm/6 text-slate-300 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}
