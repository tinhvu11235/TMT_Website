import { Container, Section, SectionTitle } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";
import type { Partner } from "@/types/content";

type PartnersConfig = Extract<HomeBlock, { type: "partners" }>["config"];

export function HomePartners({ config, partners }: { config: PartnersConfig; partners: Partner[] }) {
  return (
    <Section className="bg-[var(--color-surface)] py-12">
      <Container>
        <SectionTitle title={config.title} description={config.description} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          {partners.slice(0, config.limit).map((partner) => (
            <div key={partner.id} className="grid aspect-[3/2] place-items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 text-center text-sm font-semibold text-[var(--color-muted-foreground)]">
              {partner.name}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
