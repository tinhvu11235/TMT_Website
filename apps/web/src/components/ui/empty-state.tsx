import { SearchX } from "lucide-react";

export function EmptyState({ title = "Chưa có dữ liệu", description }: { title?: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
      <SearchX aria-hidden="true" className="mx-auto mb-4 text-slate-400" size={36} />
      <h3 className="text-lg font-semibold text-[var(--color-secondary)]">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--color-muted-foreground)]">{description}</p> : null}
    </div>
  );
}
