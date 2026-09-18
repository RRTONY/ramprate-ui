import { getRegisteredRoutes, routeUrl } from "@/lib/registered-urls";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getRegisteredRoutes();

  return routes.map((r) => ({
    url: routeUrl(r.path),
    ...(r.lastModified && { lastModified: r.lastModified }),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    ...(r.images && { images: r.images }),
  }));
}
