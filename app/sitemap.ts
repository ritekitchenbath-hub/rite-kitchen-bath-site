import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { areas } from "@/lib/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/areas",
    ...areas.map((a) => "/areas/" + a.slug),
    "/gallery",
    "/faq",
    "/contact",
  ];
  const now = new Date();
  return routes.map((r) => ({
    url: siteUrl + r,
    lastModified: now,
  }));
}
