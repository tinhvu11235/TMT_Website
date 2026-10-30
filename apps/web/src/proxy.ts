import { NextResponse, type NextRequest } from "next/server";
import { isSiteEditorEnabled } from "@/features/customize/editor-access";

/**
 * The layout is the primary editor guard. This narrow outer guard additionally
 * guarantees an HTTP 404 before React streaming can turn notFound() into a soft 404.
 */
export function proxy(_request: NextRequest) {
  if (!isSiteEditorEnabled(process.env.NODE_ENV, process.env.ENABLE_SITE_EDITOR)) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/customize/:path*"]
};
