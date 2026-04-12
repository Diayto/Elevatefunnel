import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteBaseUrl();
  const host = new URL(`${base}/`).host;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host,
  };
}
