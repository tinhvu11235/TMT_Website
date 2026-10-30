import Link from "next/link";
import { ImageFrame } from "@/components/ui/image-frame";
import { formatDate } from "@/lib/utils/format";
import type { Article } from "@/types/content";

export function NewsCard({ article }: { article: Article }) {
  return (
    <Link href={`/tin-tuc/${article.slug}`} className="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:-translate-y-1 hover:shadow-lg">
      <ImageFrame image={article.thumbnail} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="p-3">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--color-muted-foreground)]">
          <span>{article.category}</span>
          <span>/</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>
        <h3 className="text-xl font-bold text-[var(--color-secondary)]">{article.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--color-muted-foreground)]">{article.excerpt}</p>
      </div>
    </Link>
  );
}
