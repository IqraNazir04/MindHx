import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { techniques, getTechnique } from "../data";
import { pageMetadata } from "../../lib/seo";
import TechniqueDetail from "./TechniqueDetail";

export function generateStaticParams() {
  return techniques.map((technique) => ({ slug: technique.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meditation/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const technique = getTechnique(slug);
  if (!technique) return {};
  return pageMetadata({
    title: `${technique.en.name} | Meditation Technique`,
    description: `${technique.en.summary} ${technique.en.notes}`,
    path: `/meditation/${slug}`,
  });
}

export default async function TechniquePage({ params }: PageProps<"/meditation/[slug]">) {
  const { slug } = await params;
  const technique = getTechnique(slug);
  if (!technique) notFound();
  return <TechniqueDetail technique={technique} />;
}
