import { PreviewReceiver } from "@/features/customize/preview-receiver";
import { loadHomePageModel } from "@/features/home/load-home-page-model";
import { loadSiteConfig } from "@/site-config/load-site-config";

export default async function CustomizePreviewPage() {
  const config = loadSiteConfig();
  const model = await loadHomePageModel(config.pages.home.blocks);
  return <PreviewReceiver initialConfig={config} collections={model.collections} />;
}

