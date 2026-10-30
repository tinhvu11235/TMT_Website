import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeBlockRenderer } from "@/features/home/home-block-renderer";
import {
  loadHomePageModel,
  type HomeCollectionLoaders,
  type HomePageCollections,
} from "@/features/home/load-home-page-model";
import {
  demoArticles,
  demoCertificates,
  demoPartners,
  demoProjects,
  demoServices,
  demoStatistics,
} from "@/services/seed";
import { loadSiteConfig } from "@/site-config/load-site-config";
import type { HomeBlock } from "@/site-config/site.schema";

const collections: HomePageCollections = {
  statistics: demoStatistics,
  services: demoServices,
  projects: demoProjects,
  articles: demoArticles,
  partners: demoPartners,
  certificates: demoCertificates,
};

function renderBlocks(blocks: HomeBlock[]) {
  return renderToStaticMarkup(
    <HomeBlockRenderer model={{ blocks, collections }} />,
  );
}

function createLoaders(): HomeCollectionLoaders {
  return {
    statistics: vi.fn(async () => demoStatistics),
    services: vi.fn(async () => demoServices),
    projects: vi.fn(async () => demoProjects),
    articles: vi.fn(async () => demoArticles),
    partners: vi.fn(async () => demoPartners),
    certificates: vi.fn(async () => demoCertificates),
  };
}

describe("HomeBlockRenderer", () => {
  const configuredBlocks = loadSiteConfig().pages.home.blocks;

  it("renders all configured, enabled home sections", () => {
    const markup = renderBlocks(configuredBlocks);
    expect(markup).toContain("Giải pháp tư vấn và xây dựng toàn diện");
    expect(markup).not.toContain("Năm kinh nghiệm");
    expect(markup).toContain("Dịch vụ kỹ thuật cho toàn bộ vòng đời dự án");
    expect(markup).toContain("Công trình tiêu biểu");
    expect(markup).toContain("Chứng chỉ và hồ sơ pháp lý");
    expect(markup).toContain("Tin tức và cập nhật");
    expect(markup).toContain("Đối tác");
    expect(markup).toContain("Bạn có dự án cần tư vấn?");
  });

  it("uses config array order as rendered order", () => {
    const hero = configuredBlocks.find((block) => block.type === "hero");
    const services = configuredBlocks.find(
      (block) => block.type === "services",
    );
    const projects = configuredBlocks.find(
      (block) => block.type === "projects",
    );
    expect(hero && services && projects).toBeTruthy();
    const markup = renderBlocks([projects!, hero!, services!]);
    expect(markup.indexOf("Công trình tiêu biểu")).toBeLessThan(
      markup.indexOf("Đồng hành từ khảo sát"),
    );
    expect(markup.indexOf("Đồng hành từ khảo sát")).toBeLessThan(
      markup.indexOf("Dịch vụ kỹ thuật"),
    );
  });

  it("omits disabled blocks", () => {
    const disabled = configuredBlocks.map((block) =>
      block.type === "cta" ? { ...block, enabled: false } : block,
    ) as HomeBlock[];
    expect(renderBlocks(disabled)).not.toContain("Bạn có dự án cần tư vấn?");
  });

  it("renders long configured hero copy without truncating server output", () => {
    const longTitle =
      "Giải pháp kỹ thuật đồng bộ cho dự án quy mô lớn, nhiều bên liên quan và yêu cầu kiểm soát chất lượng nghiêm ngặt";
    const blocks = structuredClone(configuredBlocks);
    const hero = blocks.find((block) => block.type === "hero");
    if (!hero || hero.type !== "hero")
      throw new Error("Canonical hero block is missing");
    hero.config.title = longTitle;
    expect(renderBlocks(blocks)).toContain(longTitle);
  });
});

describe("loadHomePageModel", () => {
  it("does not fetch disabled collection-backed blocks", async () => {
    const blocks = loadSiteConfig().pages.home.blocks.map((block) =>
      ["services", "projects", "news"].includes(block.type)
        ? { ...block, enabled: false }
        : block,
    ) as HomeBlock[];
    const loaders = createLoaders();

    await loadHomePageModel(blocks, loaders);

    expect(loaders.services).not.toHaveBeenCalled();
    expect(loaders.projects).not.toHaveBeenCalled();
    expect(loaders.articles).not.toHaveBeenCalled();
    expect(loaders.statistics).not.toHaveBeenCalled();
  });
});
