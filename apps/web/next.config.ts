import type { NextConfig } from "next";

const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL
  ? new URL(process.env.NEXT_PUBLIC_CMS_URL)
  : null;

const nextConfig: NextConfig = {
  agentRules: false,
  output: "standalone",
  images: {
    remotePatterns: [
      ...(cmsUrl
        ? [
            {
              protocol: cmsUrl.protocol.replace(":", "") as "http" | "https",
              hostname: cmsUrl.hostname,
              port: cmsUrl.port,
              pathname: "/assets/**"
            }
          ]
        : []),
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
