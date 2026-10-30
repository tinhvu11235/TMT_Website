import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={cn("py-14 md:py-24", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-bold leading-tight text-[var(--color-secondary)] md:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-8 text-[var(--color-muted-foreground)] md:text-lg">{description}</p> : null}
    </div>
  );
}
