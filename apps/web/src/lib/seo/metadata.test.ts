import { describe, expect, it } from "vitest";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/site-config/site-config.adapter";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

describe("buildMetadata", () => {
  it("falls back to page title and company name", () => {
    const metadata = buildMetadata({
      title: "Dịch vụ",
      description: "Mo ta",
      path: "/dich-vu",
      settings: getSiteSettings()
    });

    expect(metadata.title).toEqual({ absolute: "Dịch vụ | ABC Engineering" });
    expect(metadata.description).toBe("Mo ta");
  });

  it("builds distinct static page metadata from SiteConfig", () => {
    const metadata = buildStaticPageMetadata("services");
    expect(metadata.title).toBe("Dịch vụ");
    expect(metadata.description).toContain("tư vấn");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/dich-vu");
  });

  it("marks non-indexable utility pages", () => {
    const metadata = buildStaticPageMetadata("search");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
