import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";
import { techniques } from "./meditation/data";
import { therapies } from "./therapies/data";
import { medications } from "./medication/data";

// Same backend-resolution rule as resourceLookup.ts: the internal URL when
// deployed together, the public API URL otherwise. Runs at request time
// (export const dynamic below) so the backend is actually up to reach it,
// unlike a build-time fetch inside the Docker build step.
const BACKEND_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type PublishedResource = { slug: string };

async function fetchResourceSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/resources`, { cache: "no-store" });
    if (!response.ok) return [];
    const resources = await response.json() as PublishedResource[];
    return resources.map((resource) => resource.slug);
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.7 },
    { path: "/medication", priority: 0.7 },
    { path: "/ai", priority: 0.8 },
    { path: "/meditation", priority: 0.8 },
    { path: "/therapies", priority: 0.8 },
    { path: "/therapist", priority: 0.8 },
    { path: "/resources", priority: 0.6 },
    { path: "/emergency", priority: 0.6 },
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    priority,
  }));

  const techniqueRoutes = techniques.map((technique) => ({
    url: `${SITE_URL}/meditation/${technique.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  const therapyRoutes = therapies.map((therapy) => ({
    url: `${SITE_URL}/therapies/${therapy.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  const medicationRoutes = medications.map((medication) => ({
    url: `${SITE_URL}/medication/${medication.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  const resourceSlugs = await fetchResourceSlugs();
  const resourceRoutes = resourceSlugs.map((slug) => ({
    url: `${SITE_URL}/resources/${slug}`,
    lastModified: new Date(),
    priority: 0.5,
  }));

  return [...staticRoutes, ...techniqueRoutes, ...therapyRoutes, ...medicationRoutes, ...resourceRoutes];
}
