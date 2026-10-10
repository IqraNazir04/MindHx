// Server-side check that a published resource exists, so a page for an
// unknown slug returns a real 404 (and a proper title when it does exist)
// instead of a 200 page that only discovers the problem in the browser.

export type ResourceSummary = { title: string; summary: string; resource_type: string };

// The backend as seen from the Next.js server: the same target the /api
// rewrite uses (next.config.ts), or the public URL when deployed separately.
const BACKEND_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// "missing" only on a definite 404 from the backend. If it can't be reached,
// returns null and the page renders as before, letting the browser retry.
export async function lookupResource(slug: string): Promise<ResourceSummary | "missing" | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/resources/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (response.status === 404) return "missing";
    if (!response.ok) return null;
    return await response.json() as ResourceSummary;
  } catch {
    return null;
  }
}
