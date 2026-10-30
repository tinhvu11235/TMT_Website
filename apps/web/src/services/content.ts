import { directusCreate, directusList } from "@/lib/directus/client";
import {
  DirectusDataError,
  normalizeImageAsset,
  normalizeImageAssets,
  normalizeProjectStatus
} from "@/services/providers/directus-normalize";
import type {
  Article,
  Certificate,
  CompanyProfile,
  Equipment,
  GalleryItem,
  CompanyLocation,
  Partner,
  Project,
  ProjectStatus,
  Service,
  Statistic,
  TeamMember
} from "@/types/content";
import {
  demoArticles,
  demoCertificates,
  demoCompanyProfile,
  demoEquipment,
  demoGallery,
  demoLocations,
  demoPartners,
  demoProjects,
  demoServices,
  demoStatistics,
  demoTeam
} from "@/services/seed";

export async function withProviderFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await fetcher();
    return data ?? fallback;
  } catch (error) {
    if (error instanceof DirectusDataError) {
      console.error(`[content] Invalid Directus data: ${error.message}`);
    }
    return fallback;
  }
}

function sortByOrder<T extends { order?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function isPublished(item: { status?: string; publishStatus?: string }) {
  if (item.publishStatus) return item.publishStatus === "published";
  if (item.status === "draft" || item.status === "published" || item.status === "archived") {
    return item.status === "published";
  }
  return true;
}

export async function getStatistics(): Promise<Statistic[]> {
  return withProviderFallback(
    () => directusList<Statistic>("statistics", { fields: "*", filter: JSON.stringify({ enabled: { _eq: true } }), sort: "order" }),
    demoStatistics
  ).then((items) => sortByOrder(items.filter((item) => item.enabled)));
}

export async function getServices(): Promise<Service[]> {
  return withProviderFallback(
    () =>
      directusList<Service>("services", {
        fields: "*.*",
        filter: JSON.stringify({ enabled: { _eq: true } }),
        sort: "order"
      }),
    demoServices
  ).then((items) =>
    sortByOrder(
      items
        .filter((item) => item.enabled && isPublished(item))
        .map((item) => ({
          ...item,
          featuredImage: normalizeImageAsset(item.featuredImage, item.title),
          ogImage: normalizeImageAsset(item.ogImage, item.title)
        }))
    )
  );
}

export async function getFeaturedServices(): Promise<Service[]> {
  const services = await getServices();
  return services.filter((service) => service.featured).slice(0, 6);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getProjects(filters?: {
  category?: string;
  status?: ProjectStatus;
  year?: string;
}): Promise<Project[]> {
  const items = await withProviderFallback(
    () =>
      directusList<Project>("projects", {
        fields: "*.*",
        sort: "order"
      }),
    demoProjects
  );

  return sortByOrder(
    items.map((project) => {
      const normalized = normalizeProjectStatus(project);
      return {
        ...normalized,
        featuredImage: normalizeImageAsset(normalized.featuredImage, normalized.name),
        gallery: normalizeImageAssets(normalized.gallery, normalized.name),
        ogImage: normalizeImageAsset(normalized.ogImage, normalized.name)
      };
    })
  ).filter((project) => {
    if (project.enabled === false || !isPublished(project)) return false;
    if (filters?.category && project.category !== filters.category) return false;
    if (filters?.status && project.status !== filters.status) return false;
    if (filters?.year && String(project.completionYear ?? project.startYear) !== filters.year) return false;
    return true;
  });
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured).slice(0, 4);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getArticles(): Promise<Article[]> {
  return withProviderFallback(
    () =>
      directusList<Article>("articles", {
        fields: "*.*",
        filter: JSON.stringify({ status: { _eq: "published" } }),
        sort: "-published_at"
      }),
    demoArticles
  ).then((items) =>
    items
      .filter((article) => article.status === "published")
      .map((article) => ({
        ...article,
        thumbnail: normalizeImageAsset(article.thumbnail, article.title),
        gallery: normalizeImageAssets(article.gallery, article.title),
        ogImage: normalizeImageAsset(article.ogImage, article.title)
      }))
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getPartners(): Promise<Partner[]> {
  return withProviderFallback(
    () => directusList<Partner>("partners", { fields: "*.*", filter: JSON.stringify({ enabled: { _eq: true } }), sort: "order" }),
    demoPartners
  ).then((items) =>
    sortByOrder(
      items.filter((item) => item.enabled).map((item) => ({
        ...item,
        logo: normalizeImageAsset(item.logo, item.name)
      }))
    )
  );
}

export async function getCertificates(): Promise<Certificate[]> {
  return withProviderFallback(
    () =>
      directusList<Certificate>("certificates", {
        fields: "*.*",
        filter: JSON.stringify({ enabled: { _eq: true }, status: { _eq: "published" } }),
        sort: "order"
      }),
    demoCertificates
  ).then((items) =>
    sortByOrder(
      items
        .filter((item) => item.enabled && isPublished(item))
        .map((item) => ({ ...item, image: normalizeImageAsset(item.image, item.name) }))
    )
  );
}

export async function getEquipment(): Promise<Equipment[]> {
  return withProviderFallback(
    () => directusList<Equipment>("equipment", { fields: "*.*", filter: JSON.stringify({ enabled: { _eq: true } }), sort: "order" }),
    demoEquipment
  ).then((items) =>
    sortByOrder(
      items.filter((item) => item.enabled).map((item) => ({
        ...item,
        image: normalizeImageAsset(item.image, item.name)
      }))
    )
  );
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return withProviderFallback(
    () =>
      directusList<TeamMember>("team_members", {
        fields: "*.*",
        filter: JSON.stringify({ enabled: { _eq: true }, show_on_website: { _eq: true } }),
        sort: "order"
      }),
    demoTeam
  ).then((items) =>
    sortByOrder(
      items
        .filter((item) => item.enabled && item.showOnWebsite)
        .map((item) => ({ ...item, avatar: normalizeImageAsset(item.avatar, item.name) }))
    )
  );
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return withProviderFallback(
    () => directusList<GalleryItem>("gallery_items", { fields: "*.*", filter: JSON.stringify({ enabled: { _eq: true } }), sort: "order" }),
    demoGallery
  ).then((items) =>
    sortByOrder(
      items
        .filter((item) => item.enabled)
        .map((item) => ({ ...item, image: normalizeImageAsset(item.image, item.title) }))
    )
  );
}

export async function getCompanyLocations(): Promise<CompanyLocation[]> {
  return withProviderFallback(
    () =>
      directusList<CompanyLocation>("company_locations", {
        fields: "*.*",
        filter: JSON.stringify({ enabled: { _eq: true } }),
        sort: "order"
      }),
    demoLocations
  ).then((items) => sortByOrder(items.filter((item) => item.enabled)));
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const profiles = await withProviderFallback(
    () => directusList<CompanyProfile>("company_profiles", { fields: "*.*", limit: 1, sort: "-uploaded_at" }),
    [demoCompanyProfile]
  );

  const profile = profiles[0] ?? demoCompanyProfile;
  return {
    ...profile,
    pdfUrl: typeof profile.pdfUrl === "string" ? profile.pdfUrl : "",
    thumbnail: normalizeImageAsset(profile.thumbnail, profile.title)
  };
}

export async function searchContent(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return { services: [], projects: [], articles: [] };

  const [services, projects, articles] = await Promise.all([getServices(), getProjects(), getArticles()]);
  const includes = (value: string) => value.toLowerCase().includes(normalized);

  return {
    services: services.filter((item) => includes(item.title) || includes(item.shortDescription)),
    projects: projects.filter((item) => includes(item.name) || includes(item.shortDescription)),
    articles: articles.filter((item) => includes(item.title) || includes(item.excerpt))
  };
}

export async function createContactRequest(payload: Record<string, unknown>) {
  return directusCreate("contact_requests", payload);
}
