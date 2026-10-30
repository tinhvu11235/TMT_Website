import { siteConfigSchema, type SiteConfig } from "@/site-config/site.schema";

export const previewMessageType = "site-config-preview";

export type PreviewMessage = {
  type: typeof previewMessageType;
  config: SiteConfig;
};

export function createPreviewMessage(config: SiteConfig): PreviewMessage {
  return { type: previewMessageType, config };
}

export function parsePreviewMessage(data: unknown, eventOrigin: string, currentOrigin: string): SiteConfig | null {
  if (eventOrigin !== currentOrigin || typeof data !== "object" || data === null) return null;
  const message = data as { type?: unknown; config?: unknown };
  if (message.type !== previewMessageType) return null;
  const parsed = siteConfigSchema.safeParse(message.config);
  return parsed.success ? parsed.data : null;
}

