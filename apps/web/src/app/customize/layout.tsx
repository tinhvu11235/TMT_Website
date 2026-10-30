import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { isSiteEditorEnabled } from "@/features/customize/editor-access";

// Keep the guard request-time so production returns a hard 404, not a prerendered soft 404.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Customizer",
  robots: { index: false, follow: false }
};

export default function CustomizeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isSiteEditorEnabled(process.env.NODE_ENV, env.ENABLE_SITE_EDITOR)) notFound();
  return children;
}
