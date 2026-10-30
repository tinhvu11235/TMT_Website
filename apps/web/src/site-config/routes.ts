import type { SiteConfig } from "@/site-config/site.schema";

export type PageId = keyof SiteConfig["pages"];

export const routeCatalog = {
  home: { path: "/", sitemap: true },
  about: { path: "/gioi-thieu", sitemap: true },
  services: { path: "/dich-vu", sitemap: true },
  projects: { path: "/du-an", sitemap: true },
  capabilities: { path: "/nang-luc", sitemap: true },
  news: { path: "/tin-tuc", sitemap: true },
  gallery: { path: "/thu-vien", sitemap: true },
  partners: { path: "/doi-tac", sitemap: true },
  contact: { path: "/lien-he", sitemap: true },
  companyProfile: { path: "/ho-so-nang-luc", sitemap: true },
  search: { path: "/tim-kiem", sitemap: false },
  privacy: { path: "/chinh-sach-bao-mat", sitemap: true }
} as const satisfies Record<PageId, { path: string; sitemap: boolean }>;

