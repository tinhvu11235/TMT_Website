import { describe, expect, it } from "vitest";
import {
  DirectusDataError,
  normalizeImageAsset,
  normalizeProjectStatus
} from "@/services/providers/directus-normalize";
import { demoProjects } from "@/services/seed";

describe("Directus normalization", () => {
  it("normalizes a Directus file ID into an asset URL", () => {
    expect(normalizeImageAsset({ id: "asset-id", title: "Logo" }, "Fallback")).toEqual({
      id: "asset-id",
      src: "http://localhost:8055/assets/asset-id",
      alt: "Logo",
      width: undefined,
      height: undefined
    });
  });

  it("keeps project progress and publication status separate", () => {
    const source = demoProjects[0];
    const project = normalizeProjectStatus(source);
    expect(project.status).toBe(source.status);
    expect(project.publishStatus).toBe("published");
  });

  it("rejects a publication-only project DTO instead of inventing progress", () => {
    const malformed = { ...demoProjects[0], status: "published", publishStatus: undefined };
    expect(() => normalizeProjectStatus(malformed as unknown as (typeof demoProjects)[number])).toThrow(DirectusDataError);
  });
});
