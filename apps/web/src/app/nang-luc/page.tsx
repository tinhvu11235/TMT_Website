import { Award, Cpu, FileDown } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { PageHero } from "@/components/ui/page-hero";
import { getCertificates, getCompanyProfile, getEquipment } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("capabilities");

export default async function CapabilityPage() {
  const [certificates, equipment, profile] = await Promise.all([getCertificates(), getEquipment(), getCompanyProfile()]);
  const page = loadSiteConfig().pages.capabilities;
  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container>
          <SectionTitle title={page.certificatesTitle} />
          <div className="grid gap-4 md:grid-cols-4">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="rounded-lg border border-slate-200 bg-white p-5">
                <Award className="mb-4 text-[var(--color-primary)]" />
                <h2 className="font-bold">{certificate.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{certificate.certificateNumber}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <SectionTitle title={page.equipmentTitle} />
          <div className="grid gap-4 md:grid-cols-3">
            {equipment.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <Cpu className="mb-4 text-[var(--color-primary)]" />
                <h2 className="font-bold">{item.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container className="grid items-center gap-8 lg:grid-cols-2">
          <ImageFrame image={profile.thumbnail} className="aspect-[4/3]" />
          <div>
            <SectionTitle title={profile.title} description={`Phiên bản ${profile.version}`} />
            <LinkButton href="/ho-so-nang-luc" variant="accent">
              <FileDown size={18} />
              {page.profileCtaLabel}
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
