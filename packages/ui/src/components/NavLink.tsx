import { cn } from "../utils";

interface NavLinkProps {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly active?: boolean;
  readonly external?: boolean;
  readonly className?: string;
}

export function NavLink({
  href,
  children,
  active = false,
  external = false,
  className,
}: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        active
          ? "text-white"
          : "text-surface-400 hover:text-white",
        className
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
