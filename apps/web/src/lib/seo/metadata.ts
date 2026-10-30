import type { Metadata } from "next";
import { env } from "@/config/env";
import type { GlobalSettings, SeoFields } from "@/types/content";

type MetadataInput = SeoFields & {
  title: string;
  description?: string | null;
  path?: string;
  settings: GlobalSettings;
};

export function buildMetadata({
  title,
  description,
  seoTitle,
  seoDescription,
  ogImage,
  path = "/",
  settings
}: MetadataInput): Metadata {
  const resolvedTitle = seoTitle || `${title} | ${settings.companyShortName}`;
  const resolvedDescription = seoDescription || description || settings.defaultDescription;
  const url = new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
  const image = ogImage?.src || settings.defaultOgImage?.src;

  return {
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: settings.companyName,
      images: image ? [{ url: image, alt: ogImage?.alt ?? settings.companyName }] : undefined,
      locale: "vi_VN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: image ? [image] : undefined
    }
  };
}

export function organizationSchema(settings: GlobalSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.companyName,
    alternateName: settings.companyShortName,
    url: env.NEXT_PUBLIC_SITE_URL,
    telephone: settings.hotline || settings.phone,
    email: settings.email,
    address: settings.address,
    sameAs: [settings.facebook, settings.youtube, settings.linkedin].filter(Boolean)
  };
}
