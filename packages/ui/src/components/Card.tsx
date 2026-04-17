import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly hoverable?: boolean;
  readonly children?: ReactNode;
}

export function Card({
  className,
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-800 bg-surface-900/50 p-6 backdrop-blur-sm",
        hoverable &&
          "transition-all duration-200 hover:border-surface-600 hover:bg-surface-800/50 hover:shadow-lg hover:shadow-brand-600/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
