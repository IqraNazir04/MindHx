import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/seo";
import ResourcePostDetail from "../../../components/ResourcePostDetail";

export const metadata: Metadata = pageMetadata({
  title: "Medication reference",
  description: "Medication reference information shared by the MindHx team.",
  path: "/medication",
});

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ResourcePostDetail slug={slug} section="medication" />;
}
