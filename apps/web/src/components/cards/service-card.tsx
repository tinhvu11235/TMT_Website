import Link from "next/link";
import { ArrowRight, HardHat } from "lucide-react";
import { ImageFrame } from "@/components/ui/image-frame";
import type { Service } from "@/types/content";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/dich-vu/${service.slug}`} className="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-lg">
      <ImageFrame image={service.featuredImage} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="p-3">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-muted)] text-[var(--color-primary)]">
          <HardHat size={20} />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-secondary)]">{service.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--color-muted-foreground)]">{service.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
          Xem chi tiết
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
