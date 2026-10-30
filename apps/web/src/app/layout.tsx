import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "@/app/globals.css";
import { FloatingContact } from "@/components/layout/floating-contact";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { organizationSchema } from "@/lib/seo/metadata";
import { getServices } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { siteConfigToGlobalSettings, siteConfigToNavigation } from "@/site-config/site-config.adapter";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap"
});

export function generateMetadata(): Metadata {
  const config = loadSiteConfig();
  return {
    title: {
      default: config.seo.defaultTitle,
      template: config.seo.titleTemplate
    },
    description: config.seo.defaultDescription,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    icons: config.brand.favicon?.src ? { icon: config.brand.favicon.src } : undefined,
    openGraph: {
      title: config.seo.defaultTitle,
      description: config.seo.defaultDescription,
      siteName: config.seo.siteName,
      locale: config.seo.locale,
      images: config.seo.defaultOgImage?.src
        ? [{ url: config.seo.defaultOgImage.src, alt: config.seo.defaultOgImage.alt }]
        : undefined,
      type: "website"
    },
    verification: config.seo.googleSiteVerification
      ? { google: config.seo.googleSiteVerification }
      : undefined
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = loadSiteConfig();
  const settings = siteConfigToGlobalSettings(config);
  const menu = siteConfigToNavigation(config);
  const services = await getServices();

  const themeStyle = {
    "--color-primary": settings.primaryColor,
    "--color-secondary": settings.secondaryColor,
    "--color-accent": settings.accentColor,
    "--color-background": settings.backgroundColor,
    "--color-text": settings.textColor,
    "--color-surface": config.theme.surface,
    "--color-muted": config.theme.muted,
    "--color-muted-foreground": config.theme.mutedForeground,
    "--color-border": config.theme.border
  } as React.CSSProperties;

  return (
    <html lang={config.site.locale} className={beVietnam.variable} data-scroll-behavior="smooth">
      <body style={themeStyle}>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema(settings)) }}
        />
        <Header menu={menu} settings={settings} actions={config.navigation.headerActions} />
        <main>{children}</main>
        <Footer settings={settings} menu={menu} services={services} navigation={config.navigation} />
        <FloatingContact settings={settings} />
      </body>
    </html>
  );
}
