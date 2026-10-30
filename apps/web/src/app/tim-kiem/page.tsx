import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { searchContent } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("search");

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const page = loadSiteConfig().pages.search;
  const results = await searchContent(q);
  const total = results.services.length + results.projects.length + results.articles.length;
  const groups = [
    {
      title: "Dịch vụ",
      items: results.services.map((item) => ({ id: item.id, label: item.title, href: `/dich-vu/${item.slug}` }))
    },
    {
      title: "Dự án",
      items: results.projects.map((item) => ({ id: item.id, label: item.name, href: `/du-an/${item.slug}` }))
    },
    {
      title: "Tin tức",
      items: results.articles.map((item) => ({ id: item.id, label: item.title, href: `/tin-tuc/${item.slug}` }))
    }
  ];

  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container>
          <form className="mb-8 flex gap-3" action="/tim-kiem">
            <input name="q" defaultValue={q} className="input flex-1" placeholder="Nhập từ khóa" />
            <button className="rounded-md bg-[var(--color-primary)] px-5 font-semibold text-white" type="submit">
              Tìm kiếm
            </button>
          </form>
          {!q ? <EmptyState title="Nhập từ khóa để tìm kiếm" /> : null}
          {q && !total ? <EmptyState title="Không tìm thấy kết quả" /> : null}
          {total ? (
            <div className="grid gap-8">
              {groups.map((group) => (
                group.items.length ? (
                  <div key={group.title}>
                    <h2 className="mb-3 text-xl font-bold">{group.title}</h2>
                    <div className="grid gap-2">
                      {group.items.map((item) => (
                        <Link key={item.id} className="rounded-md border border-slate-200 bg-white p-4 hover:text-[var(--color-primary)]" href={item.href}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
