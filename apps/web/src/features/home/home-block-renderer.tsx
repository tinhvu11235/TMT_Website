import { Fragment } from "react";
import { HomeAbout } from "@/features/home/sections/home-about";
import { HomeCapabilities } from "@/features/home/sections/home-capabilities";
import { HomeCertificates } from "@/features/home/sections/home-certificates";
import { HomeCta } from "@/features/home/sections/home-cta";
import { HomeHero } from "@/features/home/sections/home-hero";
import { HomeNews } from "@/features/home/sections/home-news";
import { HomePartners } from "@/features/home/sections/home-partners";
import { HomeProjects } from "@/features/home/sections/home-projects";
import { HomeServices } from "@/features/home/sections/home-services";
import { HomeStatistics } from "@/features/home/sections/home-statistics";
import type { HomePageModel } from "@/features/home/load-home-page-model";
import type { HomeBlock } from "@/site-config/site.schema";

function assertNever(value: never): never {
  throw new Error(`Unsupported home block: ${JSON.stringify(value)}`);
}

function renderBlock(block: HomeBlock, collections: HomePageModel["collections"]) {
  switch (block.type) {
    case "hero":
      return <HomeHero config={block.config} />;
    case "statistics":
      return <HomeStatistics config={block.config} statistics={collections.statistics} />;
    case "about":
      return <HomeAbout config={block.config} />;
    case "services":
      return <HomeServices config={block.config} services={collections.services} />;
    case "projects":
      return <HomeProjects config={block.config} projects={collections.projects} />;
    case "capabilities":
      return <HomeCapabilities config={block.config} />;
    case "certificates":
      return <HomeCertificates config={block.config} certificates={collections.certificates} />;
    case "news":
      return <HomeNews config={block.config} articles={collections.articles} />;
    case "partners":
      return <HomePartners config={block.config} partners={collections.partners} />;
    case "cta":
      return <HomeCta config={block.config} />;
    default:
      return assertNever(block);
  }
}

export function HomeBlockRenderer({ model }: { model: HomePageModel }) {
  return (
    <>
      {model.blocks.map((block) =>
        block.enabled ? <Fragment key={block.id}>{renderBlock(block, model.collections)}</Fragment> : null
      )}
    </>
  );
}

