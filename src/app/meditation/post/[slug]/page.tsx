import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "../../../lib/seo";
import { lookupResource } from "../../../lib/resourceLookup";
import ResourcePostDetail from "../../../components/ResourcePostDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = await lookupResource(slug);
  if (resource === "missing") notFound();
  return pageMetadata({
    title: resource?.title ?? "Meditation practice",
    description: resource?.summary || "A meditation practice shared by the MindHx team.",
    path: `/meditation/post/${slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (await lookupResource(slug) === "missing") notFound();
  return <ResourcePostDetail slug={slug} section="meditation" />;
}
