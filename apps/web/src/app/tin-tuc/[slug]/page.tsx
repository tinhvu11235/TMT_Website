import { notFound } from "next/navigation";
import { NewsCard } from "@/components/cards/news-card";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";
import { getArticleBySlug, getArticles } from "@/services/content";
import { getSiteSettings } from "@/site-config/site-config.adapter";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = getSiteSettings();
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    ogImage: article.ogImage ?? article.thumbnail,
    path: `/tin-tuc/${article.slug}`,
    settings
  });
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([getArticleBySlug(slug), getArticles()]);
  if (!article) notFound();
  const related = allArticles.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <PageHero title={article.title} description={`${article.category} / ${formatDate(article.publishedAt)}`} breadcrumbs={[{ label: "Tin tức", href: "/tin-tuc" }, { label: article.title }]} />
      <Section>
        <Container className="max-w-4xl">
          <ImageFrame image={article.thumbnail} className="mb-8 aspect-[16/8]" priority sizes="100vw" />
          <article className="prose-content">
            <p>{article.excerpt}</p>
            <p>{article.content}</p>
            <h2>Thông tin thêm</h2>
            <p>Admin có thể quản trị nội dung chi tiết, ảnh gallery, tác giả, category, metadata và trạng thái xuất bản trong CMS.</p>
          </article>
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-500">Chia sẻ bài viết</p>
            <p className="mt-2 text-sm text-slate-600">Sử dụng URL hiện tại để chia sẻ bài viết cho đối tác hoặc khách hàng.</p>
          </div>
        </Container>
      </Section>
      {related.length ? (
        <Section className="bg-white">
          <Container>
            <SectionTitle title="Bài viết liên quan" />
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <NewsCard key={item.id} article={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
