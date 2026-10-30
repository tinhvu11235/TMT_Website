import { parseSiteConfig } from "@/site-config/load-site-config";
import type { SiteConfig } from "@/site-config/site.schema";

export function parseImportedSiteConfig(source: string): SiteConfig {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error("Imported file is not valid JSON");
  }
  return parseSiteConfig(value);
}

export function serializeSiteConfig(config: SiteConfig) {
  const canonical = parseSiteConfig(config);
  return `${JSON.stringify(canonical, null, 2)}\n`;
}

