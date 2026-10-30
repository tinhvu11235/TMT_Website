import canonicalSiteConfig from "../../config/site.config.json";
import { siteConfigSchema, type SiteConfig } from "@/site-config/site.schema";

function formatPath(path: PropertyKey[]) {
  return path.reduce<string>((result, part) => {
    if (typeof part === "number") return `${result}[${part}]`;
    return result ? `${result}.${String(part)}` : String(part);
  }, "");
}

export function parseSiteConfig(input: unknown): SiteConfig {
  if (typeof input !== "object" || input === null || !("version" in input)) {
    throw new Error("SiteConfig version is required");
  }

  const version = (input as { version?: unknown }).version;
  if (version !== 1) {
    throw new Error(`Unsupported SiteConfig version: ${String(version)}. Expected version 1.`);
  }

  const parsed = siteConfigSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${formatPath(issue.path)}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid SiteConfig:\n${issues}`);
  }

  return parsed.data;
}

const validatedSiteConfig = parseSiteConfig(canonicalSiteConfig);

export function loadSiteConfig(): SiteConfig {
  return validatedSiteConfig;
}

