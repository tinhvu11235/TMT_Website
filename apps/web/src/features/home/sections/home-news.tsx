import { NewsCard } from "@/components/cards/news-card";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import type { HomeBlock } from "@/site-config/site.schema";
import type { Article } from "@/types/content";

type NewsConfig = Extract<HomeBlock, { type: "news" }>["config"];

export function HomeNews({ config, articles }: { config: NewsConfig; articles: Article[] }) {
  return (
    <Section>
      <Container>
        <SectionTitle title={config.title} description={config.description} />
        <div className="grid gap-5 md:grid-cols-3">
          {articles.slice(0, config.limit).map((article) => <NewsCard key={article.id} article={article} />)}
        </div>
      </Container>
    </Section>
  );
}
