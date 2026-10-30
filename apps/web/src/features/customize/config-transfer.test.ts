import { describe, expect, it } from "vitest";
import { parseImportedSiteConfig, serializeSiteConfig } from "@/features/customize/config-transfer";
import { loadSiteConfig } from "@/site-config/load-site-config";

describe("site configuration transfer", () => {
  it("imports valid JSON and exports canonical JSON with one trailing newline", () => {
    const config = loadSiteConfig();
    const source = serializeSiteConfig(config);
    expect(source.endsWith("\n")).toBe(true);
    expect(source.endsWith("\n\n")).toBe(false);
    expect(parseImportedSiteConfig(source)).toEqual(config);
  });

  it("rejects malformed JSON and schema-invalid JSON", () => {
    expect(() => parseImportedSiteConfig("{")) .toThrow("not valid JSON");
    const config = structuredClone(loadSiteConfig());
    config.theme.primary = "blue";
    expect(() => parseImportedSiteConfig(JSON.stringify(config))).toThrow("Invalid SiteConfig");
  });
});

