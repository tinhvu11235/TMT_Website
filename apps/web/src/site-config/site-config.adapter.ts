import { loadSiteConfig } from "@/site-config/load-site-config";
import type { SiteConfig } from "@/site-config/site.schema";
import type { GlobalSettings, NavItem } from "@/types/content";

export function siteConfigToGlobalSettings(config: SiteConfig): GlobalSettings {
  return {
    companyName: config.company.name,
    companyShortName: config.company.shortName,
    companyEnglishName: config.company.englishName,
    slogan: config.company.tagline,
    taxCode: config.company.taxCode,
    foundedYear: config.company.foundedYear,
    description: config.company.description,
    logo: config.brand.logo,
    logoDark: config.brand.logoDark,
    logoLight: config.brand.logoLight,
    favicon: config.brand.favicon,
    primaryColor: config.theme.primary,
    secondaryColor: config.theme.secondary,
    accentColor: config.theme.accent,
    backgroundColor: config.theme.background,
    textColor: config.theme.foreground,
    address: config.contact.address ?? "",
    phone: config.contact.phone ?? "",
    hotline: config.contact.hotline ?? "",
    email: config.contact.email ?? "",
    salesEmail: config.contact.salesEmail,
    zalo: config.contact.zalo,
    workingHours: config.contact.businessHours ?? "",
    website: config.contact.website ?? "",
    googleMapsUrl: config.contact.mapsUrl,
    facebook: config.social.facebook,
    youtube: config.social.youtube,
    linkedin: config.social.linkedin,
    defaultTitle: config.seo.defaultTitle,
    defaultDescription: config.seo.defaultDescription,
    defaultOgImage: config.seo.defaultOgImage,
    googleSiteVerification: config.seo.googleSiteVerification,
    floatingContactEnabled: config.contact.floatingEnabled
  };
}

export function siteConfigToNavigation(config: SiteConfig): NavItem[] {
  return config.navigation.primary
    .filter((item) => item.enabled)
    .map((item, index) => ({
      id: item.id,
      label: item.label,
      url: item.href,
      order: index + 1,
      target: item.target,
      enabled: item.enabled
    }));
}

export function getSiteSettings(): GlobalSettings {
  return siteConfigToGlobalSettings(loadSiteConfig());
}

export function getSiteNavigation(): NavItem[] {
  return siteConfigToNavigation(loadSiteConfig());
}

