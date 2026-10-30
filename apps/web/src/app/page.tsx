import { HomeBlockRenderer } from "@/features/home/home-block-renderer";
import { loadHomePageModel } from "@/features/home/load-home-page-model";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("home");

export default async function Page() {
  const blocks = loadSiteConfig().pages.home.blocks;
  const model = await loadHomePageModel(blocks);
  return <HomeBlockRenderer model={model} />;
}
