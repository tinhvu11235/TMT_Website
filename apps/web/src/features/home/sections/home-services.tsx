import { ServiceCard } from "@/components/cards/service-card";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";
import type { Service } from "@/types/content";

type ServicesConfig = Extract<HomeBlock, { type: "services" }>["config"];

export function HomeServices({ config, services }: { config: ServicesConfig; services: Service[] }) {
  return (
    <Section className="bg-[var(--color-surface)]">
      <Container>
        <SectionTitle title={config.title} description={config.description} eyebrow="Dịch vụ" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, config.limit).map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      </Container>
    </Section>
  );
}
