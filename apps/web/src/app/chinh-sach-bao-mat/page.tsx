import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("privacy");

export default function PrivacyPage() {
  const page = loadSiteConfig().pages.privacy;
  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container className="prose-content max-w-3xl">
          {page.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </Container>
      </Section>
    </>
  );
}
