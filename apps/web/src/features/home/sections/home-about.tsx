import { FileCheck2 } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import type { HomeBlock } from "@/site-config/site.schema";

type AboutConfig = Extract<HomeBlock, { type: "about" }>["config"];

export function HomeAbout({ config }: { config: AboutConfig }) {
  return (
    <Section>
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <ImageFrame image={config.image} className="aspect-[4/3]" />
        <div>
          <SectionTitle eyebrow={config.eyebrow} title={config.title} description={config.description} />
          <div className="grid gap-3 text-sm leading-7 text-[var(--color-muted-foreground)]">
            {config.highlights.map((item) => (
              <div className="flex gap-3" key={item}>
                <FileCheck2 className="mt-1 shrink-0 text-[var(--color-primary)]" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <LinkButton href={config.cta.href} className="mt-7">
            {config.cta.label}
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
