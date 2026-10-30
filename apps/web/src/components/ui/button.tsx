import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const styles = {
  primary:
    "bg-[var(--color-primary)] text-white border border-[var(--color-primary)] hover:bg-[var(--color-secondary)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
  accent:
    "bg-[var(--color-accent)] text-slate-950 border border-[var(--color-accent)] hover:brightness-95",
  ghost:
    "bg-transparent text-[var(--color-secondary)] border border-transparent hover:bg-[var(--color-surface)]/70"
};

type Variant = keyof typeof styles;

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font700 font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  children,
  className,
  variant = "primary",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition active:translate-y-px",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
