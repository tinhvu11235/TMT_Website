import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const collectionPaths: Record<string, string[]> = {
  global_settings: ["/", "/lien-he", "/gioi-thieu", "/ho-so-nang-luc"],
  company_locations: ["/lien-he"],
  menu_items: ["/"],
  homepage_content: ["/"],
  homepage_sections: ["/"],
  statistics: ["/"],
  services: ["/", "/dich-vu"],
  projects: ["/", "/du-an"],
  articles: ["/", "/tin-tuc"],
  certificates: ["/", "/nang-luc"],
  partners: ["/", "/doi-tac"],
  gallery_items: ["/thu-vien"],
  company_profiles: ["/ho-so-nang-luc"]
};

export async function POST(request: NextRequest) {
  if (!env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 503 });
  }

  const secret = request.headers.get("x-revalidation-secret");
  if (secret !== env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    collection?: string;
    path?: string;
    slug?: string;
  };

  const paths = new Set<string>();
  if (body.path) paths.add(body.path);
  for (const path of collectionPaths[body.collection ?? ""] ?? ["/"]) {
    paths.add(path);
  }

  if (body.collection === "services" && body.slug) paths.add(`/dich-vu/${body.slug}`);
  if (body.collection === "projects" && body.slug) paths.add(`/du-an/${body.slug}`);
  if (body.collection === "articles" && body.slug) paths.add(`/tin-tuc/${body.slug}`);

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: Array.from(paths) });
}
