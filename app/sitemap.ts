import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/gallery", "/about", "/commission", "/shop", "/contact"];
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/gallery" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/commission" ? 0.9 : 0.7,
  }));
}
