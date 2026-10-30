import { Container, Section } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";
import type { Statistic } from "@/types/content";

type StatisticsConfig = Extract<HomeBlock, { type: "statistics" }>["config"];

export function HomeStatistics({ config, statistics }: { config: StatisticsConfig; statistics: Statistic[] }) {
  return (
    <Section className="bg-[var(--color-surface)] py-10">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.slice(0, config.limit).map((item) => (
            <div key={item.id} className="border-l-4 border-[var(--color-accent)] bg-[var(--color-muted)] p-6">
              <p className="text-4xl font-bold text-[var(--color-secondary)]">
                {item.value}
                {item.suffix}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--color-muted-foreground)]">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
