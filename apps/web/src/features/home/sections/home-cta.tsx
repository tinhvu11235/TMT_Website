import { LinkButton } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";

type CtaConfig = Extract<HomeBlock, { type: "cta" }>["config"];

export function HomeCta({ config }: { config: CtaConfig }) {
  return (
    <Section className="bg-[var(--color-primary)] text-white">
      <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">{config.title}</h2>
          <p className="mt-3 max-w-2xl text-white/78">{config.description}</p>
        </div>
        <LinkButton href={config.cta.href} variant="accent">{config.cta.label}</LinkButton>
      </Container>
    </Section>
  );
}
