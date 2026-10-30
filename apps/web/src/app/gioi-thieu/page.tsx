import type { LucideIcon } from "lucide-react";
import { Building2, Compass, Eye, Factory, Gem, Network } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { getProjects, getTeamMembers } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("about");

export default async function AboutPage() {
  const page = loadSiteConfig().pages.about;
  const [projects, team] = await Promise.all([getProjects(), getTeamMembers()]);
  const sections: Array<[LucideIcon, string, string]> = [
    [Building2, page.sections.overview.title, page.sections.overview.description],
    [Compass, page.sections.history.title, page.sections.history.description],
    [Eye, page.sections.vision.title, page.sections.vision.description],
    [Gem, page.sections.values.title, page.sections.values.description],
    [Network, page.sections.organization.title, page.sections.organization.description],
    [Factory, page.sections.facilities.title, page.sections.facilities.description]
  ];

  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ImageFrame image={projects[0]?.featuredImage} className="aspect-[4/3]" />
          <div className="grid gap-4">
            {sections.map(([Icon, title, description]) => (
              <div className="rounded-lg border border-slate-200 bg-white p-5" key={String(title)}>
                <Icon className="mb-3 text-[var(--color-primary)]" size={24} />
                <h2 className="text-xl font-bold text-[var(--color-secondary)]">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <SectionTitle title={page.team.title} description={page.team.description} />
          <div className="grid gap-5 md:grid-cols-4">
            {team.map((member) => (
              <div key={member.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <ImageFrame image={member.avatar} className="mb-4 aspect-square" />
                <h3 className="font-bold text-[var(--color-secondary)]">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">{member.position}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{member.experience}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
