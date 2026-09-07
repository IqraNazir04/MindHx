import { notFound } from "next/navigation";
import { techniques, getTechnique } from "../data";
import TechniqueDetail from "./TechniqueDetail";

export function generateStaticParams() {
  return techniques.map((technique) => ({ slug: technique.slug }));
}

export default async function TechniquePage({ params }: PageProps<"/meditation/[slug]">) {
  const { slug } = await params;
  const technique = getTechnique(slug);
  if (!technique) notFound();
  return <TechniqueDetail technique={technique} />;
}
