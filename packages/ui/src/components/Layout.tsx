import { cn } from "../utils";
import { Footer } from "./Footer";

interface LayoutProps {
  readonly children: React.ReactNode;
  readonly nav: React.ReactNode;
  readonly className?: string;
}

export function Layout({ children, nav, className }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-surface-800 bg-surface-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          {nav}
        </div>
      </header>
      <main className={cn("flex-1", className)}>{children}</main>
      <Footer />
    </div>
  );
}
