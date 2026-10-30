import { SiteEditor } from "@/features/customize/site-editor";
import { loadSiteConfig } from "@/site-config/load-site-config";

export default function CustomizePage() {
  return <SiteEditor initialConfig={loadSiteConfig()} />;
}

