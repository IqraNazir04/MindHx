import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { therapies, getTherapy } from "../data";
import { pageMetadata } from "../../lib/seo";
import TherapyDetail from "./TherapyDetail";

export function generateStaticParams() {
  return therapies.map((therapy) => ({ slug: therapy.slug }));
}

export async function generateMetadata({ params }: PageProps<"/therapies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const therapy = getTherapy(slug);
  if (!therapy) return {};
  return pageMetadata({
    title: `${therapy.en.name} | Therapy Approach`,
    description: `${therapy.en.summary} ${therapy.en.sessionInfo}`,
    path: `/therapies/${slug}`,
  });
}

export default async function TherapyPage({ params }: PageProps<"/therapies/[slug]">) {
  const { slug } = await params;
  const therapy = getTherapy(slug);
  if (!therapy) notFound();
  return <TherapyDetail therapy={therapy} />;
}
