import Link from "next/link";
import { ProjectCard } from "@/components/cards/project-card";
import { Container, Section } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import type { ProjectStatus } from "@/types/content";
import { getProjects } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("projects");

const statuses: { label: string; value: ProjectStatus }[] = [
  { label: "Đang chuẩn bị", value: "planning" },
  { label: "Đang triển khai", value: "in_progress" },
  { label: "Hoàn thành", value: "completed" }
];

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; status?: ProjectStatus; year?: string }>;
}) {
  const filters = await searchParams;
  const page = loadSiteConfig().pages.projects;
  const projects = await getProjects(filters);
  const allProjects = await getProjects();
  const categories = Array.from(new Set(allProjects.map((project) => project.category)));
  const years = Array.from(new Set(allProjects.map((project) => String(project.completionYear ?? project.startYear)))).filter(Boolean);

  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap gap-2">
            <Link className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold" href="/du-an">
              Tất cả
            </Link>
            {categories.map((category) => (
              <Link key={category} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold" href={`/du-an?category=${encodeURIComponent(category)}`}>
                {category}
              </Link>
            ))}
            {statuses.map((status) => (
              <Link key={status.value} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold" href={`/du-an?status=${status.value}`}>
                {status.label}
              </Link>
            ))}
            {years.map((year) => (
              <Link key={year} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold" href={`/du-an?year=${year}`}>
                {year}
              </Link>
            ))}
          </div>
          {projects.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState title="Không có dự án phù hợp" description="Hãy thay đổi bộ lọc hoặc kiểm tra dữ liệu trong CMS." />
          )}
        </Container>
      </Section>
    </>
  );
}
