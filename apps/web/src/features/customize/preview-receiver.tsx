"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { FloatingContact } from "@/components/layout/floating-contact";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { HomeBlockRenderer } from "@/features/home/home-block-renderer";
import type { HomePageCollections } from "@/features/home/load-home-page-model";
import { parseStoredPreviewDraft, previewDraftStorageKey } from "@/features/customize/preview-draft";
import { parsePreviewMessage } from "@/features/customize/preview-messages";
import { siteConfigToGlobalSettings, siteConfigToNavigation } from "@/site-config/site-config.adapter";
import type { SiteConfig } from "@/site-config/site.schema";

export function PreviewReceiver({
  initialConfig,
  collections
}: {
  initialConfig: SiteConfig;
  collections: HomePageCollections;
}) {
  const [config, setConfig] = useState(initialConfig);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    function receivePreview(event: MessageEvent<unknown>) {
      if (window.parent !== window && event.source !== window.parent) return;
      const nextConfig = parsePreviewMessage(event.data, event.origin, window.location.origin);
      if (nextConfig) setConfig(nextConfig);
    }

    function receiveStoredPreview(event: StorageEvent) {
      if (event.key !== previewDraftStorageKey) return;
      const nextConfig = parseStoredPreviewDraft(event.newValue);
      if (nextConfig) setConfig(nextConfig);
    }

    const storedConfig = parseStoredPreviewDraft(window.localStorage.getItem(previewDraftStorageKey));
    if (storedConfig) setConfig(storedConfig);
    setStandalone(window.parent === window);
    window.addEventListener("message", receivePreview);
    window.addEventListener("storage", receiveStoredPreview);
    if (window.parent !== window) {
      window.parent.postMessage({ type: "site-config-preview-ready" }, window.location.origin);
    }
    return () => {
      window.removeEventListener("message", receivePreview);
      window.removeEventListener("storage", receiveStoredPreview);
    };
  }, []);

  const themeStyle = useMemo(() => ({
    "--color-primary": config.theme.primary,
    "--color-secondary": config.theme.secondary,
    "--color-accent": config.theme.accent,
    "--color-background": config.theme.background,
    "--color-text": config.theme.foreground,
    "--color-surface": config.theme.surface,
    "--color-muted": config.theme.muted,
    "--color-muted-foreground": config.theme.mutedForeground,
    "--color-border": config.theme.border
  }) as CSSProperties, [config.theme]);
  const settings = useMemo(() => siteConfigToGlobalSettings(config), [config]);
  const menu = useMemo(() => siteConfigToNavigation(config), [config]);

  useEffect(() => {
    document.title = config.seo.defaultTitle;
    if (!config.brand.favicon?.src) return;
    const existing = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    const icon = existing ?? document.createElement("link");
    icon.rel = "icon";
    icon.href = config.brand.favicon.src;
    if (!existing) document.head.appendChild(icon);
  }, [config.brand.favicon, config.seo.defaultTitle]);

  function preventNavigation(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) event.preventDefault();
  }

  return (
    <div data-customize-preview style={themeStyle} className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]" onClickCapture={preventNavigation}>
      {standalone ? (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 p-2 text-slate-800 shadow-lg backdrop-blur">
          <span className="px-2 text-xs font-semibold">Live preview từ Site Customizer</span>
          <button className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white" type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      ) : null}
      <Header menu={menu} settings={settings} actions={config.navigation.headerActions} />
      <HomeBlockRenderer model={{ blocks: config.pages.home.blocks, collections }} />
      <Footer settings={settings} menu={menu} services={collections.services} navigation={config.navigation} />
      <FloatingContact settings={settings} />
    </div>
  );
}
