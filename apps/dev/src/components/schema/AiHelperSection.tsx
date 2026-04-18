import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Lightbulb,
  MessageSquare,
  Search,
  Sparkles,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AI_PLATFORMS, AI_PROMPT, AI_TIPS, type AiPlatform } from "../../content/ai-helper";

const PLATFORM_ICONS: Record<AiPlatform["icon"], LucideIcon> = {
  MessageSquare,
  Sparkles,
  Zap,
  Search,
};

/**
 * "Use an AI to check or compose your OGraf" — a curated prompt designers
 * can copy into ChatGPT, Claude, Gemini, or Perplexity, plus a few tips on
 * how to get useful output back.
 */
export function AiHelperSection() {
  return (
    <section
      id="ai-helper"
      className="bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-20 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300 ring-1 ring-inset ring-white/10">
            <Wand2 className="h-3 w-3" strokeWidth={2.5} />
            AI helper
          </div>
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get an AI to check or compose your manifest.
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Copy the prompt below into any chat AI. It teaches the model the OGraf rules at a level a designer can rely on — required fields, the canonical gddTypes, vendor extensions, the lot.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
          {/* Prompt block */}
          <PromptBlock />

          {/* Sidebar: platforms + tips */}
          <aside className="space-y-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Where to paste it
              </p>
              <ul className="space-y-2">
                {AI_PLATFORMS.map((p) => {
                  const Icon = PLATFORM_ICONS[p.icon];
                  return (
                    <li key={p.url}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                      >
                        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1 text-sm font-semibold text-white group-hover:text-blue-300">
                            {p.name}
                            <ArrowUpRight
                              className="h-3 w-3 opacity-60"
                              strokeWidth={2}
                            />
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-400">{p.note}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Lightbulb className="h-3 w-3" strokeWidth={2.5} />
                Tips for better answers
              </p>
              <ul className="space-y-2.5">
                {AI_TIPS.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                    <span className="mt-1 inline-block h-1 w-1 flex-none rounded-full bg-blue-400" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          A heads-up: AI output is a great <em>draft</em>, never a final answer. Always run what you get through the{" "}
          <a
            href="/tools/check"
            className="underline decoration-slate-500 underline-offset-2 hover:text-blue-300 hover:decoration-blue-400"
          >
            Package Checker
          </a>{" "}
          before shipping.
        </p>
      </div>
    </section>
  );
}

function PromptBlock() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked (e.g. iframe without allow=clipboard-write).
      // The textarea below stays selectable as a fallback.
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">ograf-ai-prompt.txt</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            copied
              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
              : "bg-white/10 text-slate-200 hover:bg-white/20"
          }`}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" strokeWidth={2.5} />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" strokeWidth={2} />
              Copy prompt
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs/6 text-slate-200 font-mono whitespace-pre-wrap break-words">
        {AI_PROMPT}
      </pre>
      <div className="border-t border-white/10 bg-white/5 px-4 py-2 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          The prompt cites{" "}
          <a
            href="https://ograf.ebu.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-slate-500 underline-offset-2 hover:text-blue-300 hover:decoration-blue-400"
          >
            ograf.ebu.io
          </a>{" "}
          so models with browsing can fetch the canonical schema while answering.
        </span>
      </div>
    </div>
  );
}
