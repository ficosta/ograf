import { cn } from "../utils";

type BadgeVariant = "default" | "success" | "warning" | "info";

interface BadgeProps {
  readonly variant?: BadgeVariant;
  readonly children: React.ReactNode;
  readonly className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-800 text-surface-300 border-surface-700",
  success: "bg-emerald-950 text-emerald-400 border-emerald-800",
  warning: "bg-amber-950 text-amber-400 border-amber-800",
  info: "bg-brand-950 text-brand-400 border-brand-800",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
