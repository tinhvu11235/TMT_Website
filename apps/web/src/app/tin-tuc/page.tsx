import { NewsCard } from "@/components/cards/news-card";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getArticles } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("news");

export default async function NewsPage() {
  const articles = await getArticles();
  const page = loadSiteConfig().pages.news;
  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
