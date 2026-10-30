import Image from "next/image";
import type { ImageAsset } from "@/types/content";
import { cn } from "@/lib/utils/cn";

export function ImageFrame({
  image,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw"
}: {
  image?: ImageAsset | null;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-[var(--color-muted)]", className)}>
      {image?.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[var(--color-muted)] text-sm font-medium text-[var(--color-muted-foreground)]">
          Chưa có ảnh
        </div>
      )}
    </div>
  );
}
