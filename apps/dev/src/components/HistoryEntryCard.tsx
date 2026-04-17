import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  GitMerge,
  MessageSquare,
} from "lucide-react";
import type { SpecHistoryEntry } from "../content/specHistory";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function labelStyle(label: string): string {
  if (label === "Concluded") return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (label === "Idea") return "bg-blue-50 text-blue-700 ring-blue-600/20";
  if (label === "Issue / Bug") return "bg-amber-50 text-amber-700 ring-amber-600/20";
  return "bg-slate-100 text-slate-700 ring-slate-500/20";
}

function pickIcon(labels: string[]) {
  if (labels.includes("Issue / Bug")) return AlertTriangle;
  if (labels.includes("Idea")) return Lightbulb;
  return CheckCircle2;
}

const markdownClass = [
  "prose prose-sm prose-slate max-w-none",
  "prose-p:my-2 prose-p:leading-relaxed",
  "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
  // inline code — matches Spec page inline-code pill
  "prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono prose-code:font-normal prose-code:text-slate-700",
  "prose-code:before:content-[''] prose-code:after:content-['']",
  // fenced code blocks — matches Spec page CodeBlock (bg-slate-900 + rounded-xl)
  "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-300 prose-pre:p-4 prose-pre:text-sm/6 prose-pre:font-mono prose-pre:overflow-x-auto",
  // reset <code> inside <pre> so it doesn't get the inline pill background
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:text-sm/6",
  "prose-ul:my-2 prose-li:my-0.5",
  "prose-img:rounded-lg prose-img:border prose-img:border-slate-200",
].join(" ");

interface HistoryEntryCardProps {
  entry: SpecHistoryEntry;
}

export function HistoryEntryCard({ entry }: HistoryEntryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = pickIcon(entry.labels);
  const commentCount = entry.comments.length;
  const hasThread = entry.body.length > 0 || commentCount > 0;

  return (
    <li className="mb-10 last:mb-0">
      <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-slate-300">
        <Icon className="h-3 w-3 text-slate-500" strokeWidth={2.5} />
      </span>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-slate-500 hover:text-blue-600"
          >
            #{entry.number}
          </a>
          <time className="text-xs text-slate-500">{formatDate(entry.closedAt)}</time>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">@{entry.author}</span>
        </div>

        <h3 className="mt-2 font-display text-lg font-medium text-slate-900">
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            {entry.title}
          </a>
        </h3>

        <p className="mt-2 text-sm text-slate-700">{entry.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.mergedBy !== undefined && (
            <a
              href={`https://github.com/ebu/ograf/pull/${entry.mergedBy}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20 hover:bg-violet-100"
            >
              <GitMerge className="h-3 w-3" strokeWidth={2.5} />
              Merged #{entry.mergedBy}
            </a>
          )}
          {entry.labels.map((label) => (
            <span
              key={label}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${labelStyle(label)}`}
            >
              {label}
            </span>
          ))}
        </div>

        {hasThread && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              <MessageSquare className="h-4 w-4" />
              {expanded ? "Hide" : "Read"} discussion
              {commentCount > 0 && (
                <span className="text-xs text-slate-400">
                  ({commentCount} {commentCount === 1 ? "comment" : "comments"})
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>

            {expanded && (
              <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
                {entry.body && (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">@{entry.author}</span>
                      <span>opened this discussion</span>
                    </div>
                    <div className={markdownClass}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.body}</ReactMarkdown>
                    </div>
                  </div>
                )}
                {entry.comments.map((c, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">@{c.author}</span>
                      <span>·</span>
                      <time>{formatDate(c.createdAt)}</time>
                    </div>
                    <div className={markdownClass}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.body}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </li>
  );
}
