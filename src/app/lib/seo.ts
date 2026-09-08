import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "MindHx";

type PageMetaOptions = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

// Builds a page's <title>/<meta description>/canonical/Open Graph/Twitter
// tags from one call site. Used by every route's server-component page.tsx
// (client components can't export Next.js metadata), so each page gets its
// own distinct, search-relevant title instead of sharing the root layout's.
export function pageMetadata({ title, description, path, noindex }: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title, description },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
