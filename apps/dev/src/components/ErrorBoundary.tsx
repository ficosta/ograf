import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
  readonly message: string;
}

/**
 * Top-level error boundary that catches render errors anywhere in the app
 * and shows a recovery screen instead of a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, message: "" };

  public static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { hasError: true, message };
  }

  public componentDidCatch(): void {
    // Intentionally no side effects. Hook in telemetry here when available.
  }

  private readonly handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <p className="mt-6 text-sm font-semibold text-rose-600">Something went wrong</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
          We hit an unexpected error.
        </h1>
        <p className="mt-6 text-base text-slate-600">
          Reload the page to try again. If the problem persists,{" "}
          <a
            href="https://github.com/ficosta/ograf/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400"
          >
            open an issue
          </a>{" "}
          with the details below.
        </p>
        {this.state.message && (
          <pre className="mt-6 max-w-full overflow-auto rounded-lg bg-slate-100 px-4 py-3 text-left text-xs text-slate-700">
            {this.state.message}
          </pre>
        )}
        <button
          type="button"
          onClick={this.handleReload}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
          Reload the page
        </button>
      </section>
    );
  }
}
