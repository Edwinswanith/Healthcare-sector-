import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return allowIndexing
    ? { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
