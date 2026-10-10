import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "../../lib/seo";
import { lookupResource } from "../../lib/resourceLookup";
import ResourceDetailClient from "./ResourceDetailClient";

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = await lookupResource(slug);
  if (resource === "missing") notFound();
  return pageMetadata({
    title: resource?.title ?? "Resource",
    description: resource?.summary || "Additional guidance from the MindHx team.",
    path: `/resources/${slug}`,
  });
}

export default async function Page({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  if (await lookupResource(slug) === "missing") notFound();
  return <ResourceDetailClient slug={slug} />;
}
