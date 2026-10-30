import {
  getArticles,
  getCertificates,
  getPartners,
  getProjects,
  getServices,
  getStatistics
} from "@/services/content";
import type { HomeBlock } from "@/site-config/site.schema";
import type { Article, Certificate, Partner, Project, Service, Statistic } from "@/types/content";

export type HomePageCollections = {
  statistics: Statistic[];
  services: Service[];
  projects: Project[];
  articles: Article[];
  partners: Partner[];
  certificates: Certificate[];
};

export type HomePageModel = {
  blocks: HomeBlock[];
  collections: HomePageCollections;
};

export type HomeCollectionLoaders = {
  statistics: () => Promise<Statistic[]>;
  services: () => Promise<Service[]>;
  projects: () => Promise<Project[]>;
  articles: () => Promise<Article[]>;
  partners: () => Promise<Partner[]>;
  certificates: () => Promise<Certificate[]>;
};

const defaultLoaders: HomeCollectionLoaders = {
  statistics: getStatistics,
  services: getServices,
  projects: getProjects,
  articles: getArticles,
  partners: getPartners,
  certificates: getCertificates
};

export async function loadHomePageModel(
  blocks: HomeBlock[],
  loaders: HomeCollectionLoaders = defaultLoaders
): Promise<HomePageModel> {
  const enabledBlocks = blocks.filter((block) => block.enabled);
  const requiredTypes = new Set(enabledBlocks.map((block) => block.type));

  const [statistics, services, projects, articles, partners, certificates] = await Promise.all([
    requiredTypes.has("statistics") ? loaders.statistics() : Promise.resolve([]),
    requiredTypes.has("services") ? loaders.services() : Promise.resolve([]),
    requiredTypes.has("projects") ? loaders.projects() : Promise.resolve([]),
    requiredTypes.has("news") ? loaders.articles() : Promise.resolve([]),
    requiredTypes.has("partners") ? loaders.partners() : Promise.resolve([]),
    requiredTypes.has("certificates") ? loaders.certificates() : Promise.resolve([])
  ]);

  return {
    blocks,
    collections: {
      statistics,
      services: services.filter((item) => item.featured),
      projects: projects.filter((item) => item.featured),
      articles: articles.filter((item) => item.featured),
      partners: partners.filter((item) => item.featured),
      certificates: certificates.filter((item) => item.featured)
    }
  };
}

