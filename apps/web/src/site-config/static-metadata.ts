import type { Metadata } from "next";
import { env } from "@/config/env";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { routeCatalog, type PageId } from "@/site-config/routes";

export function buildStaticPageMetadata(pageId: PageId): Metadata {
  const config = loadSiteConfig();
  const page = config.pages[pageId];
  const seo = page.seo;
  const path = routeCatalog[pageId].path;
  const image = seo.ogImage ?? config.seo.defaultOgImage;

  return {
    title: pageId === "home" ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: new URL(path, env.NEXT_PUBLIC_SITE_URL).toString() },
    robots: seo.indexable ? undefined : { index: false, follow: false },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: new URL(path, env.NEXT_PUBLIC_SITE_URL).toString(),
      siteName: config.seo.siteName,
      locale: config.seo.locale,
      images: image?.src ? [{ url: image.src, alt: image.alt }] : undefined,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: image?.src ? [image.src] : undefined
    }
  };
}

