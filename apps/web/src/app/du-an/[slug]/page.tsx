import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/cards/project-card";
import { LinkButton } from "@/components/ui/button";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { statusLabel } from "@/lib/utils/format";
import { getProjectBySlug, getProjects } from "@/services/content";
import { getSiteSettings } from "@/site-config/site-config.adapter";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = getSiteSettings();
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.name,
    description: project.shortDescription,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    ogImage: project.ogImage ?? project.featuredImage,
    path: `/du-an/${project.slug}`,
    settings
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();
  const related = allProjects.filter((item) => item.category === project.category && item.slug !== project.slug).slice(0, 3);
  const facts = [
    ["Địa điểm", project.location],
    ["Chủ đầu tư", project.investor],
    ["Năm bắt đầu", project.startYear],
    ["Năm hoàn thành", project.completionYear],
    ["Quy mô", project.projectScale],
    ["Lĩnh vực", project.category],
    ["Vai trò", project.companyRole],
    ["Tình trạng", statusLabel(project.status)]
  ].filter(([, value]) => Boolean(value));

  return (
    <>
      <PageHero title={project.name} description={project.shortDescription} breadcrumbs={[{ label: "Dự án", href: "/du-an" }, { label: project.name }]} />
      <Section>
        <Container>
          <ImageFrame image={project.featuredImage} className="mb-8 aspect-[16/7]" priority sizes="100vw" />
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-5 text-xl font-bold text-[var(--color-secondary)]">Thông tin dự án</h2>
              <dl className="grid gap-4">
                {facts.map(([label, value]) => (
                  <div key={String(label)} className="border-b border-slate-100 pb-3 last:border-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
                    <dd className="mt-1 font-semibold text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
            <article className="prose-content">
              <p>{project.content}</p>
              <h2>Giới thiệu</h2>
              <p>{project.sections?.introduction}</p>
              <h2>Phạm vi công việc</h2>
              <p>{project.sections?.scope}</p>
              <h2>Thách thức</h2>
              <p>{project.sections?.challenge}</p>
              <h2>Giải pháp</h2>
              <p>{project.sections?.solution}</p>
              <h2>Kết quả</h2>
              <p>{project.sections?.result}</p>
            </article>
          </div>
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <SectionTitle title="Gallery" description="Ảnh được lấy từ CMS và có thể mở rộng thành lightbox." />
          <div className="grid gap-4 md:grid-cols-3">
            {project.gallery.map((image) => (
              <ImageFrame key={image.src} image={image} className="aspect-[4/3]" />
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="rounded-lg bg-[var(--color-primary)] p-8 text-white md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Cần tư vấn dự án tương tự?</h2>
              <p className="mt-2 text-white/75">Gửi thông tin để đội ngũ kỹ thuật liên hệ.</p>
            </div>
            <LinkButton href="/lien-he" variant="accent" className="mt-6 md:mt-0">
              Liên hệ
            </LinkButton>
          </div>
        </Container>
      </Section>
      {related.length ? (
        <Section className="bg-white">
          <Container>
            <SectionTitle title="Dự án liên quan" />
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
