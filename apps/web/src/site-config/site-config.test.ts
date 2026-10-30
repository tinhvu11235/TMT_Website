import { describe, expect, it } from "vitest";
import canonicalSiteConfig from "../../config/site.config.json";
import { parseSiteConfig } from "@/site-config/load-site-config";
import { siteConfigSchema } from "@/site-config/site.schema";

function cloneConfig() {
  return structuredClone(canonicalSiteConfig) as Record<string, unknown>;
}

describe("SiteConfig", () => {
  it("parses the canonical configuration", () => {
    expect(parseSiteConfig(canonicalSiteConfig).version).toBe(1);
  });

  it("rejects unsupported versions with a readable error", () => {
    const config = cloneConfig();
    config.version = 2;
    expect(() => parseSiteConfig(config)).toThrow("Unsupported SiteConfig version: 2");
  });

  it("rejects unsafe links", () => {
    const config = cloneConfig();
    const navigation = config.navigation as { primary: Array<{ href: string }> };
    navigation.primary[0].href = "javascript:alert(1)";
    expect(siteConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects invalid theme colors", () => {
    const config = cloneConfig();
    (config.theme as { primary: string }).primary = "red";
    expect(siteConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects duplicate block IDs and singleton block types", () => {
    const config = cloneConfig();
    const blocks = ((config.pages as { home: { blocks: unknown[] } }).home.blocks);
    blocks.push(structuredClone(blocks[0]));
    const result = siteConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual(
        expect.arrayContaining([expect.stringContaining("Duplicate block ID"), expect.stringContaining("can only appear once")])
      );
    }
  });

  it("rejects unknown blocks", () => {
    const config = cloneConfig();
    const blocks = (config.pages as { home: { blocks: Array<Record<string, unknown>> } }).home.blocks;
    blocks[0].type = "arbitrary-component";
    expect(siteConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects remote assets outside the image host policy", () => {
    const config = cloneConfig();
    const seo = config.seo as { defaultOgImage: { src: string } };
    seo.defaultOgImage.src = "https://unapproved.example/image.jpg";
    expect(siteConfigSchema.safeParse(config).success).toBe(false);
  });

  it("round-trips canonical JSON", () => {
    const parsed = parseSiteConfig(canonicalSiteConfig);
    expect(parseSiteConfig(JSON.parse(`${JSON.stringify(parsed)}\n`))).toEqual(parsed);
  });

  it("accepts realistic long customizable content within documented limits", () => {
    const config = structuredClone(parseSiteConfig(canonicalSiteConfig));
    config.company.name = "Công ty tư vấn thiết kế, giám sát, quản lý dự án và phát triển hạ tầng kỹ thuật bền vững khu vực phía Nam";
    config.company.description = "Năng lực liên ngành được tổ chức xuyên suốt từ khảo sát hiện trạng, lập phương án, thiết kế kỹ thuật đến giám sát thi công và quản lý hồ sơ hoàn công. ".repeat(3).trim();
    config.contact.address = "Văn phòng điều hành dự án, tầng 12, khu phức hợp thương mại và kỹ thuật, phường trung tâm, Thành phố Hồ Chí Minh";
    const hero = config.pages.home.blocks.find((block) => block.type === "hero");
    if (!hero || hero.type !== "hero") throw new Error("Canonical hero block is missing");
    hero.config.title = "Đồng hành cùng chủ đầu tư trong toàn bộ vòng đời dự án với giải pháp kỹ thuật minh bạch, an toàn và có khả năng mở rộng";
    hero.config.primaryCta.label = "Trao đổi với đội ngũ tư vấn dự án";
    config.navigation.primary.push(
      { id: "sustainability", label: "Phát triển bền vững", href: "/gioi-thieu", target: "_self", enabled: true },
      { id: "quality", label: "Quản lý chất lượng", href: "/nang-luc", target: "_self", enabled: true }
    );

    expect(siteConfigSchema.safeParse(config).success).toBe(true);
  });
});
