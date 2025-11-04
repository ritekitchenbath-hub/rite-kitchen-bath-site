import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/areas", "/gallery", "/faq", "/contact"];
  const now = new Date();
  return routes.map((r) => ({
    url: siteUrl + r,
    lastModified: now,
  }));
}
