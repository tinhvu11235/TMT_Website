import { notFound } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { getProjects, getServiceBySlug, getServices } from "@/services/content";
import { getSiteSettings } from "@/site-config/site-config.adapter";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = getSiteSettings();
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    ogImage: service.ogImage ?? service.featuredImage,
    path: `/dich-vu/${service.slug}`,
    settings
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, projects] = await Promise.all([getServiceBySlug(slug), getProjects()]);
  if (!service) notFound();

  const related = projects.filter((project) => project.services.some((item) => item.slug === service.slug)).slice(0, 3);

  return (
    <>
      <PageHero title={service.title} description={service.shortDescription} breadcrumbs={[{ label: "Dịch vụ", href: "/dich-vu" }, { label: service.title }]} />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="prose-content">
              <p>{service.content}</p>
              <h2>Tổng quan</h2>
              <p>{service.sections?.overview}</p>
              <h2>Phạm vi công việc</h2>
              <ul className="grid gap-3 pl-0">
                {service.sections?.scope?.map((item) => (
                  <li className="list-none rounded-md border border-slate-200 bg-white p-4" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <h2>Quy trình thực hiện</h2>
              <ol className="grid gap-3 pl-0">
                {service.sections?.process?.map((item, index) => (
                  <li className="list-none rounded-md bg-slate-100 p-4" key={item}>
                    <strong>{index + 1}. </strong>
                    {item}
                  </li>
                ))}
              </ol>
              <h2>Năng lực chuyên môn</h2>
              <p>{service.sections?.capability}</p>
            </div>
          </div>
          <aside>
            <ImageFrame image={service.featuredImage} className="aspect-[4/3]" priority />
            <div className="mt-5 rounded-lg bg-[var(--color-secondary)] p-6 text-white">
              <h2 className="text-2xl font-bold">Bạn có dự án cần tư vấn?</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">Gửi thông tin để đội ngũ kỹ thuật liên hệ trong thời gian sớm nhất.</p>
              <LinkButton href="/lien-he" variant="accent" className="mt-5">
                Liên hệ chúng tôi
              </LinkButton>
            </div>
          </aside>
        </Container>
      </Section>
      {related.length ? (
        <Section className="bg-white">
          <Container>
            <SectionTitle title="Dự án liên quan" />
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((project) => (
                <a key={project.id} className="rounded-lg border border-slate-200 p-5 font-semibold hover:text-[var(--color-primary)]" href={`/du-an/${project.slug}`}>
                  {project.name}
                </a>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
