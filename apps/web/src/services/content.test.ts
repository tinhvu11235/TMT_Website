import { describe, expect, it } from "vitest";
import { searchContent, withProviderFallback } from "@/services/content";

describe("content helpers", () => {
  it("searches demo services when CMS is unavailable", async () => {
    const result = await searchContent("giám sát");
    expect(result.services.length + result.projects.length + result.articles.length).toBeGreaterThan(0);
  });

  it("preserves a successful empty collection", async () => {
    await expect(withProviderFallback(async () => [], ["fallback"])).resolves.toEqual([]);
  });

  it("uses fallback data when the provider fails", async () => {
    await expect(
      withProviderFallback(async () => {
        throw new Error("provider unavailable");
      }, ["fallback"])
    ).resolves.toEqual(["fallback"]);
  });
});
