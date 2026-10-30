import { Container, Section } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { PageHero } from "@/components/ui/page-hero";
import { getGalleryItems } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("gallery");

export default async function GalleryPage() {
  const items = await getGalleryItems();
  const page = loadSiteConfig().pages.gallery;
  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <ImageFrame image={item.image} className="aspect-[4/3]" />
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">{item.category}</p>
                  <h2 className="mt-2 font-bold">{item.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
