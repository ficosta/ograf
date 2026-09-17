import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { UI_COPY } from "../i18n/copy/ui";
import { useCopy } from "../i18n/useLocale";

interface Props {
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
  /** The thrown Error's message; "" when something other than an Error was thrown, null before any error. */
  readonly message: string | null;
}

/**
 * Top-level error boundary that catches render errors anywhere in the app
 * and shows a recovery screen instead of a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, message: null };

  public static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "";
    return { hasError: true, message };
  }

  public componentDidCatch(): void {
    // Intentionally no side effects. Hook in telemetry here when available.
  }

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return <ErrorScreen message={this.state.message} />;
  }
}

/** A function component so the recovery screen can read the locale from the URL. */
function ErrorScreen({ message }: { readonly message: string | null }) {
  const c = useCopy(UI_COPY).errorBoundary;
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <p className="mt-6 text-sm font-semibold text-rose-600">{c.eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
        {c.title}
      </h1>
      <p className="mt-6 text-base text-slate-600">
        {c.bodyBefore}{" "}
        <a
          href="https://github.com/ficosta/ograf/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400"
        >
          {c.openIssue}
        </a>{" "}
        {c.bodyAfter}
      </p>
      {message !== null && (
        <pre className="mt-6 max-w-full overflow-auto rounded-lg bg-slate-100 px-4 py-3 text-left text-xs text-slate-700">
          {message || c.unexpected}
        </pre>
      )}
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
        {c.reload}
      </button>
    </section>
  );
}
