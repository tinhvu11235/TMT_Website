import { Award } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";
import type { Certificate } from "@/types/content";

type CertificatesConfig = Extract<HomeBlock, { type: "certificates" }>["config"];

export function HomeCertificates({ config, certificates }: { config: CertificatesConfig; certificates: Certificate[] }) {
  return (
    <Section className="bg-[var(--color-surface)]">
      <Container>
        <SectionTitle title={config.title} description={config.description} />
        <div className="grid gap-4 md:grid-cols-4">
          {certificates.slice(0, config.limit).map((certificate) => (
            <div key={certificate.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-5">
              <Award className="mb-5 text-[var(--color-primary)]" size={26} />
              <h3 className="font-semibold text-[var(--color-secondary)]">{certificate.name}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{certificate.organization}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
