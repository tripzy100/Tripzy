import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Primary public routes with priority weightings
  const primaryRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/cars", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/vehicles", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/packages", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/cities", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/airports", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/bookings", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/support", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  // Legal and informational pages
  const legalRoutes = [
    { path: "/privacy", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/cancellation", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/security", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  const allRoutes = [...primaryRoutes, ...legalRoutes];

  const routes = allRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return routes;
}
