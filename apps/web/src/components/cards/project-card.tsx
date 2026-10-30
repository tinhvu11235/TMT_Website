import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { ImageFrame } from "@/components/ui/image-frame";
import { statusLabel } from "@/lib/utils/format";
import type { Project } from "@/types/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/du-an/${project.slug}`} className="group block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition hover:-translate-y-1 hover:shadow-lg">
      <ImageFrame image={project.featuredImage} className="aspect-[16/10] rounded-none transition duration-500 group-hover:scale-[1.02]" sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--color-primary)]">
          <span>{project.category}</span>
          <span className="text-slate-300">/</span>
          <span>{statusLabel(project.status)}</span>
        </div>
        <h3 className="text-xl font-bold text-[var(--color-secondary)]">{project.name}</h3>
        <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted-foreground)]">
          <span className="flex items-center gap-2">
            <MapPin size={15} />
            {project.location}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={15} />
            {project.completionYear ?? project.startYear}
          </span>
        </div>
      </div>
    </Link>
  );
}
