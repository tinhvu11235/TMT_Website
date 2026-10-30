import { siteConfigSchema, type SiteConfig } from "@/site-config/site.schema";

export const previewDraftStorageKey = "tmt-site-config-preview-v1";

export function serializePreviewDraft(config: SiteConfig): string | null {
  const parsed = siteConfigSchema.safeParse(config);
  return parsed.success ? JSON.stringify(parsed.data) : null;
}

export function parseStoredPreviewDraft(source: string | null): SiteConfig | null {
  if (!source) return null;

  try {
    const parsed = siteConfigSchema.safeParse(JSON.parse(source));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
