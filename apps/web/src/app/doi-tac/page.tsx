import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getPartners } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("partners");

export default async function PartnersPage() {
  const partners = await getPartners();
  const page = loadSiteConfig().pages.partners;
  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container>
          <div className="grid gap-4 md:grid-cols-4">
            {partners.map((partner) => (
              <Link key={partner.id} href={partner.website ?? "#"} className="grid aspect-[3/2] place-items-center rounded-lg border border-slate-200 bg-white p-5 text-center font-bold text-slate-500 hover:border-[var(--color-primary)]">
                {partner.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
