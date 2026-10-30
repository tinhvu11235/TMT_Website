import { ProjectCard } from "@/components/cards/project-card";
import { LinkButton } from "@/components/ui/button";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";
import type { Project } from "@/types/content";

type ProjectsConfig = Extract<HomeBlock, { type: "projects" }>["config"];

export function HomeProjects({ config, projects }: { config: ProjectsConfig; projects: Project[] }) {
  return (
    <Section>
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionTitle eyebrow="Dự án" title={config.title} description={config.description} />
          <LinkButton href={config.cta.href} variant="secondary">{config.cta.label}</LinkButton>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {projects.slice(0, config.limit).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </Container>
    </Section>
  );
}
