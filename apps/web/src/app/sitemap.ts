import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { getArticles, getProjects, getServices } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { routeCatalog, type PageId } from "@/site-config/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, articles] = await Promise.all([getServices(), getProjects(), getArticles()]);
  const config = loadSiteConfig();
  const staticRoutes = (Object.entries(routeCatalog) as Array<[PageId, (typeof routeCatalog)[PageId]]>)
    .filter(([pageId, route]) => route.sitemap && config.pages[pageId].seo.indexable)
    .map(([, route]) => route.path);

  return [
    ...staticRoutes.map((route) => ({ url: new URL(route, env.NEXT_PUBLIC_SITE_URL).toString(), lastModified: new Date() })),
    ...services.map((service) => ({ url: `${env.NEXT_PUBLIC_SITE_URL}/dich-vu/${service.slug}`, lastModified: new Date(service.publishedAt ?? Date.now()) })),
    ...projects.map((project) => ({ url: `${env.NEXT_PUBLIC_SITE_URL}/du-an/${project.slug}`, lastModified: new Date(project.publishedAt ?? Date.now()) })),
    ...articles.map((article) => ({ url: `${env.NEXT_PUBLIC_SITE_URL}/tin-tuc/${article.slug}`, lastModified: new Date(article.publishedAt) }))
  ];
}
