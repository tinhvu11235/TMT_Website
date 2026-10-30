import { Container, Section } from "@/components/ui/container";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";

export function PageHero({
  title,
  description,
  breadcrumbs
}: {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <Section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-12 md:py-16">
      <Container>
        {breadcrumbs ? <Breadcrumb items={breadcrumbs} /> : null}
        <div className="max-w-4xl">
          <h1 className="text-balance text-4xl font-bold leading-tight text-[var(--color-secondary)] md:text-6xl">
            {title}
          </h1>
          {description ? <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--color-muted-foreground)]">{description}</p> : null}
        </div>
      </Container>
    </Section>
  );
}
