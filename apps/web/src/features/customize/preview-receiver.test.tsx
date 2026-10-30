import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PreviewReceiver } from "@/features/customize/preview-receiver";
import type { HomePageCollections } from "@/features/home/load-home-page-model";
import {
  demoArticles,
  demoCertificates,
  demoPartners,
  demoProjects,
  demoServices,
  demoStatistics
} from "@/services/seed";
import { loadSiteConfig } from "@/site-config/load-site-config";

const collections: HomePageCollections = {
  statistics: demoStatistics,
  services: demoServices,
  projects: demoProjects,
  articles: demoArticles,
  partners: demoPartners,
  certificates: demoCertificates
};

describe("PreviewReceiver", () => {
  it("renders global draft settings as well as homepage blocks", () => {
    const config = structuredClone(loadSiteConfig());
    config.company.name = "Công ty đang xem trước";
    config.company.shortName = "PREVIEW";
    config.company.tagline = "Tagline cập nhật tức thời";
    config.contact.hotline = "0909 111 222";
    config.navigation.primary[0].label = "Trang xem trước";

    const markup = renderToStaticMarkup(<PreviewReceiver initialConfig={config} collections={collections} />);

    expect(markup).toContain("Công ty đang xem trước");
    expect(markup).toContain("PREVIEW");
    expect(markup).toContain("Tagline cập nhật tức thời");
    expect(markup).toContain("0909 111 222");
    expect(markup).toContain("Trang xem trước");
    expect(markup).toContain("Đồng hành từ khảo sát");
  });
});
