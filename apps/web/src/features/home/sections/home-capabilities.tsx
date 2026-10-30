import type { LucideIcon } from "lucide-react";
import { Award, Building2, Ruler, Users } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";

const capabilityIcons = [Building2, Ruler, Award, Users] satisfies LucideIcon[];
type CapabilitiesConfig = Extract<HomeBlock, { type: "capabilities" }>["config"];

export function HomeCapabilities({ config }: { config: CapabilitiesConfig }) {
  return (
    <Section className="bg-[var(--color-secondary)] text-white">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">{config.eyebrow}</p>
          <h2 className="text-balance text-3xl font-bold leading-tight md:text-5xl">{config.title}</h2>
          <p className="mt-4 text-base leading-8 text-white/75 md:text-lg">{config.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {config.items.map((label, index) => {
            const Icon = capabilityIcons[index % capabilityIcons.length];
            return (
              <div key={label} className="rounded-lg border border-white/10 bg-white/6 p-6">
                <Icon className="mb-5 text-[var(--color-accent)]" size={28} />
                <p className="font-semibold">{label}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
