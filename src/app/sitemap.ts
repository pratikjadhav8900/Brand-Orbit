import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { verticals } from "@/data/verticals";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/businesses",
    "/services",
    "/industries",
    "/approach",
    "/portfolio",
    "/careers",
    "/insights",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];

  const verticalRoutes = verticals.map((v) => `/businesses/${v.slug}`);

  return [...staticRoutes, ...verticalRoutes].map((path) => ({
    url: `${siteConfig.url}${path}`,
  }));
}
