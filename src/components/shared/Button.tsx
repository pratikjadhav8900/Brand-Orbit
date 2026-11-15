import Link from "next/link";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ocean text-white hover:bg-teal transition-colors duration-300",
  secondary:
    "border border-white/30 text-white hover:border-white hover:bg-white/10 transition-colors duration-300",
  ghost:
    "border border-white/20 text-white hover:border-white/50 hover:bg-white/5 transition-colors duration-300",
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
