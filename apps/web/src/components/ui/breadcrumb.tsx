import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="hover:text-[var(--color-primary)]">
        Trang chủ
      </Link>
      {items.map((item) => (
        <span className="flex items-center gap-2" key={item.label}>
          <ChevronRight aria-hidden="true" size={14} />
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-primary)]">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
